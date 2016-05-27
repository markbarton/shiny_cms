/**
 * Created by Mark on 31/10/2014.
 */
var User = require("../models/user"); //We need the mongoose model for Player
var logger=require('../logger');
var bCrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
var mg = require('nodemailer-mailgun-transport');

//We need to check this user exists and does not have a status of inactive
module.exports.checkUser=function(req,res){
    User.findById(req.user._id,function(err,user){

        // In case of any error, return using the done method
        if (err) {
            logger.error('error trying to find a user ' + req.user._id)
            return    res.status(400).send({'error':'error trying to find a user ' + req.user._id,'message':err});
        }
        if(!user){
            logger.debug('error trying to find a user ' + req.user._id)
            return     res.status(400).send({'error':'error trying to find a user ' + req.user._id});
        }

        if(user.status){
            if(user.status==='inactive'){
                logger.debug('user is inactive')
                return res.status(400).send({'error':'error user is inactive ' + req.user._id});
            }
        }
        res.json(user)
    })
    
}

//update user
module.exports.updateUser=function(req,res){

    User.findById(req.params.id, function(err, user) {
        // In case of any error, return using the done method
        if (err) {
            logger.error('error trying to update a user ' + req.params.id);
            return    res.status(400).send({'error':'error trying to update a user ' + req.params.id});
        }

        if(!user){
            logger.debug('cannot find user to update ' +req.params.id );
            return     res.status(400).send({'error':'error trying to update a user ' + req.params.id});
        }

        var today=new Date();
        if(req.body.username){
            user.username= req.body.username;
        }
        if(req.body.password){
            user.password=createHash(req.body.password);
        }
        if(req.body.avatar){
            user.avatar= req.body.avatar;
        }
        if(req.body.role){
            user.role= req.body.role;
        }
        if(req.body.phonenumber){
            user.phonenumber= req.body.phonenumber;
        }
        if(req.body.clientid){
            user.clientid= req.body.clientid;
        }
        user.updated_by = req.user.username;
        user.updated_date = today;
        user.save(function (err) {
            if (err) {
                //Throw error
                logger.error('error trying to update a user when saving ' + req.params.id);
                return   res.status(400).send({'error':'Error trying to update a user ' + req.params.id});
            }
            logger.debug('User has been updated ' + user.username);
            res.json(user)
        })
    })
};

//Find User if we can and then send
module.exports.forgottenPassword=function(req,res){

    User.findOne({ 'username' :  req.body.username },function(err, user) {
        if (err) {
            logger.error("error trying to find user for forgotten password " + req.body.username);
            return    res.status(400).send({'error':'error ' + err});
        }

        if(!user){
            //Hide a missing user
            logger.debug("User is missing when trying to trigger forgotten password")
            return     res.sendStatus(200);
        }

        //got user
         // This is your API key that you retrieve from www.mailgun.com/cp (free up to 10K monthly emails)
        var auth = {
            auth: {
                api_key: 'key-32562ab10d03f38009f735b2ecf287ff',
                domain: 'cms.virtualplace.co.uk'
            }
        }
        // set expiration to 1 day
        var today = new Date();
        var exp = new Date(today);
        exp.setDate(today.getDate() + 1);

        var nodemailerMailgun = nodemailer.createTransport(mg(auth));
        var token=jwt.sign({
            username: req.body.username,
           exp: parseInt(exp.getTime() / 1000)
        }, 'shinydesign');
        nodemailerMailgun.sendMail({
            from: 'donotreply@allsportanalytics.co.uk',
            to: req.body.username,
            subject: 'Forgotten Password',
            html: '<p><a href="http://cms.virtualplace.co.uk/#/admin/resetpassword#token=' + token+'">Click to reset your password</a></p>',
             text: 'Forgotten Password'
        }, function (err, info) {
            if (err){
                logger.error("error trying to email user " + err);
                return    res.status(400).send({'error':'error trying to email user ' + err});
            }else{
                logger.debug("Forgotten Email Success " + info)
                return     res.json(info);
            }

        });

    })
}


module.exports.changePassword=function(req,res){
    //User will already be extracted via JWT token
    logger.debug("Change Password for " + req.user);
    User.findOne({ 'username' :  req.user.username },function(err, user) {
        if (err) {
            logger.error("error trying to change password " + err);
            return res.status(400).send({'error': 'error ' + err});
        }

        if (!user) {
            logger.debug("Cannot find user to change password " + req.user);
            return res.status(400).send({'error': 'user not found'});
        }

        user.password = createHash(req.body.password);
        // save the user
        user.save(function(err) {
            if (err){
                logger.error("error trying to save a changed password " + err);
                return res.status(400).send({'error': 'error ' + err});
                throw err;
            }

            //Send Email with successful email change
            return res.json({'status':'password changed'})

        });
    })

}


// Generates hash using bCrypt
var createHash = function(password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}
//All Users
module.exports.allUsers=function(req,res){

    var query;
    query=User.find({});

    query.sort('-username')
    query.exec(function(err,users){
        if (err) {
           logger.error({'error':'error trying to list all users'})
            return res.status(400).send({'error':'error trying to list all users'});
        }
        if(!users){
            logger.debug("No Users Found")
            return res.status(400).send({'error':'No Users Found'});
        }
        res.json(users)
    })
}

//get a specific user
module.exports.getUser=function(req,res){

    User.findById(req.params.id, function(err, user) {
        // In case of any error, return using the done method
        if (err) {
            logger.error({'error':'error trying to find user by ID '+ req.params.id})
            return res.status(400).send({'error':'error trying to find user by ID '+ req.params.id});
        }
        if(!user){
            logger.debug({'error':'No user found using '+ req.params.id})
            return res.status(400).send({'error':'No user found using '+ req.params.id});
        }
        res.json(user)
    })
}

//Delete a specific user
module.exports.deleteUser=function(req,res){
    User.findOneAndRemove({'_id':req.params.id}, function(err, user) {
        user.remove(
            function(err){
                if(err){
                    logger.error({'error':'error trying to delete user '+ req.params.id,'msg':err})
                    res.status(400).send(err);
                }else{
                    res.json({'success':'true'})
                }
            }
        );
    });

}

// Generates hash using bCrypt
var createHash = function(password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}



