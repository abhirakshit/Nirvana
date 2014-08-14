/**
 * StudentController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var _ = require('lodash'),
    async = require('async'),
    moment = require('moment'),
    consts = require('consts');

getCommentStrFromUpdateFields = function (updateFields, student) {
    //Remove id
    delete updateFields['id'];

    var oldValues = student.toJSON();
    var keyArray = _.keys(updateFields);
    var comment = {};

    //Currently only one field
    _.forEach(keyArray, function (key) {
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
//            comment.type = "change";
            comment.type = consts.COMMENT_CHANGE;
        } else {
            comment.str = "<b>" + Utils.capitalizeFirst(key) + ":</b> " + newVal;
//            comment.type = "add";
            comment.type = consts.COMMENT_ADD;
        }
    });
    return comment;
};

/**
 * Updates services for a enquiry.
 */
updateServices = function (studentId, staffId, updatedServiceIdArr, res) {

    async.waterfall([
        function (callback) {
            Student.findOne(studentId).populate('services').exec(function (err, student) {
                if (err || !student) {
                    console.log("Could not find student with id: " + studentId + "\n" + err);
                    callback(err);
                }

                var existingServiceIdArr = _.map(student.services, function (service) {
                    return service.id;
                });
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
        function (servicesRemoved, servicesAdded, student, callback) {
            Service.find().exec(function (err, allServices) {
                if (err || !allServices) {
                    console.log("Could not find services." + "\n" + err);
                    callback(err);
                }
                var addedServiceNameArr = [];
                var removedServiceNameArr = [];
                _.forEach(servicesRemoved, function (serviceId) {
                    var serviceName = _.find(allServices, {'id': serviceId}).name;
                    removedServiceNameArr.push(serviceName);
                });

                _.forEach(servicesAdded, function (serviceId) {
//                    console.log(_.find(allServices, {'id': serviceId}));
                    var serviceName = _.find(allServices, {'id': serviceId}).name;
                    addedServiceNameArr.push(serviceName);
                });

                var comments = [];
                if (addedServiceNameArr.length > 0) {
                    comments.push({
                        comment: "<b>Service(s):</b> " + stringCleanUp(addedServiceNameArr),
                        type: consts.COMMENT_ADD,
                        added: staffId,
                        received: studentId})
                }

                if (removedServiceNameArr.length > 0) {
                    comments.push({
                        comment: "<b>Service(s):</b> " + stringCleanUp(removedServiceNameArr),
                        type: consts.COMMENT_REMOVE,
                        added: staffId,
                        received: studentId})
                }

                callback(null, comments);
            });
        },
        function (comments, callback) {
            UserService.createComments(comments, callback);
        },
        function (newComment, callback) {
            UserService.getStudent(studentId, callback);
        }

    ], function (err, student) {
        if (err) {
            console.log(err);
            return err;
        }

        return res.json(student);
    });

};

/**
 * Updates countries for a user.
 */
updateCountries = function (studentId, staffId, updatedCountryIdArr, res) {

    async.waterfall([
        function (callback) {
            Student.findOne(studentId).populate('countries').exec(function (err, student) {
                if (err || !student) {
                    callback(err);
                }

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
        function (countriesRemoved, countriesAdded, student, callback) {
            Country.find().exec(function (err, allCountries) {
                if (err || !allCountries) {
                    callback(err);
                }
                var addedCountryNameArr = [];
                var removedCountryNameArr = [];
                _.forEach(countriesRemoved, function (countryId) {
                    var countryName = _.find(allCountries, {'id': countryId}).name;
                    removedCountryNameArr.push(countryName);
                });

                _.forEach(countriesAdded, function (countryId) {
                    var countryName = _.find(allCountries, {'id': countryId}).name;
                    addedCountryNameArr.push(countryName);
                });


                var comments = [];
                if (addedCountryNameArr.length > 0) {
                    var commentStr = "<b>Country:</b> " + stringCleanUp(addedCountryNameArr);
                    comments.push({comment: commentStr, type: consts.COMMENT_ADD, added: staffId, received: studentId})
                }

                if (removedCountryNameArr.length > 0) {
                    var commentStr1 = "<b>Country:</b> " + stringCleanUp(removedCountryNameArr);
                    comments.push({comment: commentStr1, type: consts.COMMENT_REMOVE, added: staffId, received: studentId})
                }

                callback(null, comments);
            });
        },
        function (comments, callback) {
            UserService.createComments(comments, callback);
        },
        function (newComment, callback) {
            UserService.getStudent(studentId, callback);
        }

    ],
        function (err, student) {
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
            function (callback) {
                Student.findOne(id).populate('enquiryStatus').exec(function (err, student) {
                    if (err || !student) {
                        callback(err)
                    }
                    var oldEnquiryStatus = student.enquiryStatus;
                    Student.update({id: id}, {enquiryStatus: newEnquiryStatusId}).exec(function (err, updatedStudent) {
                        if (err || !updatedStudent) {
                            callback(err);
                        }
                        return callback(null, oldEnquiryStatus, newEnquiryStatusId);
                    });
                });
            },
            function (oldEnqStatus, newEnqStatusId, callback) {
                EnquiryStatus.find().exec(function (err, allEnquiryStatus) {
                    if (err || allEnquiryStatus) {
                        callback(err);
                    }
                    var oldStatusName = oldEnqStatus.name;
                    var newStatusName = _.find(allEnquiryStatus, {'id': newEnqStatusId}).name;
                    var commentStr = "<b>EnquiryStatus:</b> <i>'" + oldStatusName + "'</i> to <i>'" + newStatusName + "'</i>";
//                    callback(null, commentStr, "change");
                    callback(null, commentStr, consts.COMMENT_CHANGE);
                });
            },
            function (commentStr, commentType, callback) {
                UserService.createComment(staffId, id, commentStr, commentType, callback);
            },
            function (studentId, newComment, callback) {
                UserService.getStudent(id, callback);
            }

        ],
        function (err, student) {
            if (err) {
                console.log(err);
                return err;
            }
            return res.json(student);
        }
    );
};


/**
 * Updates Locations for a user.
 */
updateLocations = function (studentId, staffId, updatedLocationsIdArr, res) {
    async.waterfall(
        [
            function (callback) {
                //TODO Needs update as location info has moved to User table
                Student.findOne(studentId).populate('locations').exec(function (err, student) {
                    if (err || !student) {
                        callback(err);
                    }
                    var existingLocationsIdArr = _.map(student.locations, function (location) {
                        return location.id
                    });
                    var toRemove = _.difference(existingLocationsIdArr, updatedLocationsIdArr);
                    var toAdd = _.difference(updatedLocationsIdArr, existingLocationsIdArr);

                    //Remove all
                    _.forEach(toRemove, function (id) {
                        student.locations.remove(id);
                    });

                    //Add new
                    _.forEach(toAdd, function (id) {
                        student.locations.add(id);
                    });

                    student.save(function (err, s) {
                        if (err || !s) callback(err);
                        callback(null, toRemove, toAdd, s);
                    });
                });
            },

            //Create comment string
            function (locationsRemoved, locationsAdded, student, callback) {
                Location.find().exec(function (err, allLocations) {
                    if (err || !allLocations) {
                        callback(err);
                    }
                    var addedLocationNameArr = [];
                    var removedLocationNameArr = [];
                    _.forEach(locationsRemoved, function (locationId) {
                        var locationName = _.find(allLocations, {'id': locationId}).name;
                        if (locationName)
                            removedLocationNameArr.push(locationName);
                    });

                    _.forEach(locationsAdded, function (locationId) {
                        var locationName = _.find(allLocations, {'id': locationId}).name;
                        if (locationName)
                            addedLocationNameArr.push(locationName);
                    });

                    var comments = [];
                    if (addedLocationNameArr.length > 0) {
                        var commentStr = "<b>Location(s):</b> " + stringCleanUp(addedLocationNameArr);
                        comments.push({comment: commentStr, type: consts.COMMENT_ADD, added: staffId, received: studentId})
                    }

                    if (removedLocationNameArr.length > 0) {
                        var commentStr1 = "<b>Location(s):</b> " + stringCleanUp(removedLocationNameArr);
                        comments.push({comment: commentStr1, type: consts.COMMENT_REMOVE, added: staffId, received: studentId})
                    }

                    callback(null, comments);
                });
            },
            function (comments, callback) {
                UserService.createComments(comments, callback);
            },
            function (newComment, callback) {
                UserService.getStudent(studentId, callback);
            }
        ],
        function (err, student) {
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
updateStaff = function (studentId, staffId, updatedStaffIdArr, res) {
    async.waterfall(
        [
            function (callback) {
                Student.findOne(studentId).populate('staff').exec(function (err, student) {
                    if (err || !student) {
                        callback(err);
                    }
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
                    student.save(function (err, s) {
                        if (err) callback(err);
                        callback(null, toRemove, toAdd, s);
                    });
                });
            },

            //Create comment string
            function (staffRemoved, staffAdded, student, callback) {
                Staff.find().exec(function (err, allStaff) {
                    if (err || !allStaff) {
                        callback(err)
                    }
                    var addedStaffNameArr = [];
                    var removedStaffNameArr = [];
                    _.forEach(staffRemoved, function (staffId) {
                        var staffName = _.find(allStaff, {'id': staffId}).fullName();
                        if (staffName)
                            removedStaffNameArr.push(staffName);
                    });

                    _.forEach(staffAdded, function (staffId) {
                        var staffName = _.find(allStaff, {'id': staffId}).fullName();
                        if (staffName)
                            addedStaffNameArr.push(staffName);
                    });

                    var comments = [];
                    if (addedStaffNameArr.length > 0) {
                        var commentStr = "<b>Staff:</b> " + stringCleanUp(addedStaffNameArr);
                        comments.push({comment: commentStr, type: consts.COMMENT_ADD, added: staffId, received: studentId})
                    }

                    if (removedStaffNameArr.length > 0) {
                        var commentStr1 = "<b>Staff:</b> " + stringCleanUp(removedStaffNameArr);
                        comments.push({comment: commentStr1, type: consts.COMMENT_REMOVE, added: staffId, received: studentId})
                    }

                    callback(null, comments);
                });
            },
            function (comments, callback) {
                UserService.createComments(comments, callback);
            },
            function (newComment, callback) {
                UserService.getStudent(studentId, callback);
            }
        ],
        function (err, student) {
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
addEducation = function (id, staffId, education, res) {
    async.waterfall(
        [
            function (callback) {
                Student.findOne(id).populate('educationList').exec(function (err, student) {
                    if (err || !student) {
                        callback(err);
                    }
                    // Check if an education with same name exists
                    if (_.contains(student.educationList, education.programName)) {
                        console.log("Education exists: " + education.programName);
                        return callback("Education exists: " + education.programName);
                    }

                    // Create new Education
                    education.student = student.id;
                    Education.create(education).exec(function (err, newEducation) {
                        if (err || !newEducation) {
                            console.log("Error creating edu: " + err);
                            callback(err);
                        }

                        var commentStr = "<b>Education:</b> " + newEducation.programName + ", " + newEducation.score;
                        return callback(null, commentStr, consts.COMMENT_ADD);
                    });
                });
            },
            function (commentStr, commentType, callback) {
                UserService.createComment(staffId, id, commentStr, commentType, callback);
            },
            function (studentId, newComment, callback) {
                UserService.getStudent(id, callback, 'educationList');
            }
        ],
        function (err, student) {
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
removeEducation = function (id, staffId, education, res) {

    async.waterfall(
        [
            function (callback) {
                Student.findOne(id).populate('educationList').exec(function (err, student) {
                    if (err) {
                        console.log("Error removing edu: " + err);
                        return callback(err);
                    }

                    student.educationList.remove(parseInt(education.id));

                    //Remove from education Table
                    Education.destroy(education.id).exec(function (err, deletedEducation) {
                        if (err) {
                            console.log("Error removing edu: " + err);
                            return callback(err);
                        }

                        var commentStr = "<b>Education:</b> " + deletedEducation[0].programName + ", " + deletedEducation[0].score;
                        student.save();
//                        return callback(null, commentStr, "remove");
                        return callback(null, commentStr, consts.COMMENT_REMOVE);
                    });

                });
            },
            function (commentStr, commentType, callback) {
                UserService.createComment(staffId, id, commentStr, commentType, callback);
            },
            function (studentId, newComment, callback) {
                UserService.getStudent(id, callback, 'educationList');
            }
        ],
        function (err, student) {
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
updateEmail = function (id, staffId, updateFields, res) {
    async.waterfall([
        function (callback) {
            Student.findOne(id).exec(function (err, student) {
                if (err || !student) {
                    callback(err);
                }
                var comment = getCommentStrFromUpdateFields(updateFields, student);
                callback(null, comment.str, comment.type);
            });
        },
        //Update Student and User with new data
        function (commentStr, commentType, callback) {
            Student.update(id, updateFields, function (err, updatedStudents) {
                if (err || !updatedStudents) {
                    return callback(err);
                }

                User.update(updatedStudents[0].user, updateFields, function (err, updatedUser) {
                    if (err || !updatedUser) {
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
        function (studentId, comment, callback) {
            UserService.getStudent(id, callback);
        }
    ], function (err, student) {
        if (err) {
            console.log(err);
            return res.badRequest(err);
        }
        res.json(student);
    })
};

addComment = function (id, staffId, comment, res) {
    async.series([
        function (callback) {
//            console.log(req.body.comment);
            var commentStr = "<b>Comment:</b> " + comment.commentText;
//            UserService.createComment(staffId, id, commentStr, "comment", callback)
            UserService.createComment(staffId, id, commentStr, consts.COMMENT_ADD, callback)
        },
        function (callback) {
            UserService.getStudent(id, callback);
        }
    ],
        function (err, student) {
            if (err || !student) {
                console.log(err);
                return res.badRequest(err);
            }
            res.json(student);
        }
    );
};

addEnroll = function (id, staffId, serviceId, totalFee, enrollDate, res) {
    async.series([
        function (callback) {
            var values = {student: id, service: serviceId, totalFee: totalFee, enrollDate: enrollDate };
            //create a enrollment for a student id
            Enroll.create(values).exec(function (err, enroll) {
                if (err || !enroll) {
                    callback(err);

                }
                console.log(enroll);
                callback(null);
            });

        },

        function (callback) {
            //create a comment that a new enrollment is created
            var commentStr = '<b>Enrolled:</b> ' + 'Total Fee ' + totalFee;
            console.log();
//            UserService.createComment(staffId, id, commentStr, "add", callback)
            UserService.createComment(staffId, id, commentStr, consts.COMMENT_ADD, callback)
        },

        function (callback) {
            UserService.getStudent(id, callback, 'enrollments');
        }

    ], function (err, student) {
        if (err || !student) {
            console.log(err);
            return res.badRequest(err);
        }
        res.json(student);
    });
};

addPayment = function (id, staffId, method, amount, receiptNumber, paymentDate, enrollId, res) {

    async.series([


        function (callback) {
            var values = {amount: amount, method: method, enroll: enrollId, receiptNumber: receiptNumber, paymentDate: paymentDate, receivedBy: staffId };
            //create a enrollment for a student id
            Payment.create(values).exec(function (err, payment) {
                if (err || !payment) {
                    callback(err);

                }
                callback(null);
            });

        },

        function (callback) {
            //create a comment that a new enrollment is created
            var commentStr = '<b>Paid:</b> ' + 'Amount: ' + amount;
            console.log();
//            UserService.createComment(staffId, id, commentStr, "add", callback)
            UserService.createComment(staffId, id, commentStr, consts.COMMENT_ADD, callback)
        },

        function (callback) {
            UserService.getStudent(id, callback, 'enrollments');
        }

    ], function (err, student) {
        if (err || !student) {
            console.log(err);
            return res.badRequest(err);
        }
        res.json(student);
    });


};

/**
 * This will get all the relations. Populate comments with creator info. Update enrollements
 * with payment info.
 * @param id: Student Id
 */
findStudent = function (id) {
    Student.findOne(id)
        .populate('commentsReceived')
        .populate('services')
        .populate('countries')
//        .populate('locations')
        .populate('staff')
        .populate('enquiryStatus')
        .populate('enrollments')
        .exec(function (err, student){
            if (err || !student) {

                async.parallel([
                    function(callback) {
                        //Populate comments
                        var commentsReceived = student.commentsReceived;
                        var commentCollection = [];
                        async.each(commentsReceived, function (comment, callback) {
                            Comment.findOne(comment.id).populate('added').exec(function (err, comm) {
                                if (err) {
                                    console.log("Error handling comment:  " + comment.id + "\n" + err);
                                    callback(err);
                                }
                                commentCollection.push(comm);
                                callback();
                            })
                        }, function (err) {
                            if (err) {
                                console.log("Could not process comments. " + err);
                                return res.badRequest("Could not process comment. " + err);
                            }

                            res.json(_.sortBy(commentCollection, 'createdAt').reverse());
                        });
                    },

                    function(callback) {
                        //Populate Enrollments

                    }

                ], function(err, results) {

                });


                //Enrollments
            }
        });
};

stringCleanUp = function (strArr) {
    return strArr.join(", ");
};


module.exports = {

    updatePartial: function (req, res) {
        var id = req.param('id'),
            staffId = UserService.getCurrentStaffUserId(req);

//        console.log(_.merge({}, req.params.all(), req.body));
        if (!id) {
            return res.badRequest('No id provided.');
        } else if (req.body.services) {
            //Services
            var serviceIds = _.map(req.body.services, function (stringId) {
                return parseInt(stringId);
            });
            updateServices(id, staffId, serviceIds, res);
        } else if (req.body.countries) {
            //Countries
            var countryIds = _.map(req.body.countries, function (stringId) {
                return parseInt(stringId);
            });
            updateCountries(id, staffId, countryIds, res);
        } else if (req.body.staff) {
            //Counselors
            var staffIds = _.map(req.body.staff, function (stringId) {
                return parseInt(stringId);
            });
            updateStaff(id, staffId, staffIds, res);
        } else if (req.body.locations) {
            //Counselors
            var locationIds = _.map(req.body.locations, function (stringId) {
                return parseInt(stringId);
            });
            //TODO Needs update as location info has moved to User table
            updateLocations(id, staffId, locationIds, res);
        } else if (req.body.enquiryStatus) {
            //enquiryStatus
            updateEnquiryStatus(id, staffId, parseInt(req.body.enquiryStatus), res);
        } else if (req.body.addEducation) {
            //addEducation
            addEducation(id, staffId, req.body.addEducation, res);
        } else if (req.body.removeEducation) {
            //removeEducation
            removeEducation(id, staffId, req.body.removeEducation, res);
        } else if (req.body.comment) {
            //Add Comment
            addComment(id, staffId, req.body.comment, res);
        } else if (req.body.email) {
            updateEmail(id, staffId, req.body, res);
        } else if (req.body.enroll) {
            var enroll = req.body.enroll;
            console.log(req.body.enroll);
            addEnroll(id, staffId, enroll.service, enroll.totalFee, enroll.enrollDate, res);
        } else if (req.body.payment) {
            var payment = req.body.payment;
            addPayment(id, staffId, payment.method, payment.amount, payment.receiptNumber, payment.paymentDate, payment.enroll, res);
        } else {
            var updateFields = _.merge({}, req.params.all(), req.body);
            async.waterfall([
                // Find student and create change comment
                function (callback) {
                    Student.findOne(id).exec(function (err, student) {
                        if (err || !student) {
                            callback(err);
                        }
                        var comment = getCommentStrFromUpdateFields(updateFields, student);
                        callback(null, comment.str, comment.type);
                    });
                },
                //Update Student with new data
                function (commentStr, commentType, callback) {
                    Student.update(id, updateFields, function (err, updatedStudent) {
                        if (err || !updatedStudent) {
                            console.log("Could not update student: " + id + "\n" + err);
                            return callback(err);
                        }
                        callback(null, commentStr, commentType);
                    });
                },
                function (commentStr, commentType, callback) {
                    UserService.createComment(staffId, id, commentStr, commentType, callback);
                },
                //Get updated student
                function (studentId, comment, callback) {
                    UserService.getStudent(id, callback);
                }
            ],
                function (err, student) {
                    if (err) {
                        console.log(err);
                        return res.badRequest(err);
                    }
                    res.json(student);
                });

        }
    },

    find: function (req, res) {
        var id = req.param('id');
        if (!id) {
            return res.badRequest('No id provided.');
        } else {
            return res.json(findStudent(id));
        }
    },

    getComments: function (req, res) {
        var id = req.param('id');
        if (!id) {
            return res.badRequest('No id provided.');
        }

        Student.findOne(id).populate('commentsReceived').exec(function (err, student) {
            if (err || !student) {
                return res.badRequest("Could not find student for id: " + id + "\n" + err);
            }

            var commentsReceived = student.commentsReceived;
            var commentCollection = [];
            async.each(commentsReceived, function (comment, callback) {
                Comment.findOne(comment.id).populate('added').exec(function (err, comm) {
                    if (err) {
                        console.log("Error handling comment:  " + comment.id + "\n" + err);
                        callback(err);
                    }
                    commentCollection.push(comm);
                    callback();
                })
            }, function (err) {
                if (err) {
                    console.log("Could not process comments. " + err);
                    return res.badRequest("Could not process comment. " + err);
                }

                res.json(_.sortBy(commentCollection, 'createdAt').reverse());
            });
        });
    },

    getEnquiries: function (req, res) {
        EnquiryView.find().exec(function (err, enquiries) {
            if(err || !enquiries) {
                return Utils.logQueryError(err, enquiries, "Could not find enquiries.", function(err) {
                    res.badRequest(err);
                });
            }
            res.json(enquiries);
        })

//        EnquiryStatus
//            .find()
//            .where({name: [consts.ENQ_STATUS_ENROLLED, consts.ENQ_STATUS_CLOSED]})
//            .exec(function (err, enqStatusList) {
//                if (err || !enqStatusList) {
//                    return res.badRequest("Could not find enquiry status list." + "\n" + err);
//                }
//                var enrolledId, closedId;
//                while (enqStatusList.length) {
//                    var enquiry = enqStatusList.pop();
//                    if (enquiry.name === consts.ENQ_STATUS_ENROLLED)
//                        enrolledId = enquiry.id;
//                    else
//                        closedId = enquiry.id;
//                }
//
//                Student.find({enquiryStatus: {'!': [closedId, enrolledId]}})
//                    .limit(5)
//                    .populate('services')
//                    .populate('countries')
//                    .populate('staff')
//                    .populate('enquiryStatus')
//                    .exec(function (err, students) {
//                        if (err || !students) {
//                            return res.badRequest("Could not find students." + "\n" + err);
//                        }
//                        res.json(students);
//                    });
//            });
    },

    getClosedEnquiries: function (req, res) {
        EnquiryStatus.findOne().where({name: consts.ENQ_STATUS_CLOSED}).exec(function (err, enqStatus) {
            Student.find({enquiryStatus: enqStatus.id})
                .populate('services')
                .populate('countries')
                .populate('staff')
                .populate('enquiryStatus')
                .exec(function (err, students) {
                    if (err || !students) {
                        return res.badRequest("Could not find students." + "\n" + err);
                    }
                    res.json(students);
                });
        });
    },

    getEnrolledStudents: function (req, res) {
        EnquiryStatus.findOne({name: consts.ENQ_STATUS_ENROLLED}).exec(function (err, enqStatusEnrolled) {
            if (err || !enqStatusEnrolled) {
                return res.badRequest("Could not find Enrolled enquiry status." + "\n" + err);
            }
            Student.find({enquiryStatus: enqStatusEnrolled.id})
                .populate('services')
                .populate('countries')
//                .populate('locations')
                .populate('staff')
                .populate('enquiryStatus')
                .populate('enrollments').
                exec(function (err, enrolledStudents) {
                    if (err || !enrolledStudents) {
                        return res.badRequest("Could not find enrolled students." + "\n" + err);
                    }

                    var studentCollection = [];
                    async.each(enrolledStudents, function (student, callback) {
                        var id = student.id;
                        if (!id) {
                            return res.badRequest('No id provided.');
                        }

                        var enrollmentList = student.enrollments;
                        var enrollmentCollection = [];

                        var paid = {};
                        async.each(enrollmentList, function (enroll, callback) {
                            Enroll.findOne(enroll.id).populate('payments').populate('service').exec(function (err, enr) {
                                if (err || !enr) {
                                    callback(err);
                                }
                                var sum = _.reduce(_.pluck(enr.payments, 'amount'), function (mem, payment) {
                                    return Number(mem) + Number(payment);
                                });

                                if (!sum) {
                                    sum = 0;
                                }
                                enr.totalPaid = sum;
                                enr.due = Number(enr.totalFee) - Number(enr.totalPaid);

                                enrollmentCollection.push(enr);
                                callback();
                            });
                        }, function (err) {
                            if (err) {
                                console.log("Could not process payment information. " + err);
                                return res.badRequest("Could not process payment information. " + err);
                            }

                            var payment = {};

                            var totalDue = _.reduce(_.pluck(enrollmentCollection, 'due'), function (mem, due) {
                                return Number(mem) + Number(due);
                            });

                            var totalPaid = _.reduce(_.pluck(enrollmentCollection, 'totalPaid'), function (mem, totalPaid) {
                                return Number(mem) + Number(totalPaid);
                            });

                            var totalFee = _.reduce(_.pluck(enrollmentCollection, 'totalFee'), function (mem, totalFee) {
                                return Number(mem) + Number(totalFee);
                            });

                            if (totalFee === null) {
                                totalFee = 0;
                            } else {
                                student.totalFee = Number(totalFee);
                            }
                            if (totalPaid === null) {
                                totalPaid = 0;
                            } else {
                                student.totalPaid = Number(totalPaid);
                            }

                            if (totalDue === null) {
                                totalDue = 0;
                            } else {
                                student.totalDue = Number(totalDue);
                            }

                            //student.totalPaid = Number(totalPaid);
                            // student.totalDue = totalDue;


                            studentCollection.push(student);
                            callback();


                        });


                    }, function (err) {
                        if (err) {
                            console.log("Could not process payment information. " + err);
                            return res.badRequest("Could not process payment information. " + err);
                        }
                        //  console.log(studentCollection);
                        res.json(studentCollection);


                    });
                });
        })
    },

    getEnrollments: function (req, res) {
        var id = req.param('id');
        if (!id) {
            return res.badRequest('No id provided.');
        }

        Student.findOne(id).populate('enrollments').exec(function (err, student) {
            if (err || !student) {
                return res.badRequest("Could not find student for id: " + id + "\n" + err);
            }

            var enrollmentList = student.enrollments;
            var enrollmentCollection = [];
            var paid = {};

            async.each(enrollmentList, function (enroll, callback) {

                Enroll.findOne(enroll.id).populate('payments').populate('service').exec(function (err, enr) {
                    if (err || !enr) {
                        callback(err);
                    }

                    var sum = _.reduce(_.pluck(enr.payments, 'amount'), function (mem, payment) {
                        return Number(mem) + Number(payment);
                    });


                    if (!sum) {
                        sum = 0;
                    }
                    enr.totalPaid = sum;
                    enr.due = Number(enr.totalFee) - Number(enr.totalPaid);

                    enrollmentCollection.push(enr);
                    callback();
                });
            }, function (err) {
                if (err) {
                    console.log("Could not process payment information. " + err);
                    return res.badRequest("Could not process payment information. " + err);
                }

                res.json(enrollmentCollection);
                // res.json(payments);
            });
        });
    },

    /**
     * Get all students enrolled in a particular service
     * @param req (should have service id)
     * @param res
     * @returns Array of students
     */
    getServiceEnrolledStudents: function (req, res) {
        var serviceId = req.param('id');
        if (!serviceId) {
            return res.badRequest('No service id provided.');
        }

        // Find all enrolled students
        EnquiryStatus.findOne({name: consts.ENQ_STATUS_ENROLLED}).exec(function (err, enqStatusEnrolled) {
            if (err || !enqStatusEnrolled) {
                return res.badRequest("Could not find enquiry status for : " + consts.ENQ_STATUS_ENROLLED + "\n" + err);
            }
            Student.find({enquiryStatus: enqStatusEnrolled.id})
                .populate('enrollments', {service: serviceId})
                .exec(function (err, students) {
                    if (err || !students) {
                        return res.badRequest("Could not find students." + "\n" + err);
                    }
                    res.json(
                        _.filter(students, function (student) {
                            return student.enrollments.length > 0;
                        }))
                });
        })
    },

    getTotalPayments: function (req, res) {

        var id = req.param('id');
        if (!id) {
            return res.badRequest('No id provided.');
        }

        Student.findOne(id).populate('enrollments').exec(function (err, student) {
            if (err || !student) {
                return res.badRequest("Could not find student for id: " + id + "\n" + err);
            }
            var enrollmentList = student.enrollments;
            var enrollmentCollection = [];
            var paid = {};

            async.each(enrollmentList, function (enroll, callback) {
                Enroll.findOne(enroll.id).populate('payments').populate('service').exec(function (err, enr) {
                    if (err || !enr) {
                        return res.badRequest("Could not find enroll for id: " + enroll.id + "\n" + err);
                    }
                    var sum = _.reduce(_.pluck(enr.payments, 'amount'), function (mem, payment) {
                        return Number(mem) + Number(payment);
                    });

                    if (!sum) {
                        sum = 0;
                    }
                    enr.totalPaid = sum;
                    enr.due = Number(enr.totalFee) - Number(enr.totalPaid);

                    enrollmentCollection.push(enr);
                    callback();
                });
            }, function (err) {
                if (err) {
                    console.log("Could not process payment information. " + err);
                    return res.badRequest("Could not process payment information. " + err);
                }

                var payment = {};

                var totalDue = _.reduce(_.pluck(enrollmentCollection, 'due'), function (mem, due) {
                    return Number(mem) + Number(due);
                });

                var totalPaid = _.reduce(_.pluck(enrollmentCollection, 'totalPaid'), function (mem, totalPaid) {
                    return Number(mem) + Number(totalPaid);
                });

                var totalFee = _.reduce(_.pluck(enrollmentCollection, 'totalFee'), function (mem, totalFee) {
                    return Number(mem) + Number(totalFee);
                });

                payment.student = id;
                payment.totalFee = totalFee;
                payment.totalPaid = totalPaid;
                payment.totalDue = totalDue;
//                console.log('Total Due: ' + totalDue + ' Total Paid: ' + totalPaid + ' Total Fee: ' + totalFee);
                res.json(payment);
            });

        });
    }
};
