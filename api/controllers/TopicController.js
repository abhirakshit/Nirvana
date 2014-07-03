/**
 * CourseController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

    create: function(req, res) {
//        var staffId = UserService.getCurrentStaffUserId(req);
        var topicAttr = _.merge({}, req.params.all(), req.body);
//        console.log(_.merge({}, req.params.all(), req.body));

        //Create batch
        Topic.create(topicAttr).exec(function(err, topic) {
            if (err || !topic) {
                console.log("Error creating topic: \n" + topicAttr);
                console.log(err);
                return res.json(err);
            }

            Topic.findOne(topic.id).
                populate('service').
//                populate('classes').
                exec(function(err, populatedTopic){
                    if (err || !topic) {
                        res.json(err);
                    }
                    console.log(populatedTopic);
                    res.json(populatedTopic);
                })
        });
    }
	
};
