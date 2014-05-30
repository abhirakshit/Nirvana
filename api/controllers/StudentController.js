/**
 * StudentController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var _ = require('lodash'),
    async = require('async'),
    moment = require('moment');

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
    //Remove id
    delete updateFields['id'];

    var oldValues = student.toJSON();
    var keyArray = _.keys(updateFields);
    var comment = {};

    //Currently only one field
    _.forEach(keyArray, function(key){
        var newVal = updateFields[key];
        var oldVal = oldValues[key];

        //Check for Dates and format
        var dateFormat = "ddd, MMM Do 'YY, h:mm a";
        if (key === 'followUp') {
            newVal = moment(newVal).format(dateFormat);
            oldVal = moment(oldVal).format(dateFormat);
        }

        //Check for other String updates
        if (oldVal) {
            comment.str = "<b>" + Utils.capitalizeFirst(key) + ":</b> <i>'" + oldVal + "'</i> to <i>'" + newVal + "'</i>"
            comment.type = "change";
        } else {
            comment.str= "<b>" + Utils.capitalizeFirst(key) + ":</b> " + newVal;
            comment.type = "add";
        }
    });
    return comment;
};

/**
 * Updates services for a enquiry.
 */
updateServices = function (id, staffId, updatedServiceIdArr, res) {

    async.waterfall([
        function(callback){
            Student.findOne(id).populate('services').exec(function (err, student) {

                var existingServiceIdArr = _.map(student.services, function (service) {
                    return service.id;
                });
//                console.log(updatedServiceIdArr);
                var toRemove = _.difference(existingServiceIdArr, updatedServiceIdArr);
                var toAdd = _.difference(updatedServiceIdArr, existingServiceIdArr);

                //Remove all
                _.forEach(toRemove, function (id) {
                    student.services.remove(id);
                });

                //Add new
                _.forEach(toAdd, function (id) {
                    student.services.add(id);
                });
                student.save();
                return callback(null, toRemove, toAdd, student);
            });
        },
        function(servicesRemoved, servicesAdded, student, callback) {
            Service.find().exec(function(err, allServices){
                var addedServiceNameArr = [];
                var removedServiceNameArr = [];
                _.forEach(servicesRemoved, function(serviceId){
                    var serviceName = _.find(allServices, {'id': serviceId}).name;
                    removedServiceNameArr.push(serviceName);
                });

                _.forEach(servicesAdded, function(serviceId){
//                    console.log(_.find(allServices, {'id': serviceId}));
                    var serviceName = _.find(allServices, {'id': serviceId}).name;
                    addedServiceNameArr.push(serviceName);
                });

                var commentStr = "";
                var commentType = "";
                if (addedServiceNameArr.length > 0) {
                    commentStr = "<b>Service(s):</b> " + stringCleanUp(addedServiceNameArr);
                    commentType = "add";
                }

                if (removedServiceNameArr.length > 0) {
                    if (addedServiceNameArr.length > 0)
                        commentStr = commentStr + "<br />";

                    commentStr = commentStr + "<b>Service(s):</b> " + stringCleanUp(removedServiceNameArr);
                    commentType = "remove";
                }

                callback(null, commentStr, commentType);
            });
        },
        function (commentStr, commentType, callback) {
            UserService.createComment(staffId, id, commentStr, commentType, callback);
        },
        function (studentId, newComment, callback){
            UserService.getStudent(id, callback);
        }

    ], function(err, student){
        if (err) {
            console.log(err);
            return err;
        }

//        console.log("returning successfully");
        return res.json(student);
    });

};

/**
 * Updates countries for a user.
 */
