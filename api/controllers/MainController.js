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
      if (err) return next(err);

      // If no user is found...
      if (!usr) {
       res.send(500, { error: "DB Error" });
      }

      // Compare password from the form params to the encrypted password of the user found.

      bcrypt.compare(password, usr.encryptedPassword, function(err, valid) {
        if (err) return next(err);

        // If the password is not valid then return error...
        if (!valid) {
          res.send(400, { error: "Wrong Password" });
        }

                        req.session.user = usr;
                        req.session.isAuthenticated = true;
                        res.redirect('/');
  
      });
    });

    },


    logout: function (req, res, next) {
        console.log("Logging off...");
        req.session.user = null;
        req.session.isAuthenticated = null;
        res.redirect('/');
    }


};
