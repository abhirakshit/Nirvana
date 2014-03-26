/**
 * Bootstrap
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#documentation
 */

module.exports.bootstrap = function (cb) {

  // It's very important to trigger this callack method when you are finished 
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)


    // Add Admin and Test Counselors
    var adminUsers = [
        {
            "firstName": "Admin",
            "lastName": "",
            "email": "admin@admin.com",
            "password": "admin",
            "phoneNumber": "1114444444",
            "role": "admin"
        }
    ];

    User.findOne({email: "admin@admin.com"}, function(err, user) {
        if (err){
            sails.log.error(err);
            return cb(err);
        }

        if(!user) {
            console.log('***Create Admin');
            User.create(adminUsers).exec(cb);
        }
    });


    // Populate Countries
    var countries = [
        {"name": "India"},
        {"name": "UK"},
        {"name": "USA"},
        {"name": "Canada"},
        {"name": "Aus/NZ"},
        {"name": "Singapore"},
        {"name": "Europe"}
    ];


    Country.count().exec(function (err, cnt){
        if (err){
            sails.log.error(err);
            return cb(err);
        }

        if (cnt === 0) {
            console.log('***Add Countries');
            Country.create(countries).exec(cb);
        }
    });

    // Populate Courses
    var courses = [
        {"name": "GRE"},
        {"name": "GMAT"},
        {"name": "SAT"},
        {"name": "TOEFL"},
        {"name": "IELTS"}
    ];

    Course.count().exec(function (err, cnt){
        if (err){
            sails.log.error(err);
            return cb(err);
        }

        if (cnt === 0) {
            console.log('***Add Courses');
            Course.create(courses).exec(cb);
        }
    });

    // Populate Services
    var services = [
        {"name": "Visa"},
        {"name": "Application"}
    ];

    Service.count().exec(function (err, cnt){
        if (err){
            sails.log.error(err);
            return cb(err);
        }

        if (cnt === 0) {
            console.log('***Add services');
            Service.create(services).exec(cb);
        }
    });

    // Populate Status types
    var statuses = [
        {"title": "Not Picking Up"},
        {"title": "In Progress"},
        {"title": "Joined"},
        {"title": "Closed"},
        {"title": "Took Requirements"},
        {"title": "Visited"},
        {"title": "Expected Walk In"},
        {"title": "To Call"},
        {"title": "Enrolled"}
    ];

    Status.count().exec(function (err, cnt){
        if (err){
            sails.log.error(err);
            return cb(err);
        }

        if (cnt === 0) {
            console.log('***Add status type');
            Status.create(statuses).exec(cb);
        }
    });

    //Populate Test Counselor

    var counselors = [
        {
            "firstName": "Ankita",
            "lastName": "Rakshit",
            "email": "ankita@ankita.com",
            "password": "ankita",
            "phoneNumber": "1114444444",
            "role": "counselor"
        },

        {
            "firstName": "Ashish",
            "lastName": "Gupta",
            "email": "ashish@ashish.com",
            "password": "ashish",
            "phoneNumber": "1114444444",
            "role": "counselor"
        }
    ];

    Counselor.count().exec(function (err, cnt){
        if (err){
            sails.log.error(err);
            return cb(err);
        }

        if (cnt === 0) {
            console.log('***Add Counselors');
            Counselor.create(counselors).exec(cb);
        }
    });


    var students = [
        {
            "firstName": "Abhishek",
            "lastName": "Rakshit",
            "email": "abhi@abhi.com",
            "password": "abhi",
            "phoneNumber": "9999999999",
            "role": "student"
        },

        {
            "firstName": "Jhampak",
            "lastName": "Lal",
            "email": "jhampak@jhampak.com",
            "password": "jhampak",
            "phoneNumber": "8888888888",
            "role": "student"
        }

    ];

    Student.count().exec(function (err, cnt){
        if (err){
            sails.log.error(err);
            return cb(err);
        }

        if (cnt === 0) {
            console.log('***Add students type');
            Student.create(students).exec(cb);
        }
    });



  cb();
};