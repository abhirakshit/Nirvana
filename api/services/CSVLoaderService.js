var _ = require('lodash'),
    async = require('async'),
    moment = require('moment'),
    consts = require('consts'),
    fs = require('fs'),
    csv = require('fast-csv');

module.exports = {
    loadCountries: function (path, fileName, callback) {
        var countryArr = [];
        csv.fromPath(path + fileName, {headers: true})
            .on("record", function (data) {
                countryArr.push(data);
            })
            .on("end", function () {
                Country.create(countryArr).exec(function (err, newCountries) {
                    if (err || !newCountries) {
                        console.log(err);
//                        return callback(err);
                        return callback(null);
                    }
                    console.log('***Added Countries: ' + countryArr);
                    callback(null);
                });
            });
    },

    loadServices: function (path, fileName, callback) {
        var serviceArr = [];
        csv.fromPath(path + fileName, {headers: true})
            .on("record", function (data) {
                serviceArr.push(data);
            })
            .on("end", function () {
                Service.create(serviceArr).exec(function (err, newServices) {
                    if (err || !newServices) {
                        console.log(err);
//                        return callback(err);
                        return callback(null);
                    }
                    console.log('***Added Services: ' + serviceArr);
                    callback(null);
                });
            });
    },

    loadStatusTypes: function (path, fileName, callback) {
        var statusArr = [];
        csv.fromPath(path + fileName, {headers: true})
            .on("record", function (data) {
                statusArr.push(data);
            })
            .on("end", function () {
                EnquiryStatus.create(statusArr).exec(function (err, newStatusTypes) {
                    if (err || !newStatusTypes) {
                        console.log(err);
//                        return callback(err);
                        return callback(null);
                    }
                    console.log('***Added Status types: ' + statusArr);
                    callback(null);
                });
            });
    },

    loadLocations: function (path, fileName, callback) {
        var locationArr = [];
        csv.fromPath(path + fileName, {headers: true})
            .on("record", function (data) {
                locationArr.push(data);
            })
            .on("end", function () {
                Location.create(locationArr).exec(function (err, newLocations) {
                    if (err || !newLocations) {
                        console.log(err);
//                        return callback(err);
                        return callback(null);
                    }
                    console.log('***Added Locations: ' + locationArr);
                    callback(null);
                });
            });
    },

    compactObject: function (o) {
        var clone = _.clone(o);
        _.each(clone, function (v, k) {
            if (!v) {
                delete clone[k];
            }
        });
        return clone;
    },

    loadStaff: function (path, fileName, callback) {
        var that = this;
        var rowsRead = 0,
            rowsWritten = 0;
        var csvStream = csv
            .fromPath(path + fileName, {headers: true, ignoreEmpty: true})
            .on("record", function (data) {
                rowsRead++;
                var updatedData = that.compactObject(data);
                if (!updatedData.firstName || !updatedData.email || !updatedData.encryptedPassword) {
                    console.log(new Error("Illegal arguments: " + updatedData));
                    return;
                }

                async.waterfall([
                    function (cb) {
                        User.create(updatedData).exec(function (err, user) {
                            if (err || !user) {
                                return Utils.logQueryError(err, user, "Could not create user: " + updatedData.email, cb);
                            }
                            cb(null, user.id);
                        });
                    },
                    function (userId, cb) {
                        updatedData.user = userId;
                        Staff.create(updatedData).exec(function (err, newStaff) {
                            if (err) {
                                console.log("Could not create staff: " + err);
//                                return cb(err);
                                return Utils.logQueryError(err, newStaff, "Could not create staff: " + updatedData.email, cb);
                            }
                            User.update({id: userId}, {staff: newStaff.id}).exec(function (err, updatedUser) {
                                if (err || !updatedUser) {
//                                    return cb(err);
                                    return Utils.logQueryError(err, updatedUser, "Could not find user.", cb);
                                }

                                cb(null, newStaff);
                            });
                        })
                    }
                ], function (err, staff) {
                    if (err) {
                        sails.log.error(err);
                    }
                    console.log("**Created Staff: " + staff.firstName);

                    /**
                     * The async code make the csv reader not wait for the row to be updated in the
                     * DB. This code forces the callback to wait until all rows have been processed.
                     */
                    rowsWritten++;
                    if (rowsRead === rowsWritten) {
                        console.log("****Created all staff");
                        callback(null);
                    }
                });
            })
            .on("end", function () {
                console.log("****Read all staff");
            });

    },

    getRandomEmail: function (firstName) {
        //Format - abhishek7636@abhishek8787.com
        var max = 100000, min = 500;
        return firstName + (Math.round(Math.random() * (max - min)) + min).toString() + "@" +
            firstName + (Math.round(Math.random() * (max - min)) + min).toString() + ".com";
    },

    loadStudents: function (path, fileName, callback) {
        var that = this;
        var rowsRead = 0,
            rowsWritten = 0;
        var csvStream = csv
            .fromPath(path + fileName, {headers: true, ignoreEmpty: true})
            .on("record", function (data) {
                rowsRead++;
                var updatedData = that.compactObject(data);
                if (!updatedData.firstName || !updatedData.encryptedPassword) {
                    console.log(new Error("Illegal arguments: " + updatedData));
                    return;
                }
                async.waterfall([
                    function (cb) {
                        if (!updatedData.email) {
                            updatedData.email = that.getRandomEmail(updatedData.firstName);
                        }
                        User.create(updatedData).exec(function (err, user) {
                            if (err || !user) {
                                console.log("Could not create user: " + updatedData.firstName);
                                console.log(err);
//                                return cb(err);
                                return Utils.logQueryError(err, user, "Could not create user: " + updatedData.firstName, cb);
                            }
                            cb(null, user.id);
                        });
                    },
                    function (userId, cb) {
                        updatedData.user = userId;

                        if (!updatedData.enquiryStatus) {
                            updatedData.enquiryStatus = "In-Progress"
                        }

                        EnquiryStatus.findOne({name: updatedData.enquiryStatus}).exec(function (err, enquiry) {
                            if (err || !enquiry) {
                                return Utils.logQueryError(err, enquiry, "Could not find enquiry status", cb);
                            }

                            updatedData.enquiryStatus = enquiry.id;
                            Student.create(updatedData).exec(function (err, newStudent) {
                                if (err || !newStudent) {
                                    console.log("Could not create student: " + err);
                                    console.log(updatedData);
                                    return Utils.logQueryError(err, newStudent, "Could not create student", cb);
                                }
                                User.update({id: userId}, {student: newStudent.id}).exec(function (err, updatedUser) {
                                    if (err || !updatedUser) {
                                        console.log("Could not update user: " + err);
                                        return Utils.logQueryError(err, updatedUser, "Could not update user", cb);
                                    }

                                    cb(null, newStudent);
                                });
                            })
                        })
                    }
                ], function (err, student) {
                    if (err || !student) {
                        console.log(err);
                        console.log("Could not create student--");
                        console.log(updatedData);
                    } else {
                        console.log("**Created Student: " + student.firstName);
                    }

                    /**
                     * The async code make the csv reader not wait for the row to be updated in the
                     * DB. This code forces the callback to wait until all rows have been processed.
                     */
                    rowsWritten++;
                    if (rowsRead === rowsWritten) {
                        console.log("****Created all students");
                        callback(null);
                    }
                });
            })
            .on("end", function () {
                console.log("****Read all students");
            });

    },

    loadUserLocations: function (path, fileName, callback) {
        var that = this;
        var rowsRead = 0,
            rowsWritten = 0;
        var csvStream = csv
            .fromPath(path + fileName, {headers: true, ignoreEmpty: true})
            .on("record", function (data) {
                rowsRead++;
                var updatedData = that.compactObject(data);
                if (!updatedData.location ||
                    (!updatedData.email && !updatedData.firstName)) {
                    console.log(new Error("Illegal arguments: " + updatedData));
                    return;
                }

                async.waterfall([
                    function (cb) {
                        Location.findOneByName(updatedData.location).exec(function (err, location) {
                            if (err || !location) {
                                return Utils.logQueryError(err, location, "Could not find location.", cb);
                            }

                            cb(null, location.id);
                        })
                    },

                    function (locationId, cb) {
                        if (updatedData.email) {
                            //Staff will have a email for sure, student may or may not
                            User.findOneByEmail(updatedData.email)
                                .populate('staff')
                                .populate('student')
                                .exec(function (err, user) {
                                    if (err || !user) {
                                        return Utils.logQueryError(err, user, "No user for email: " + updatedData.email, cb)
                                    }

                                    var options = {
                                        locations: [locationId]
                                    };
                                    console.log(user);
                                    if (user.role === consts.STUDENT) {
                                        options.id = user.student.id;
                                        Student.assignLocations(options, cb, function (err, updatedUser) {
                                            if (err || !updatedUser) {
                                                return Utils.logQueryError(err, updatedUser, "Could not save location", cb)
                                            }
                                            cb(null);
                                        });
                                    } else {
                                        options.id = user.staff.id;
                                        Staff.assignLocations(options, cb, function (err, updatedUser) {
                                            if (err || !updatedUser) {
                                                return Utils.logQueryError(err, updatedUser, "Could not save location", cb)
                                            }
                                            cb(null);
                                        });
                                    }

//                                user.locations.add(locationId);
//                                user.save(function (err, updatedUser) {
//                                    if (err || !updatedUser) {
//                                        return Utils.logQueryError(err, updatedUser, "Could not save location", cb)
//                                    }
//                                    cb(null);
//                                })

                                })

                        } else {
                            //If no email check student by name
                            Student.findOne({firstName: updatedData.firstName, lastName: updatedData.lastName})
                                .populate('user')
                                .exec(function (err, student) {
                                    if (err || !student) {
                                        return Utils.logQueryError(err, student,
                                            "No student found: " + updatedData.firstName, cb);
                                    }

                                    var options = {
                                        id: student.id,
                                        locations: [locationId]
                                    };

                                    Student.assignLocations(options, cb, function (err, updatedUser) {
                                        if (err || !updatedUser) {
                                            return Utils.logQueryError(err, updatedUser, "Could not save location", cb)
                                        }
                                        cb(null);
                                    });
                                })
                        }
                    }
                ], function (err) {
                    if (err) {
                        sails.log.error(err);
                    }
                    console.log("**Updated user location");
                    console.log(updatedData);

                    /**
                     * The async code make the csv reader not wait for the row to be updated in the
                     * DB. This code forces the callback to wait until all rows have been processed.
                     */
                    rowsWritten++;
                    if (rowsRead === rowsWritten) {
                        console.log("****Updated location for all students");
                        callback(null);
                    }
                });
            })
            .on("end", function () {
                console.log("****Read all students to update location");
            });

    },

    loadStudentStaff: function (path, fileName, callback) {
        var that = this;
        var rowsRead = 0,
            rowsWritten = 0;
        var csvStream = csv
            .fromPath(path + fileName, {headers: true, ignoreEmpty: true})
            .on("record", function (data) {
                rowsRead++;
                var updatedData = that.compactObject(data);
                if (!updatedData.staff ||
                    (!updatedData.email && !updatedData.firstName)) {
                    console.log(new Error("Illegal arguments: " + updatedData));
                    return;
                }

                async.waterfall([
                    function (cb) {
                        //Find staff id from email
                        User.findOneByEmail(updatedData.staff).populate('staff').exec(function (err, user) {
                            if (err || !user) {
                                return Utils.logQueryError(err, user, "No user for email: " + updatedData.email, cb)
                            }

                            cb(null, user.staff.id);
                        })
                    },

                    function (staffId, cb) {
                        //Find student from user
                        if (updatedData.email) {
                            //Staff will have a email for sure, student may or may not
                            User.findOneByEmail(updatedData.email).populate('student').exec(function (err, user) {
                                if (err || !user) {
                                    return Utils.logQueryError(err, user, "No user for email: " + updatedData.email, cb)
                                }

                                var options = {
                                    id: user.student.id,
                                    staffArr: [staffId]
                                };

                                Student.assignStaff(options, cb, function (err, updatedStudent) {
                                    if (err || !updatedStudent) {
                                        return cb(err)
                                    }

                                    cb(null);
                                });
                            })

                        } else {
                            //If no email check student by name
                            Student.findOne({firstName: updatedData.firstName, lastName: updatedData.lastName})
                                .exec(function (err, student) {
                                    if (err || !student) {
                                        return Utils.logQueryError(err, student, "No student for name: " + updatedData.firstName, cb)
                                    }
                                    student.staff.add(staffId);
                                    student.save(function (err, updatedStudent) {
                                        if (err || !updatedStudent) {
                                            return Utils.logQueryError(err, updatedStudent, "Could not update student for name: " + updatedData.firstName, cb)
                                        }

                                        cb(null);
                                    })
                                })
                        }
                    }
                ], function (err) {
                    if (err) {
                        sails.log.error(err);
                    }
                    console.log("**Updated student staff");
                    console.log(updatedData);

                    /**
                     * The async code make the csv reader not wait for the row to be updated in the
                     * DB. This code forces the callback to wait until all rows have been processed.
                     */
                    rowsWritten++;
                    if (rowsRead === rowsWritten) {
                        console.log("****Updated staff for all students");
                        callback(null);
                    }
                });
            })
            .on("end", function () {
                console.log("****Read all students to update staff");
            });

    },

    loadStudentCountries: function (path, fileName, callback) {
        var that = this;
        var rowsRead = 0,
            rowsWritten = 0;
        var csvStream = csv
            .fromPath(path + fileName, {headers: true, ignoreEmpty: true})
            .on("record", function (data) {
                rowsRead++;
                var updatedData = that.compactObject(data);
                if (!updatedData.country ||
                    (!updatedData.email && !updatedData.firstName)) {
                    console.log(new Error("Illegal arguments: " + updatedData));
                    return;
                }

                async.waterfall([
                    function (cb) {
                        //Find country id from name
                        Country.findOneByName(updatedData.country).exec(function (err, country) {
                            if (err || !country) {
                                return Utils.logQueryError(err, country, "No country foound: " + updatedData.country, cb)
                            }

                            cb(null, country.id);
                        })
                    },

                    function (countryId, cb) {
                        //Find student from user
                        if (updatedData.email) {
                            //Staff will have a email for sure, student may or may not
                            User.findOneByEmail(updatedData.email).populate('student').exec(function (err, user) {
                                if (err || !user) {
                                    return Utils.logQueryError(err, user, "No user for email: " + updatedData.email, cb)
                                }

                                var options = {
                                    id: user.student.id,
                                    countries: [countryId]
                                };

                                Student.assignCountries(options, cb, function (err, updatedStudent) {
                                    if (err || !updatedStudent) {
                                        return cb(err)
                                    }

                                    cb(null);
                                });
                            })

                        } else {
                            //If no email check student by name
                            Student.findOne({firstName: updatedData.firstName, lastName: updatedData.lastName})
                                .exec(function (err, student) {
                                    if (err || !student) {
                                        return Utils.logQueryError(err, student, "No student for name: " + updatedData.firstName, cb)
                                    }
                                    student.countries.add(countryId);
                                    student.save(function (err, updatedStudent) {
                                        if (err || !updatedStudent) {
                                            return Utils.logQueryError(err, updatedStudent, "Could not update student for name: " + updatedData.firstName, cb)
                                        }

                                        cb(null);
                                    })
                                })
                        }
                    }
                ], function (err) {
                    if (err) {
                        sails.log.error(err);
                    }
                    console.log("**Updated student country");
                    console.log(updatedData);

                    /**
                     * The async code make the csv reader not wait for the row to be updated in the
                     * DB. This code forces the callback to wait until all rows have been processed.
                     */
                    rowsWritten++;
                    if (rowsRead === rowsWritten) {
                        console.log("****Updated countries for all students");
                        callback(null);
                    }
                });
            })
            .on("end", function () {
                console.log("****Read all students to update countries");
            });

    },

    loadStudentServices: function (path, fileName, callback) {
        var that = this;
        var rowsRead = 0,
            rowsWritten = 0;
        var csvStream = csv
            .fromPath(path + fileName, {headers: true, ignoreEmpty: true})
            .on("record", function (data) {
                rowsRead++;
                var updatedData = that.compactObject(data);
                if (!updatedData.service ||
                    (!updatedData.email && !updatedData.firstName)) {
                    console.log(new Error("Illegal arguments: " + updatedData));
                    return;
                }

                async.waterfall([
                    function (cb) {
                        //Find staff id from email
                        Service.findOneByName(updatedData.service).exec(function (err, service) {
                            if (err || !service) {
                                return Utils.logQueryError(err, service, "No service found: " + updatedData.service, cb)
                            }

                            cb(null, service.id);
                        })
                    },

                    function (serviceId, cb) {
                        //Find student from user
                        if (updatedData.email) {
                            //Staff will have a email for sure, student may or may not
                            User.findOneByEmail(updatedData.email).populate('student').exec(function (err, user) {
                                if (err || !user) {
                                    return Utils.logQueryError(err, user, "No user for email: " + updatedData.email, cb)
                                }

                                var options = {
                                    id: user.student.id,
                                    services: [serviceId]
                                };

                                Student.assignServices(options, cb, function (err, updatedStudent) {
                                    if (err || !updatedStudent) {
                                        return cb(err)
                                    }

                                    cb(null);
                                });
                            })

                        } else {
                            //If no email check student by name
                            Student.findOne({firstName: updatedData.firstName, lastName: updatedData.lastName})
                                .exec(function (err, student) {
                                    if (err || !student) {
                                        return Utils.logQueryError(err, student, "No student for name: " + updatedData.firstName, cb)
                                    }
                                    student.services.add(serviceId);
                                    student.save(function (err, updatedStudent) {
                                        if (err || !updatedStudent) {
                                            return Utils.logQueryError(err, updatedStudent, "Could not update student for name: " + updatedData.firstName, cb)
                                        }

                                        cb(null);
                                    })
                                })
                        }
                    }
                ], function (err) {
                    if (err) {
                        sails.log.error(err);
                    }
                    console.log("**Updated student service");
                    console.log(updatedData);

                    /**
                     * The async code make the csv reader not wait for the row to be updated in the
                     * DB. This code forces the callback to wait until all rows have been processed.
                     */
                    rowsWritten++;
                    if (rowsRead === rowsWritten) {
                        console.log("****Updated services for all students");
                        callback(null);
                    }
                });
            })
            .on("end", function () {
                console.log("****Read all students to update services");
            });
    },

    loadStudentComments: function (path, fileName, callback) {
        var that = this;
        var rowsRead = 0,
            rowsWritten = 0;
        var csvStream = csv
            .fromPath(path + fileName, {headers: true, ignoreEmpty: true})
            .on("record", function (data) {
                rowsRead++;
                var updatedData = that.compactObject(data);
                if (!updatedData.staffEmail ||
                    (!updatedData.email && !updatedData.firstName)) {
                    console.log(new Error("Illegal arguments: " + updatedData));
                    return;
                }

                async.waterfall([
                    function (cb) {
                        //Find staff id from email
                        User.findOneByEmail(updatedData.staffEmail).populate('staff').exec(function (err, user) {
                            if (err || !user) {
                                return Utils.logQueryError(err, user, "No user for email: " + updatedData.email, cb)
                            }

                            cb(null, user.staff.id);
                        })
                    },

                    function (staffId, cb) {
                        //Find student from user
                        if (updatedData.email) {
                            //Staff will have a email for sure, student may or may not
                            User.findOneByEmail(updatedData.email).populate('student').exec(function (err, user) {
                                if (err || !user) {
                                    return Utils.logQueryError(err, user, "No user for email: " + updatedData.email, cb)
                                }
                                cb(null, user.student.id, staffId);
                            })

                        } else {
                            //If no email check student by name
                            Student.findOne({firstName: updatedData.firstName, lastName: updatedData.lastName})
                                .exec(function (err, student) {
                                    if (err || !student) {
                                        return Utils.logQueryError(err, student, "No student for name: " + updatedData.firstName, cb)
                                    }
                                    cb(null, student.id, staffId);
                                })
                        }
                    },

                    function (studentId, staffId, cb) {
                        UserService.createComment(staffId, studentId, updatedData.comment, consts.COMMENT_ADD, cb);
                    }
                ], function (err) {
                    if (err) {
                        sails.log.error(err);
                    }
                    console.log("**Updated student comment");
                    console.log(updatedData);

                    /**
                     * The async code make the csv reader not wait for the row to be updated in the
                     * DB. This code forces the callback to wait until all rows have been processed.
                     */
                    rowsWritten++;
                    if (rowsRead === rowsWritten) {
                        console.log("****Updated comments for all students");
                        callback(null);
                    }
                });
            })
            .on("end", function () {
                console.log("****Read all students to update comment");
            });
    },

    loadStudentEnrollments: function (path, fileName, callback) {
        var that = this;
        var rowsRead = 0,
            rowsWritten = 0;
        var csvStream = csv
            .fromPath(path + fileName, {headers: true, ignoreEmpty: true})
            .on("record", function (data) {
                rowsRead++;
                var updatedData = that.compactObject(data);
                if (!updatedData.service || !updatedData.totalFee || !updatedData.enrollDate ||
                    (!updatedData.email && !updatedData.firstName)) {
                    console.log(new Error("Illegal arguments: " + updatedData));
                    return;
                }

                async.waterfall([
                    function (cb) {
                        //Find student from user
                        if (updatedData.email) {
                            //Staff will have a email for sure, student may or may not
                            User.findOneByEmail(updatedData.email).populate('student').exec(function (err, user) {
                                if (err || !user) {
                                    return Utils.logQueryError(err, user, "No user for email: " + updatedData.email, cb)
                                }
                                cb(null, user.student.id);
                            })

                        } else {
                            //If no email check student by name
                            Student.findOne({firstName: updatedData.firstName, lastName: updatedData.lastName})
                                .exec(function (err, student) {
                                    if (err || !student) {
                                        return Utils.logQueryError(err, student, "No student for name: " + updatedData.firstName, cb)
                                    }
                                    cb(null, student.id);
                                })
                        }
                    },

                    function (studentId, cb) {
                        //Find service id from name
                        Service.findOneByName(updatedData.service).exec(function (err, service) {
                            if (err || !service) {
                                return Utils.logQueryError(err, service, "No service for name: " + updatedData.service, cb)
                            }

                            cb(null, studentId, service.id);
                        })
                    },

                    //Create Enrollment
                    function (studentId, serviceId, cb) {
                        var values = {student: studentId, service: serviceId,
                            totalFee: updatedData.totalFee, enrollDate: updatedData.enrollDate };
                        Enroll.create(values).exec(function (err, enroll) {
                            if (err || !enroll) {
                                return Utils.logQueryError(err, enroll, "Could not create enrollment: " + values, cb)
                            }
                            cb(null);
                        });
                    }
                ], function (err) {
                    if (err) {
                        sails.log.error(err);
                    }
                    console.log("**Updated student enrollment");
                    console.log(updatedData);

                    /**
                     * The async code make the csv reader not wait for the row to be updated in the
                     * DB. This code forces the callback to wait until all rows have been processed.
                     */
                    rowsWritten++;
                    if (rowsRead === rowsWritten) {
                        console.log("****Updated enrollments for all students");
                        callback(null);
                    }
                });
            })
            .on("end", function () {
                console.log("****Read all students to update enrollments");
            });

    },

    loadStudentEducation: function (path, fileName, callback) {
        var that = this;
        var rowsRead = 0,
            rowsWritten = 0;
        var csvStream = csv
            .fromPath(path + fileName, {headers: true, ignoreEmpty: true})
            .on("record", function (data) {
                rowsRead++;
                var updatedData = that.compactObject(data);
                if (!updatedData.programName || !updatedData.score ||
                    (!updatedData.email && !updatedData.firstName)) {
                    console.log(new Error("Illegal arguments: " + updatedData));
                    return;
                }

                async.waterfall([
                    function (cb) {
                        //Find student from user
                        if (updatedData.email) {
                            //Staff will have a email for sure, student may or may not
                            User.findOneByEmail(updatedData.email).populate('student').exec(function (err, user) {
                                if (err || !user) {
                                    return Utils.logQueryError(err, user, "No user for email: " + updatedData.email, cb)
                                }
                                cb(null, user.student.id);
                            })

                        } else {
                            //If no email check student by name
                            Student.findOne({firstName: updatedData.firstName, lastName: updatedData.lastName})
                                .exec(function (err, student) {
                                    if (err || !student) {
                                        return Utils.logQueryError(err, student, "No student for name: " + updatedData.firstName, cb)
                                    }
                                    cb(null, student.id);
                                })
                        }
                    },

                    //Create Education
                    function (studentId, cb) {
//                        var values = {student: studentId,
//                            programName: updatedData.programName, score: updatedData.score };
//                        Education.create(values).exec(function (err, education) {
                        Education.create(updatedData).exec(function (err, education) {
                            if (err || !education) {
//                                return Utils.logQueryError(err, education, "Could not create education: " + values, cb)
                                return Utils.logQueryError(err, education, "Could not create education for student Id: " + studentId, cb)
                            }
                            cb(null);
                        });
                    }
                ], function (err) {
                    if (err) {
                        sails.log.error(err);
                    }
                    console.log("**Updated student education");
                    console.log(updatedData);

                    /**
                     * The async code make the csv reader not wait for the row to be updated in the
                     * DB. This code forces the callback to wait until all rows have been processed.
                     */
                    rowsWritten++;
                    if (rowsRead === rowsWritten) {
                        console.log("****Updated education for all students");
                        callback(null);
                    }
                });
            })
            .on("end", function () {
                console.log("****Read all students to update education");
            });

    },

    loadStudentPayments: function (path, fileName, callback) {
        var that = this;
        var rowsRead = 0,
            rowsWritten = 0;
        var csvStream = csv
            .fromPath(path + fileName, {headers: true, ignoreEmpty: true})
            .on("record", function (data) {
                rowsRead++;
                var updatedData = that.compactObject(data);
                if (!updatedData.receivedBy || !updatedData.totalFee ||
                    (!updatedData.email && !updatedData.firstName)) {
                    console.log(new Error("Illegal arguments: " + updatedData));
                    return;
                }

                async.waterfall([
                    function (cb) {
                        //Find student from user
                        if (updatedData.email) {
                            //Staff will have a email for sure, student may or may not
                            User.findOneByEmail(updatedData.email).populate('student').exec(function (err, user) {
                                if (err || !user) {
                                    return Utils.logQueryError(err, user, "No user for email: " + updatedData.email, cb)
                                }
                                cb(null, user.student.id);
                            })

                        } else {
                            //If no email check student by name
                            Student.findOne({firstName: updatedData.firstName, lastName: updatedData.lastName})
                                .exec(function (err, student) {
                                    if (err || !student) {
                                        return Utils.logQueryError(err, student, "No student for name: " + updatedData.firstName, cb)
                                    }
                                    cb(null, student.id);
                                })
                        }
                    },

                    function (studentId, cb) {
                        //Find service id from name
                        Service.findOneByName(updatedData.service).exec(function (err, service) {
                            if (err || !service) {
                                return Utils.logQueryError(err, service, "No service for name: " + updatedData.service, cb)
                            }

                            cb(null, studentId, service.id);
                        })
                    },

                    //Find Enrollment Id
                    function (studentId, serviceId, cb) {
                        var options = {student: studentId,
                            service: serviceId,
                            totalFee: Number(updatedData.totalFee)
                        };
                        Enroll.findOne(options).exec(function (err, enroll) {
                            if (err || !enroll) {
                                console.log(options);
                                return Utils.logQueryError(err, enroll, "Could not find enrollment: " + options, cb)
                            }
                            cb(null, enroll.id);
                        })
                    },

                    //Find staff from receivedBy
                    function (enrollId, cb) {
                        //Find staff id from email
                        User.findOneByEmail(updatedData.receivedBy).populate('staff').exec(function (err, user) {
                            if (err || !user) {
                                return Utils.logQueryError(err, user, "No user for email: " + updatedData.receivedBy, cb)
                            }

                            cb(null, enrollId, user.staff.id);
                        })
                    },

                    //Create payment
                    function (enrollId, staffId, cb) {
                        var values = {amount: updatedData.amount, method: updatedData.method, enroll: enrollId,
                            receiptNumber: updatedData.receiptNumber, paymentDate: updatedData.paymentDate,
                            receivedBy: staffId };
                        //create a enrollment for a student id
                        Payment.create(values).exec(function (err, payment) {
                            if (err || !payment) {
                                return Utils.logQueryError(err, payment, "Could not create payment: " + values, cb)
                            }
                            cb(null);
                        });
                    }
                ], function (err) {
                    if (err) {
                        sails.log.error(err);
                    }
                    console.log("**Updated student payment");
                    console.log(updatedData);

                    /**
                     * The async code make the csv reader not wait for the row to be updated in the
                     * DB. This code forces the callback to wait until all rows have been processed.
                     */
                    rowsWritten++;
                    if (rowsRead === rowsWritten) {
                        console.log("****Updated payments for all students");
                        callback(null);
                    }
                });
            })
            .on("end", function () {
                console.log("****Read all students to update payment");
            });

    }

};


