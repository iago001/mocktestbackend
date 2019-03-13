var mongoose = require('mongoose');

var exports = module.exports = {};

var stateSchema = new mongoose.Schema({
  name: { type: String, required: true }
});

var gradesOrQuotaSchema = new mongoose.Schema({
  maximumScore: { type: mongoose.Schema.Types.Decimal128, required: true },
  leastSelectedScore: { type: mongoose.Schema.Types.Decimal128, required: false },
  leastSelectedPercentile: { type: mongoose.Schema.Types.Decimal128, required: false }
});

var pastPerformancesSchema = new mongoose.Schema({
  year: { type: Number, required: true },
  gradesOrQuota: [gradesOrQuotaSchema]
});

var sectionsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  instructions: [String],
  minimumQuestionCount: { type: Number, required: true },
  maximumQuestionCount: { type: Number, required: true },
  duration: { type: Number, required: true },
  maximumMarks: { type: mongoose.Schema.Types.Decimal128 },
  minimumMarks: { type: mongoose.Schema.Types.Decimal128 },
  maximumDuration: { type: Number },
  tags: { type: [String], required: false }
});

var examSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  iconLarge: { type: String, required: true },
  conductingAuthority: { type: String, required: true },
  state: {
    stateSchema
  },
  url: { type: String, required: true },
  languages: [String],
  eligibilities: [String],
  instructions: [String],
  maximumMarks: { type: mongoose.Schema.Types.Decimal128 },
  minimumMarks: { type: mongoose.Schema.Types.Decimal128 },
  maximumDuration: { type: Number },
  pastPerformances: [pastPerformancesSchema],
  sections: [sectionsSchema],
  version: { type: String, required: true }
});

var schema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  iconLarge: { type: String, required: true },
  exams: {
    type: [examSchema],
    required: false
  }
});
  
exports.model = new mongoose.model('examcategory', schema, "examcategories");