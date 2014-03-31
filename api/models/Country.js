module.exports = {

    attributes: {
        name: {
            type: 'string',
            required: true,
            unique: true
        },

        users: {
            collection: 'Student',
            via: 'countries'
        }

    }

};