updateCountries = function (id, staffId, updatedCountryIdArr, res) {

    async.waterfall([
        function(callback){
            Student.findOne(id).populate('countries').exec(function (err, student) {

                var existingCountriesIdArr = _.map(student.countries, function (country) {
                    return country.id
                });
                var toRemove = _.difference(existingCountriesIdArr, updatedCountryIdArr);
                var toAdd = _.difference(updatedCountryIdArr, existingCountriesIdArr);

                //Remove all
                _.forEach(toRemove, function (id) {
                    student.countries.remove(id);
                });

                //Add new
                _.forEach(toAdd, function (id) {
                    student.countries.add(id);
                });
                student.save();
                return callback(null, toRemove, toAdd, student);
    //            return student;
            });
        },
        function(countriesRemoved, countriesAdded, student, callback) {
            Country.find().exec(function(err, allCountries){
                var addedCountryNameArr = [];
                var removedCountryNameArr = [];
                _.forEach(countriesRemoved, function(countryId){
                    var countryName = _.find(allCountries, {'id': countryId}).name;
                    removedCountryNameArr.push(countryName);
                });

                _.forEach(countriesAdded, function(countryId){
                    var countryName = _.find(allCountries, {'id': countryId}).name;
                    addedCountryNameArr.push(countryName);
                });

                var commentStr = "";
                var commentType = "";
                if (addedCountryNameArr.length > 0) {
                    commentStr = "<b>Countries:</b> " + stringCleanUp(addedCountryNameArr);
                    commentType = "add";
                }

                if (removedCountryNameArr.length > 0) {
                    if (addedCountryNameArr.length > 0)
                        commentStr = commentStr + "<br />";

                    commentStr = commentStr + "<b>Countries:</b> " + stringCleanUp(removedCountryNameArr);
                    commentType = "remove";
                }

                callback(null, commentStr, commentType);
            });
        },
        function (commentStr, commentType, callback) {
            UserService.createComment(staffId, id, commentStr, commentType, callback);
        },
        function (studentId, newComment, callback){
            UserService.getStudent(id, callback);
        }

    ],
    function(err, student){
        if (err) {
            console.log(err);
            return err;
        }
        return res.json(student);
    });

};

/*
 * Updates EnquiryStatus
 */
updateEnquiryStatus = function (id, staffId, newEnquiryStatusId, res) {
    async.waterfall(
        [
            function(callback) {
                Student.findOne(id).populate('enquiryStatus').exec(function (err, student) {
                    if (err || !student) {
                        callback(err)
                    }
                    var oldEnquiryStatus = student.enquiryStatus;
                    Student.update({id:id}, {enquiryStatus: newEnquiryStatusId}).exec(function(err, updatedStudent){
                        if (err || !updatedStudent) {
                            callback(err);
                        }
                        return callback(null, oldEnquiryStatus, newEnquiryStatusId);
                    });
                });
            },
            function(oldEnqStatus, newEnqStatusId, callback) {
                EnquiryStatus.find().exec(function(err, allEnquiryStatus){
                    var oldStatusName = oldEnqStatus.name;
                    var newStatusName = _.find(allEnquiryStatus, {'id': newEnqStatusId}).name;
                    var commentStr = "<b>EnquiryStatus:</b> <i>'" + oldStatusName + "'</i> to <i>'" + newStatusName + "'</i>";
                    callback(null, commentStr, "change");
                });
            },
            function (commentStr, commentType, callback) {
                UserService.createComment(staffId, id, commentStr, commentType, callback);
            },
            function (studentId, newComment, callback){
                UserService.getStudent(id, callback);
            }

        ],
        function(err, student){
            if (err) {
                console.log(err);
                return err;
            }
            return res.json(student);
        }
    );
};

/**
 * Updates Staff for a user.
 */
updateStaff = function (id, staffId, updatedStaffIdArr, res) {
    async.waterfall(
        [
            function(callback) {
                Student.findOne(id).populate('staff').exec(function (err, student) {
                    var existingCounselorIdArr = _.map(student.staff, function (staff) {
                        return staff.id
                    });
                    var toRemove = _.difference(existingCounselorIdArr, updatedStaffIdArr);
                    var toAdd = _.difference(updatedStaffIdArr, existingCounselorIdArr);

                    //Remove all
                    _.forEach(toRemove, function (id) {
                        student.staff.remove(id);
                    });

                    //Add new
                    _.forEach(toAdd, function (id) {
                        student.staff.add(id);
                    });
                    student.save();
                    return callback(null, toRemove, toAdd, student);
                });
            },
            function(staffRemoved, staffAdded, student, callback) {
                Staff.find().exec(function(err, allStaff){
                    var addedStaffNameArr = [];
                    var removedStaffNameArr = [];
                    _.forEach(staffRemoved, function(staffId){
                        var staffName = _.find(allStaff, {'id': staffId}).fullName();
                        if (staffName)
                            removedStaffNameArr.push(staffName);
                    });

                    _.forEach(staffAdded, function(staffId){
                        var staffName = _.find(allStaff, {'id': staffId}).fullName();
                        if (staffName)
                            addedStaffNameArr.push(staffName);
                    });

                    var commentStr = "";
                    var commentType = "";
                    if (addedStaffNameArr.length > 0) {
                        commentStr = "<b>Staff:</b> " + stringCleanUp(addedStaffNameArr);
                        commentType = "add";
                    }

                    if (removedStaffNameArr.length > 0) {
                        if (addedStaffNameArr.length > 0)
                            commentStr = commentStr + "<br />";

                        commentStr = commentStr + "<b>Staff:</b> " + stringCleanUp(removedStaffNameArr);
                        commentType = "remove";
                    }

                    callback(null, commentStr, commentType);
                });
            },
            function (commentStr, commentType, callback) {
                UserService.createComment(staffId, id, commentStr, commentType, callback);
            },
            function (studentId, newComment, callback){
                UserService.getStudent(id, callback);
            }
        ],
        function(err, student){
            if (err) {
                console.log(err);
                return err;
            }
            return res.json(student);
        }
    );
};

