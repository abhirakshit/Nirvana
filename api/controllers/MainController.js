module.exports = {

    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to MainController)
     */
    _config: {},

    index: function (req, res) {
        if (req.session.isAuthenticated) {
            console.log('Show index...');
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

        User.findOneByEmail(email).done(function(err, usr) {
            if (err) {
                res.send(500, { error: "DB Error" });
            } else {
                if (usr) {
                    if (password === usr.password) {
                        req.session.user = usr;
                        req.session.isAuthenticated = true;
//                        this.index(req, res);
                        res.view('main/index', {
                            _layoutFile: '../layout_index',
                            loggedUser: req.session.user
                        });
//                        res.send(usr);
                    } else {
                        res.send(400, { error: "Wrong Password" });
//                        res.send(400, usr);
                    }
                } else {
                    res.send(404, { error: "User not Found" });
                }
            }
        });
    }

};
