module.exports = function(app,passport){

    require('./user')(app,passport);
    require('./main')(app);
    require('./admin')(app);

};