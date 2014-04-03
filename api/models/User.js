/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {
        firstName: {type: 'string', required: true},

        lastName: {type: 'string'},

        phoneNumber: {type: 'string', defaultsTo: '1112223333', required: true},

        address: {type: 'text'},

        role: {type: 'string', defaultsTo: "student", required: true},

        highSchoolScore: {type: 'string'},

        seniorSecondaryScore: {type: 'string'},

        graduationScore: {type: 'string'},

        satScore: {type: 'string'},

        toeflScore: {type: 'string'},

        ieltsScore: {type: 'string'},

        greScore: {type: 'string'},

        gmatScore: {type: 'string'},

        program: {type: 'string'},

        intake: {type: 'string'},

        source: {type: 'string'},

        remarks: {type: 'text'},

        followUp: {type: 'datetime'
        //            required: true
        },


        // Auth Attribs
        email: {type: 'email', required: true, unique: true},

        encryptedPassword: {type: 'string'},

        sessionTokens: {type: 'array'},

        passwordResetToken: {type: 'json'},

        apiKey: {type: 'string', unique: true},


        //Associations
        students: {
            collection: 'User',
            via: 'counselors',
            dominant: true
        },

        counselors: {
            collection: 'User',
            via: 'students'
        },

        services: {
            collection: 'Service',
            via: 'users',
            dominant: true
        },

        countries: {
            collection: 'Country',
            via: 'users',
            dominant: true
        },

        //One to many EnquiryStatus to User
        enquiryStatus: {
            model: 'EnquiryStatus'
        },

        //Many to one enrollments with User
        enrollments: {
            collection: 'Enroll',
            via: 'user'
        },

        //One to One with Enrollment modification
        enrollmentModifier: {
            model: 'Enroll'
        },


        //One to One for modifiedBy
        //******
        modifier: {
            model: 'User'
        },

        modifiedBy: {
            model: 'User'
        },
        //******

        //Utils
        fullName: function () {
            return this.firstName + ' ' + this.lastName;
        },

        toJSON: function () {
            var obj = this.toObject();
            delete obj.encryptedPassword;
            obj.name = obj.fullName();
            return obj;
        }

    }

};
