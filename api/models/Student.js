/**
 * Student.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {

        parentFirstName: {type: 'string', required: true},

        parentLastName: {type: 'string'},

        parentPhoneNumber: {type: 'string', defaultsTo: '1112223333', required: true},

        parentEmail: {type: 'email', required: true, unique: true},

        yearsExp : {type: 'string'},

        comapanyName: {type: 'string'},

        status: {type: 'string'},

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
            via: 'received',
            dominant: true
        },

        //Many to many - Student to Service
        services: {
            collection: 'Service',
            via: 'students',
            dominant: true
        },

        //One to many: student to education
        eductionList: {
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
        });
    },


    /*
     * Updates EnquiryStatus
     */
    updateEnquiryStatus: function (id, enquiryStatusId, cb) {
        Student.findOne(id).populate('enquiryStatus').exec(function (err, student) {

            student.enquiryStatus = enquiryStatusId;
            student.save(cb);
        });
    },

    /**
     * Updates Counselors for a user.
     */
    updateCounselors: function (id, updatedCounselorIdArr, cb) {
        Student.findOne(id).populate('counselors').exec(function (err, student) {

            var existingCounselorIdArr = _.map(student.counselors, function (counselor) {
                return counselor.id
            });
            var toRemove = _.difference(existingCounselorIdArr, updatedCounselorIdArr);
            var toAdd = _.difference(updatedCounselorIdArr, existingCounselorIdArr);

            //Remove all
            _.forEach(toRemove, function (id) {
                student.counselors.remove(id);
            });

            //Add new
            _.forEach(toAdd, function (id) {
                student.counselors.add(id);
            });
            student.save(cb);
        });
    }

};
