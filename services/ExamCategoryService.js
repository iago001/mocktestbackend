var passport = require('passport')
var db;
var authService;

module.exports = {};

module.exports.init = function(app){
  
  app.get('/categories/', 
    passport.authenticate('bearer', { session: false }), 
    function (req, res) {
      
      db.categoryModel.find({}, function(err, categories) {
        if (err) {
          console.log(err);
          res.sendStatus(500);
          return;
        }
          
        var response = [];
        for (category in categories) {
          
          var obj = categories[category].toObject();
          response.push(obj)
        }
        res.status(200).json(response)
      });      
  });
  
  app.post('/categories/', 
    passport.authenticate('bearer', { session: false }), 
    function (req, res) {
      
      var newCategory = new db.categoryModel(req.body);
      newCategory.save(function(err, newCategory1) {
        
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
          res.status(201).json(newCategory1.toObject());
        }
      });
  });
  
  app.get('/categories/:categoryId', 
    passport.authenticate('bearer', { session: false }), 
    function (req, res) {
      if (req.params.categoryId) {
        db.categoryModel.findById(req.params.categoryId, function(err, category) {
          if (err) {
            console.log(err);
            res.sendStatus(500);
          } else if (category) {
            var obj = category.toObject();

            res.status(200).json(obj)
          } else {
            res.sendStatus(404);
          }
        });
      } else {
        res.sendStatus(400)
      }
  });
  
  app.patch('/categories/:categoryId', 
    passport.authenticate('bearer', { session: false }), 
    function (req, res) {
      
      db.categoryModel.findOneAndUpdate(
        // the id of the item to find
        { _id: req.params.categoryId },
        
        // the change to be made. Mongoose will smartly combine your existing 
        // document with this change, which allows for partial updates too
        req.body,
        
        // an option that asks mongoose to return the updated version 
        // of the document instead of the pre-updated one.
        {new: true},
        
        // the callback function
        (err, updatedcategory) => {
        // Handle any possible database errors
            if (err) return res.status(500).send(err);
            return res.send(updatedcategory);
        }
      );
      
  });
  
  app.delete('/categories/:categoryId', 
    passport.authenticate('bearer', { session: false }), 
    function (req, res) {
      if (req.params.categoryId) {
        db.categoryModel.findOneAndDelete(req.params.categoryId, function(err, category) {
          if (err) {
            console.log(err);
            res.sendStatus(500)

          } else if (category) {
            res.sendStatus(200)
            
          } else {
            res.sendStatus(404)
          }
        });
      } else {
        res.sendStatus(400)
      }
  });
  
  app.post('/categories/:categoryId/exams/', 
    passport.authenticate('bearer', { session: false }), 
    function (req, res) {
      
      if (req.params.categoryId) {
        db.categoryModel.findById(req.params.categoryId, function(err, category) {
          if (err) {
            console.log(err);
            res.sendStatus(500);
          } else {
            category.exams.push(req.body);
            category.save(function(err, newCategory1) {
        
              if (err) {
                console.log(err);
                if (err.name === 'ValidationError') {
                  res.sendStatus(400);
                } else {
                  res.sendStatus(500);
                }
              } else {
                res.status(201).json(newCategory1.toObject());
              }
            });
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