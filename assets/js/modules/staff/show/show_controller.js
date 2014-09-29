define([
    "modules/staff/show/show_view",
    "modules/entities/location"

], function () {
    Application.module("Staff.Show", function (Show, Application, Backbone, Marionette, $, _) {


        Show.Controller = Application.Controllers.Base.extend({
            initialize: function () {

                var staff = Application.request(Application.GET_STAFF, this.options.staffId);
                var allLocations = Application.request(Application.GET_LOCATIONS);
//                var student = Application.request(Application.GET_STUDENT, this.options.studentId);

                this.layout = this.getLayout();

                this.listenTo(this.layout, Application.SHOW, function () {
                    this.showStaff(staff, allLocations);
                });


                this.show(this.layout, {
                    loading: {
                        entities: [staff, allLocations]
                    }
                });

            },

            showStaff: function (staff, allLocations) {
                this.showPersonalView(staff, allLocations);
            },

            showPersonalView: function (staff, allLocations) {
                var addedLocation = new Application.Entities.LocationCollection(staff.get('locations'));
                var addedLocationIdList = addedLocation.pluck("id");

                var personalView = new Show.views.Personal({
                    model: staff,
                    allLocations: allLocations.getIdToTextMap('name'),
                    addedLocation: addedLocationIdList
                });

                this.listenTo(personalView, Show.STAFF_EDIT_SAVE, function (model, id, value) {
                    model.save(id, value, {
                        wait: true,
                        patch: true,
                        success: function (updateStaff) {
                            console.dir(updateStaff);
                            console.log("saved on server");
                        },

                        error: function (x, response) {
                            console.dir(response);
                            console.log("Error on server!");
                        }
                    });
                });

                this.layout.personalRegion.show(personalView);
            },


            getLayout: function () {
                return new Show.views.Layout();
            }

        });


    });
});
