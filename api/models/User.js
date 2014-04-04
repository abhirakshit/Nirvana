/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

var bcrypt = require('bcrypt'),
    uuid = require("node-uuid");


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

    validatePassword: function( candidatePassword, cb ) {
      bcrypt.compare( candidatePassword, this.encryptedPassword, function (err, valid) {
        if(err) return cb(err);
        cb(null, valid);
      });
    },

        toJSON: function () {
            var obj = this.toObject();
            delete obj.encryptedPassword;
            obj.name = obj.fullName();
            return obj;
        }

    },

  /**
   * Functions that run before a user is created
   */
   
  beforeCreate: [
    // Encrypt user's password
    // function (values, cb) {
    //   if (!values.password || values.password !== values.passwordConfirmation) {
    //     return cb({ err: "Password doesn't match confirmation!" });
    //   }

    //   User.encryptPassword(values, function (err) {
    //     cb(err);
    //   });
    // },

    // Create an API key
    function (values, cb) {
      values.apiKey = uuid.v4();
      cb();
    }
  ],

  /**
   * Functions that run before a user is updated
   */
   
  beforeUpdate: [
    // Encrypt user's password, if changed
    function (values, cb) {
      if (!values.password) {
        return cb();
      }

      User.encryptPassword(values, function (err) {
        cb(err);
      });
    }
  ],

  /**
   * User password encryption. Uses bcrypt.
   */

  encryptPassword: function(values, cb) {
    bcrypt.hash(values.password, 10, function (err, encryptedPassword) {
      if(err) return cb(err);
      values.encryptedPassword = encryptedPassword;
      cb();
    });
  }




};
