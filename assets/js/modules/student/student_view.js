define([
], function () {
    Application.module("Student", function (Student, Application, Backbone, Marionette, $, _) {

        Student.addEducationFormId = 'addEducationModal';

        Student.showAddEducationModalEvt = "showAddEducationModalEvt";
        Student.createEducationEvt = "createEducationEvt";
        Student.deleteEducationEvt = "deleteEducationEvt";
        Student.addCommentEvt = "addCommentEvt";
        Student.addEnrollFormId = 'addEnrollModal';
        Student.showAddEnrollModalEvt = "showAddEnrollModalEvt";
        Student.createEnrollEvt = "createEnrollEvt";
        Student.deleteEnrollEvt = "deleteEnrollEvt";

        this.prefix = "Student";
        this.templatePath = "js/modules/";
        this.views = {};

        this.template = function (str) {
            return this.prefix + '-' + str;
        };


        // This has been added to only keep class naming consistent with views.
        this.models = {};
        this.collections = {};
        //*************







        Student.views.Layout = Application.Views.Layout.extend({
           // template: "student/templates/student_layout",
            template: "student/templates/student_layout",
//            className: "someClass",
            regions: {
                personalRegion: "#personal",
                careerRegion: "#career",
                academicRegion: "#academic",
                adminRegion: "#admin",
                historyRegion: "#history",
                enrollmentRegion: "#enrollment"
            }
        });







//        var successCB = function (response, value) {
//            console.log(value);
//            model.save(id, value, {
//                wait: true,
//                patch: true,
//                success: function (updatedStudent) {
//                    console.log("Saved on server!!");
//                    Application.execute(Student.UPDATE_HISTORY_EVT, updatedStudent);
//                },
//
//                error: function (x, response) {
//                    console.dir(response);
//                    console.log("Error on server!! -- " + response.msg);
//                    return response.msg;
//                }
//            });
//        }

        Student.views.Personal = Application.Views.ItemView.extend({
            template: "student/templates/personal_view",

            onRender: function() {
                Backbone.Validation.bind(this);
                this.setupProfile();
            },

            setupProfile: function() {
                Student.setupEditableBox(this.$el, this.model, "firstName", "FirstName", this.model.get('firstName'), 'text', null, 'right');
                Student.setupEditableBox(this.$el, this.model, "lastName", "LastName", this.model.get('lastName'), 'text', null, 'right');
                Student.setupEditableBox(this.$el, this.model, "phoneNumber", "Enter Phone", this.model.get('phoneNumber'), 'text', null, 'right');
                Student.setupEditableBox(this.$el, this.model, "email", "Enter Email", this.model.get('email'), 'text');
                Student.setupEditableBox(this.$el, this.model, "address", "Enter Address", this.model.get('address'), 'textarea', null, 'right');
                //Student.setupEditableBox(this.$el, this.model, "parentFirstName", "Parent First Name", this.model.get('parentFirstName'), 'textarea', null, 'right');
                //Student.setupEditableBox(this.$el, this.model, "parentLastName", "Parent Last Name", this.model.get('parentLastName'), 'textarea', null, 'right');

            }
        });

        //     Student.views.Enrollment = Application.Views.ItemView.extend({
        //     template: "student/templates/enrollment_view",

        //     onRender: function() {
        //         Backbone.Validation.bind(this);
        //         this.setupEnroll();
        //     },

        //     setupEnroll: function() {
        //         Student.setupEditableBox(this.$el, this.model, "enrollDate", "Enroll Date", this.model.get('enrollDate'), 'text', null, 'right');
        //         Student.setupEditableBox(this.$el, this.model, "totalFee", "TotalFee", this.model.get('totalFee'), 'text', null, 'right');
        //         //Student.setupEditableBox(this.$el, this.model, "address", "Enter Address", this.model.get('address'), 'textarea', null, 'right');
        //         //Student.setupEditableBox(this.$el, this.model, "parentFirstName", "Parent First Name", this.model.get('parentFirstName'), 'textarea', null, 'right');
        //         //Student.setupEditableBox(this.$el, this.model, "parentLastName", "Parent Last Name", this.model.get('parentLastName'), 'textarea', null, 'right');

        //     }
        // });

     Student.views.addEnrollForm = Application.Views.ItemView.extend({
            template: "student/templates/enroll_form",

            events: {
                "click #createEnroll" : "createEnroll"
            },

            onRender: function() {
                Backbone.Validation.bind(this);
            },

            createEnroll: function(evt) {
                evt.preventDefault();
                var data = Backbone.Syphon.serialize(this);
                this.model.set(Application.Views.trimFormData(data));

                var isValid = this.model.isValid(true);
                if (isValid) {
                    Application.Views.hideModal(Student.addEnrollFormId);
                    this.trigger(Student.createEnrollEvt, this);
                }
            }

        });

        Student.views.EnrollField = Application.Views.ItemView.extend({
            template: "student/templates/enroll_field",
            tagName: "div",
            className: "col-md-12",

            events: {
                "mouseenter": "toggleDelete",
                "mouseleave": "toggleDelete",
                "click .i-cancel": "deleteEnroll"
            },

            deleteEnroll: function(evt) {
                evt.preventDefault();
                this.trigger(Student.deleteEnrollEvt, this);
            },

            toggleDelete: function (evt) {
                evt.preventDefault();
               // console.log('Mouse hover delete!');
                var fieldId = this.model.get('totalFee');
                $('#' + fieldId).toggleClass("basicBorder");
                $('#' + fieldId).find('.i-cancel').toggleClass("display-none");
            }

        });

        Student.views.EnrollComposite = Application.Views.CompositeView.extend({
            template: "student/templates/enrollment_view",
            itemViewContainer: "#enrollFields",
            itemView: Student.views.EnrollField,

            initialize: function() {
                var that = this;
                this.on(Application.CHILD_VIEW + ":" + Student.deleteEnrollEvt, function(childView) {
                    that.trigger(Student.deleteEnrollEvt, childView);
                })
            },

            serializeData: function() {
                var data = this.model.toJSON();
                data.modalId = Student.addEnrollFormId;
                return data;
            },

            events: {
                "click #addEnroll" : "showAddEnrollModal"
            },

            showAddEnrollModal: function(evt) {
                evt.preventDefault();
                this.trigger(Student.showAddEnrollModalEvt, this);
            }
        });





        Student.views.addEducationForm = Application.Views.ItemView.extend({
            template: "student/templates/add_education_form",

            events: {
                "click #createEducationInfo" : "createEducationInfo"
            },

            onRender: function() {
                Backbone.Validation.bind(this);
            },

            createEducationInfo: function(evt) {
                evt.preventDefault();
                var data = Backbone.Syphon.serialize(this);
                this.model.set(Application.Views.trimFormData(data));

                var isValid = this.model.isValid(true);
                if (isValid) {
                    Application.Views.hideModal(Student.addEducationFormId);
                    this.trigger(Student.createEducationEvt, this);
                }
            }

        });

        Student.views.EducationField = Application.Views.ItemView.extend({
            template: "student/templates/education_field",
            tagName: "div",
            className: "col-md-12",

            events: {
                "mouseenter": "toggleDelete",
                "mouseleave": "toggleDelete",
                "click .i-cancel": "deleteEducation"
            },

            deleteEducation: function(evt) {
                evt.preventDefault();
                this.trigger(Student.deleteEducationEvt, this);
            },

            toggleDelete: function (evt) {
                evt.preventDefault();
                var fieldId = this.model.get('programName');
                $('#' + fieldId).toggleClass("basicBorder");
                $('#' + fieldId).find('.i-cancel').toggleClass("display-none");
            }

        });

        Student.views.AcademicComposite = Application.Views.CompositeView.extend({
            template: "student/templates/academic_view",
            itemViewContainer: "#educationFields",
            itemView: Student.views.EducationField,

            initialize: function() {
                var that = this;
                this.on(Application.CHILD_VIEW + ":" + Student.deleteEducationEvt, function(childView) {
                    that.trigger(Student.deleteEducationEvt, childView);
                })
            },

            serializeData: function() {
                var data = this.model.toJSON();
                data.modalId = Student.addEducationFormId;
                return data;
            },

            events: {
                "click #addEducationInfo" : "showAddEducationModal"
            },

            showAddEducationModal: function(evt) {
                evt.preventDefault();
                this.trigger(Student.showAddEducationModalEvt, this);
            }
        });

        Student.views.Career = Application.Views.ItemView.extend({
            template: "student/templates/career_view",

            onRender: function() {
                Backbone.Validation.bind(this);
                this.setupCareerView();
            },

            setupCareerView: function() {
                Student.setupSelect2EditableBox(this.$el, this.model, "countries", this.options.allCountries, "Add Country", this.options.addedCountries, 'right');
                Student.setupSelect2EditableBox(this.$el, this.model, "services", this.options.allServices, "Add Service", this.options.addedServices, 'right');
                Student.setupEditableBox(this.$el, this.model, "intake", "Enter Intake", this.model.get('intake'), 'text', null, 'right');
                //TODO make it a year combodate
                Student.setupEditableBox(this.$el, this.model, "intakeYear", "Enter Intake year", this.model.get('intakeYear'), 'text');
            }
        });

//        Student.dateFormat = "ddd, MMM Do 'YY, h:mm a";
        Student.views.Comment = Application.Views.ItemView.extend({
            template: "student/templates/comment_view",

            serializeData: function() {
                var comment = this.model.toJSON();
                var iconClass, iconColor;
                if (comment.type == "remove") {
                    iconClass = 'fa fa-times';
                    iconColor = 'red';
                } else if(comment.type == 'comment') {
                    iconClass = 'fa fa-comment';
                    iconColor = 'cornflowerblue';
                } else if(comment.type == 'change') {
                    iconClass = 'i i-switch';
                    iconColor = 'blueviolet';
                } else {
                    iconClass = 'fa fa-check';
                    iconColor = 'cadetblue';
                }
                comment.iconClass = iconClass;
                comment.iconColor = iconColor;
                return comment;
            }
        });

        Student.views.History = Application.Views.CompositeView.extend({
            template: "student/templates/history_view",

            itemView: Student.views.Comment,
            itemViewContainer: "#historySection",

            events: {
                'click #addComment': 'addComment'
            },

            onRender: function() {
                Backbone.Validation.bind(this);
            },

            addComment: function(evt) {
                evt.preventDefault();
                var data = Backbone.Syphon.serialize(this);
//                data.type = "comment";
                console.log(data);
                this.trigger(Student.addCommentEvt, data);
            }
        });

        Student.views.Admin = Application.Views.ItemView.extend({
            template: "student/templates/admin_view",

            onRender: function() {
                Backbone.Validation.bind(this);
                this.setupAdminView();
            },

            setupAdminView: function() {
                Student.setupSelect2EditableBox(this.$el, this.model, "staff", this.options.allStaff, "Assigned To", this.options.addedStaff);
                Student.setupEditableBox(this.$el, this.model, "enquiryStatus", "Add Status", this.model.get('enquiryStatus').id, 'select', this.options.allStatus);
                Student.setupEditableBox(this.$el, this.model, "remarks", "Enter Remarks", this.model.get('remarks'), 'textarea');
                Student.setupEditableBox(this.$el, this.model, "source", "Enter Source", this.model.get('source'), 'text');
                Student.setupDateTimeEditableBox(this.$el, this.model, "followUp", "Follow Up On", this.model.get('followUp'));
            }
        });

        //TODO All these need to be moved to the controller
        Student.setupEditableBox = function(el, model, id, emptyText, initialValue, type, source, placement){
            var successCB = function (response, value) {
//                console.log("[" + id + ":" + value + "]");
                model.save(id, value, {
                    wait: true,
                    patch: true,
                    success: function (updatedStudent) {
                        console.log("Saved on server!!");
                        Application.execute(Student.UPDATE_HISTORY_EVT, updatedStudent);
                    },

                    error: function (x, response) {
                        console.log("Error on server!! -- " + response.msg);
                        return response.msg;
                    }
                })
            };

            Application.Views.setupEditableBox(el, id, emptyText, initialValue, type, source, placement, successCB);
        };

        Student.setupDateTimeEditableBox = function(el, model, id, emptyText, initialValue){
            var successCB = function(response, value) {
//                console.log("[" + id + ":" + value + "]");
                if (!value) {
                    console.log("No value!!!");
                    return;
                }

                model.save(id, value, {
                    wait: true,
                    patch: true,
                    success: function(updatedStudent){
                        console.log("Saved on server!!");
                        Application.execute(Student.UPDATE_HISTORY_EVT, updatedStudent);
                    },

                    error: function(x, response) {
                        console.log("Error on server!! -- " + response);
                        return response.msg;
                    }
                })
            };

            Application.Views.setupDateTimeEditableBox(el, id, emptyText, initialValue, successCB);
        };



        Student.setupSelect2EditableBox = function(el, model, id, source, emptyText, initialValue, placement){
            var successCB = function(response, value) {
                console.log(value);
                model.save(id, value, {
                    wait: true,
                    patch: true,
                    success: function(updatedStudent){
                        console.log("Saved on server!!");
                        Application.execute(Student.UPDATE_HISTORY_EVT, updatedStudent);
                    },

                    error: function(x, response) {
                        console.dir(response);
                        console.log("Error on server!! -- " + response.msg);
                        return response.msg;
                    }
                });
            };

            Application.Views.setupSelect2EditableBox(el, id, source, emptyText, initialValue, placement, successCB);
        }

    });
});