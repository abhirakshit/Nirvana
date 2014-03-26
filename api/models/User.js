/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {
        firstName: {
            type: 'string',
            required: true
        },
        lastName: {
            type: 'string'
        },
        phoneNumber: {
            type: 'string',
            defaultsTo: '1112223333',
            required: true
        },
        email: {
            type: 'email', // Email type will get validated by the ORM
            required: true,
            unique: true
        },
        password: {
            type: 'string',
            required: true
        },

        role: {
            type: 'string',
            defaultsTo: "student",
            required: true
        },


        fullName: function() {
            return this.firstName + ' ' + this.lastName;
        },

        toJSON: function() {
            var obj = this.toObject();
            delete obj.password;
            obj.fullName = obj.fullName();
            return obj;
        }

	}

};
