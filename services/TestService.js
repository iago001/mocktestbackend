var passport = require('passport')
var db;
var authService;

module.exports = {};

module.exports.init = function(app){
  
  app.get('/tests/', 
    passport.authenticate('bearer', { session: false }), 
    function (req, res) {
      
      db.testModel.find({}, function(err, tests) {
        if (err) {
          console.log(err);
          res.sendStatus(500);
          return;
        }
          
        var response = [];
        for (test in tests) {
          
          var obj = tests[test].toObject();
          response.push(obj)
        }
        res.status(200).json(response)
      });      
  });
  
  app.post('/tests/', 
    passport.authenticate('bearer', { session: false }), 
    function (req, res) {
      
      req.body.createdOn = Date.now();
      req.body.lastUpdatedOn = 0;
      req.body.submittedOn = 0;
      req.body.validatedOn = 0;
      req.body.isValidated = false;
      req.body.isEnabled = false;      
      
      var newTest = new db.testModel(req.body);
      newTest.save(function(err, newTest1) {
        
        if (err) {
          console.log(err);
          if (err.code == 11000) {
            res.sendStatus(409);
          } else if (err.name === 'ValidationError') {
            res.sendStatus(400);
          } else {
            res.sendStatus(500);
          }
        } else {
          res.status(201).json(newTest1.toObject());
        }
      });
  });
  
  app.get('/tests/:testId', 
    passport.authenticate('bearer', { session: false }), 
    function (req, res) {
      if (req.params.testId) {
        db.testModel.findById(req.params.testId, function(err, test) {
          if (err) {
            console.log(err);
            res.sendStatus(500);
          } else if (test) {
            var obj = test.toObject();

            res.status(200).json(obj)
          } else {
            res.sendStatus(404);
          }
        });
      } else {
        res.sendStatus(400)
      }
  });
  
  app.patch('/tests/:testId', 
    passport.authenticate('bearer', { session: false }), 
    function (req, res) {
      
      if (req.body.createdOn
          || req.body.isValidated
          || req.body.isEnabled
          || req.body.lastUpdatedOn
          || req.body.submittedOn
          || req.body.validatedOn) {
            res.sendStatus(400)
      } else { 
      
        req.body.lastUpdatedOn = Date.now();
        req.body.submittedOn = 0;
        req.body.validatedOn = 0; 
        req.body.isValidated = false;
        req.body.isEnabled = false;    
      
        db.testModel.findOneAndUpdate(
          // the id of the item to find
          { _id: req.params.testId },
          
          // the change to be made. Mongoose will smartly combine your existing 
          // document with this change, which allows for partial updates too
          req.body,
          
          // an option that asks mongoose to return the updated version 
          // of the document instead of the pre-updated one.
          {new: true},
          
          // the callback function
          (err, updatedTest) => {
          // Handle any possible database errors
              if (err) return res.status(500).send(err);
              return res.send(updatedTest);
          }
        );
      }
  });
  
  app.delete('/tests/:updatedTest', 
    passport.authenticate('bearer', { session: false }), 
    function (req, res) {
      if (req.params.updatedTest) {
        db.testModel.findOneAndDelete(req.params.updatedTest, function(err, test) {
          if (err) {
            console.log(err);
            res.sendStatus(500)

          } else if (test) {
            res.sendStatus(200)
            
          } else {
            res.sendStatus(404)
          }
        });
      } else {
        res.sendStatus(400)
      }
  });

};

module.exports.setDB =  function(dbInstance) {
  db = dbInstance;
};

module.exports.setAuthService =  function(service) {
  authService = service;
};