/**
     * Add Education
     */
    addEducation = function(id, staffId, education, res) {
        async.waterfall(
            [
                function(callback) {
                    Student.findOne(id).populate('educationList').exec(function (err, student){
                    // Check if an education with same name exists
                        if (_.contains(student.educationList, education.programName)){
                            console.log("Education exists: " + education.programName);
                            return callback("Education exists: " + education.programName);
                        }

                    // Create new Education
                        education.student = student.id;
                        Education.create(education).exec(function(err, newEducation) {
                            if (err) {
                                console.log("Error creating edu: " + err);
                                return callback(err);
                            }

                            var commentStr = "<b>Education:</b> " + newEducation.programName+ ", " + newEducation.score;
                            return callback(null, commentStr, "add");
                        });
                    });
                },
                function (commentStr, commentType, callback) {
                    UserService.createComment(staffId, id, commentStr, commentType, callback);
                },
                function (studentId, newComment, callback){
                    UserService.getStudent(id, callback, 'educationList');
                }
            ],
            function(err, student) {
                if (err) {
                    console.log(err);
                    return err;
                }
                return res.json(student);
            }
        );
    };
/**
 * Remove Education
 */
removeEducation = function(id, staffId, education, res) {

    async.waterfall(
        [
            function(callback) {
                Student.findOne(id).populate('educationList').exec(function(err, student){
                    if (err) {
                        console.log("Error removing edu: " + err);
                        return callback(err);
                    }

                    student.educationList.remove(parseInt(education.id));

                    //Remove from education Table
                    Education.destroy(education.id).exec(function(err, deletedEducation) {
                        if (err) {
                            console.log("Error removing edu: " + err);
                            return callback(err);
                        }

                        var commentStr = "<b>Education:</b> " + deletedEducation[0].programName + ", " + deletedEducation[0].score;
                        student.save();
                        return callback(null, commentStr, "remove");
                    });

                });
            },
            function (commentStr, commentType, callback) {
                UserService.createComment(staffId, id, commentStr, commentType, callback);
            },
            function (studentId, newComment, callback){
                UserService.getStudent(id, callback, 'educationList');
            }
        ],
        function(err, student) {
            if (err) {
                console.log(err);
                return err;
            }
            return res.json(student);
        }
    );
};

/*
Email has to be updated both in student and user table
 */
updateEmail = function(id, staffId, updateFields, res) {
    async.waterfall([
        function(callback){
            Student.findOne(id).exec(function (err, student){
                var comment = getCommentStrFromUpdateFields(updateFields, student);
                callback(null, comment.str, comment.type);
            });
        },
        //Update Student and User with new data
        function(commentStr, commentType, callback) {
            Student.update(id, updateFields, function (err, updatedStudents) {
                if (err) {
                    return callback(err);
                }

                User.update(updatedStudents[0].user, updateFields, function(err, updatedUser){
                    if (err) {
                        return callback(err);
                    }
                    callback(null, commentStr, commentType);
                });
            });
        },

        function (commentStr, commentType, callback) {
            UserService.createComment(staffId, id, commentStr, commentType, callback);
        },
        //Get updated student
        function(studentId, comment, callback) {
            UserService.getStudent(id, callback);
        }
    ], function(err, student){
        if (err) {
            console.log(err);
            res.badRequest(err);
        }
        res.json(student);
    })
};

