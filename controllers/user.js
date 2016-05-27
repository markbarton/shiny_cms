var userData = require("../data/user");
var logger=require('../logger');


module.exports.allUsers= function (req, res,next) {
    logger.debug('All Users called');
    userData.allUsers(req,res)
};
module.exports.allUsersByClubId= function (req, res,next) {
    logger.debug('All Users by club id called');
    userData.allUsersByClubId(req,res)
};

module.exports.updateUser= function (req, res) {
    logger.debug('Update User called for ' + req.params.id);
    userData.updateUser(req,res)
};

module.exports.getUser= function (req, res) {
    logger.debug('Get User called for ' + req.params.id);
    userData.getUser(req,res)
};

module.exports.checkUser= function (req, res) {
    logger.debug('Check User called');
    userData.checkUser(req,res)
};
module.exports.forgottenPassword= function (req, res) {
    logger.debug('Forgotten Password Called');
    userData.forgottenPassword(req,res)
};
module.exports.changePassword= function (req, res) {
    logger.debug('Change Password Called');
    userData.changePassword(req,res)
};

module.exports.deleteUser= function (req, res) {
    logger.debug('Delete User called for ' + req.params.id);
    userData.deleteUser(req,res)
};

module.exports.sendEmail= function (req, res) {
    logger.debug('Send Email Called');
    userData.sendEmail(req,res)
};

