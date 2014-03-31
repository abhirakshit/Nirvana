
var infoTable = require('../baseModels/InfoTable'),
            _ = require('lodash');

module.exports = _.merge(_.cloneDeep(infoTable), {
    attributes: {

        users: {
            collection: 'Student',
            via: 'countries'
        }

    }

});