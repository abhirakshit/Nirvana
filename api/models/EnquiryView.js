/**
* EnquiryView.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    migrate: 'safe',

	attributes: {

        name: {type: 'string'},

        enquiryDate: {type: 'datetime'},

        followUp: {type: 'datetime'},
       
        phoneNumber: {type: 'string', defaultsTo: 'unknown'},

        services: {type: 'string'},

        countries: {type: 'string'},

        assignedTo: {type: 'string'}


	}
};

