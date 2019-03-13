var mongoose = require('mongoose');

var exports = module.exports = {};

var schema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  profileImage: { type: String },
  profileImageLarge: { type: String },
  contactNumber: { type: String, required: true },
  isEnabled: { type: Boolean, required: true },
  gender: { type: String, required: true, enum: [ 'male', 'female', 'other' ] }
});
  
exports.model = new mongoose.model('student', schema, "students");