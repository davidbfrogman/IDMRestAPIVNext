import mongoose = require("mongoose");
import log = require('winston');

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://dbrown:password1@ds157320.mlab.com:57320/idmdocumentdb",{ server: { socketOptions: { keepAlive: 1 } } }).connection
    .on('error', console.log)
    .on('connected', () => {
        log.info(`Connected To Mongo Database: ${mongoose.connection.db.databaseName}`);
    });

export { mongoose };