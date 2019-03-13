var randomstring = require("randomstring");

var db;

module.exports = {};

module.exports.init = function(app){
  
  app.post('/account/session/login', function (req, res) {
    
    if (req.body.username && req.body.password) {
    
      db.authModel.find({username: req.body.username}, function(err, auths) {
        if (err) {
          console.log("username:" + err);
          res.sendStatus(500);
        } else {
          if (auths.length > 0 && auths[0].password === req.body.password) {
            findRandomToken(req, res, auths, 300);
          } else {
            console.log("not an admin");
            db.providerModel.find({email: req.body.username, password: req.body.password}, function(err, providers){
              if (err) {
                console.log("username:" + err);
                res.sendStatus(500);
              } else if (providers.length > 0) {
                findRandomToken(req, res, providers, 200);
              } else {
                res.sendStatus(401);
              }
            })
          }
        }
      });  
    } else {
      res.sendStatus(400);
    }
  });
  
};

module.exports.setDB =  function(dbInstance) {
  db = dbInstance;
};

module.exports.getDetailsForAuthToken = function(authToken1, callback) {
  db.sessionModel.find({authToken: authToken1}, function(err, sessions) {
    if (err) {
      console.log(err);
      callback(err, null);
      return
      
    } else if (sessions.length == 0) {
      console.log("auth token invalid");
      callback(err, null);
      return
      
    } else {
      callback(null, sessions[0]);
    }
  });
}

findRandomToken = function(req, res, auths, level) {
  
  var token = randomstring.generate({
    length: 12,
    charset: 'alphabetic'
  });
  db.sessionModel.find({authToken: token}, function(err, tokens) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else { 
      if (tokens.length == 0) {
        var session = new db.sessionModel({username: req.body.username, authToken: token, authLevel: level});
        session.save(function(err, session1) {
          
            if (err) {
              res.sendStatus(500);
            } else {
              var payload = {};
              payload.authToken = session1.authToken;
              payload.username = session1.username;
              payload.authLevel = session1.authLevel;
              payload.userId = auths[0]._id;
              res.status(200).json(payload);
            }
        });
      } else {
        findRandomToken(req, res, auths);
      }
    }
  });
  
}