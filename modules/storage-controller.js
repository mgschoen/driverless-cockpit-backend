const MongoClient = require('mongodb').MongoClient;
const Loki = require('lokijs');

function StorageController () {

    let cache = new Loki('./db.json', { verbose: true }).addCollection('timeframes');
        cache.setTTL(30000, 1000);      // Expiration time for cache documents and check interval
    let dbClient = null;
    let db = null;
    let timeframeCollection = null;
    let clipCollection = null;
    let initialised = false;
    let lastFramePersisted = 0;
    let countUnpersistedFrames = 0;
    let timeoutSinceLastDump = null;

    MongoClient.connect('mongodb://localhost:27017', (err, client) => {
        if (err) { console.error(err.message); process.exit(1); }
        dbClient = client;
        db = client.db('driverless');
        db.createCollection('timeframes', (err, tfCollection) => {
            if (err) { console.error(err.message); process.exit(1); }
            timeframeCollection = tfCollection;
            db.createCollection('recordings', (err, recCollection) => {
                if (err) { console.error(err.message); process.exit(1); }
                clipCollection = recCollection;
                initialised = true;
            })
        });
    });

    this.createRecording = _ => {
        return new Promise((resolve, reject) => {
            if (initialised) {
                let insertObject = {
                    start: new Date().getTime(),
                    end: null,
                    writeActive: true };
                clipCollection.insertOne(insertObject, (err, response) => {
                    if (err) {
                        console.error(err.message);
                        reject(err.message);
                    }
                    console.log('[START RECORDING] id:', response.insertedId, ', started at:', response.ops[0].start);
                    resolve(response.insertedId);
                });
            } else {
                let msg = 'Database not initialised.';
                console.warn(msg);
                reject(msg);
            }
        });
    };

    this.finishRecording = (id) => {
        return new Promise((resolve, reject) => {
            if (initialised) {
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
                        reject(error.message);
                    });
            } else {
                let msg = 'Database not initialised.';
                console.warn(msg);
                reject(msg);
            }
        });
    };

    this.insert = (timestamp, frame) => {
        frame['timestamp'] = timestamp;
        cache.insert(frame);
        countUnpersistedFrames += 1;
        if (!timeoutSinceLastDump) {
            timeoutSinceLastDump = setTimeout(this.dumpUnpersistedFrames.bind(this), 20000);
        }
        if (countUnpersistedFrames >= 30) {
            this.dumpUnpersistedFrames();
        }
    };

    this.dumpUnpersistedFrames = (finalDump) => {
        let cacheContent = cache.find();
        console.log('Number of objects in Cache: ', cacheContent.length);
        if (initialised) {
            clearTimeout(timeoutSinceLastDump);
            let cacheData =  cache.find({'timestamp': { '$gt': lastFramePersisted } });
            let insertData = cacheData.map((doc) => {
                let copy = Object.assign({}, doc);
                delete copy.$loki;
                delete copy.meta;
                return copy;
            });
            timeframeCollection.insertMany(insertData, (err, result) => {
                if (err) { console.error(err.message); }
                if (finalDump) {
                    timeoutSinceLastDump = null;
                } else {
                    timeoutSinceLastDump = setTimeout(this.dumpUnpersistedFrames.bind(this), 20000);
                }
                let newestTimestamp = insertData.map((doc) => { return doc.timestamp; })
                                                .reduce((a,b) => { return Math.max(a,b); });
                lastFramePersisted = newestTimestamp;
                countUnpersistedFrames = 0;
                console.log('Dumped '+insertData.length+' timeframes and reset timeout');
            });
        } else {
            console.warn('Database not initialised. Cannot dump keys.');
        }
    }
}

module.exports = StorageController;