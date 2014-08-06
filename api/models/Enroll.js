/**
 * Enroll.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {

        enrollDate: {type: 'datetime'},

        totalFee: {type: 'float'},

        //Associations
        //One to Many: Student to Enroll
        student: {
            model: 'Student'
        },

        //Many to one - Enroll to Service
        service: {
            model: 'Service'
        },

        //Many to one - Payment to Enroll
        payments: {
            collection: 'Payment',
            via: 'enroll'
        }

	}

};
