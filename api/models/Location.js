/**
 * Location.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var infoTable = require('../baseModels/InfoTable'),
    _ = require('lodash');

module.exports = _.merge(_.cloneDeep(infoTable), {

	attributes: {

        //One to many: Location to class
        classes: {
            collection: 'Class',
            via: 'location'
        },

        //Many to Many Location to User


        users: {
            collection: 'User',
            via: 'locations'
        }

//        students: {
//            collection: 'Student',
//            via: 'locations'
//        },
//
//        staff: {
//            collection: 'Staff',
//            via: 'locations'
//        }

	}

});
