var bcrypt = require('bcrypt');


module.exports = {

    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to MainController)
     */
    _config: {},

    index: function (req, res) {
        if (req.session.isAuthenticated) {
//            console.log('Show index...');
            return res.view('main/index', {
                _layoutFile: '../layout_index',
                loggedUser: req.session.user
            });
        } else {
            console.log('Show login...');
            return res.view('main/login');
        }
    },


    login: function (req, res, next) {
        console.log("Trying to login...");
        var email = req.param("email");
        var password = req.param("password");

        User.findOneByEmail(email, function foundUser(err, usr) {
            if (err || !usr) {
                res.send(500, { error: "DB Error" });
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
//if password is invalid then return wrong password.
                        res.send(400, { error: "Wrong Password" });
                    }
                });

            } else {
// if incorrect email was entered then user not found.
                res.send(404, { error: "User not found!" });
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
