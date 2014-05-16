var _ = require('lodash'),
    async = require('async'),
    moment = require('moment');



exports.getEnrollments = function (studentId, cb, populateField) {
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

};




