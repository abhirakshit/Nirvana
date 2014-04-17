/**
 * StudentController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

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
            Student.updateServices(id, serviceIds);
        }

        //Countries
        if (req.body.countries) {
            var countryIds = _.map(req.body.countries, function(stringId) { return parseInt(stringId); });
            Student.updateCountries(id, countryIds);
        }

        //Counselors
        if (req.body.counselors) {
            var counselorIds = _.map(req.body.counselors, function(stringId) { return parseInt(stringId); });
            Student.updateStaff(id, counselorIds);
        }

        //enquiryStatus
        if (req.body.enquiryStatus) {
            Student.updateEnquiryStatus(id, parseInt(req.body.enquiryStatus));
        }

        //addEducation
        if (req.body.addEducation) {
            console.log(req.body.addEducation);
            Student.addEducation(id, req.body.addEducation);
        }

        Student.update(id, updateFields, function (err, user) {

            if (!user) return res.notFound();

            if (err) return next(err);

            res.json(user);

        });
    }
	
};
