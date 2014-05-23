define([
    "modules/batches/show/show_view"
], function () {
    Application.module("Batches.Show", function (Batches_Show, Application, Backbone, Marionette, $, _) {

//        Batches_Show.UPDATE_HISTORY_EVT = "update:history";
        Batches_Show.Controller = Application.Controllers.Base.extend({
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

                var that = this;
                Application.commands.setHandler(Batches_Show.UPDATE_HISTORY_EVT, function (student) {
                    studentComments = Application.request(Application.GET_STUDENT_COMMENTS, student.id);
                    that.showHistoryView(student, studentComments);
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
                var personalView = new Batches_Show.views.Personal({
                    model: student
                });

                this.layout.personalRegion.show(personalView);
            },

            showAcademicView: function(student) {
                //todo Any better way for this
                var educationCollection = new Application.Entities.EducationCollection(student.get('educationList'));

                var that = this;
                var academicView = new Batches_Show.views.AcademicComposite({
                    collection: educationCollection,
                    model: student
                });
                this.layout.academicRegion.show(academicView);

                academicView.on(Batches_Show.showAddEducationModalEvt, function(view){
                   console.log("Batches_Show modal!!!");
//                    var modalRegion = new Application.Views.ModalRegion({el:'#modal'});
                    var newEducation = Application.request(Application.GET_EDUCATION);
                    newEducation.attributes.modalId = Batches_Show.addEducationFormId;

                    var addEducationModalView = new Batches_Show.views.addEducationForm({
                        model: newEducation
                    });

                    addEducationModalView.on(Batches_Show.createEducationEvt, function(modalFormView){
                        student.save("addEducation", modalFormView.model.attributes, {
                            wait: true,
                            patch: true,
                            success: function(updatedStudent){
                                console.log("Saved on server!!");
                                console.dir(updatedStudent);
                                that.showAcademicView(updatedStudent);
                                Application.execute(Batches_Show.UPDATE_HISTORY_EVT, updatedStudent);
                            },

                            error: function(x, response) {
                                console.log("Error on server!! -- " + response.text);
                                return response;
                            }
                        });

                    });
                    Application.modalRegion.show(addEducationModalView);
                });

                academicView.on(Batches_Show.deleteEducationEvt, function(educationFieldView) {
                    console.log('Delete edu...');
                    student.save("removeEducation", educationFieldView.model.attributes, {
                        wait: true,
                        patch: true,
                        success: function(updatedStudent){
                            console.log("Saved on server!!");
                            console.dir(updatedStudent);
                            that.showAcademicView(updatedStudent);
                            Application.execute(Batches_Show.UPDATE_HISTORY_EVT, updatedStudent);
                        },

                        error: function(x, response) {
                            console.log("Error on server!! -- " + response.text);
                            return response;
                        }
                    });
                });
            },

            showHistoryView: function(student, studentComments) {
                var historyView = new Batches_Show.views.History({
                   model: student,
                   collection: studentComments
                });

                this.listenTo(historyView, Batches_Show.addCommentEvt, function(data) {
                    student.save("comment", data, {
                        wait: true,
                        patch: true,
                        success: function(updatedStudent){
                            console.log("Saved on server!!");
                            Application.execute(Batches_Show.UPDATE_HISTORY_EVT, updatedStudent);
                        },

                        error: function(x, response) {
                            console.log("Error on server!! -- " + response.msg);
                            return response.msg;
                        }
                    })
                });
                this.layout.historyRegion.show(historyView);
            },

            showAdminView: function(student, allStaff, allStatus) {
                var addedStaff = new Application.Entities.UsersCollection(student.get('staff'));
                var addedStaffIdList = addedStaff.pluck("id");
                var adminView = new Batches_Show.views.Admin({
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

                var careerView = new Batches_Show.views.Career({
                    model: student,
                    allCountries: allCountries.getIdToTextMap('name'),
                    addedCountries: addedCountriesIdList,

                    allServices: allServices.getIdToTextMap('name'),
                    addedServices: addedServicesIdList
                });
                this.layout.careerRegion.show(careerView);
            },

            getLayout: function () {
                return new Batches_Show.views.Layout();
            }

        });


    });
});