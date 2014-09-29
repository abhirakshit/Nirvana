/**
 * ClassController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {


    create: function(req, res) {
//        var staffId = UserService.getCurrentStaffUserId(req);
        var classAttr = _.merge({}, req.params.all(), req.body);
//        console.log(_.merge({}, req.params.all(), req.body));

        //Create batch
        Class.create(classAttr).exec(function(err, newClass) {
            if (err || !newClass) {
                return res.badRequest(err);
            }

            Class.findOne(newClass.id).
                populate('staff').
                populate('topic').
//                populate('classes').
                exec(function(err, updatedClass){
                    if (err || !updatedClass) {
                        return res.badRequest(err);
                    }
                    res.json(updatedClass);
                })
        });

    }
	
};
