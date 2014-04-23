/**
 * Student.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var moment = require('moment'),
    _ = require('lodash');

module.exports = {

	attributes: {

        email: {type: 'email', unique: true},

        firstName: {type: 'string', required: true},

        lastName: {type: 'string'},

        phoneNumber: {type: 'string', defaultsTo: '1112223333', required: true},

        address: {type: 'text'},

        dob: {type: 'datetime'},

        gender: {type: 'string', defaultsTo: 'male'},

        parentFirstName: {type: 'string'},

        parentLastName: {type: 'string'},

        parentPhoneNumber: {type: 'string'},

        parentEmail: {type: 'email', unique: true},

        yearsExp : {type: 'string'},

        comapanyName: {type: 'string'},

//        status: {type: 'string'},

        intake: {type: 'string'},

        intakeYear: {type: 'string'},

        major: {type: 'string'},

        degree: {type: 'string'},

        imgLocation: {type: 'string'},

        remarks: {type: 'text'},

        source: {type: 'string'},

        followUp: {type: 'datetime'},

        enquiryDate: {type: 'datetime'},

        //Associations

        //Many to Many: Location to User
        locations: {
            collection: 'Location',
            via: 'students',
            dominant: true
        },

        //One to One: User to Student
        user: {
            model: 'User'
        },

        //Many to Many: class to students
        classesAttended: {
            collection: 'Class',
            via: 'students',
            dominant: true
        },

        //One to Many: Student to AssignmentResults
        assignmentResults: {
            collection: 'AssignmentResult',
            via: 'student'
        },

        //One to many EnquiryStatus to User
        enquiryStatus: {
            model: 'EnquiryStatus'
        },

        //Many to many Comments added for a User
        commentsReceived: {
            collection: 'Comment',
            via: 'received'
//            dominant: true
        },

        //Many to many - Student to Service
        services: {
            collection: 'Service',
            via: 'students',
            dominant: true
        },

        //One to many: student to education
        educationList: {
            collection: 'Education',
            via: 'student'
        },

        countries: {
            collection: 'Country',
            via: 'students',
            dominant: true
        },

        staff: {
            collection: 'Staff',
            via: 'students'
        },

        //Many to one enrollments with Student
        enrollments: {
            collection: 'Enroll',
            via: 'student'
        },

        //Many to many: Student to Batch
        batchesEnrolled: {
            collection: 'Batch',
            via: 'students',
            dominant: true
        },

    //  Utils
        toJSON: function () {
//            console.log("Getting JSON: Student");
            var obj = this.toObject();
            obj.name = obj.fullName();
            return obj;
        },

        fullName: function () {
            if (this.lastName)
                return this.firstName + ' ' + this.lastName;
            else
                return this.firstName;
        }
	},


    /**
     * Updates services for a enquiry.
     */
    updateServices: function (id, updatedServiceIdArr, cb) {
        Student.findOne(id).populate('services').exec(function (err, student) {

            var existingServiceIdArr = _.map(student.services, function (service) {
                return service.id
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
            student.save(cb);
            return student;
        });
    },

    /**
     * Updates countries for a user.
     */
    updateCountries: function (id, updatedCountryIdArr, cb) {
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
            student.save(cb);
            return student;
        });
    },


    /*
     * Updates EnquiryStatus
     */
    updateEnquiryStatus: function (id, enquiryStatusId, cb) {
        Student.findOne(id).populate('enquiryStatus').exec(function (err, student) {

            student.enquiryStatus = enquiryStatusId;
            student.save(cb);
            return student;
        });
    },

    /**
     * Updates Counselors for a user.
     */
    updateStaff: function (id, updatedStaffIdArr, cb) {
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
            student.save(cb);
            return student;
        });
    },

    /**
     * Add Education
     */
    addEducation: function(id, education, res, cb) {

        Student.findOne(id).populate('educationList').exec(function (err, student){

        // Check if an education with same name exists
            if (_.contains(student.educationList, education.programName)){
                console.log("Education exists: " + education.programName);
                return false;
            };


        // Create new Education
            education.student = student.id;
            Education.create(education).exec(function(err, newEducation) {
                if (err) {
                    console.log("Error creating edu: " + err);
                    return false;
                }

                student.save(function(err,s){
                    if (err) {
                        console.log("Error saving student: " + err);
                        return false;
                    }
                    Student.findOne(s.id).populate('educationList').exec(function(err, stud){
                        console.log(stud);
                        cb(res, stud);
                    });
                });
            });
        });

    },

    /**
     * Remove Education
     */
    removeEducation: function(id, education, res, cb) {
        console.log(cb);
        Student.findOne(id).populate('educationList').exec(function(err, student){
            if (err) {
                console.log("Error removing edu: " + err);
                return false;
            }

            console.log("Remove education:" + education.id);
            student.educationList.remove(parseInt(education.id));

            //Remove from education Table
            Education.destroy(education.id).exec(function(err, deletedEducation) {
                if (err) {
                    console.log("Error removing edu: " + err);
                    return false;
                }


                //Save complete
                student.save(function(err, s){
                    if (err) {
                        console.log("Error removing edu: " + err);
                        return false;
                    }

                    //return student;
                    Student.findOne(s.id).populate('educationList').exec(function(err, student1){
                        cb(res, student1);
                    });
                });
            });


        });

    }

};
