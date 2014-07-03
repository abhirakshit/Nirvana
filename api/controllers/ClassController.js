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
                res.json(err);
            }

            Class.findOne(newClass.id).
                populate('staff').
                populate('topic').
//                populate('classes').
                exec(function(err, updatedClass){
                    if (err || !updatedClass) {
                        res.json(err);
                    }
                    res.json(updatedClass);
                })
        });

    }
	
};
