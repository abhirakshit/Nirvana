/**
 * Assignment.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */
var infoTable = require('../baseModels/InfoTable'),
    _ = require('lodash');

module.exports = _.merge(_.cloneDeep(infoTable), {

	attributes: {

        totalScore: {type: 'string'},

        //Association

        //Many to One : Assignment to Class
        class: {
            model: 'Class'
        },

        //One to Many: Assignment to AssignmentResults
        assignmentResults: {
            collection: 'AssignmentResult',
            via: 'assignment'
        }

	}

});
