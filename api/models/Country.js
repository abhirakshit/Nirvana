module.exports = {

    attributes: {
        name: {
            type: 'string',
            required: true
        },

        users: {
            collection: 'Student',
            via: 'countries'
        }

    }

};