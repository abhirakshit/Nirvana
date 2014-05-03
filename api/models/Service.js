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

        //Associations
        //Many to many - Student to Service
        students: {
            collection: 'Student',
            via: 'services'
        },

        //Many to one - Enroll to Service
        enrollments: {
            collection: 'Enroll',
            via: 'service'
        },

        // Many to One: Topic to Service
        topics: {
            collection: 'Topic',
            via: 'service'
        },

        //Many to One : Batch to Service
        batches: {
            collection: 'Batch',
            via: 'service'
        }

	}
});
