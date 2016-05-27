/**
 * Created by Mark on 06/10/2015.
 */
var jwt = require('express-jwt');

var logger = require('./logger')

module.exports.ensureAuthorised = jwt({
    secret: 'shinydesign',
    credentialsRequired: true,
    getToken: function fromHeaderOrQuerystring (req) {
         if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1];
        } else if (req.query && req.query.token) {
            return req.query.token;
        }
        return null;
    }
});

//Changed to middleware
module.exports.checkRole=function(roles){
    return function(req,res,next){
        if(!req.user.role){
            logger.debug('No Role in User Object - Failed Check Role')
            return res.status(403).send('No Role in User Object - Failed Check Role');
        }
        if(roles.indexOf(req.user.role)===-1){
            logger.debug('User does not have a required role ')
            return res.status(403).send();
        }
        next();

    }

}



