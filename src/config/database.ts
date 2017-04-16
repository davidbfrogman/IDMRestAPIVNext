import mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://dbrown:password1@ds157320.mlab.com:57320/idmdocumentdb",{ server: { socketOptions: { keepAlive: 1 } } }).connection
    .on('error', console.log);

export { mongoose };