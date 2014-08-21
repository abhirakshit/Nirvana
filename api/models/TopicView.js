/**
* TopicView.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    migrate: 'safe',


  attributes: {

  	 	name: {type: 'string'},

        section: {type: 'string'},

        duration: {type: 'string'},

        service: {type: 'string'},

        description: {type: 'string'}

  }
};

