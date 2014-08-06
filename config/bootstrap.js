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

    var populate = function(cb) {
        async.series([
            //Meta Data
            function(callback) {
                CSVLoaderService.loadCountries("data/", "countries.csv", callback);
            },
            function(callback) {
                CSVLoaderService.loadServices("data/", "services.csv", callback);
            },
            function(callback) {
                CSVLoaderService.loadStatusTypes("data/", "statusTypes.csv", callback);
            },
            function(callback) {
                CSVLoaderService.loadLocations("data/", "locations.csv", callback);
            },

            //Add Users
            function(callback) {
                CSVLoaderService.loadStaff("data/", "staff.csv", callback);
            },
            function(callback) {
                CSVLoaderService.loadStudents("data/", "students.csv", callback);
            },

            //Student Associations
            function(callback) { //Location
                CSVLoaderService.loadUserLocations("data/", "user_locations.csv", callback);
            },
            function(callback) { //Staff
                CSVLoaderService.loadStudentStaff("data/", "student_staff.csv", callback);
            },
            function(callback) { //Country
                CSVLoaderService.loadStudentCountries("data/", "student_country.csv", callback);
            },
            function(callback) { //Service
                CSVLoaderService.loadStudentServices("data/", "student_services.csv", callback);
            },
            function(callback) { //Comment
                CSVLoaderService.loadStudentComments("data/", "student_comments.csv", callback);
            },
            function(callback) { //Enrollments
                CSVLoaderService.loadStudentEnrollments("data/", "student_enrollments.csv", callback);
            },
            function(callback) { //Payments
                CSVLoaderService.loadStudentPayments("data/", "student_payments.csv", callback);
            }

        ], function(err, results){
            if (err) {
                sails.log.error(err);
            }
            cb();
        });
    };
//    populate(cb);
  cb();
};