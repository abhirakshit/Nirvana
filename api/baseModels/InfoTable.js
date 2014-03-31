module.exports = {

    attributes: {
        name: {
            type: 'string',
            required: true,
            unique: true
        },

        basicInfo: {
            type: "text"
        }

    }

};