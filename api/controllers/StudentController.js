/**
 * StudentController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var async = require("async");


checkForEnquiryStatus = function(inputFields, cb) {
    if (!inputFields.enquiryStatus) {
        var defaultEnqName = 'In Progress';
        //If no enquiry status set to default
        EnquiryStatus.findOne({name: defaultEnqName}).exec(function (err, enqStatus) {
            if (err || !enqStatus) {
                console.log("Could not find enquiry " + defaultEnqName + "\n" + err);
                cb(err);
            }
            inputFields.enquiryStatus = enqStatus.id;
            cb(null, inputFields);
        })
    } else {
        cb(null, inputFields);
    }
};

createStudent = function(inputFields, userId, cb) {
        // Create new student
    Student.create(inputFields).exec(function(err, newStudent){
        if (err) {
            console.log("Could not create student: " + err);
            cb(err);
        }

        //Add associations
        //Check for assigned or assign current logged in
        var staffIdArr;
        if (inputFields.staff) {
            staffIdArr = _.map(inputFields.staff, function(stringId) { return parseInt(stringId); });
        } else {
            staffIdArr = [userId];
        }

        _.forEach(staffIdArr, function (id) {
            newStudent.staff.add(id);
        });
        //This student will not have the updated information so just returning id
        //This should be followed by getStudentById
        newStudent.save();

        cb(null, newStudent.id);
    });
};

getStudentById = function (id, cb) {
    Student.findOne(id).exec(function (err, student) {
        if (err) {
            console.log("No student for id: " + id + "\n" + err);
            cb(err);
        }
        cb(null, student);
    });
};

module.exports = {

    create: function (req, res, next) {
        var inputFields = _.merge({}, req.params.all(), req.body);
//        console.log(inputFields);

        async.waterfall([
            function(callback){
                checkForEnquiryStatus(inputFields, callback);
            },
            function(inputFields, callback) {
                createStudent(inputFields, req.session.user.id, callback);
            },
            function(newStudentId, callback) {
                getStudentById(newStudentId, callback);
            }
        ], function(err, student){
            if (err) {
                console.log(err);
                res.json(err);
            }

            res.json(student);
        })
    },

    updatePartial: function (req, res, next) {

        var id = req.param('id');
        if (!id) {
            return res.badRequest('No id provided.');
        } else if (req.body.services) {
            //Services
            var serviceIds = _.map(req.body.services, function(stringId) { return parseInt(stringId); });
            res.json(Student.updateServices(id, serviceIds));
        } else if (req.body.countries) {
            //Countries
            var countryIds = _.map(req.body.countries, function(stringId) { return parseInt(stringId); });
            res.json(Student.updateCountries(id, countryIds));
        } else if (req.body.staff) {
            //Counselors
            var staffIds = _.map(req.body.staff, function(stringId) { return parseInt(stringId); });
            res.json(Student.updateStaff(id, staffIds));
        } else if (req.body.enquiryStatus) {
            //enquiryStatus
            res.json(Student.updateEnquiryStatus(id, parseInt(req.body.enquiryStatus)));
        } else if (req.body.addEducation) {
            //addEducation
            Student.addEducation(id, req.body.addEducation, res, ResponseService.sendResponse);
        } else if (req.body.removeEducation) {
            //removeEducation
            Student.removeEducation(id, req.body.removeEducation, res, ResponseService.sendResponse);
        } else {
            var updateFields = _.merge({}, req.params.all(), req.body);
            Student.update(id, updateFields, function (err, student) {

                if (!student) return res.notFound();

                if (err) return next(err);

                res.json(student);

            });
        }
    }
	
};
