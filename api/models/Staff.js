/**
 * Counselor.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {

        email: {type: 'email', required: true, unique: true},

        firstName: {type: 'string', required: true},

        lastName: {type: 'string'},

        phoneNumber: {type: 'string', defaultsTo: '1112223333', required: true},

        address: {type: 'text'},

        dob: {type: 'datetime'},

        gender: {type: 'string', defaultsTo: 'male'},

        //Many to Many: Location to User
//        locations: {
//            collection: 'Location',
//            via: 'staff',
//            dominant: true
//        },

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
            via: 'added'
//            dominant: true
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
        },

        //Utils
        toJSON: function () {
//            console.log("Getting JSON: Student");
            var obj = this.toObject();
            obj.name = obj.fullName();
            return obj;
        },

        fullName: function () {
            if (this.lastName)
                return this.firstName + ' ' + this.lastName;
            else
                return this.firstName;
        }

    }

};
