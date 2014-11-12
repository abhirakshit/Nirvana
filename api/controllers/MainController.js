var bcrypt = require('bcrypt');


module.exports = {

    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to MainController)
     */
    _config: {},

    index: function (req, res) {
        if (req.session.isAuthenticated) {
            res.locals.layout = 'layout_index';
            return res.view('main/index', {
//                _layoutFile: '../layout_index',
                loggedUser: req.session.user
            });
        } else {
            return res.view('main/login');
        }
    },


    login: function (req, res, next) {
        var email = req.param("email");
        var password = req.param("password");
        if (!email || !password) {
            return res.view('main/login', {error: "Incorrect Username or Password"});
        }

        User.findOneByEmail(email, function foundUser(err, usr) {
            if (err || !usr) {
                return res.view('main/login', {error: "Incorrect Username or Password"});
            }

            // Compare password from the form params to the encrypted password of the user found.
            if (usr) {
                bcrypt.compare(password, usr.encryptedPassword, function (err, valid) {
                    if (err) return next(err);

                    // If the password is valid return user...
                    if (valid) {

                        req.session.user = usr;
                        req.session.isAuthenticated = true;
                        res.redirect('/');

                    } else {
                        return res.view('main/login', {error: "Incorrect Username or Password"});
                    }
                });

            } else {
                // if incorrect email was entered then user not found.
                return res.view('main/login', {error: "Incorrect Username or Password"});
            }
        });
    },


    logout: function (req, res, next) {
        console.log("Logging off...");
        req.session.user = null;
        req.session.isAuthenticated = null;
        res.redirect('/');
    }


};
