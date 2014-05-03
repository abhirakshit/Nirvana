/**
 * CounselorController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

    getAssignedStudents : function(req, res) {
        var id = req.param('id');
        if (!id) {
            return res.badRequest('No id provided.');
        };

        // Only return non joined or closed enquiries
        EnquiryStatus.find().where({name: ['Enrolled', 'Closed']}).exec(function(err, enqStatusList){
            var enrolledId, closedId;
            while (enqStatusList.length) {
                var enquiry = enqStatusList.pop();
                if (enquiry.name === 'Enrolled')
                    enrolledId = enquiry.id;
                else
                    closedId = enquiry.id;
            }
            Staff.findOne(id).populate('students').exec(function(err, staff){
                var students = staff.students;
                var studentCollection = [];
                async.each(students, function(student, callback){
                    Student.findOne(student.id).populate('countries').populate('services').populate('enquiryStatus').exec(function(err, stud){
                        if (err) {
                            console.log("Error handling comment:  " + student.id + "\n" + err);
                            callback(err);
                        }

                        if (stud.enquiryStatus.id != enrolledId && stud.enquiryStatus.id != closedId) // Only return non joined or closed enquiries
                            studentCollection.push(stud);
                        callback();
                    })
                }, function(err){
                    if (err) {
                        console.log("Could not process students. " + err);
                        res.badRequest(err);
                    }

                    res.json(studentCollection);
                });

            });
        });
    }
	
};
