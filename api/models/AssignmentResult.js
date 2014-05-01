/**
 * Result.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {

        receivedScore: {type: 'string'},

        feedback: {type: 'string'},

        dueDate: {type: 'datetime'},

        givenDate: {type: 'datetime'},

        submittedDate: {type: 'datetime'},

//        One to Many : Student to AssignmentResult
        student: {
            model: 'Student'
        },


        //One to Many : Assignment to Result
        assignment: {
            model: 'Assignment'
        }


    }

};
