
var infoTable = require('../baseModels/InfoTable'),
            _ = require('lodash');

module.exports = _.merge(_.cloneDeep(infoTable), {
    attributes: {

        students: {
            collection: 'Student',
            via: 'countries'
        }

    }

});