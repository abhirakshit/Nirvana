/**
* StudentView.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  migrate: 'safe',

  attributes: {

  	    name: {type: 'string'},

        enquiryDate: {type: 'datetime'},

        enquiryStatus: {type: 'string'},

        followUp: {type: 'datetime'},
       
        phoneNumber: {type: 'string'},

        services: {type: 'string'},

        enrolledIn: {type: 'string'},

        countries: {type: 'string'},

        assignedTo: {type: 'string'},

        locations: {type: 'string'},

        totalFee: {type: 'float'},

        totalPaid: {type: 'float'},

        totalDue: {type: 'float'}
  }
};

