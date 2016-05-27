/**
 * Created by Mark on 27/10/2014.
 */
var express = require('express');
var os = require('os');
var port = process.env.PORT || 8222;
var cors = require('cors');
var User=require("./models/user");
var logger = require('./logger')
var bodyParser = require('body-parser');
var router = express.Router();
var pjson = require('./package.json');
var path = require('path');

var mongoose = require('mongoose');
var config=require('./config');

var app = express();
var exphbs = require('express3-handlebars');
Swag = require('swag');

var hbs = exphbs.create({
    defaultLayout: 'main',
    partialsDir: [
        'views/partials/'
    ],
    extname:'.handlebars'

});

Swag.registerHelpers(hbs.handlebars);

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.get('/*', function (req, res, next) {
    res.header('X-CMSSERVER', os.hostname());
    res.header('X-CMSVERSION', pjson.version);
    next(); 
});

var passport = require('passport');
app.use(passport.initialize());
var routes=require('./routes')(app,passport);

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

app.use(cors());
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send('invalid JWT token...');
    }
});

//Satic File handling
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port);

mongoose.connect(config.mongoConnection.url,function(err){
    if(err)
    {
        logger.error(err + ' ' + config.mongoConnection.url)
    }
}); //connect once




logger.info(pjson.name+' Server Started');
logger.info('running in ' + process.env.NODE_ENV)
logger.info('CMS Server happens on port ' + port);
