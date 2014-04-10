module.exports = {

    attributes: {
        name: {
            type: 'string',
            required: true,
            unique: true
        },

        description: {
            type: 'text'
        },

        remarks: {
            type: 'string'
        }

    }

};