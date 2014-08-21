/**
* BatchView.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    migrate: 'safe',


  attributes: {


        name: {type: 'string'},

        startDate: {type: 'datetime'},

        endDate: {type: 'datetime'},

        service: {type: 'string'},

        type: {type: 'string'},

        totalTopic: {type: 'integer'},

        totalClass: {type: 'integer'}

  }
};

