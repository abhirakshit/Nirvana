/**
 * StudentController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var _ = require('lodash'),
    async = require('async');


checkForEnquiryStatus = function(inputFields, cb) {
    if (!inputFields.enquiryStatus) {
        var defaultEnqName = 'In Progress';
        //If no enquiry status set to default
        EnquiryStatus.findOne({name: defaultEnqName}).exec(function (err, enqStatus) {
            if (err || !enqStatus) {
                console.log("Could not find enquiry " + defaultEnqName + "\n" + err);
                cb(err);
            }
            inputFields.enquiryStatus = enqStatus.id;
            cb(null, inputFields);
        })
    } else {
        cb(null, inputFields);
    }
};

createStudent = function(inputFields, userId, cb) {
        // Create new student
    Student.create(inputFields).exec(function(err, newStudent){
        if (err) {
            console.log("Could not create student: " + err);
            cb(err);
        }

        //Add associations
        //Check for assigned or assign current logged in
        var staffIdArr;
        if (inputFields.staff) {
            staffIdArr = _.map(inputFields.staff, function(stringId) { return parseInt(stringId); });
        } else {
            staffIdArr = [userId];
        }

        _.forEach(staffIdArr, function (id) {
            newStudent.staff.add(id);
        });
        //This student will not have the updated information so just returning id
        //This should be followed by getStudentById
        newStudent.save();

        cb(null, newStudent.id);
    });
};

getStudent = function (studentId, cb) {
    Student.findOne(studentId).exec(function (err, student) {
        if (err) {
            console.log("No student for id: " + studentId + "\n" + err);
            cb(err);
        }
        cb(null, student);
    });
};

createComment = function(staffId, studentId, commentStr, cb) {
    var commentAttribs = {
        comment: commentStr,
        added: staffId,
        received: studentId
    };
//    Comment.create({comment: comment}).exec(function(err, comment){
    Comment.create(commentAttribs).exec(function(err, newComment){
        if (err || !newComment) {
            console.log("Could not create comment: " + newComment + "\n" + err);
            cb(err);
        }

        cb(null, studentId, newComment);

    });
};


updateStudent = function(studentId, updateFields, cb) {
    Student.update(studentId, updateFields, function (err, student) {
        if (err || !student) {
            console.log("Could not update student: " + id + "\n" + err);
            return cb(err);
        }

        cb(null, student)
    });
};

getCommentStrFromUpdateFields = function(updateFields, student) {
    var keyArray = _.keys(updateFields);
    _.forEach(updateFields, function(field){
        
    });
    return "Some field has been updated";
};

createComment = function(staffId, studentId, commentStr, cb) {
    var commentAttribs = {
        comment: commentStr,
        added: staffId,
        received: studentId
    };
    console.log(commentAttribs);
    Comment.create(commentAttribs).exec(function(err, newComment){
        if (err || !newComment) {
            console.log("Could not create comment: " + newComment + "\n" + err);
            cb(err);
        }

        cb(null, newComment);

    });
};


module.exports = {

    create: function (req, res, next) {
        var inputFields = _.merge({}, req.params.all(), req.body);
//        console.log(inputFields);

        async.waterfall([
            function(callback){
                checkForEnquiryStatus(inputFields, callback);
            },
            function(inputFields, callback) {
                createStudent(inputFields, req.session.user.id, callback);
            },
            function(newStudentId, callback) {
                createComment(req.session.user.id, newStudentId, "Student Created!", callback);
            },
            function(newStudentId, newComment, callback) {
                getStudent(newStudentId, callback);
            }
        ], function(err, student){
            if (err) {
                console.log(err);
                res.json(err);
            }

            res.json(student);
        })
    },

    updatePartial: function (req, res) {

        var id = req.param('id');
        if (!id) {
            return res.badRequest('No id provided.');
        } else if (req.body.services) {
            //Services
            var serviceIds = _.map(req.body.services, function(stringId) { return parseInt(stringId); });
            res.json(Student.updateServices(id, serviceIds));
        } else if (req.body.countries) {
            //Countries
            var countryIds = _.map(req.body.countries, function(stringId) { return parseInt(stringId); });
            res.json(Student.updateCountries(id, countryIds));
        } else if (req.body.staff) {
            //Counselors
            var staffIds = _.map(req.body.staff, function(stringId) { return parseInt(stringId); });
            res.json(Student.updateStaff(id, staffIds));
        } else if (req.body.enquiryStatus) {
            //enquiryStatus
            res.json(Student.updateEnquiryStatus(id, parseInt(req.body.enquiryStatus)));
        } else if (req.body.addEducation) {
            //addEducation
            Student.addEducation(id, req.body.addEducation, res, ResponseService.sendResponse);
        } else if (req.body.removeEducation) {
            //removeEducation
            Student.removeEducation(id, req.body.removeEducation, res, ResponseService.sendResponse);
        } else {
            var updateFields = _.merge({}, req.params.all(), req.body);
            console.log(updateFields);

            async.waterfall([
                // Find student and create change comment
                function(callback){
                    console.log("Get Comment Str");
                    Student.findOne(id).exec(function (err, student){
                        var commentStr = getCommentStrFromUpdateFields(updateFields, student);
                        console.log(commentStr);
                        callback(null, commentStr);
                    });
                },
                //Update Student with new data
                function(commentStr, callback) {
                    console.log("Update Student");
                    Student.update(id, updateFields, function (err, student) {
                        if (err || !student) {
                            console.log("Could not update student: " + id + "\n" + err);
                            return callback(err);
                        }
                        callback(null, commentStr);
                    });
                },
                function (commentStr, callback) {
                    createComment(req.session.user.id, id, commentStr, callback)
                },
                //Get updated student
                function(studentId, comment, callback) {
                    console.log("Get updated student");
                    getStudent(id, callback);
                }
            ],
            function(err, student){
                if (err) {
                    console.log(err);
                    res.badRequest(err);
                }

                res.json(student);
            }
            );

        }
    },

    getComments: function (req, res) {
        var id = req.param('id');
        if (!id) {
            return res.badRequest('No id provided.');
        }

        Student.findOne(id).populate('commentsReceived').exec(function(err, student){
            var commentsReceived = student.commentsReceived;
            var commentCollection = [];
            async.each(commentsReceived, function(comment, callback){
                Comment.findOne(comment.id).populate('added').exec(function(err, comm){
                    if (err) {
                        console.log("Error handling comment:  " + comment.id + "\n" + err);
                        callback(err);
                    }
                    commentCollection.push(comm);
                    callback();
                })
            }, function(err){
                if (err) {
                    console.log("Could not process comments. " + err);
                    return res.badRequest("Could not process comment. " + err);
                }

                res.json(commentCollection);
            });
        });
    }
	
};
