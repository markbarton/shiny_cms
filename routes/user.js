/**
 * Created by Mark on 01/08/2014.
 * User - login / logout / create new user, edit user, delete user
 */

//var ctrl = require('../controllers/api');

var logger=require('../logger');
var controller=require('../controllers/user')
var authorised=require('../authorised');

module.exports = function(app,passport){

    /*********************USER LOGIN / LOGOUT / ISLOGGED IN / CURRENT USER DETAILS*******************/

        //A simple route to determine if the user is logged in - use this on any page you want to protect but doesnt call any of the APIs below
    app.get('/api/user/loggedin',authorised.ensureAuthorised,
        controller.checkUser
    );

 /**
     * Login User
     * Expects username & password
     * Returns 401 if failed
     */

    app.post('/api/user/login',
        function(req, res, next) {
            logger.debug('Logging In');
            passport.authenticate('login', function(err, user, info) {
                  if (err) { return next(err); }
                if (!user) { return res.status(401).send(info) }
                req.logIn(user, function(err) {
                    if (err) { return next(err); }
                    return res.status(200).send(info);
                });
            })(req, res, next);
        });


    /****************************USER CREATE / EDIT / DELETE / VIEW ******************/


    //Return Current User
    app.get('/api/user',authorised.ensureAuthorised,
        function(req, res) {
            logger.debug('current User')
             res.json(req.user);
        });
    //Create New User
    /**
     * Expects username & password
     */
    app.post('/api/user',
      //  authorised.ensureAuthorised,
       // authorised.checkRole(['admin']),
        function(req, res, next) {
            logger.debug('New User Sign Up Started');
            passport.authenticate('signup', function(err, user, info) {
                if (err) { return next(err); }
                if (!user) { return res.status(403).send(info) }
                //All good return the new user
                return res.status(200).send(user);

            })(req, res, next);
        });


    //Forgotten Password
    app.post('/api/user/forgotten',
    controller.forgottenPassword
    )

    //Change Password
    app.post('/api/user/change', 
        authorised.ensureAuthorised,
    controller.changePassword
    )

    //List all Users - requires Admin

    /*** ALL Users**/
    app.get('/api/users',
        authorised.ensureAuthorised,
        authorised.checkRole(['admin']),
        controller.allUsers
        );

    /*** ALL Users By Club ID**/
    app.get('/api/users/:clubid',
        authorised.ensureAuthorised,
        authorised.checkRole(['admin']),
        controller.allUsersByClubId
        );

    /*** Get Single User**/
    app.get('/api/user/:id',
        authorised.ensureAuthorised,
        authorised.checkRole(['admin']),
        controller.getUser
    );

    /****Update User**/
    app.put('/api/user/:id',
        authorised.ensureAuthorised,
        authorised.checkRole(['admin']),
        controller.updateUser
        );

    /***Delete User***/
    app.delete('/api/user/:id',
        authorised.ensureAuthorised,
        authorised.checkRole(['admin']),
        controller.deleteUser
    );
    

};