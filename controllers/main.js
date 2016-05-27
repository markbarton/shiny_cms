/* GET 'about us' page */

var logger=require('../logger');

module.exports.home = function (req, res) {
            logger.debug('rendering Home page')
            res.render('home')
};
