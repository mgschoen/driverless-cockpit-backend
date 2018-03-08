const MongoClient = require('mongodb').MongoClient;
const Loki = require('lokijs');

function StorageController () {

    this.cache = new Loki('./db.json', { verbose: true }).addCollection('timeframes');
    this.dbClient = null;
    this.db = null;
    this.timeframeCollection = null;
    this.clipCollection = null;
    this.initialised = false;
    this.lastFramePersisted = 0;
    this.countUnpersistedFrames = 0;
    this.timeoutSinceLastDump = null;

    MongoClient.connect('mongodb://localhost:27017', (err, client) => {
        if (err) { console.error(err.message); process.exit(1); }
        this.dbClient = client;
        this.db = client.db('driverless');
        this.db.createCollection('timeframes', (err, tfCollection) => {
            if (err) { console.error(err.message); process.exit(1); }
            this.timeframeCollection = tfCollection;
            this.db.createCollection('recordings', (err, recCollection) => {
                if (err) { console.error(err.message); process.exit(1); }
                this.clipCollection = recCollection;
                this.initialised = true;
            })
        });
    });

    this.insert = (timestamp, frame) => {
        frame['timestamp'] = timestamp;
        this.cache.insert(frame);
        this.countUnpersistedFrames += 1;
        if (!this.timeoutSinceLastDump) {
            this.timeoutSinceLastDump = setTimeout(this.dumpUnpersistedFrames.bind(this), 20000);
        }
        if (this.countUnpersistedFrames >= 30) {
            this.dumpUnpersistedFrames();
        }
    };

    this.dumpUnpersistedFrames = (finalDump) => {
        if (this.initialised) {
            clearTimeout(this.timeoutSinceLastDump);
            let insertData =  this.cache.find({'timestamp': { '$gt': this.lastFramePersisted } });
            insertData.forEach((doc) => {
                delete doc.$loki;
                delete doc.meta;
            });
            this.timeframeCollection.insertMany(insertData, (err, result) => {
                if (err) { console.error(err.message); }
                if (finalDump) {
                    this.timeoutSinceLastDump = null;
                } else {
                    this.timeoutSinceLastDump = setTimeout(this.dumpUnpersistedFrames.bind(this), 20000);
                }
                let newestTimestamp = insertData.map((doc) => { return doc.timestamp; })
                                                .reduce((a,b) => { return Math.max(a,b); });
                this.lastFramePersisted = newestTimestamp;
                this.countUnpersistedFrames = 0;
                console.log('Dumped '+insertData.length+' timeframes and reset timeout');
            });
        } else {
            console.warn('Database not initialised. Cannot dump keys.');
        }
    }
}

module.exports = StorageController;