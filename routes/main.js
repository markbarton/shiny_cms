var ctrl = require('../controllers/main');

//All routes which land on a single top level page are here - if the page has sub pages it gets its own route js page e.g. team

module.exports = function(app){
    app.get('/', ctrl.home);
};