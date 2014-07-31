define([
    //"modules/enquiries/show/show_view"
    "modules/students/show/show_view",

    //Models
    "modules/entities/user",
    "modules/entities/comment",
    "modules/entities/service",
    "modules/entities/education",
    "modules/entities/enquiryStatus",
    "modules/entities/enroll",
    "modules/entities/enrollment",
    "modules/entities/payment"

], function () {
    Application.module("Students.Show", function (Show, Application, Backbone, Marionette, $, _) {

        Show.UPDATE_HISTORY_EVT = "update:history";
        Show.Controller = Application.Controllers.Base.extend({
            initialize: function () {
                var student = Application.request(Application.GET_STUDENT, this.options.studentId);
                var allCountries = Application.request(Application.GET_COUNTRIES);
                var allServices = Application.request(Application.GET_SERVICES);
                var allStaff = Application.request(Application.GET_ALL_STAFF);
                var allStatus = Application.request(Application.GET_STATUS_All);
                var allLocations = Application.request(Application.GET_LOCATIONS);

                var studentComments = Application.request(Application.GET_STUDENT_COMMENTS, this.options.studentId);
                var studentEnrollments = Application.request(Application.GET_STUDENT_ENROLLMENTS, this.options.studentId);

                this.layout = this.getLayout();

                this.listenTo(this.layout, Application.SHOW, function () {
                    if (!student) {
                        Application.execute(Application.STUDENTS_LIST_ALL, this.region);
                    }

                    this.showPersonalView(student);

                    this.showParentView(student);

                    this.showAcademicView(student);

                    this.showCareerView(student, allCountries, allServices);

                    this.showAdminView(student, allStaff, allStatus, allLocations);

                    this.showHistoryView(student, studentComments);
//                    this.showHistoryView(student);

                    this.showEnrollmentView(student, allServices, studentEnrollments);
//                    this.showEnrollmentView(student, allServices);
                });


                this.show(this.layout, {
                    loading: {
//                        entities: [student, allCountries, allServices, allStaff, allStatus, studentEnrollments, allLocations]
                        entities: [student, allCountries, allServices, allStaff, allStatus, allLocations]
                    }
                });

                var that = this;
                Application.commands.setHandler(Show.UPDATE_HISTORY_EVT, function (student) {
                    studentComments = Application.request(Application.GET_STUDENT_COMMENTS, student.id);
                    that.showHistoryView(student, studentComments);
                });
            },

            showPersonalView: function (student) {
                var personalView = new Show.views.Personal({
                    model: student
                });

                this.layout.personalRegion.show(personalView);
            },

            showParentView: function (student) {
                var parentView = new Show.views.Parent({
                    model: student
                });

                this.layout.parentRegion.show(parentView);
            },

            showEnrollmentView: function (student, allServices, studentEnrollments) {
//            showEnrollmentView: function (student, allServices) {
//                var studentEnrollments = new Application.Entities.EnrollmentCollection(student.get('enrollments'))
                var that = this;
                var enrollView = new Show.views.EnrollComposite({
                    collection: studentEnrollments,
                    model: student
                });

                this.layout.enrollmentRegion.show(enrollView);

                enrollView.on(Show.showAddEnrollModalEvt, function (view) {
//                    console.log("Enroll modal!!!");
                    var newEnroll = Application.request(Application.GET_ENROLLMENT);
                    newEnroll.attributes.modalId = Show.addEnrollFormId;

                    var addEnrollModalView = new Show.views.addEnrollForm({
                        model: newEnroll,
                        allServices: allServices.getIdToTextMap('name')

                    });

                    addEnrollModalView.on(Show.createEnrollEvt, function (modalFormView) {
                        student.save("enroll", modalFormView.model.attributes, {
                            wait: true,
                            patch: true,
                            success: function (updatedStudent) {
                                var studentEnrollments = Application.request(Application.GET_STUDENT_ENROLLMENTS, updatedStudent.get('id'));
                                that.showEnrollmentView(updatedStudent, allServices, studentEnrollments);
                                Application.execute(Show.UPDATE_HISTORY_EVT, updatedStudent);
                            },

                            error: function (x, response) {
                                console.log("Error on server!! -- " + response.text);
                                return response;
                            }
                        });

                    });
                    Application.modalRegion.show(addEnrollModalView);
                });

                enrollView.on(Show.deleteEnrollEvt, function (enrollFieldView) {
                    console.log('Delete enrollment...');
                    student.save("removeEnroll", enrollFieldView.model.attributes, {
                        wait: true,
                        patch: true,
                        success: function (updatedStudent) {
                            console.log("Saved on server!!");
                            // console.dir(updatedStudent);
                            // that.showEnrollView(updatedStudent);
                            //Application.execute(Show.UPDATE_HISTORY_EVT, updatedStudent);
                        },

                        error: function (x, response) {
                            console.log("Error on server!! -- " + response.text);
                            return response;
                        }
                    });
                });

                enrollView.on(Show.showAddPaymentModalEvt, function (view) {
                    var newPayment = Application.request(Application.GET_PAYMENT);
                    newPayment.attributes.modalId = Show.addPaymentFormId;

                    var addPaymentModalView = new Show.views.addPaymentForm({
                        model: newPayment,
                        enroll: view.model.get('id'),
                        due: view.model.get('due')
                    });

                    addPaymentModalView.on(Show.addPaymentEvt, function (modalFormView) {
                        //  console.log(modalFormView);
                        student.save("payment", modalFormView.model.attributes, {
                            wait: true,
                            patch: true,
                            success: function (updatedStudent) {
                                console.log("Saved on server!!");
                                var studentEnrollments = Application.request(Application.GET_STUDENT_ENROLLMENTS, updatedStudent.get('id'));
                                that.showEnrollmentView(updatedStudent, allServices, studentEnrollments);
                                Application.execute(Show.UPDATE_HISTORY_EVT, updatedStudent);
                            },

                            error: function (x, response) {
                                console.log("Error on server!! -- " + response.text);
                                return response;
                            }
                        });

                    });
                    Application.modalRegion.show(addPaymentModalView);
                });


            },

            showAcademicView: function (student) {
                //TODO Any better way for this
                var educationCollection = new Application.Entities.EducationCollection(student.get('educationList'));

                var that = this;
                var academicView = new Show.views.AcademicComposite({
                    collection: educationCollection,
                    model: student
                });
                this.layout.academicRegion.show(academicView);

                academicView.on(Show.showAddEducationModalEvt, function (view) {
                    var newEducation = Application.request(Application.GET_EDUCATION);
                    newEducation.attributes.modalId = Show.addEducationFormId;

                    var addEducationModalView = new Show.views.addEducationForm({
                        model: newEducation
                    });

                    addEducationModalView.on(Show.createEducationEvt, function (modalFormView) {
                        student.save("addEducation", modalFormView.model.attributes, {
                            wait: true,
                            patch: true,
                            success: function (updatedStudent) {
                                that.showAcademicView(updatedStudent);
                                Application.execute(Show.UPDATE_HISTORY_EVT, updatedStudent);
                            },

                            error: function (x, response) {
                                console.log("Error on server!! -- " + response.text);
                                return response;
                            }
                        });

                    });
                    Application.modalRegion.show(addEducationModalView);
                });

                academicView.on(Show.deleteEducationEvt, function (educationFieldView) {
                    student.save("removeEducation", educationFieldView.model.attributes, {
                        wait: true,
                        patch: true,
                        success: function (updatedStudent) {
                            that.showAcademicView(updatedStudent);
                            Application.execute(Show.UPDATE_HISTORY_EVT, updatedStudent);
                        },

                        error: function (x, response) {
                            console.log("Error on server!! -- " + response.text);
                            return response;
                        }
                    });
                });
            },

            showHistoryView: function (student, studentComments) {
//            showHistoryView: function (student) {
//                var studentComments = new Application.Entities.CommentCollection(student.get('commentsReceived'));
                var historyView = new Show.views.History({
                    model: student,
                    collection: studentComments
                });

                this.listenTo(historyView, Show.addCommentEvt, function (data) {
                    student.save("comment", data, {
                        wait: true,
                        patch: true,
                        success: function (updatedStudent) {
                            console.log("Saved on server!!");
                            Application.execute(Show.UPDATE_HISTORY_EVT, updatedStudent);
                        },

                        error: function (x, response) {
                            console.log("Error on server!! -- " + response.msg);
                            return response.msg;
                        }
                    })
                });
                this.layout.historyRegion.show(historyView);
            },

            showAdminView: function (student, allStaff, allStatus, allLocations) {
                var addedStaff = new Application.Entities.StaffCollection(student.get('staff'));
                var addedStaffIdList = addedStaff.pluck("id");

                var addedLocations = new Application.Entities.LocationCollection(student.get('user').locations);
                var addedLocationIdList = addedLocations.pluck("id");


                var adminView = new Show.views.Admin({
                    model: student,
                    allStaff: allStaff.getIdToTextMap('name'),
                    addedStaff: addedStaffIdList,
                    allLocations: allLocations.getIdToTextMap('name'),
                    addedLocations: addedLocationIdList,
                    allStatus: allStatus.getValueToTextMap('name')
                });
                this.layout.adminRegion.show(adminView);

            },

            showCareerView: function (student, allCountries, allServices) {
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
