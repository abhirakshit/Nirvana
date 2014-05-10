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

                    this.showStaff(staff,allLocations);
                });


                this.show(this.layout, {
                    loading: { 
                        entities: [staff, allLocations] 
                    }
                });

            },

            showStaff: function (staff,allLocations) {

                this.showPersonalView(staff,allLocations);




            },

            showPersonalView: function(staff, allLocations) {

                var addedLocation = new Application.Entities.LocationCollection(staff.get('locations'));
                var addedLocationIdList = addedLocation.pluck("id");

                // console.dir(addedLocation);
                // console.dir(allLocations);
                // console.dir(allLocations.getIdToTextMap('name'));

                var personalView = new Show.views.Personal({
                    model: staff, 
                    allLocations: allLocations.getIdToTextMap('name'), 
                    addedLocation: addedLocationIdList
                });

                this.listenTo(personalView,Show.STAFF_EDIT_SAVE,function(model,id,value){

                    // console.log('edit function called! ' + model + 'ID: ' + id + 'Value: ' + value);

                    model.save(id,value,{

                        wait: true,
                        patch:true,
                        success: function(updateStaff){
                            console.log("saved on server");
                        },

                        error: function(x,response){
                            console.log("Error on server!");
                        }

                    });
                });

                this.layout.personalRegion.show(personalView);


            },

            showLocationView: function(staff) {

            },

            // showCareerView: function(student, allCountries, allServices) {
            //     var addedCountries = new Application.Entities.CountryCollection(student.get('countries'));
            //     var addedCountriesIdList = addedCountries.pluck("id");

            //     var addedServices = new Application.Entities.ServiceCollection(student.get('services'));
            //     var addedServicesIdList = addedServices.pluck("id");

            //     var careerView = new Show.views.Career({
            //         model: student,
            //         allCountries: allCountries.getIdToTextMap('name'),
            //         addedCountries: addedCountriesIdList,

            //         allServices: allServices.getIdToTextMap('name'),
            //         addedServices: addedServicesIdList
            //     });
            //     this.layout.careerRegion.show(careerView);
            // },




            getLayout: function () {
                return new Show.views.Layout();
            }

        });


    });
});
