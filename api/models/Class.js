/**
 * Class.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var infoTable = require('../baseModels/InfoTable'),
    _ = require('lodash');

module.exports = _.merge(_.cloneDeep(infoTable), {
    attributes: {

        date: {type: 'datetime'},

        startTime: {type: 'datetime'},

        endTime: {type: 'datetime'},


        //Association

        //One to Many : Class to Assignment
        assignments: {
            collection: 'Assignment',
            via: 'class'
        },

        //Many to one: location to class
        location: {
            model: 'Location'
        },

        // Taken by : Many to one class to staff
        staff: {
            model: 'Staff'
        },

        //Many to Many: class to students
        students: {
            collection: 'Student',
            via: 'classesAttended'
        },

        //One to One: course to class
        topic: {
            model: 'Topic'
        },

        //One to Many: Batch to class
        batch: {
            model: 'Batch'
        }

	}

});
