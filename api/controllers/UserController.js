/**
 * UserController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
var _ = require('lodash');
module.exports = {

    getAllStaff: function(req, res, next) {
        User.find({role: 'staff'}).exec(function(err, staffList) {
            if (err) {
                return res.badRequest(err);
            }

            return res.json(staffList);
        })
    },

    getAllStudents: function(req, res, next) {
        User.find({role: 'student'}).exec(function(err, students) {
            if (err) {
                return res.badRequest(err);
            }

            return res.json(students);
        })
    },

    updatePartial: function (req, res, next) {

        var updateFields = {};
        updateFields = _.merge({}, req.params.all(), req.body);

        var id = req.param('id');
        if (!id) {
            return res.badRequest('No id provided.');
        }

        //Check Associations
        //Services
        if (req.body.services) {
            var serviceIds = _.map(req.body.services, function(stringId) { return parseInt(stringId); });
            User.updateServices(id, serviceIds);
        }

        //Countries
        if (req.body.countries) {
            var countryIds = _.map(req.body.countries, function(stringId) { return parseInt(stringId); });
            User.updateCountries(id, countryIds);
        }

        //Counselors
        if (req.body.counselors) {
            var counselorIds = _.map(req.body.counselors, function(stringId) { return parseInt(stringId); });
            User.updateCounselors(id, counselorIds);
        }

        //enquiryStatus
        if (req.body.enquiryStatus) {
            User.updateEnquiryStatus(id, parseInt(req.body.enquiryStatus));
        }



        User.update(id, updateFields, function (err, user) {

            if (!user) return res.notFound();

            if (err) return next(err);

            res.json(user);

        });
    }


	
};
