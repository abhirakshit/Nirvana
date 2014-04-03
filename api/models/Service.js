/**
 * Service.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var infoTable = require('../baseModels/InfoTable'),
    _ = require('lodash');

module.exports = _.merge(_.cloneDeep(infoTable), {

	attributes: {
        name: {
            type: 'string',
            required: true,
            unique: true
        },

//        users: {
//            collection: 'Student',
//            via: 'services'
//        }

        //Associations
        //Many to many - User to Service
        users: {
            collection: 'User',
            via: 'services'
        },

        //Many to one - Enroll to Service
        enrollments: {
            collection: 'Enroll',
            via: 'service'
        }

	}
});
