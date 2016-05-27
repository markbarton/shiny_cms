/* GET 'about us' page */

var logger=require('../logger');

module.exports.home = function (req, res) {
            logger.debug('rendering Test Admin page')
    res.render('admin/home', {
         layout:'admin'
    });
};
