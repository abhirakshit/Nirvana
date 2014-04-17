/**
 * Education.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {

        programName: {type: 'string', required: true},

        programScore: {type: 'string', required: true},

        score: {type: 'string', required: true},

        passingYear: {type: 'string'},

        school: {type: 'string'},

        major: {type: 'string'},

        degree: {type: 'string'}, //TODO why is this needed? Wouldn't program name suffice.

        board: {type: 'string'},

        //Associations
        //One to many: student to education
        student : {
            model: 'Student'
        }

	}

};
