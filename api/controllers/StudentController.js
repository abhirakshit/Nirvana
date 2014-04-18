/**
 * StudentController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var async = require("async");

module.exports = {

    updatePartial: function (req, res, next) {

        var id = req.param('id');
        if (!id) {
            return res.badRequest('No id provided.');
        } else if (req.body.services) {
            //Services
            var serviceIds = _.map(req.body.services, function(stringId) { return parseInt(stringId); });
            res.json(Student.updateServices(id, serviceIds));
        } else if (req.body.countries) {
            //Countries
            var countryIds = _.map(req.body.countries, function(stringId) { return parseInt(stringId); });
            res.json(Student.updateCountries(id, countryIds));
        } else if (req.body.staff) {
            //Counselors
            var staffIds = _.map(req.body.staff, function(stringId) { return parseInt(stringId); });
            res.json(Student.updateStaff(id, staffIds));
        } else if (req.body.enquiryStatus) {
            //enquiryStatus
            res.json(Student.updateEnquiryStatus(id, parseInt(req.body.enquiryStatus)));
        } else if (req.body.addEducation) {
            //addEducation
            Student.addEducation(id, req.body.addEducation, res, ResponseService.sendResponse);
        } else if (req.body.removeEducation) {
            //removeEducation
            Student.removeEducation(id, req.body.removeEducation, res, ResponseService.sendResponse);
        } else {
            var updateFields = _.merge({}, req.params.all(), req.body);
            Student.update(id, updateFields, function (err, student) {

                if (!student) return res.notFound();

                if (err) return next(err);

                res.json(student);

            });
        }
    }
	
};
