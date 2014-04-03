/**
 * Enroll.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {

        enrollDate: {type: 'datetime'},
        totalFee: {type: 'string'},

        //Associations
        user: {
            model: 'User'
        },

        service: {
            model: 'Service'
        },

        modifiedBy: {
            model: 'User'
        },

        //Many to one - Payment to Enroll
        payments: {
            collection: 'Payment',
            via: 'enroll'
        }

	}

};
