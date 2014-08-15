/**
 * CounselorController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */


/*
 Email has to be updated both in student and user table
 */
updateEmail = function(id, staffId, updateFields, res) {

    Staff.update(id, updateFields, function (err, updatedStaffList) {
        if (err) {
            console.log(err);
            return res.badRequest(err);
        }

        User.update(updatedStaffList[0].user, updateFields, function(err, updatedUser){
            if (err) {
                console.log(err);
                return res.badRequest(err);
            }

            res.json(updatedStaffList)
        });
    });
};


module.exports = {

    getAssignedStudents : function(req, res) {
        var id = req.param('id');
        if (!id) {
            return res.badRequest('No id provided.');
        };

        // Only return non joined or closed enquiries
        EnquiryStatus.find().where({name: ['Enrolled', 'Closed']}).exec(function(err, enqStatusList){
            var enrolledId, closedId;
            while (enqStatusList.length) {
                var enquiry = enqStatusList.pop();
                if (enquiry.name === 'Enrolled')
                    enrolledId = enquiry.id;
                else
                    closedId = enquiry.id;
            }
            Staff.findOne(id).populate('students').exec(function(err, staff){
                var students = staff.students;
                var studentIds = _.pluck(students, "id");

                EnquiryView.find(studentIds).exec(function(err, students) {
                    res.json(students);
                })
            });
        });
    },

    
    updatePartial: function (req, res) {
        var id = req.param('id');
        console.log(_.merge({}, req.params.all(), req.body));
        if (!id) {
            return res.badRequest('No id provided.');
        } else if (req.body.email) {
//           updateEmail(id, UserService.getCurrentStaffUserId(req), req.body, res);
        } else if (req.body.location) {

            var newLocationsArray = _.map(req.body.location,function(locationId){
                return parseInt(locationId);
            });
            //find current staff from the id
            Staff.findOne(id).populate('locations').exec(function(err,staff){
                 if (err) {
                    console.log("Could not update staff location: " + id + "\n" + err);
                    res.badRequest(err);
                }
                // compare the server values with the client values
                var oldLocations = _.map(staff.locations, function(location){
                    return location.id;
                });

                var toRemove = _.difference(oldLocations,newLocationsArray);
                var toAdd = _.difference(newLocationsArray,oldLocations);

                _.forEach(toRemove, function(id){
                    staff.locations.remove(id);
                });

                _.forEach(toAdd, function(id){
                    staff.locations.add(id);
                });

                staff.save();
                res.json(staff);
            });
            //
        }


         else {

            var updateFields = _.merge({}, req.params.all(), req.body);
            Staff.update(id, updateFields, function (err, updated) {
                if (err) {
                    console.log("Could not update staff: " + id + "\n" + err);
                    res.badRequest(err);
                }
                res.json(updated);
            });
        }

    },


    getLocation: function (req, res) {
        var id = req.param('id');
        if (!id) {
            return res.badRequest('No id provided.');
        }

        Staff.findOne(id).populate('locations').exec(function(err, staff){
            var locations = staff.locations;
            var locationCollection = [];
            async.each(locations, function(location, callback){
                Location.findOne(location.id).populate('staff').exec(function(err, loc){
                    if (err) {
                        console.log("Error handling location:  " + location.id + "\n" + err);
                        callback(err);
                    }
                    locationCollection.push(loc);
                    callback();
                })
            }, function(err){
                if (err) {
                    console.log("Could not process location. " + err);
                    res.badRequest("Could not process location. " + err);
                }

                //res.json(_.sortBy(locationCollection, 'createdAt').reverse());
            });
        });

    }

};
