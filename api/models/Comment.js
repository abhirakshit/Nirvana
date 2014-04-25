/**
 * Comment.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {
        comment: {type: 'text', required: true},
        type: {type: 'text', defaultsTo: 'add'},   //add, remove, change

        //Associations
        //Many to One: Staff to comment
        added: {
            model: 'Staff'
//            collection: 'Staff',
//            via: 'addedComments'
        },

        //Many to many Comments added for a User
        received: {
            model: 'Student'
//            collection: 'Student',
//            via: 'commentsReceived'
        }

	}

};
