/**
 * UserController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {


    create: function (req, res, next) {
        sails.log.debug("Create user: " + req.params.all());
        Users.create(req.params.all(), function userCreated(err, user) {
            if (err){
                sails.log.error("Could not create user: " + Object.prototype.toString.call(err));
                return next(err);
            }

            res.json(user);
        })
    }
	
};
