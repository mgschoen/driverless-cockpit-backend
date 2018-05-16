const Mongo = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const Loki = require('lokijs');

function StorageController () {

    this.cacheTTL = process.env.FSD_CACHE_TTL || 30000;

    let cache = new Loki('./db.json', { verbose: true }).addCollection('timeframes');
        cache.setTTL(this.cacheTTL, 1000);      // Expiration time for cache documents and check interval
    let dbClient = null;
    let db = null;
    let timeframeCollection = null;
    let clipCollection = null;
    let initialised = false;
    let lastFrameInDump = 0;
    let countUndumpedFrames = 0;
    let timeoutSinceLastDump = null;
    let dumps = {};

    /**
     * Wrap a database related function around a Promise and execute it.
     * Promise gets automatically rejected if database is not initialised.
     * @param func - function to execute, must have `reject` and `resolve`
     *               arguments and call them appropriately
     * @returns {Promise}
     */
    let dbSecureExecute = func => {
        if (typeof func !== 'function') {
            throw new Error('func must be a function');
        }
        return new Promise((resolve, reject) => {
            if (initialised) {
                func(resolve, reject);
            } else {
                let msg = 'Database not initialised.';
                console.warn(msg);
                reject(new Error(msg));
            }
        });
    };

    /**
     * Project a list of loki documents to a list of documents without
     * LokiJS metadata.
     * @param array
     * @returns {Array|Cursor}
     */
    let lokiProjection = array => {
        return array.map(doc => {
            let copy = Object.assign({}, doc);
            delete copy.$loki;
            delete copy.meta;
            return copy;
        });
    };

    let createCollection = collectionName => {
        return new Promise((resolve, reject) => {
            db.createCollection(collectionName).then(result => {
                resolve(result);
            }, err => {
                console.error(err.message);
                process.exit(1);
                reject();
            });
        });
    }

    MongoClient.connect('mongodb://localhost:27017', (err, client) => {
        if (err) { console.error(err.message); process.exit(1); }
        dbClient = client;
        db = client.db('driverless');
        createCollection('timeframes').then(tfCollection => {
            timeframeCollection = tfCollection;
            timeframeCollection.ensureIndex({'timestamp': 1}).then(result => {
                createCollection('recordings').then(recCollection => {
                    clipCollection = recCollection;
                    initialised = true;
                });
            }, err => {
                console.error(err.message);
                process.exit(1);
            });
        });
    });

    this.createRecording = _ => {
        return dbSecureExecute((resolve, reject) => {
            let insertObject = {
                start: new Date().getTime(),
                end: null,
                writeActive: true };
            clipCollection.insertOne(insertObject, (err, response) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                }
                console.log('[START RECORDING] id:', response.insertedId, ', started at:', response.ops[0].start);
                resolve({
                    id: response.insertedId,
                    start: insertObject.start
                });
            });
        });
    };

    this.finishRecording = (id) => {
        return dbSecureExecute((resolve, reject) => {
            clipCollection.findOneAndUpdate(
                {_id: id},
                {$set: {
                    end: new Date().getTime(),
                    writeActive: false
                }},
                {returnOriginal: false})
                .then((response) => {
                    let recording = response.value;
                    console.log('[STOP RECORDING] id:', recording._id, ', stopped at:', recording.end);
                    resolve(recording);
                }, (error) => {
                    console.error(error.message);
                    reject(error);
                });
        });
    };

    this.getRecording = (id) => {
        return dbSecureExecute((resolve, reject) => {
            let objectID = new Mongo.ObjectID(id);
            clipCollection.findOne({_id: objectID}).then((response) => {
                if (response) {
                    resolve(response);
                } else {
                    reject(new Error('No recording with id '+id+' found'));
                }
            }, (error) => {
                console.error(error.message);
                reject(error);
            });
        });
    };

    this.getRecordings = _ => {
        return dbSecureExecute((resolve, reject) => {
            clipCollection.find().toArray().then(
                result => {
                    resolve(result);
                }, error => {
                    console.warn(error.message);
                    reject(error);
                });
        });
    };

    this.getIntervalCached = (from, to) => {
        return dbSecureExecute((resolve, reject) => {
            let query = {
                '$and': [
                    { 'timestamp': { '$gt': from } },
                    { 'timestamp': { '$lt': to } }
                ]};
            let now = new Date().getTime();
            if (now-from < this.cacheTTL-1000) {
                // retrieve frames from cache
                let frames = cache.find(query);
                frames.sort((a, b) => {
                    return a.timestamp - b.timestamp;
                });
                let result = lokiProjection(frames);
                resolve(result);
            } else {
                // retrieve frames from db
                timeframeCollection.find(query)
                    .project({_id: 0})
                    .sort('timestamp', 1)
                    .toArray()
                    .then((result) => {
                        resolve(result);
                    }, (error) => {
                        console.warn(error.message);
                        reject(error.message);
                    });
            }
        });
    };

    this.getIntervalUncached = (from, to) => {
        return dbSecureExecute((resolve, reject) => {
            timeframeCollection.find(
                { '$and': [
                    { 'timestamp': { '$gte': from } },
                    { 'timestamp': { '$lte': to } } ]})
                .project({_id: 0})

                // TODO This sort exceeds our RAM limits on large collections. See if we can fix it this
                //      by making `timestamp` an index (https://docs.mongodb.com/manual/indexes/)
                //      (I can not imagine we want our timeframes sorted any other way than by timestamps)
                .sort('timestamp', 1)
                .toArray()
                .then((result) => {
                    resolve(result);
                }, (error) => {
                    console.warn(error.message);
                    reject(error.message);
                });
        });
    };

    this.insert = (timestamp, frame) => {
        frame['timestamp'] = timestamp;
        // console.log(frame);
        cache.insert(frame);
        countUndumpedFrames += 1;
        if (!timeoutSinceLastDump) {
            timeoutSinceLastDump = setTimeout(this.dumpUnpersistedFrames.bind(this), 20000);
        }
        if (countUndumpedFrames >= 30) {
            this.dumpUnpersistedFrames();
        }
    };

    this.dumpUnpersistedFrames = (finalDump) => {
        let cacheContent = cache.find();
        console.log('Number of objects in Cache: ', cacheContent.length);
        if (initialised) {
            clearTimeout(timeoutSinceLastDump);
            let cacheData =  cache.find({'timestamp': { '$gt': lastFrameInDump } });
            let insertData = lokiProjection(cacheData);
            let dumpID = new Date().getTime();
            let timestamps = insertData.map((doc) => { return doc.timestamp; });
            let newestTimestamp = timestamps.reduce((a,b) => { return Math.max(a,b); });
            let oldestTimestamp = timestamps.reduce((a,b) => { return Math.min(a,b); });
            dumps[dumpID] = {
                first: oldestTimestamp,
                last: newestTimestamp,
                data: insertData
            };
            lastFrameInDump = newestTimestamp;
            countUndumpedFrames = 0;

            // TODO This insert seems to take veeery long. Verify this. And see how we can fix it.
            //      Maybe by only storing cluster delta instead of all the clusters in every frame.
            timeframeCollection.insertMany(insertData, (err, result) => {
                if (err) { console.error(err.message); }
                if (finalDump) {
                    timeoutSinceLastDump = null;
                } else {
                    timeoutSinceLastDump = setTimeout(this.dumpUnpersistedFrames.bind(this), 20000);
                }
                delete dumps[dumpID];
                console.log('Dumped '+insertData.length+' timeframes and reset timeout');
            });
        } else {
            console.warn('Database not initialised. Cannot dump keys.');
        }
    }
}

module.exports = StorageController;