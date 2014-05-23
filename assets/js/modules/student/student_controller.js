define([
    //"modules/enquiries/show/show_view"
    "modules/student/student_view",

        //Models
    "modules/entities/user",
    "modules/entities/comment",
    "modules/entities/service",
    "modules/entities/education",
    "modules/entities/enquiryStatus",
    "modules/entities/enroll"
    
], function () {
    Application.module("Student", function (Student, Application, Backbone, Marionette, $, _) {

        Student.UPDATE_HISTORY_EVT = "update:history";
        Student.Controller = Application.Controllers.Base.extend({
            initialize: function () {
//                var user = Application.request(Application.GET_LOGGED_USER);
                var student = Application.request(Application.GET_STUDENT, this.options.studentId);
                var studentComments = Application.request(Application.GET_STUDENT_COMMENTS, this.options.studentId);
                var allCountries = Application.request(Application.GET_COUNTRIES);
                var allServices = Application.request(Application.GET_SERVICES);
                var allStaff = Application.request(Application.GET_ALL_STAFF);
                var allStatus = Application.request(Application.GET_STATUS_All);
                var enrollmentByStudent = Application.request(Application.GET_ENROLLMENT_BY_STUDENTID, this.options.studentId);
                
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
                Application.commands.setHandler(Student.UPDATE_HISTORY_EVT, function (student) {
                    studentComments = Application.request(Application.GET_STUDENT_COMMENTS, student.id);
                    that.showHistoryView(student, studentComments);
                });
            },

            showStudent: function (student, allCountries, allServices, allStaff, allStatus, studentComments,enrollmentByStudent) {

                this.showPersonalView(student);

                this.showAcademicView(student);

                this.showCareerView(student, allCountries, allServices);

                this.showAdminView(student, allStaff, allStatus);

                this.showHistoryView(student, studentComments);

                this.showEnrollmentView(student, allServices);

            },

            showPersonalView: function(student) {
                var personalView = new Student.views.Personal({
                    model: student
                });

                this.layout.personalRegion.show(personalView);
            },

            showEnrollmentView: function(student,allServices){
      
                var enrollCollection = new Application.Entities.EnrollCollection(student.get('enrollments'));
                var addedServices = new Application.Entities.ServiceCollection(student.get('services'));
                var addedServicesIdList = addedServices.pluck("id");

                var that = this;
                var enrollView = new Student.views.EnrollComposite({
                    collection: enrollCollection,
                    model: student,
                    allServices: allServices.getIdToTextMap('name'),
                    addedServices: addedServicesIdList
                });
                this.layout.enrollmentRegion.show(enrollView);

                enrollView.on(Student.showAddEnrollModalEvt, function(view){
                   console.log("Enroll modal!!!");
//                    var modalRegion = new Application.Views.ModalRegion({el:'#modal'});
                    var newEnroll = Application.request(Application.GET_ENROLLMENT);
                    newEnroll.attributes.modalId = Student.addEnrollFormId;

                    var addEnrollModalView = new Student.views.addEnrollForm({
                        model: newEnroll
                    });

                    addEnrollModalView.on(Student.createEnrollEvt, function(modalFormView){
                        student.save("addEnroll", modalFormView.model.attributes, {
                            wait: true,
                            patch: true,
                            success: function(updatedStudent){
                                console.log("Saved on server!!");
                                console.dir(updatedStudent);
                                that.showEnrollView(updatedStudent);
                                //Application.execute(Student.UPDATE_HISTORY_EVT, updatedStudent);
                            },

                            error: function(x, response) {
                                console.log("Error on server!! -- " + response.text);
                                return response;
                            }
                        });

                    });
                    Application.modalRegion.show(addEnrollModalView);
                });

                enrollView.on(Student.deleteEnrollEvt, function(enrollFieldView) {
                    console.log('Delete enrollment...');
                    student.save("removeEnroll", enrollFieldView.model.attributes, {
                        wait: true,
                        patch: true,
                        success: function(updatedStudent){
                            console.log("Saved on server!!");
                            //console.dir(updatedStudent);
                            //that.showEnrollView(updatedStudent);
                            //Application.execute(Student.UPDATE_HISTORY_EVT, updatedStudent);
                        },

                        error: function(x, response) {
                            console.log("Error on server!! -- " + response.text);
                            return response;
                        }
                    });
                });




            },

            showAcademicView: function(student) {
                //todo Any better way for this
                var educationCollection = new Application.Entities.EducationCollection(student.get('educationList'));

                var that = this;
                var academicView = new Student.views.AcademicComposite({
                    collection: educationCollection,
                    model: student
                });
                this.layout.academicRegion.show(academicView);

                academicView.on(Student.showAddEducationModalEvt, function(view){
                   console.log("Student modal!!!");
//                    var modalRegion = new Application.Views.ModalRegion({el:'#modal'});
                    var newEducation = Application.request(Application.GET_EDUCATION);
                    newEducation.attributes.modalId = Student.addEducationFormId;

                    var addEducationModalView = new Student.views.addEducationForm({
                        model: newEducation
                    });

                    addEducationModalView.on(Student.createEducationEvt, function(modalFormView){
                        student.save("addEducation", modalFormView.model.attributes, {
                            wait: true,
                            patch: true,
                            success: function(updatedStudent){
                                console.log("Saved on server!!");
                                console.dir(updatedStudent);
                                that.showAcademicView(updatedStudent);
                                Application.execute(Student.UPDATE_HISTORY_EVT, updatedStudent);
                            },

                            error: function(x, response) {
                                console.log("Error on server!! -- " + response.text);
                                return response;
                            }
                        });

                    });
                    Application.modalRegion.show(addEducationModalView);
                });

                academicView.on(Student.deleteEducationEvt, function(educationFieldView) {
                    console.log('Delete edu...');
                    student.save("removeEducation", educationFieldView.model.attributes, {
                        wait: true,
                        patch: true,
                        success: function(updatedStudent){
                            console.log("Saved on server!!");
                            console.dir(updatedStudent);
                            that.showAcademicView(updatedStudent);
                            Application.execute(Student.UPDATE_HISTORY_EVT, updatedStudent);
                        },

                        error: function(x, response) {
                            console.log("Error on server!! -- " + response.text);
                            return response;
                        }
                    });
                });
            },

            showHistoryView: function(student, studentComments) {
                var historyView = new Student.views.History({
                   model: student,
                   collection: studentComments
                });

                this.listenTo(historyView, Student.addCommentEvt, function(data) {
                    student.save("comment", data, {
                        wait: true,
                        patch: true,
                        success: function(updatedStudent){
                            console.log("Saved on server!!");
                            Application.execute(Student.UPDATE_HISTORY_EVT, updatedStudent);
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
                var adminView = new Student.views.Admin({
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

                var careerView = new Student.views.Career({
                    model: student,
                    allCountries: allCountries.getIdToTextMap('name'),
                    addedCountries: addedCountriesIdList,

                    allServices: allServices.getIdToTextMap('name'),
                    addedServices: addedServicesIdList
                });
                this.layout.careerRegion.show(careerView);
            },

            getLayout: function () {
                return new Student.views.Layout();
            }

        });


    });
});
