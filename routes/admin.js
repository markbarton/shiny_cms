/**
 * Created by Mark on 04/08/2014.
 * Admin Routes
 */


var ctrl = require('../controllers/admin');

module.exports = function(app){

     //Admin Home
    app.get('/admin/home',ctrl.home);



};