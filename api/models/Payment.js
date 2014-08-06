/**
 * Payment.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var _ = require('lodash'),
    async = require('async');


module.exports = {

	attributes: {

        amount: {type: 'float'},

        receiptNumber: {type: 'string'},

        method: {type: 'string'},

        paymentDate: {type: 'datetime'},

        nextPaymentDate: {type: 'datetime'},

        //Associations
        //Many to one - Payment to Enroll
        enroll: {
            model: 'Enroll'
        },

        //One to One - Staff to Payment
        receivedBy: {
            model: 'Staff'
        }

}

};
