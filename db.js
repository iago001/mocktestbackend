var mongoose = require('mongoose');

var authCollection = require('./collections/auth.js');
var sessionCollection = require('./collections/session.js');
var providerCollection = require('./collections/provider.js');
var studentCollection = require('./collections/student.js');
var categoryCollection = require('./collections/examcategories.js');
var testCollection = require('./collections/tests.js');

var exports = module.exports = {};

var db;

exports.connect = function(callback) {
  
  mongoose.connect(process.env.npm_package_config_mongodburl, { useNewUrlParser: true });

  db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    // we're connected!
    console.log("Connected to database, initializing Models");
    
    exports.authModel = authCollection.model;
    exports.sessionModel = sessionCollection.model;
    exports.providerModel = providerCollection.model;
    exports.studentModel = studentCollection.model;
    exports.categoryModel = categoryCollection.model;
    exports.testModel = testCollection.model;
    callback();
  });
};
