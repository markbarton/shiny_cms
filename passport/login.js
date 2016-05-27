/**
 * Created by Mark on 09/09/2014.
 */


var LocalStrategy   = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');
var bCrypt = require('bcrypt-nodejs');
var logger=require('../logger')
;module.exports = function(passport){

    passport.use('login', new LocalStrategy({
                passReqToCallback : true
            },
            function(req, username, password, done) {
                // check in mongo if a user with username exists or not
                User.findOne({ 'username' :  username },
                    function(err, user) {
                        // In case of any error, return using the done method
                        if (err)
                            logger.error("Error trying to login " + err);
                            return done(err);
                        // Username does not exist, log the error and redirect back
                        if (!user){
                            logger.debug("User not found trying to login " + username)
                            return done(null, false,'User not found');
                        }
                        // User exists but wrong password, log the error
                        if (!isValidPassword(user, password)){
                            logger.debug("Wrong password entered trying to login " + username)
                            return done(null, false,'Password not correct'); // redirect back to login page
                        }
                        // User and password both match, return user from done method
                        // which will be treated like success
                        logger.debug("User logged in " + username)
                        return done(null,user,{token: user.generateJWT()})
                    }
                );

            })
    );

    var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    }

}