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

        //TODO check default value as date
//        followUp: {type: 'datetime', defaultsTo: moment()},
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
	}

};
