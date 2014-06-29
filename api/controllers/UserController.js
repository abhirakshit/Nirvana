/**
 * UserController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
var _ = require('lodash'),
    bcrypt = require('bcrypt'),
    async = require('async'),
    consts = require('consts');


createStaff = function (inputFields, cb) {
    //TODO - Auto gen password
    inputFields.encryptedPassword = inputFields.firstName + "1234";
    //Create User
    User.create(inputFields).exec(function (err, user) {
        if (err) {
            console.log("Could not create user: " + err);
            cb(err);
        }

        //Attach Student to User
        inputFields.user = user.id;

        // Create new student
        Staff.create(inputFields).exec(function (err, newStaff) {
            if (err) {
                console.log("Could not create staff: " + err);
                cb(err);
            }

            User.update(user.id, {staff: newStaff.id}).exec(function (err, updateduser) {
                if (err) {
                    cb(err);
                }

                cb(newStaff);
            });
        });

    });
};

module.exports = {

    create: function (req, res, next) {
        var inputFields = _.merge({}, req.params.all(), req.body);
        console.log(inputFields);

        if (inputFields.role == 'student' || inputFields.role == 'enquiry') {
            async.waterfall([
                function (callback) {
                    UserService.checkForEnquiryStatus(inputFields, callback);
                },
                function (inputFields, callback) {
                    UserService.createStudent(inputFields, UserService.getCurrentStaffUserId(req), callback);
                },
                function (newStudent, callback) {
                    UserService.createComment(UserService.getCurrentStaffUserId(req), newStudent.id, "Student Created!", consts.COMMENT_ADD, callback);
                },
                function (newStudentId, newComment, callback) {
                    UserService.getStudent(newStudentId, callback);
                }],
                function (err, student) {
                    if (err) {
                        console.log(err);
                        res.json(err);
                    }

                    res.json(student);
                })
        } else {
            createStaff(inputFields, function (staff) {
                res.json(staff);
            });
        }
    },

    getAllStaff: function (req, res, next) {
        User.find({role: 'staff'}).exec(function (err, staffList) {
            if (err) {
                return res.badRequest(err);
            }

            return res.json(staffList);
        })
    },

    getAllStudents: function (req, res, next) {
        User.find({role: 'student'}).exec(function (err, students) {
            if (err) {
                return res.badRequest(err);
            }

            return res.json(students);
        })
    },

    changePassword: function (req, res) {
        var id = req.param('id');
        if (!id) {
            return res.badRequest('No id provided.');
        }

        var currentPassword = req.param("currentPassword");
        var newPassword = req.param("newPassword");
        if (currentPassword && newPassword) {
            User.findOne(id).exec(function (err, user) {
                if (err || !user) {
                    res.badRequest(err);
                }

                user.validatePassword(currentPassword, function(err, valid) {
                    if (err) res.badRequest(err);

                    if (valid) {
                        User.update(id, {encryptedPassword: newPassword}).exec(function (err, updatedUsers){
                            if (err) res.badRequest(err);

                            if (!updatedUsers) {
                                res.send(400, {error: "Could not update password"});
                            } else {
                                res.json(updatedUsers[0]);
                            }
                        });
                    } else {
                        //if password is invalid then return wrong password.
//                        res.send(400, { error: "Wrong Password" });
                        res.badRequest("Wrong password");
                    }
                });

//                res.json(user);
            });
        } else {
            res.badRequest("Bad input");
        }
    },

    updatePartial: function (req, res, next) {

//        var updateFields = {};
//        updateFields = _.merge({}, req.params.all(), req.body);
//
//        var id = req.param('id');
//        if (!id) {
//            return res.badRequest('No id provided.');
//        }
//
//        //Check Associations
//        //Services
//        if (req.body.services) {
//            var serviceIds = _.map(req.body.services, function(stringId) { return parseInt(stringId); });
//            User.updateServices(id, serviceIds);
//        }
//
//        //Countries
//        if (req.body.countries) {
//            var countryIds = _.map(req.body.countries, function(stringId) { return parseInt(stringId); });
//            User.updateCountries(id, countryIds);
//        }
//
//        //Counselors
//        if (req.body.counselors) {
//            var counselorIds = _.map(req.body.counselors, function(stringId) { return parseInt(stringId); });
//            User.updateStaff(id, counselorIds);
//        }
//
//        //enquiryStatus
//        if (req.body.enquiryStatus) {
//            User.updateEnquiryStatus(id, parseInt(req.body.enquiryStatus));
//        }
//
//
//
//        User.update(id, updateFields, function (err, user) {
//
//            if (!user) return res.notFound();
//
//            if (err) return next(err);
//
//            res.json(user);
//
//        });
    }



};
