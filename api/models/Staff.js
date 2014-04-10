/**
 * Counselor.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {

        //One to One: User to Staff
        user: {
            model: 'User'
        },

        //Many to Many: Staff to Students
        students: {
            collection: 'Student',
            via: 'staff',
            dominant: true
        },

        //Many to One: Staff to comment
        addedComments: {
            collection: 'Comment',
            via: 'added',
            dominant: true
        },

        //Many to One: Class to Staff
        classesAssigned: {
            collection: 'Class',
            via: 'staff'
        },

        //One to Many - Staff to Payment
        paymentAccepted: {
            collection: 'Payment',
            via: 'receivedBy'
        }

	}

};
