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

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)

//    var dataDir = "data/";
    var dataDir = "data/";
    var populate = function(cb) {
        async.series([
            //Meta Data
            function(callback) {
                CSVLoaderService.loadCountries(dataDir, "countries.csv", callback);
            },
            function(callback) {
                CSVLoaderService.loadServices(dataDir, "services.csv", callback);
            },
            function(callback) {
                CSVLoaderService.loadStatusTypes(dataDir, "statusTypes.csv", callback);
            },
            function(callback) {
                CSVLoaderService.loadLocations(dataDir, "locations.csv", callback);
            },

            //Add Users
            function(callback) {
                CSVLoaderService.loadStaff(dataDir, "staff.csv", callback);
            },
            function(callback) {
                CSVLoaderService.loadStudents(dataDir, "students.csv", callback);
            },

//            Student Associations
            function(callback) { //Location
                CSVLoaderService.loadUserLocations(dataDir, "user_locations.csv", callback);
            },
            function(callback) { //Staff
                CSVLoaderService.loadStudentStaff(dataDir, "student_staff.csv", callback);
            },
            function(callback) { //Country
                CSVLoaderService.loadStudentCountries(dataDir, "student_country.csv", callback);
            },
            function(callback) { //Service
                CSVLoaderService.loadStudentServices(dataDir, "student_services.csv", callback);
            },
            function(callback) { //Comment
                CSVLoaderService.loadStudentComments(dataDir, "student_comments.csv", callback);
            },
            function(callback) { //Enrollments
                CSVLoaderService.loadStudentEnrollments(dataDir, "student_enrollments.csv", callback);
            },
            function(callback) { //Payments
                CSVLoaderService.loadStudentPayments(dataDir, "student_payments.csv", callback);
            }

        ], function(err, results){
            if (err) {
                sails.log.error(err);
            }
            cb();
        });
    };
    //populate(cb);
cb();
};