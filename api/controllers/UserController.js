/**
 * UserController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

//    update: function(req, res, next) {
//        console.log("Update model");
//        console.log(req.param('id'));
//        console.log(req.params);
//        console.log(req.body);
////        console.log(res);
//        return res.json("Hello");
//    }

    update: function (req, res, next) {
        console.log("Update model");
        console.log(req.param('id'));
        console.log(req.params);
        console.log(req.body);



        var updateFields = {};

        updateFields = _.merge({}, req.params.all(), req.body);

        var id = req.param('id');

        if (!id) {
            return res.badRequest('No id provided.');
        }

        User.update(id, updateFields, function (err, user) {

            if (!user) return res.notFound();

            if (err) return next(err);

            res.json(user);

        });
    }


	
};
