/**
 * Course.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var infoTable = require('../baseModels/InfoTable'),
    _ = require('lodash');

module.exports = _.merge(_.cloneDeep(infoTable), {

	attributes: {
        section: {type: 'string'},

        duration: {type: 'string'},

        homework: {type: 'string'},

        sequence: {type: 'integer'},

        //Association

        // Many to One: Topic to Service
        service: {
            model: 'Service'
        },

        //Many to One: Classes to Topic
//        class: {
//            model: 'Class'
//        },

        //Many to One: Classes to Topic
        classes: {
            collection: 'Class',
            via: 'topic'
        }

	}

});
