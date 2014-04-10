/**
 * Education.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {

        programName: {type: 'string'},

        passingYear: {type: 'string'},

        school: {type: 'string'},

        major: {type: 'string'},

        degree: {type: 'string'},

        board: {type: 'string'},

        //Associations

        student : {
            model: 'Student'
        }

	}

};
