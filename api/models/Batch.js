/**
 * Batch.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var infoTable = require('../baseModels/InfoTable'),
    _ = require('lodash');

module.exports = _.merge(_.cloneDeep(infoTable), {

	attributes: {

        type: {type: 'string'},

        startDate: {type: 'datetime'},

        endDate: {type: 'datetime'},

        // Association

        //One to Many : Service to batch
        service: {
            model: 'Service'
        },

        //Many to many: Student to Batch
        students: {
            collection: 'Student',
            via: 'batchesEnrolled'
        },

        //One to Many: Batch to class
        classes: {
            collection: 'Class',
            via: 'batch'
        }

	}

});
