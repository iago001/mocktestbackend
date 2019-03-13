var mongoose = require('mongoose');

var exports = module.exports = {};

var tagSchema = new mongoose.Schema({
  tag: { type: String, required: true },
  maximumDuration: { type: Number, required: false }
});

var answerChoiceSchema = new mongoose.Schema({
  description: { type: String, required: true },
  explanation: { type: String, required: true },
  isCorrect: { type: Boolean, required: true }
});

var questionSchema = new mongoose.Schema({
  type: { type: Number, required: true },
  questionGroupId: { type: mongoose.Schema.Types.ObjectId, required: true },
  maximumMarks: { type: mongoose.Schema.Types.Decimal128, required: true },
  minimumMarks: { type: mongoose.Schema.Types.Decimal128, required: false },
  maximumDuration: { type: Number, required: false },
  title: { type: String, required: true },
  description: { type: String, required: true },
  answerChoices: {
    type: [answerChoiceSchema],
    required: true
  },
  answerExplanation: { type: String, required: true },
  tags: {
    type: [tagSchema],
    required: false
  }
});

var questionGroupSchema = new mongoose.Schema({
  description: { type: String, required: true },
  instructions: { type: String, required: true }
});

var ratingSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, required: true },
  rating: { type: mongoose.Schema.Types.Decimal128, required: true },
  timestamp: { type: Number, required: true }
});

var sectionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  instructions: { type: String, required: true },
  duration: { type: Number, required: true }
});

var schema = new mongoose.Schema({
  examId: { type: mongoose.Schema.Types.ObjectId, required: true },
  providerId: { type: mongoose.Schema.Types.ObjectId, required: true },
  paperYear: { type: Number, required: false },
  priorityCode: { type: Number, required: true },
  isValidated: { type: Boolean, required: true },
  isEnabled: { type: Boolean, required: true },
  price: { type: mongoose.Schema.Types.Decimal128, required: true },
  currency: { type: String, required: false },
  defaultLanguage: { type: String, required: true },
  instructions: { type: String, required: true },
  createdOn: { type: Number, required: true },
  lastUpdatedOn: { type: Number, required: true },
  submittedOn: { type: Number, required: true },
  validatedOn: { type: Number, required: true },
  ratings: {
    type: [ratingSchema],
    required: false
  },
  sections: {
    type: [sectionSchema],
    required: true
  }
});
  
exports.model = new mongoose.model('test', schema, "tests");