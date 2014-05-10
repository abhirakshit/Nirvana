define([
    "modules/students/show/show_view"
], function () {
    Application.module("Students.Show", function (Show, Application, Backbone, Marionette, $, _) {

    
        Show.Controller = Application.Controllers.Base.extend({
            initialize: function () {

                var student = Application.request(Application.GET_STUDENT, this.options.studentId);
//                var student = Application.request(Application.GET_STUDENT, this.options.studentId);

                this.layout = this.getLayout();

                this.listenTo(this.layout, Application.SHOW, function () {

                    this.showStudent(student)
                });


                this.show(this.layout, {
                    loading: { 
                        entities: student }
                });

            },

            showStudent: function (student) {

                this.showPersonalView(student);


            },

            showPersonalView: function(student) {
                var personalView = new Show.views.Personal({
                    model: student
                });

                this.layout.personalRegion.show(personalView);
            },

//  showLocationView: function(student) {
//                 //todo Any better way for this
//                 var locationCollection = new Application.Entities.LocationCollection(student.get('locations'));

//                 var that = this;
//                 var locationView = new Show.views.LocationComposite({
//                     collection: locationCollection,
//                     model: student
//                 });
//                 this.layout.locationRegion.show(locationView);

//                 locationView.on(Show.showAddLocationModalEvt, function(view){
//                    console.log("Show modal!!!");
// //                    var modalRegion = new Application.Views.ModalRegion({el:'#modal'});
//                     var newLocation = Application.request(Application.GET_LOCATION);
//                     newLocation.attributes.modalId = Show.addLocationFormId;

//                     var addLocationModalView = new Show.views.addLocationForm({
//                         model: newLocation
//                     });

//                     addLocationModalView.on(Show.createLocationEvt, function(modalFormView){
//                         student.save("addLocation", modalFormView.model.attributes, {
//                             wait: true,
//                             patch: true,
//                             success: function(updatedStudent){
//                                 console.log("Saved on server!!");
//                                 console.dir(updatedStudent);
//                                 that.showAcademicView(updatedStudent);
//                                 Application.execute(Show.UPDATE_HISTORY_EVT, updatedStudent);
//                             },

//                             error: function(x, response) {
//                                 console.log("Error on server!! -- " + response.text);
//                                 return response;
//                             }
//                         });

//                     });
//                     Application.modalRegion.show(addEducationModalView);
//                 });

//                 academicView.on(Show.deleteEducationEvt, function(educationFieldView) {
//                     console.log('Delete edu...');
//                     student.save("removeEducation", educationFieldView.model.attributes, {
//                         wait: true,
//                         patch: true,
//                         success: function(updatedStudent){
//                             console.log("Saved on server!!");
//                             console.dir(updatedStudent);
//                            // that.showAcademicView(updatedStudent);
//                            // Application.execute(Show.UPDATE_HISTORY_EVT, updatedStudent);
//                         },

//                         error: function(x, response) {
//                             console.log("Error on server!! -- " + response.text);
//                             return response;
//                         }
//                     });
//                 });
//             },



            getLayout: function () {
                return new Show.views.Layout();
            }

        });


    });
});
