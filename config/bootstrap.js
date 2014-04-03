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


    // Add Admin and Test Counselors
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
        {"name": "IELTS"}
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
            "encryptedPassword": "ankita",
            "phoneNumber": "1114444444",
            "role": "counselor"
        },

        {
            "firstName": "Ashish",
            "lastName": "Gupta",
            "email": "ashish@ashish.com",
            "encryptedPassword": "ashish",
            "phoneNumber": "1114444444",
            "role": "counselor"
        }
    ];

    var students = [
        {
            "firstName": "Abhishek",
            "lastName": "Rakshit",
            "email": "abhi@abhi.com",
            "encryptedPassword": "abhi",
            "phoneNumber": "9999999999",
            "role": "student"
        },

        {
            "firstName": "Jhampak",
            "lastName": "Lal",
            "email": "jhampak@jhampak.com",
            "encryptedPassword": "jhampak",
            "phoneNumber": "8888888888",
            "role": "student"
        }

    ];

    var createCountries = function(cb) {
        Country.count().exec(function (err, cnt){
            if (err){
                sails.log.error(err);
                return cb(err);
            }

            if (cnt < countries.length) {
                Country.create(countries).exec(function(err, newCountries){
                    console.log('***Added Countries: ' + newCountries.length);
                    cb(null);
                });
            }
        });
    };

    var createServices = function(cb) {
        Service.count().exec(function (err, cnt){
            if (err){
                sails.log.error(err);
                return cb(err);
            }

            if (cnt < services.length) {
                Service.create(services).exec(function(err, newServices){
                    console.log('***Added services: ' + newServices.length);
                    cb(null)
                });
            }
        });
    };

    var createStatusTypes = function(cb) {
        EnquiryStatus.count().exec(function (err, cnt){
            if (err){
                sails.log.error(err);
                return cb(err);
            }

            if (cnt < statusTypes.length) {
                EnquiryStatus.create(statusTypes).exec(function(err, newStatus) {
                    console.log('***Added status types: ' + newStatus.length);
                    cb(null);
                });
            }
        });
    };

    var createAdmin = function(cb){
        _.forEach(admins, function(admin) {
//            Counselor.findOne({email: admin.email}, function(err, user) {
            User.findOne({email: admin.email}, function(err, user) {
                if (err){
                    sails.log.error(err);
                    return cb(err);
                }

                if(!user) {
//                    Counselor.create(admin).exec(function(err, newAdmin){
                    User.create(admin).exec(function(err, newAdmin){
                        console.log('***Added Admin: ' + newAdmin.firstName);
                        cb(null);
                    });
                }
            });
        });

    };

    var createCounselors = function(cb) {
//        Counselor.count().exec(function (err, cnt){
        User.count().exec(function (err, cnt){
            if (err){
                sails.log.error(err);
                return cb(err);
            }

            if (cnt < counselors.length) {
//                Counselor.create(counselors).exec(function(err, newCounselors) {
                User.create(counselors).exec(function(err, newCounselors) {
                    console.log('***Added Counselors: ' + newCounselors.length);
                    cb(null);
                });
            }
        });
    };


    var afterStudents = function(err, students) {
        console.log("***Associate Students: " + students.length);

        _.forEach(students, function(student){

            async.series([
                function(cb) {
                    //Assign Countries
                    Country.find({}).exec(function find(err, countries){
                        console.log("***Countries: " + countries.length);
                        _.forEach(countries, function(country) {
                            console.log('Associating ', country.name,' with ', student.firstName);
                            student.countries.add(country.id);
//                            student.save(console.log);
                        });
                        cb(null);
                    });
                },

                function(cb) {
                    //Assign Services
                    Service.find({}).exec(function find(err, services){
                        console.log("***Services: " + services.length);
                        _.forEach(services, function(service){
                            console.log('Associating ', service.name,' with ', student.firstName);
                            student.services.add(service.id);
                        });
                        cb(null);
                    });

                },

                function(cb) {
                    //Assign Counselors
//                    Counselor.find({}).exec(function find(err, counselors){
                    User.find({role: 'counselor'}).exec(function find(err, counselors){
                        console.log("***Counselors: " + counselors.length);
                        _.forEach(counselors, function(counselor){
                            console.log('Associating ', counselor.firstName, ' with ', student.firstName);
                            student.counselors.add(counselor.id);
                        });
                        cb(null);
                    });

                },

                function(cb) {
                    //Assign Status
                    EnquiryStatus.find({}).exec(function find(err, statusType){
                        console.log("***Status: " + statusType.length);
                        var status = statusType.pop(); //Add any status
                        console.log('Associating ', status.name, ' with ', student.firstName);

                        //TODO None of these are working
//                        student.status.add(status.id);
//                        student.Status = status.id;
                        student.enquiryStatus = status.id;
                        cb(null);
                    });
                }

            ], function cb(err, results){
                student.save(console.log);

            });
        });

    };

    var deleteAllStudents = function(cb) {
        console.log('***Deleting all students');
        User.destroy({role: 'student'}).exec(function (err, students){
            if (err) {
                console.log('***Error deleting students');
                return;
            }
            var studentIds = students.map(function(student){return student.id;});

            //Remove from Countries
            Country.find({}).populate('users').exec(function findCB(err, countries){
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
            Service.find({}).populate('users').exec(function findCB(err, services){
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
            EnquiryStatus.find({}).populate('users').exec(function findCB(err, statusList){
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

            //Remove Assigned Counselors
            User.find({role: 'counselor'}).populate('students').exec(function (err, counselors) {
                if (err) {
                    console.log('***Error getting counselors');
                    return;
                }
                while (counselors.length) {
                    var counselor = counselors.pop();
                    _.forEach(studentIds, function(studId) {
                        console.log("***Remove id " + studId + " from student list for " + counselor.firstName);
                        counselor.students.remove(studId);
                        counselor.save();
                    });
                }
            });


            cb(null);
        });
    };

    var createStudents = function (cb) {
//        Student.count().exec(function (err, cnt) {
        User.count().exec(function (err, cnt) {
            if (err) {
                sails.log.error(err);
                return cb(err);
            }

//            if (cnt === 0) {
                console.log('***Add Students');
//                Student.create(students).exec(afterStudents);
                User.create(students).exec(afterStudents);
//            }
            cb(null);
        });
    };

    var populate = function(cb) {

        async.series([
            createCountries(cb),
            createServices(cb),
            createStatusTypes(cb),

            //Users
            createAdmin(cb),
            createCounselors(cb),
            deleteAllStudents(cb),
            createStudents(cb)
        ]);
    };

//    populate(cb);



  cb();
};