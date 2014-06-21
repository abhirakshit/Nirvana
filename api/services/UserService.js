var _ = require('lodash'),
    async = require('async'),
    moment = require('moment');

module.exports = {
    createComment : function(staffId, studentId, commentStr, commentType, cb) {
        var commentAttribs = {
            comment: commentStr,
            type: commentType,
            added: staffId,
            received: studentId
        };
        Comment.create(commentAttribs).exec(function(err, newComment){
            if (err || !newComment) {
                console.log("Could not create comment: " + newComment + "\n" + err);
                cb(err);
            }

            cb(null, studentId, newComment);
        });
    },

    getStudent : function (studentId, cb, populateField) {
        if (populateField) {
            Student.findOne(studentId).populate(populateField).exec(function (err, student) {
                if (err) {
                    console.log("No student for id: " + studentId + "\n" + err);
                    cb(err);
                }
                cb(null, student);
            });
        } else {
            Student.findOne(studentId).exec(function (err, student) {
                if (err) {
                    console.log("No student for id: " + studentId + "\n" + err);
                    cb(err);
                }
                cb(null, student);
            });
        }

    },

    getCurrentStaffUserId : function (req) {
    //    console.log("Session User");
    //    console.log(req.session.user);
        return req.session.user.staff;
    },

    checkForEnquiryStatus : function(inputFields, cb) {
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
    },

    createStudent : function(inputFields, staffId, cb) {
        inputFields.encryptedPassword = inputFields.firstName + "1234";
        User.create(inputFields).exec(function(err, user){
            if (err) {
                console.log("Could not create user: " + err);
                cb(err);
            }

            //Attach Student to User
            inputFields.user = user.id;

            // Create new student
            Student.create(inputFields).exec(function(err, newStudent){
                console.log("Create student with staff id: " + staffId);
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
                    console.log("Adding staff id: " + staffId);
                    staffIdArr = [staffId];
                }

                _.forEach(staffIdArr, function (id) {
                    newStudent.staff.add(id);
                });
                //This student will not have the updated information so just returning id
                //This should be followed by getStudentById
                newStudent.save();

                User.update(user.id, {student: newStudent.id}).exec(function(err, updateduser){
                    if (err) {
                        cb(err);
                    }

                    cb(newStudent);
                });

    //            cb(null, newStudent.id);
            });

        });
    }

}
//exports.createComment = function(staffId, studentId, commentStr, commentType, cb) {
//    var commentAttribs = {
//        comment: commentStr,
//        type: commentType,
//        added: staffId,
//        received: studentId
//    };
//    Comment.create(commentAttribs).exec(function(err, newComment){
//        if (err || !newComment) {
//            console.log("Could not create comment: " + newComment + "\n" + err);
//            cb(err);
//        }
//
//        cb(null, studentId, newComment);
//
//    });
//};
//
//exports.getStudent = function (studentId, cb, populateField) {
//    if (populateField) {
//        Student.findOne(studentId).populate(populateField).exec(function (err, student) {
//            if (err) {
//                console.log("No student for id: " + studentId + "\n" + err);
//                cb(err);
//            }
//            cb(null, student);
//        });
//    } else {
//        Student.findOne(studentId).exec(function (err, student) {
//            if (err) {
//                console.log("No student for id: " + studentId + "\n" + err);
//                cb(err);
//            }
//            cb(null, student);
//        });
//    }
//
//};
//
//exports.getCurrentStaffUserId = function (req) {
////    console.log("Session User");
////    console.log(req.session.user);
//    return req.session.user.staff;
//};
//
//
//exports.checkForEnquiryStatus = function(inputFields, cb) {
//    if (!inputFields.enquiryStatus) {
//        var defaultEnqName = 'In Progress';
//        //If no enquiry status set to default
//        EnquiryStatus.findOne({name: defaultEnqName}).exec(function (err, enqStatus) {
//            if (err || !enqStatus) {
//                console.log("Could not find enquiry " + defaultEnqName + "\n" + err);
//                cb(err);
//            }
//            inputFields.enquiryStatus = enqStatus.id;
//            cb(null, inputFields);
//        })
//    } else {
//        cb(null, inputFields);
//    }
//};
//
//exports.createStudent = function(inputFields, staffId, cb) {
//    inputFields.encryptedPassword = inputFields.firstName + "1234";
//    User.create(inputFields).exec(function(err, user){
//        if (err) {
//            console.log("Could not create user: " + err);
//            cb(err);
//        }
//
//        //Attach Student to User
//        inputFields.user = user.id;
//
//        // Create new student
//        Student.create(inputFields).exec(function(err, newStudent){
//            console.log("Create student with staff id: " + staffId);
//            if (err) {
//                console.log("Could not create student: " + err);
//                cb(err);
//            }
//
//            //Add associations
//            //Check for assigned or assign current logged in
//            var staffIdArr;
//            if (inputFields.staff) {
//                staffIdArr = _.map(inputFields.staff, function(stringId) { return parseInt(stringId); });
//            } else {
//                console.log("Adding staff id: " + staffId);
//                staffIdArr = [staffId];
//            }
//
//            _.forEach(staffIdArr, function (id) {
//                newStudent.staff.add(id);
//            });
//            //This student will not have the updated information so just returning id
//            //This should be followed by getStudentById
//            newStudent.save();
//
//            User.update(user.id, {student: newStudent.id}).exec(function(err, updateduser){
//                if (err) {
//                    cb(err);
//                }
//
//                cb(newStudent);
//            });
//
////            cb(null, newStudent.id);
//        });
//
//    });
//
//};


