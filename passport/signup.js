var LocalStrategy   = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');
var bCrypt = require('bcrypt-nodejs');
var logger=require('../logger');
module.exports = function(passport){

    passport.use('signup', new LocalStrategy({
                passReqToCallback : true // allows us to pass back the entire request to the callback
            },
            function(req, username, password, done) {
                findOrCreateUser = function(){
                    username=username.toLowerCase();
                     // find a user in Mongo with provided username
                    User.findOne({ 'username' :  username }, function(err, user) {
                        // In case of any error, return using the done method
                        if (err){
                       logger.error("Error in Signup " + err)
                            return done(err);
                        }
                        // already exists
                        if (user) {
                            logger.debug("User already exists when trying to sign them up " + username)
                            return done(null, false, 'User Already Exists','User Already Exists');
                        } else {
                            // if there is no user with that email
                            // create the user
                            var newUser = new User();
                             // set the user's local credentials
                            newUser.username = username;
                            newUser.role=req.body.role;
                            newUser.status=req.body.status;
                            newUser.password = createHash(password);
                            // save the user
                            newUser.save(function(err) {
                                if (err){
                                    logger.error("Error when trying to save new user " + err);
                                    throw err;
                                }
                                logger.debug("New User registration successful" + newUser.username)
                                return done(null,newUser,{token: newUser.generateJWT()})
                            });
                        }
                    });
                };
                // Delay the execution of findOrCreateUser and execute the method
                // in the next tick of the event loop
                process.nextTick(findOrCreateUser);
            })
    );

    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }

}