var mongoose = require('mongoose');

var exports = module.exports = {};

var schema = new mongoose.Schema({
  username: String,
  authToken: String,
  authLevel: Number,
  expired: Boolean
});
  
exports.model = new mongoose.model('session', schema, "sessions");