addComment = function(id, staffId, comment, res) {
    async.series([
        function(callback) {
//            console.log(req.body.comment);
            var commentStr = "<b>Comment:</b> " + comment.commentText;
            UserService.createComment(staffId, id, commentStr, "comment", callback)
        },
        function(callback) {
            UserService.getStudent(id, callback);
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
};

addEnroll = function(id, staffId, serviceId, totalFee, enrollDate, res){
    

    async.series([


        function(callback){
            var values = {student: id, service: serviceId, totalFee: totalFee, enrollDate: enrollDate };
            //create a enrollment for a student id
            Enroll.create(values).exec(function(err, enroll){
                if (err){
                    callback(err);

                }
                console.log(enroll);
                callback(null);
            });

        },

        function(callback){
            //create a comment that a new enrollment is created
            var commentStr = '<b>Enrolled:</b> ' + 'Total Fee ' + totalFee ;
            console.log();
            UserService.createComment(staffId, id, commentStr, "add", callback)


        },

       function(callback) {
            UserService.getStudent(id, callback, 'enrollments');
        }

        ], function(err, student){
            if (err){
                console.log(err);
                res.badRequest(err);
            }
            res.json(student);
        });
}



stringCleanUp = function(strArr) {
    return strArr.join(", ");
};


module.exports = {

    updatePartial: function (req, res) {
        var id = req.param('id');
//        console.log(_.merge({}, req.params.all(), req.body));
        if (!id) {
            return res.badRequest('No id provided.');
        } else if (req.body.services) {
            //Services
            var serviceIds = _.map(req.body.services, function(stringId) { return parseInt(stringId); });
            updateServices(id, UserService.getCurrentStaffUserId(req), serviceIds, res);
        } else if (req.body.countries) {
            //Countries
            var countryIds = _.map(req.body.countries, function(stringId) { return parseInt(stringId); });
            updateCountries(id, UserService.getCurrentStaffUserId(req), countryIds, res);
        } else if (req.body.staff) {
            //Counselors
            var staffIds = _.map(req.body.staff, function(stringId) { return parseInt(stringId); });
            updateStaff(id, UserService.getCurrentStaffUserId(req), staffIds, res);
        } else if (req.body.enquiryStatus) {
            //enquiryStatus
            updateEnquiryStatus(id, UserService.getCurrentStaffUserId(req), parseInt(req.body.enquiryStatus), res);
        } else if (req.body.addEducation) {
            //addEducation
            addEducation(id, UserService.getCurrentStaffUserId(req), req.body.addEducation, res);
        } else if (req.body.removeEducation) {
            //removeEducation
            removeEducation(id, UserService.getCurrentStaffUserId(req), req.body.removeEducation, res);
        } else if (req.body.comment) {
            //Add Comment
            addComment(id, UserService.getCurrentStaffUserId(req), req.body.comment, res);
        } else if (req.body.email) {
            updateEmail(id, UserService.getCurrentStaffUserId(req), req.body, res);
        } else if(req.body.enroll) {
            var enroll = req.body.enroll;
            addEnroll(id, UserService.getCurrentStaffUserId(req), enroll.service, enroll.totalFee, enroll.enrollDate, res);
        } else {
            var updateFields = _.merge({}, req.params.all(), req.body);
            async.waterfall([
                // Find student and create change comment
                function(callback){
                    Student.findOne(id).exec(function (err, student){
                        var comment = getCommentStrFromUpdateFields(updateFields, student);
                        callback(null, comment.str, comment.type);
                    });
                },
                //Update Student with new data
                function(commentStr, commentType, callback) {
                    Student.update(id, updateFields, function (err, updated) {
                        if (err) {
                            console.log("Could not update student: " + id + "\n" + err);
                            return callback(err);
                        }
                        callback(null, commentStr, commentType);
                    });
                },
                function (commentStr, commentType, callback) {
                    UserService.createComment(UserService.getCurrentStaffUserId(req), id, commentStr, commentType, callback);
                },
                //Get updated student
                function(studentId, comment, callback) {
//                    console.log("Get updated student");
                    UserService.getStudent(id, callback);
                }
            ],
            function(err, student){
                if (err) {
                    console.log(err);
                    res.badRequest(err);
                }
                res.json(student);
            });

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
                    res.badRequest("Could not process comment. " + err);
                }

                res.json(_.sortBy(commentCollection, 'createdAt').reverse());
            });
        });
    },

    getEnquiries: function (req, res) {
        EnquiryStatus.find().where({name: ['Enrolled', 'Closed']}).exec(function(err, enqStatusList){
            var enrolledId, closedId;
            while (enqStatusList.length) {
                var enquiry = enqStatusList.pop();
                if (enquiry.name === 'Enrolled')
                    enrolledId = enquiry.id;
                else
                    closedId = enquiry.id;
            }

            Student
                .find({
                    enquiryStatus: {'!' : [closedId, enrolledId]}
                })
                .populate('services')
                .populate('countries')
                .populate('staff')
                .populate('enquiryStatus')
                .exec(function(err, students){
                res.json(students);
            });

        });
    },


    getClosedEnquiries: function (req, res) {


        //TODO Why does this way does not work
//        EnquiryStatus.findOne().where({name: 'Closed'}).exec(function(err, enqStatus){
//            var closedId = enqStatus.id;
//            console.log("Enq: " + closedId);
//            Student
//                .find({enquiryStatus: closedId})
////                .populate('services')
////                .populate('countries')
////                .populate('staff')
////                .populate('enquiryStatus')
//                .exec(function(err, students){
//                    res.json(students);
//                });
//
//        });



        /*
        This is a round about way of getting the closed enquiries.
        We should find out why the above does not work
         */
        EnquiryStatus.find({name: {'!': 'Closed'}}).exec(function(err, enqStatusList){

            var enqIdArr = [];
            while (enqStatusList.length) {
                var enquiry = enqStatusList.pop();
                enqIdArr.push(enquiry.id);
            }
            Student
                .find({enquiryStatus: {'!' : enqIdArr}})
                .populate('services')
                .populate('countries')
                .populate('staff')
                .populate('enquiryStatus')
                .exec(function(err, students){
                    res.json(students);
                });

        });
    },

