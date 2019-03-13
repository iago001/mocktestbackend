
var randomstring = require("randomstring")

var db;
var authService;

module.exports = {};

module.exports.init = function(app){
  
  app.post('/admin/createProvider', function (req, res) {
    console.log("generate a provider")
    
    var token = req.headers.authorization;
    if (token && token.includes("bearer ")) {
      
      authService.getDetailsForAuthToken(token.substr(7), function(err, session) {

        if (err) {
          console.log(err)
          res.sendStatus(500)
          return
        } else if (session && session.authLevel >= 300) {
        
          if (req.body.email && req.body.title && req.body.contactNumber) {
            var newPassword = randomstring.generate({
              length: 8,
              charset: 'alphabetic'
            });
            
            db.providerModel.find({email: req.body.email}, function(err, providers) {
              if (err) {
                console.log(err)
                res.sendStatus(500)
              } else {
              
                if (providers.length > 0) {
                  res.sendStatus(409)
                } else {
                  
                  var newProvider = new db.providerModel({
                    email: req.body.email,
                    password: newPassword,
                    title: req.body.title,
                    contactNumber: req.body.contactNumber
                  });
                
                  newProvider.save(function(err, newProvider1){
                    if (err) {
                      console.log(err)
                      res.sendStatus(500)
                    } else {
                      var payload = {};
                      payload.email = req.body.email
                      payload.password = newProvider1.password
                      res.status(200).json(payload) 
                    }
                  });
                }
              }
            })      
          
          } else {
            res.sendStatus(400)
          }
        } else {
          res.sendStatus(401)
        }
      })

    } else {
      res.sendStatus(401)
    }
  });
  
};

module.exports.setDB =  function(dbInstance) {
  db = dbInstance;
};

module.exports.setAuthService =  function(service) {
  authService = service;
};