const MongoClient = require('mongodb').MongoClient;

function StorageController () {

    this.cache = require('memory-cache');
    this.dbClient = null;
    this.db = null;
    this.timeframeCollection = null;
    this.clipCollection = null;
    this.initialised = false;
    this.packageKeys = [];
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

    this.insert = (timestamp, chunk) => {
        this.cache.put(timestamp, chunk, 30000);
        this.packageKeys.push(timestamp);
        if (!this.timeoutSinceLastDump) {
            this.timeoutSinceLastDump = setTimeout(this.dumpKeys.bind(this), 20000);
        }
        if (this.packageKeys.length >= 30) {
            this.dumpKeys();
        }
    };

    this.dumpKeys = (finalDump) => {
        if (this.initialised) {
            clearTimeout(this.timeoutSinceLastDump);
            let insertData = [];
            this.packageKeys.forEach((v) => {
                let timeframe = this.cache.get(v);
                timeframe['timestamp'] = v;
                insertData.push(timeframe);
            });
            this.timeframeCollection.insertMany(insertData, (err, result) => {
                if (err) { console.error(err.message); }
                if (finalDump) {
                    this.timeoutSinceLastDump = null;
                } else {
                    this.timeoutSinceLastDump = setTimeout(this.dumpKeys.bind(this), 20000);
                }
                this.packageKeys = [];
                console.log('Dumped '+insertData.length+' timeframes and reset timeout');
            });
        } else {
            console.warn('Database not initialised. Cannot dump keys.');
        }
    }
}

module.exports = StorageController;