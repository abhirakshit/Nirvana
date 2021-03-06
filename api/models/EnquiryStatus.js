/**
 * Status.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var infoTable = require('../baseModels/InfoTable'),
    _ = require('lodash');

module.exports = _.merge(_.cloneDeep(infoTable), {


	attributes: {

        //One to Many : EnquiryStatus to Student
        students: {
            collection: 'Student',
            via: 'enquiryStatus'
        }

	}

});
