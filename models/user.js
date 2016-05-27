/**
 * Created by Mark on 09/09/2014.
 */


var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var logger = require('../logger');

var UserSchema=new mongoose.Schema({
    username:String,
    password: String,
    status:{type:String},
    role: String,
    created_by: {type: String},
    created_date: {type: Date, default: Date.now},
    updated_by: {type: String},
    updated_date: {type: Date, default: Date.now}
});

UserSchema.methods.generateJWT = function() {

    // set expiration to 60 days
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);
    return jwt.sign({
        _id: this._id,
        username: this.username,
        role:this.role,
        clientid:this.clientid,
        exp: parseInt(exp.getTime() / 1000)
    }, 'shinydesign');
};




module.exports = mongoose.model('User', UserSchema);