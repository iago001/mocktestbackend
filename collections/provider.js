var mongoose = require('mongoose');

var exports = module.exports = {};

var schema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  iconLarge: { type: String, required: true },
  contactNumber: { type: String, required: true },
  isActive: { type: Boolean, required: true },
  panNumber: { type: String, required: true },
  gstin: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String, required: true },
  addressCity: { type: String, required: true },
  addressPincode: { type: Number, required: true },
  tags: [{ type: String }]
});
  
exports.model = new mongoose.model('provider', schema, "providers");