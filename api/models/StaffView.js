/**
* StaffView.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  migrate: 'safe',

  attributes: {

  	    name: {type: 'string'},

        email: {type: 'string'},

        phoneNumber: {type: 'string'},

        locations: {type: 'string'}
  }
};

