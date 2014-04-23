define([
    "modules/enquiries/show/show_view"
], function () {
    Application.module("Enquiries.Show", function (Show, Application, Backbone, Marionette, $, _) {

        Show.Controller = Application.Controllers.Base.extend({
            initialize: function () {
//                var user = Application.request(Application.GET_LOGGED_USER);
                var student = Application.request(Application.GET_STUDENT, this.options.studentId);
                var studentComments = Application.request(Application.GET_STUDENT_COMMENTS, this.options.studentId);
                var allCountries = Application.request(Application.GET_COUNTRIES);
                var allServices = Application.request(Application.GET_SERVICES);
                var allStaff = Application.request(Application.GET_ALL_STAFF);
                var allStatus = Application.request(Application.GET_STATUS_All);
//                var allStudents = Application.request(Application.GET_STUDENTS);

                this.layout = this.getLayout();

                this.listenTo(this.layout, Application.SHOW, function () {
//                    console.dir(allStudents);
                    this.showStudent(student, allCountries, allServices, allStaff, allStatus, studentComments)
                });


                this.show(this.layout, {
                    loading: {
                        entities: [student, allCountries, allServices, allStaff, allStatus]
                    }
                });
            },

            showStudent: function (student, allCountries, allServices, allStaff, allStatus, studentComments) {

                this.showPersonalView(student);

                this.showAcademicView(student);

                this.showCareerView(student, allCountries, allServices);

                this.showAdminView(student, allStaff, allStatus);

                this.showHistoryView(student, studentComments);
            },

            showPersonalView: function(student) {
                var personalView = new Show.views.Personal({
                    model: student
                });

                this.layout.personalRegion.show(personalView);
            },

            showAcademicView: function(student) {
                //todo Any better way for this
                var educationCollection = new Application.Entities.EducationCollection(student.get('educationList'));

                var that = this;
                var academicView = new Show.views.AcademicComposite({
                    collection: educationCollection,
                    model: student
                });
                this.layout.academicRegion.show(academicView);

                academicView.on(Show.showAddEducationModalEvt, function(view){
                   console.log("Show modal!!!");
//                    var modalRegion = new Application.Views.ModalRegion({el:'#modal'});
                    var newEducation = Application.request(Application.GET_EDUCATION);
                    newEducation.attributes.modalId = Show.addEducationFormId;

                    var addEducationModalView = new Show.views.addEducationForm({
                        model: newEducation
                    });

                    addEducationModalView.on(Show.createEducationEvt, function(modalFormView){
                        student.save("addEducation", modalFormView.model.attributes, {
                            wait: true,
                            patch: true,
                            success: function(updatedStudent){
                                console.log("Saved on server!!");
                                console.dir(updatedStudent);
                                that.showAcademicView(updatedStudent)
                            },

                            error: function(x, response) {
                                console.log("Error on server!! -- " + response.text)
                                return response;
                            }
                        });

                    });
                    Application.modalRegion.show(addEducationModalView);
                });

                academicView.on(Show.deleteEducationEvt, function(educationFieldView) {
                    console.log('Delete edu...');
                    student.save("removeEducation", educationFieldView.model.attributes, {
                        wait: true,
                        patch: true,
                        success: function(updatedStudent){
                            console.log("Saved on server!!");
                            console.dir(updatedStudent);
                            that.showAcademicView(updatedStudent);
                        },

                        error: function(x, response) {
                            console.log("Error on server!! -- " + response.text)
                            return response;
                        }
                    });
                });
            },

            showHistoryView: function(student, studentComments) {
                var historyView = new Show.views.History({
                   model: student,
                   collection: studentComments
                });
                this.layout.historyRegion.show(historyView);
            },

            showAdminView: function(student, allStaff, allStatus) {
                var addedStaff = new Application.Entities.UsersCollection(student.get('staff'));
                var addedStaffIdList = addedStaff.pluck("id");
                var adminView = new Show.views.Admin({
                    model: student,
                    allStaff: allStaff.getIdToTextMap('name'),
                    addedStaff: addedStaffIdList,
                    allStatus: allStatus.getValueToTextMap('name')
                });
                this.layout.adminRegion.show(adminView);

            },

            showCareerView: function(student, allCountries, allServices) {
                var addedCountries = new Application.Entities.CountryCollection(student.get('countries'));
                var addedCountriesIdList = addedCountries.pluck("id");

                var addedServices = new Application.Entities.ServiceCollection(student.get('services'));
                var addedServicesIdList = addedServices.pluck("id");

                var careerView = new Show.views.Career({
                    model: student,
                    allCountries: allCountries.getIdToTextMap('name'),
                    addedCountries: addedCountriesIdList,

                    allServices: allServices.getIdToTextMap('name'),
                    addedServices: addedServicesIdList
                });
                this.layout.careerRegion.show(careerView);
            },

            getLayout: function () {
                return new Show.views.Layout();
            }

        });


    });
});
