import mongoose = require("mongoose");
import log = require('winston');
import { config } from './config'

mongoose.Promise = require('bluebird');
mongoose.connect(config.devConfig.mongoConnectionString,{ server: { socketOptions: { keepAlive: 1 } } }).connection
    .on('error', console.log)
    .on('connected', () => {
        log.info(`Connected To Mongo Database: ${mongoose.connection.db.databaseName}`);
    });

export { mongoose };