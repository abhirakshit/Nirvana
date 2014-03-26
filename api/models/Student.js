/**
 * Student.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */


var userModel = require('./User'),
    _ = require('lodash');

module.exports = _.merge( _.cloneDeep( userModel ), {

	attributes: {

        //Associations
        counselors : {
            collection: 'Counselor',
            via: 'students'
        },

        countries : {
            collection: 'Country',
            via: 'users',
            dominant: true
        },

        status : {
            model: 'Status'
        }
	}

});
