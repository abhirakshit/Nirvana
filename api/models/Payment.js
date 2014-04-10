/**
 * Payment.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {

        amount: {type: 'string'},

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
