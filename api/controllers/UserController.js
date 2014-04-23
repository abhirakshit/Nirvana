/**
 * UserController.js 
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

createStaff = function(inputFields, cb) {
    //TODO - Auto gen password
    inputFields.encryptedPassword = inputFields.firstName + "1234";
    //Create User
    User.create(inputFields).exec(function(err, user){
        if (err) {
            console.log("Could not create user: " + err);
            cb(err);
        }

        //Attach Student to User
        inputFields.user = user.id;

        // Create new student
        Staff.create(inputFields).exec(function(err, newStaff){
            if (err) {
                console.log("Could not create staff: " + err);
                cb(err);
            }
            cb(newStaff);
        });

    });
};


createStudent = function(inputFields, creatorId, cb) {

    //TODO - Auto gen password
    inputFields.encryptedPassword = inputFields.firstName + "1234";
    //Create User
    User.create(inputFields).exec(function(err, user){
        if (err) {
            console.log("Could not create user: " + err);
            cb(err);
        }

        //Attach Student to User
        inputFields.user = user.id;

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
                staffIdArr = [creatorId];
            }

            _.forEach(staffIdArr, function (id) {
                newStudent.staff.add(id);
            });
            //This student will not have the updated information so just returning id
            //This should be followed by getStudentById
            newStudent.save();

            cb(null, newStudent.id);
        });

    });
};

getStudentById = function (studentId, cb) {
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


module.exports = {

    create: function (req, res, next) {
        var inputFields = _.merge({}, req.params.all(), req.body);
//        console.log(inputFields);

        if (inputFields.role == 'student' || inputFields.role == 'enquiry') {
            async.waterfall([
                function(callback){
                    checkForEnquiryStatus(inputFields, callback);
                },
                function(inputFields, callback) {
                    createStudent(inputFields, req.session.user.id, callback);
//                    createStudent(inputFields, 2, callback);
                },
                function(newStudentId, callback) {
                    createComment(req.session.user.id, newStudentId, "Student Created!", callback);
//                    createComment(2, newStudentId, "Student Created!", callback);
                },
                function(newStudentId, comment, callback) {
                    getStudentById(newStudentId, callback);
                }
            ], function(err, student){
                if (err) {
                    console.log(err);
                    res.json(err);
                }

                res.json(student);
            })
        } else {
            createStaff(inputFields, function(staff) {
                res.json(staff);
            });
        }
    },

    getAllStaff: function(req, res, next) {
        User.find({role: 'staff'}).exec(function(err, staffList) {
            if (err) {
                return res.badRequest(err);
            }

            return res.json(staffList);
        })
    },

    getAllStudents: function(req, res, next) {
        User.find({role: 'student'}).exec(function(err, students) {
            if (err) {
                return res.badRequest(err);
            }

            return res.json(students);
        })
    },

    updatePartial: function (req, res, next) {

        var updateFields = {};
        updateFields = _.merge({}, req.params.all(), req.body);

        var id = req.param('id');
        if (!id) {
            return res.badRequest('No id provided.');
        }

        //Check Associations
        //Services
        if (req.body.services) {
            var serviceIds = _.map(req.body.services, function(stringId) { return parseInt(stringId); });
            User.updateServices(id, serviceIds);
        }

        //Countries
        if (req.body.countries) {
            var countryIds = _.map(req.body.countries, function(stringId) { return parseInt(stringId); });
            User.updateCountries(id, countryIds);
        }

        //Counselors
        if (req.body.counselors) {
            var counselorIds = _.map(req.body.counselors, function(stringId) { return parseInt(stringId); });
            User.updateStaff(id, counselorIds);
        }

        //enquiryStatus
        if (req.body.enquiryStatus) {
            User.updateEnquiryStatus(id, parseInt(req.body.enquiryStatus));
        }



        User.update(id, updateFields, function (err, user) {

            if (!user) return res.notFound();

            if (err) return next(err);

            res.json(user);

        });
    }


	
};
