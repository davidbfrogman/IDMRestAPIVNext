import mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://dbrown:password1@ds157320.mlab.com:57320/idmdocumentdb");

export { mongoose };