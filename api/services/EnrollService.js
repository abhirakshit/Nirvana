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


exports.getTotalPayment = function (studentId, cb, populateField) {


    var id = studentId;
        if (!id) {
            return res.badRequest('No id provided.');
        }

        Student.findOne(id).populate('enrollments').exec(function(err,student){


            var enrollmentList = student.enrollments;
            var enrollmentCollection = [];
            var paid = {};

            async.each(enrollmentList, function(enroll, callback){

                Enroll.findOne(enroll.id).populate('payments').populate('service').exec(function(err,enr){

               var  sum = _.reduce(_.pluck(enr.payments,'amount'), function (mem, payment){
                    return Number(mem) + Number(payment);
                });

    
                if(!sum) {
                    sum = 0;
                } 
                  enr.totalPaid = sum;
                  enr.due = Number(enr.totalFee) - Number(enr.totalPaid);

                    enrollmentCollection.push(enr);
                    callback();
                });

                


            }, function(err){
                if (err) {
                    console.log("Could not process payment information. " + err);
                    res.badRequest("Could not process payment information. " + err);
                }

                 res.json(enrollmentCollection);
                // res.json(payments);


            });

        });








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

