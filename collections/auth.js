var mongoose = require('mongoose');

var exports = module.exports = {};

var schema = new mongoose.Schema({
  username: String,
  password: String
});
  
exports.model = new mongoose.model('auth', schema, "auth");