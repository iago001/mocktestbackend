var passport = require('passport')
var db;
var authService;

module.exports = {};

module.exports.init = function(app){
  
  app.get('/providers/', 
    passport.authenticate('bearer', { session: false }), 
    function (req, res) {
      
      db.providerModel.find({}, function(err, providers) {
        if (err) {
          console.log(err);
          res.sendStatus(500);
          return;
        }
                  
        var response = [];
        for (provider in providers) {
          
          var obj = providers[provider].toObject();
          
          delete obj["__v"]
          delete obj["password"]
          
          response.push(obj)
        }
        res.status(200).json(response)
      });      
  });
  
  app.post('/providers/', 
    function (req, res) {
      
      req.body.isActive = false;
      var newProvider = new db.providerModel(req.body);
      newProvider.save(function(err, newProvider1) {
        
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
          res.status(201).json(newProvider1.toObject());
        }
      });
 });
  
  app.get('/providers/:providerId', 
    passport.authenticate('bearer', { session: false }), 
    function (req, res) {
      if (req.params.providerId) {
        db.providerModel.findById(req.params.providerId, function(err, provider) {
          if (err) console.log(err);
            
          var obj = provider.toObject();

          res.status(200).json(obj)
        });
      } else {
        res.sendStatus(400)
      }
  });
  
  app.patch('/providers/:providerId', 
    passport.authenticate('bearer', { session: false }), 
    function (req, res) {
      
      if (req.body.email
          || req.body.password
          || req.body.isActive) {
            res.sendStatus(400)
      } else { 
      
        db.providerModel.findOneAndUpdate(
          // the id of the item to find
          { _id: req.params.providerId },
          
          // the change to be made. Mongoose will smartly combine your existing 
          // document with this change, which allows for partial updates too
          req.body,
          
          // an option that asks mongoose to return the updated version 
          // of the document instead of the pre-updated one.
          {new: true},
          
          // the callback function
          (err, updatedProvider) => {
          // Handle any possible database errors
              if (err) return res.status(500).send(err);
              return res.send(updatedProvider);
          }
        );
      }
  });
  
  app.delete('/providers/:providerId', 
    passport.authenticate('bearer', { session: false }), 
    function (req, res) {
      if (req.params.providerId) {
        db.providerModel.findOneAndDelete(req.params.providerId, function(err, provider) {
          if (err) {
            console.log(err);
            res.sendStatus(500)

          } else if (provider) {
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