/**
 * Student.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */


//var userModel = require('./User'),
//console.log("***User Path: " + ./)
var userModel = require('../baseModels/User'),
    _ = require('lodash');

module.exports = _.merge(_.cloneDeep(userModel), {

    attributes: {

        highSchoolScore: {
            type: 'string'
        },

        seniorSecondaryScore: {
            type: 'string'
        },

        graduationScore: {
            type: 'string'
        },

        satScore: {
            type: 'string'
        },

        toeflScore: {
            type: 'string'
        },

        ieltsScore: {
            type: 'string'
        },

        greScore: {
            type: 'string'
        },

        gmatScore: {
            type: 'string'
        },

        program: {
            type: 'string'
        },

        intake: {
            type: 'string'
        },

        source: {
            type: 'string'
        },

        remarks: {
            type: 'text'
        },

        followUp: {
            type: 'datetime'
//            required: true
        },


        //Associations
//        creator: {
//            model: 'Counselor'
//        },

        counselors: {
            collection: 'Counselor',
            via: 'students'
        },

        services: {
            collection: 'Service',
            via: 'users',
            dominant: true
        },

        courses: {
            collection: 'Course',
            via: 'users',
            dominant: true
        },

        countries: {
            collection: 'Country',
            via: 'users',
            dominant: true
        },


        status: {
            model: 'Status'
        }

    }


});
