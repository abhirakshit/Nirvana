/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

var bcrypt = require('bcrypt'),
    uuid = require("node-uuid"),
    _ = require('lodash');


module.exports = {

    attributes: {
        role: {type: 'string', defaultsTo: "student", required: true},

        status: {type: 'string', defaultsTo: 'active'},

        // Auth Attribs
        email: {type: 'email', required: true, unique: true},

        encryptedPassword: {type: 'string'},

        sessionTokens: {type: 'array'},

        passwordResetToken: {type: 'json'},

        apiKey: {type: 'string', unique: true},

        //Association
        //Many to Many: Location to User
        locations: {
            collection: 'Location',
            via: 'users',
            dominant: true
        },

        //One to One: User to Student
        student: {
            model: 'Student'
        },

        //One to One: User to Staff
        staff: {
            model: 'Staff'
        },

        validatePassword: function (candidatePassword, cb) {
            bcrypt.compare(candidatePassword, this.encryptedPassword, function (err, valid) {
                if (err) return cb(err);
                cb(null, valid);
            });
        },

        toJSON: function () {
//            console.log("Getting JSON: User");
            var obj = this.toObject();
            delete obj.encryptedPassword;
//            obj.name = obj.fullName();
            return obj;
        }

    },

    /**
     * Functions that run before a user is created
     */

    beforeCreate: [
        // Encrypt user's password
        function (values, cb) {
           User.encryptPassword(values, function (err) {
             cb(err);
           });
        },

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
            if (!values.encryptedPassword) {
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

    encryptPassword: function (values, cb) {
        bcrypt.hash(values.encryptedPassword, 10, function (err, encryptedPassword) {
            if (err) {
                console.log(err);
                return cb(err);
            }
            values.encryptedPassword = encryptedPassword;
            cb();
        });
    },

    /**
     * Assign a user in one or more locations.
     * @param  {Object}   options
     *            => locations {Array} list of location ids
     *            => id {Integer} id of the enrolling user
     * @param  {Function} cb
     */
    assignLocations: function (options, errCb, cb) {
        User.findOne(options.id).exec(function (err, theUser) {
            if (err || !theUser) {
                return Utils.logQueryError(err, theUser, 'User not found.', errCb);
            }

            _.forEach(options.locations, function(locationId){
                theUser.locations.add(locationId);
            });
            theUser.save(cb);
        });
    }

};
