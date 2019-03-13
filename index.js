var express = require('express')
var bodyParser = require('body-parser')

var passport = require('passport');
var Strategy = require('passport-http-bearer').Strategy;

var db = require('./db.js')
var app = express()
app.use(bodyParser.json())

var services = require('./services.js');

services.init(app);

passport.use(new Strategy(
  function(token, cb) {
    services.authService.getDetailsForAuthToken(token, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      return cb(null, user);
    });
}));

// all services should be initialized before 'listen' call
app.listen(process.env.npm_package_config_port)
console.log("Server up and running at port: " + process.env.npm_package_config_port)

console.log("Opening connection with database")
db.connect(function() {
  console.log("connect successful")

  services.setReferences(db);
});

