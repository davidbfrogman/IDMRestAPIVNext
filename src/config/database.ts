import mongoose = require("mongoose");
import log = require('winston');
import { Config } from './config';

let mongoConnectionString = Config.currentConfig().mongoConnectionString;

mongoose.Promise = require('bluebird');
mongoose.connect(mongoConnectionString,{ server: { socketOptions: { keepAlive: 1 } } }).connection
    .on('error', console.log)
    .on('connected', () => {
        log.info(`Connected To Mongo Database: ${mongoose.connection.db.databaseName}`);
    });

export { mongoose };