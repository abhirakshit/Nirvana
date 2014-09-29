/**
 * Class.js
 *
 * @description :: This does not inherit from info tables as classes do not have names and are associated to topics
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    attributes: {

        date: {type: 'datetime'},

        description: {
            type: 'text'
        },

        remarks: {
            type: 'string'
        },

        //Association

        //One to Many : Class to Assignment
        assignments: {
            collection: 'Assignment',
            via: 'class'
        },

        //Many to one: location to class
        location: {
            model: 'Location'
        },

        // Taken by : Many to one class to staff
        staff: {
            model: 'Staff'
        },

        //Many to Many: class to students
        students: {
            collection: 'Student',
            via: 'classesAttended'
        },

        //Many to One Classes to Topic
        topic: {
            model: 'Topic'
        },

        //One to Many: Batch to Classes
        batch: {
            model: 'Batch'
        }

	}

};
