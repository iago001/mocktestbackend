
var authService = require('./services/AuthService.js');
var adminService = require('./services/AdminService.js');
var providerService = require('./services/ProviderService.js');
var studentService = require('./services/StudentService.js');
var categoryService = require('./services/ExamCategoryService.js');
var testService = require('./services/TestService.js');

module.exports = {};

module.exports.init = function(app) { 
  authService.init(app);
  adminService.init(app);
  providerService.init(app);
  studentService.init(app);
  categoryService.init(app);
  testService.init(app);
};
  
module.exports.setReferences = function(db) {
  authService.setDB(db)
  
  adminService.setDB(db)
  adminService.setAuthService(authService)
  
  providerService.setDB(db)
  providerService.setAuthService(authService)  
  
  studentService.setDB(db)
  studentService.setAuthService(authService)  
  
  categoryService.setDB(db)
  categoryService.setAuthService(authService)
  
  testService.setDB(db)
  testService.setAuthService(authService)
};

module.exports.authService = authService;