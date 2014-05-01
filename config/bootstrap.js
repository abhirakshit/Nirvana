/**
 * Bootstrap
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#documentation
 */

//Test comment

var _ = require('lodash'),
    async = require('async');
module.exports.bootstrap = function (cb) {

  // It's very important to trigger this callack method when you are finished 
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)


    // Add Admin and Test Staff
    var admins = [
        {
            "firstName": "Admin",
            "lastName": "",
            "email": "admin@admin.com",
            "encryptedPassword": "admin",
            "phoneNumber": "1114444444",
            "role": "admin"
        }
    ];

    var countries = [
        {"name": "India"},
        {"name": "UK"},
        {"name": "USA"},
        {"name": "Canada"},
        {"name": "Aus/NZ"},
        {"name": "Singapore"},
        {"name": "Europe"}
    ];

    var services = [
        {"name": "Visa"},
        {"name": "Application"},
        {"name": "GRE"},
        {"name": "GMAT"},
        {"name": "SAT"},
        {"name": "TOEFL"},
        {"name": "IELTS"},
        {"name": "Career Counseling"}
    ];

    var statusTypes = [
        {"name": "Not Picking Up"},
        {"name": "In Progress"},
        {"name": "Closed"},
        {"name": "Took Requirements"},
        {"name": "Visited"},
        {"name": "Expected Walk In"},
        {"name": "To Call"},
        {"name": "Enrolled"}
    ];

    var counselors = [
        {
            "firstName": "Ankita",
            "lastName": "Rakshit",
            "email": "ankita@ankita.com",
            "encryptedPassword": "1",
            "phoneNumber": "1114444444",
            "role": "staff"
        },

        {
            "firstName": "Ashish",
            "lastName": "Gupta",
            "email": "ashish@ashish.com",
            "encryptedPassword": "1",
            "phoneNumber": "1114444444",
            "role": "staff"
        }
    ];

    var students = [
        {
            "firstName": "Abhishek",
            "lastName": "Rakshit",
            "email": "abhi@abhi.com",
            "encryptedPassword": "1",
            "phoneNumber": "9999999999",
            "role": "student"
        },

        {
            "firstName": "Jhampak",
            "lastName": "Lal",
            "email": "jhampak@jhampak.com",
            "encryptedPassword": "1",
            "phoneNumber": "8888888888",
            "role": "student"
        }

    ];

    var createCountries = function(callback) {
        Country.count().exec(function (err, cnt){
            if (err){
                sails.log.error(err);
                return callback(err);
            }

            if (cnt < countries.length) {
                Country.create(countries).exec(function(err, newCountries){
                    console.log('***Added Countries: ' + newCountries.length);
                    callback(null, "Created All Countries");
                    return;
                });
            }
            callback(null, "Countries Exist");
        });
    };

    var createServices = function(callback) {
        Service.count().exec(function (err, cnt){
            if (err){
                sails.log.error(err);
                return callback(err);
            }

            if (cnt < services.length) {
                Service.create(services).exec(function(err, newServices){
                    console.log('***Added services: ' + newServices.length);
                    callback(null, "Created All Services");
                    return;
                });
                callback(null, "Services exist");
            }
        });
    };

    var createStatusTypes = function(callback) {
        EnquiryStatus.count().exec(function (err, cnt){
            if (err){
                sails.log.error(err);
                return callback(err);
            }

            if (cnt < statusTypes.length) {
                EnquiryStatus.create(statusTypes).exec(function(err, newStatus) {
                    console.log('***Added status types: ' + newStatus.length);
                    callback(null, "Created All Status");
                    return;
                });
                callback(null, "Status Exist");
            }
        });
    };

    var createAdmin = function(callback){
        _.forEach(admins, function(admin) {
            User.findOne({email: admin.email}, function(err, user) {
                if (err){
                    sails.log.error(err);
                    return callback(err);
                }

                if(!user) {
                    User.create(admin).exec(function(err, newAdmin){
                            if (err) {
                                sails.log.error(err);
                            }
                        console.log('***Added Admin: ' + admin.firstName);
                        admin.user = newAdmin.id;
                        Staff.create(admin).exec(function(err, staff){
//                            console.log('***Updated Admin ' + staff.id);
                            if (err) {
                                sails.log.error(err);
                            }
                            User.update({id: newAdmin.id}, {staff: staff.id}).exec(console.log);
                        });
                    });
                }
            });
        });
        callback(null, "Created All Admins");

    };

    var createStaff = function(callback) {
        User.find({role: 'staff'}).exec(function (err, users){
            if (err){
                sails.log.error(err);
                return callback(err);
            }

            if (users.length < counselors.length) {
                User.create(counselors).exec(function(err, users) {
                    console.log('***Added Counselors: ' + users.length);
                    var len  = users.length;
                    var i = 0;
                    _.forEach(users, function(user){
                        var attrib = counselors[i];
                        attrib.user = user.id;
                        i++;

                        Staff.create(attrib).exec(function(err, staff){
                            console.log('***Create Staff: ' + staff.firstName);
                            if (err) {
                                sails.log.error(err);
                            }
                            User.update({id: user.id}, {staff: staff.id}).exec(console.log);
                        });
                    });
                });
            }
        });
        callback(null, "Created All Staff");
    };

    var deleteAllStudents = function(callback) {
        console.log('***Deleting all students');
        User.destroy({role: 'student'}).exec(function (err, users){
            if (err) {
                console.log('***Error deleting users');
                return;
            }


            var studentIds = users.map(function(user){return user.student.id;});

            //Destroy Students
            _.forEach(studentIds, function(studId){
                Student.destroy({id: studId}).exec(function (err, students){
                    if (err) {
                        console.log('***Error deleting students');
                        return;
                    }
                });
            });

            //Remove from Countries
            Country.find({}).populate('students').exec(function findCB(err, countries){
//                console.log("***Countries: " + country.length);
                while (countries.length) {
                    var country = countries.pop();
                    _.forEach(studentIds, function(studId) {
                        console.log("***Remove id " + studId + " from country " + country.name);
                        country.users.remove(studId);
                        country.save();
                    });
                }
            });


            //Remove from Services
            Service.find({}).populate('students').exec(function findCB(err, services){
                while (services.length) {
                    var service = services.pop();
                    _.forEach(studentIds, function(studId) {
                        console.log("***Remove id " + studId + " from service " + service.name);
                        service.users.remove(studId);
                        service.save();
                    });
                }
            });

            //Remove from Services
            EnquiryStatus.find({}).populate('students').exec(function findCB(err, statusList){
                if (err) {
                    console.log('***Error getting status');
                    return;
                }
                while (statusList.length) {
                    var status = statusList.pop();
                    _.forEach(studentIds, function(studId) {
                        console.log("***Remove id " + studId + " from status " + status.name);
                        status.users.remove(studId);
                        status.save();
                    });
                }
            });

            //Remove Assigned Staff
            Staff.find({}).populate('students').exec(function (err, staffList) {
                if (err) {
                    console.log('***Error getting counselors');
                    return;
                }
                while (staffList.length) {
                    var staff = staffList.pop();
                    _.forEach(studentIds, function(studId) {
                        console.log("***Remove id " + studId + " from student list for " + staff.firstName);
                        staff.students.remove(studId);
                        staff.save();
                    });
                }
            });


            callback(null, "Deleted all students");
        });
    };


    var createStudents = function (callback) {
        User.find({role: 'student'}).exec(function (err, studentUsers) {
            if (err) {
                console.log(err);
                return callback(err);
            }

            console.log('***Add Students');
            if (students.length > studentUsers.length) {
                User.create(students).exec(function(err, users){
                    var i = 0;
                    _.forEach(users, function(user){
//                        user.user = user.id;
                        var attrib = students[i];
                        attrib.user = user.id;
                        i++;
                        Student.create(attrib).exec(function(err, student){
                            console.log('***Updated Student: ' + student.id);
                            User.update({id: user.id}, {student: student.id}).exec(console.log);
                        });
                    });
                });
                callback(null, "Created All Students");
            } else {
                callback(null, "Students exist");
            }
        });
    };

    var associateStudents = function(callback) {
        Student.find({}).populate('user').exec(function (err, students) {
            console.log("***Associate Students: " + students.length);
            _.forEach(students, function(student){
                async.series([
                    function(cb1) {
                        //Assign Countries
                        Country.find({}).exec(function find(err, countries){
                            console.log("***Countries: " + countries.length);
                            _.forEach(countries, function(country) {
                                console.log('Associating ', country.name,' with ', student.firstName);
//                                student.countries.remove(country.id);
                                student.countries.add(country.id);
                            });
                            cb1(null, "Countries Added to all Student");
                        });
                    },

                    function(cb1) {
                        //Assign Services
                        Service.find({}).exec(function find(err, services){
                            console.log("***Services: " + services.length);
                            _.forEach(services, function(service){
                                console.log('Associating ', service.name,' with ', student.firstName);
//                                student.services.remove(service.id);
                                student.services.add(service.id);
                            });
                            cb1(null);
                        });

                    },

                    function(cb1) {
                        //Assign Status
                        EnquiryStatus.find({}).exec(function find(err, statusType){
                            console.log("***Status: " + statusType.length);
                            var status = statusType.pop(); //Add any status
                            console.log('Associating ', status.name, ' with ', student.firstName);
                            student.enquiryStatus = parseInt(status.id);
                            cb1(null);
                        });
                    },

                    function(cb1) {
                        //Assign Staff
                        Staff.find({}).populate('user').exec(function find(err, staffList){
                            console.log("***Staff: " + staffList.length);
                            _.forEach(staffList, function(staff){
                                console.log('Associating ', staff.firstName, ' with ', student.firstName);
//                                student.staff.remove(user.staff.id);
                                student.staff.add(staff.id);
                            });
                            cb1(null);
                        });

                    }


                ], function cb1(err, results){
                    student.save(console.log);
                });
            });

        })
    };

    var callback = function (err, results){
        sails.log.debug("***Result: " + results);
        cb();
    };

    var populate = function() {
        async.series([
            createCountries(callback),
            createServices(callback),
            createStatusTypes(callback),
//            //Users
            createAdmin(callback),
            createStaff(callback),
//            deleteAllStudents(cb),
            createStudents(callback),
            associateStudents(callback)
        ], callback);
    };

//    populate(cb);
  cb();
};