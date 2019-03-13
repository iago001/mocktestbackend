var passport = require('passport')
var db;
var authService;

module.exports = {};

module.exports.init = function(app){
  
  app.get('/students/', 
    passport.authenticate('bearer', { session: false }), 
    function (req, res) {
      
      db.studentModel.find({}, function(err, students) {
        if (err) {
          console.log(err);
          res.sendStatus(500);
          return;
        }
          
        var response = [];
        for (student in students) {
          
          var obj = students[student].toObject();
          
          delete obj["__v"]
          delete obj["password"]
          
          response.push(obj)
        }
        res.status(200).json(response)
      });      
  });
  
  app.post('/students/', 
    function (req, res) {
      
      req.body.isEnabled = true;
      var newStudent = new db.studentModel(req.body);
      newStudent.save(function(err, newStudent1) {
        
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
          res.status(201).json(newStudent.toObject());
        }
      });
  });
  
  app.get('/students/:studentId', 
    passport.authenticate('bearer', { session: false }), 
    function (req, res) {
      if (req.params.studentId) {
        db.studentModel.findById(req.params.studentId, function(err, student1) {
          if (err) {
            console.log(err);
            res.sendStatus(500);
            
          } else if (student1) {
            var obj = student1.toObject();
            res.status(200).json(obj)
            
          } else {
            res.sendStatus(404);
          }
        });
      } else {
        res.sendStatus(400)
      }
  });
  
  app.patch('/students/:studentId', 
    passport.authenticate('bearer', { session: false }), 
    function (req, res) {
      
      if (req.body.email
          || req.body.password
          || req.body.isEnabled) {
            res.sendStatus(400)
      } else { 
           
        db.studentModel.findOneAndUpdate(
          // the id of the item to find
          { _id: req.params.studentId },
          
          // the change to be made. Mongoose will smartly combine your existing 
          // document with this change, which allows for partial updates too
          req.body,
          
          // an option that asks mongoose to return the updated version 
          // of the document instead of the pre-updated one.
          {new: true},
          
          // the callback function
          (err, updatedStudent) => {
          // Handle any possible database errors
              if (err) return res.status(500).send(err);
              return res.send(updatedStudent);
          }
        );
      }
  });
  
  app.delete('/students/:studentId', 
    passport.authenticate('bearer', { session: false }), 
    function (req, res) {
      if (req.params.studentId) {
        db.studentModel.findOneAndDelete(req.params.studentId, function(err, student) {
          if (err) {
            console.log(err);
            res.sendStatus(500)

          } else if (student) {
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