//         getPaymentInfo: function (req, res) {

//         var id = req.param('id');
//         if (!id) {
//             return res.badRequest('No id provided.');
//         }
       
// //get all the payments tied to a student id
//         Enroll.find().where({student: [id]}).populate('service').exec(function(err, enrollList){
          
//           //assign the results to a variable and create an empty array
//             var payments = enrollList;
//             var paymentCollection =[]; 

// console.log(enrollList);

//            // var serviceCollection = enrollList.service.get('name');
// //console.dir(enrollList);
// //console.log(enrollList[1].service.name);
// //loop through payment table and find all payments assigned to all enrollments for a student
//             async.each(payments, function(payment, callback){

// //find all payments for above enrollments                
//                 Payment.find().where({enroll: [payment.id]}).populate('enroll').exec(function(err, pay){

//                     if (err) {
//                         console.log("Error handling enroll:  " + pay.id + "\n" + err);
//                         callback(err);
//                     }

// Service.findOne(pay[0].enroll.service).exec(function(err,ser, pay){
//      if (err) {
//                         //console.log("Error handling enroll:  " + payment.id + "\n" + err);
//                         callback(err);
//                     }
//      // console.log(ser);              

//      // paymentCollection.push(pay.concat(ser));

// });
// //console.log(pay);

// //push each result to the payment Collection array defined above                    
//                 paymentCollection.push(pay);
               
// //tell async that process is completed
//                     callback();
//                 })
//             }, function(err){
//                 if (err) {
//                     console.log("Could not process payment information. " + err);
//                     res.badRequest("Could not process payment information. " + err);
//                 }
// //array1.concat(array2)
//                  res.json(paymentCollection);
//                 // res.json(payments);
//             });
//         });



//     },


    getEnrollments: function(req,res) {

        var id = req.param('id');
        if (!id) {
            return res.badRequest('No id provided.');
        }

        Student.findOne(id).populate('enrollments').exec(function(err,student){

    console.log(student);
    //res.json(student);
            var enrollmentList = student.enrollments;
            var enrollmentCollection = [];

//console.log(enrollmentList);
            async.each(enrollmentList, function(enroll, callback){

                Enroll.find(enroll.id).populate('payments').populate('service').exec(function(err,enr){

                    enrollmentCollection.push(enr);
                    callback();
                })


            }, function(err){
                if (err) {
                    console.log("Could not process payment information. " + err);
                    res.badRequest("Could not process payment information. " + err);
                }

//array1.concat(array2)
                 res.json(enrollmentCollection);
                // res.json(payments);


            });

        });



    }


	
};
