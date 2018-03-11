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