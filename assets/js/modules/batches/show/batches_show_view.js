define([
], function () {
    Application.module("Batches.Show", function (Show, Application, Backbone, Marionette, $, _) {

//        Show.addEducationFormId = 'addEducationModal';
        Show.showAddEducationModalEvt = "showAddEducationModalEvt";
//        Show.createEducationEvt = "createEducationEvt";
        Show.removeStudentEvt = "removeStudentEvt";
        Show.addStudentEvt = "addStudentEvt";
//        Show.addCommentEvt = "addCommentEvt";

        Show.addClassModalFormId = "addClassModal";
        Show.SHOW_NEW_CLASS_MODAL = "show:new:class:modal";
        Show.CREATE_CLASS = "create:class";


        this.prefix = "Show";
        this.templatePath = "js/modules/";
        this.views = {};

        this.template = function (str) {
            return this.prefix + '-' + str;
        };


        Show.views.Layout = Application.Views.Layout.extend({
            template: "batches/show/templates/show_layout",
//            className: "someClass",
            regions: {
                batchDetailsRegion: "#batchDetails",
                studentsRegion: "#students",
                classesRegion: "#classes"
            }
        });

        Show.views.ClassSectionLayout = Application.Views.Layout.extend({
            template: "batches/show/templates/classes_layout",
            regions: {
                addClassBtnRegion: "#addClass",
                classTableRegion: "#classesTable"
            }

        });

        Show.views.BatchDetails = Application.Views.ItemView.extend({
            template: "batches/show/templates/batch_details_view",

            onRender: function() {
                Show.setupEditableBox(this.$el, this.model, "name", "Name", this.model.get('name'), 'text', null, 'right');
                Show.setupEditableBox(this.$el, this.model, "type", "Type", this.model.get('type'), 'text', null, 'right');
                Show.setupEditableBox(this.$el, this.model, "service", "Service", this.model.get('service').id, 'select', this.options.allServices, null, 'right');
                Show.setupDateTimeEditableBox(this.$el, this.model, "startDate", "Enter begin date", this.model.get('startDate'), 'right');
                Show.setupDateTimeEditableBox(this.$el, this.model, "endDate", "Enter end date", this.model.get('endDate'), 'right');
            }
        });

        Show.views.EnrolledStudentView = Application.Views.ItemView.extend({
            template: "batches/show/templates/student_field",
            tagName: "div",
            className: "col-md-12",

            events: {
                "mouseenter": "toggleDelete",
                "mouseleave": "toggleDelete",
                "click .i-cancel": "deleteStudent"
            },

            deleteStudent: function(evt) {
                evt.preventDefault();
                this.trigger(Show.removeStudentEvt, this);
            },

            toggleDelete: function (evt) {
                evt.preventDefault();
                var fieldId = this.model.get('id');
                $('#' + fieldId).find('.i-cancel').toggleClass("display-none");
            }

        });

        Show.views.StudentComposite = Application.Views.CompositeView.extend({
            template: "batches/show/templates/students_view",
            itemView: Show.views.EnrolledStudentView,
            itemViewContainer: "#enrolledStudents",

            initialize: function() {
                var that = this;
                this.on(Application.CHILD_VIEW + ":" + Show.removeStudentEvt, function(childView) {
                    that.trigger(Show.removeStudentEvt, childView.model);
                })
            },

            onRender: function() {
//                console.log("Printing this...");
//                console.dir(this);
                var that = this;
                var successCB = function(response, value) {
                    console.log("Add students: " + value);
                    that.trigger(Show.addStudentEvt, value);
                };
                Application.Views.setupSelect2EditableBox(this.$el, "addStudents", this.options.allStudents, "Add Students", this.options.addedStudents, 'right', successCB)
            }
        });

        Show.views.AddClassButton = Application.Views.ItemView.extend({
            template: "views/templates/tab_add_button",

            events: {
                "click" : "showAddClassModal"
            },

            showAddClassModal: function(evt){
                evt.preventDefault();
                this.trigger(Show.SHOW_NEW_CLASS_MODAL);
            }

        });


        Show.views.AddClassForm = Application.Views.ItemView.extend({
            template: "batches/show/templates/add_class_form",

            events: {
                "click #createNewClass" : "createNewClass"
            },

            onRender: function() {
                Backbone.Validation.bind(this);

                this.renderSelect(this.options.allTopics, "#topic");
                this.renderSelect(this.options.allStaff, "#staff");
//
//                //Add datetime field
                Application.Views.addDateTimePicker(this.$el.find('#dateDiv'));
//                Application.Views.addDateTimePicker(this.$el.find('#dateDiv'), null, {pickTime: false});
//                Application.Views.addDateTimePicker(this.$el.find('#timeDiv'), null,{pickDate: false});

            },

            renderSelect :function (idToTextMap, element) {
                var that = this;
                _.each(idToTextMap, function(select){
                    that.$el.find(element).append("<option value='" + select.id + "'>" + select.text + "</option>");
                });
                this.$el.find(element).select2();
            },

            createNewClass: function(evt) {
                evt.preventDefault();
                var data = Backbone.Syphon.serialize(this);
                this.model.set(data);

                if (!data.name) {
                    var val = _.find(this.options.allTopics, function(topic){
                        return topic.id == data.topic;
                    })
                    data.name = val.text;
                }


                var isValid = this.model.isValid(true);
                if (isValid) {
                    Application.Views.hideModal(Show.addClassModalFormId);
                    this.trigger(Show.CREATE_CLASS, this, data);
                }
            }

        });

        Show.views.ClassRow = Application.Views.ItemView.extend({
            template: "batches/show/templates/class_row",
            tagName: "tr",

            serializeData: function() {
                var data = this.model.toJSON();
//                data.serviceName = data.service.name;
                data.staffNames = _.pluck(data.staff, 'name').join(', ');
                return data;
            },

            events: {
                "click": "click"
            },

            click: function(evt) {
                evt.preventDefault();
                this.trigger(Application.CLASS_SHOW, this);
            }
        });




//        Show.views.Personal = Application.Views.ItemView.extend({
//            template: "batches/show/templates/personal_view",
//
//            onRender: function() {
//                Backbone.Validation.bind(this);
//                this.setupProfile();
//            },
//
//            setupProfile: function() {
//                Show.setupEditableBox(this.$el, this.model, "firstName", "FirstName", this.model.get('firstName'), 'text', null, 'right');
//                Show.setupEditableBox(this.$el, this.model, "lastName", "LastName", this.model.get('lastName'), 'text', null, 'right');
//                Show.setupEditableBox(this.$el, this.model, "phoneNumber", "Enter Phone", this.model.get('phoneNumber'), 'text', null, 'right');
//                Show.setupEditableBox(this.$el, this.model, "email", "Enter Email", this.model.get('email'), 'text');
//                Show.setupEditableBox(this.$el, this.model, "address", "Enter Address", this.model.get('address'), 'textarea', null, 'right');
//            }
//        });
//
//        Show.views.addEducationForm = Application.Views.ItemView.extend({
//            template: "batches/show/templates/add_education_form",
//
//            events: {
//                "click #createEducationInfo" : "createEducationInfo"
//            },
//
//            onRender: function() {
//                Backbone.Validation.bind(this);
//            },
//
//            createEducationInfo: function(evt) {
//                evt.preventDefault();
//                var data = Backbone.Syphon.serialize(this);
//                this.model.set(data);
//
//                var isValid = this.model.isValid(true);
//                if (isValid) {
//                    Application.Views.hideModal(Show.addEducationFormId);
//                    this.trigger(Show.createEducationEvt, this);
//                }
//            }
//
//        });
//
//        Show.views.EducationField = Application.Views.ItemView.extend({
//            template: "batches/show/templates/education_field",
//            tagName: "div",
//            className: "col-md-12",
//
//            events: {
//                "mouseenter": "toggleDelete",
//                "mouseleave": "toggleDelete",
//                "click .i-cancel": "deleteEducation"
//            },
//
//            deleteEducation: function(evt) {
//                evt.preventDefault();
//                this.trigger(Show.deleteEducationEvt, this);
//            },
//
//            toggleDelete: function (evt) {
//                evt.preventDefault();
//                var fieldId = this.model.get('programName');
//                $('#' + fieldId).toggleClass("basicBorder");
//                $('#' + fieldId).find('.i-cancel').toggleClass("display-none");
//            }
//
//        });
//
//        Show.views.AcademicComposite = Application.Views.CompositeView.extend({
//            template: "batches/show/templates/academic_view",
//            itemViewContainer: "#educationFields",
//            itemView: Show.views.EducationField,
//
//            initialize: function() {
//                var that = this;
//                this.on(Application.CHILD_VIEW + ":" + Show.deleteEducationEvt, function(childView) {
//                    that.trigger(Show.deleteEducationEvt, childView);
//                })
//            },
//
//            serializeData: function() {
//                var data = this.model.toJSON();
//                data.modalId = Show.addEducationFormId;
//                return data;
//            },
//
//            events: {
//                "click #addEducationInfo" : "showAddEducationModal"
//            },
//
//            showAddEducationModal: function(evt) {
//                evt.preventDefault();
//                this.trigger(Show.showAddEducationModalEvt, this);
//            }
//        });
//
//        Show.views.Career = Application.Views.ItemView.extend({
//            template: "batches/show/templates/career_view",
//
//            onRender: function() {
//                Backbone.Validation.bind(this);
//                this.setupCareerView();
//            },
//
//            setupCareerView: function() {
//                Show.setupSelect2EditableBox(this.$el, this.model, "countries", this.options.allCountries, "Add Country", this.options.addedCountries, 'right');
//                Show.setupSelect2EditableBox(this.$el, this.model, "services", this.options.allServices, "Add Service", this.options.addedServices, 'right');
//                Show.setupEditableBox(this.$el, this.model, "intake", "Enter Intake", this.model.get('intake'), 'text', null, 'right');
//                //TODO make it a year combodate
//                Show.setupEditableBox(this.$el, this.model, "intakeYear", "Enter Intake year", this.model.get('intakeYear'), 'text');
//            }
//        });
//
////        Show.dateFormat = "ddd, MMM Do 'YY, h:mm a";
//        Show.views.Comment = Application.Views.ItemView.extend({
//            template: "batches/show/templates/comment_view",
//
//            serializeData: function() {
//                var comment = this.model.toJSON();
//                var iconClass, iconColor;
//                if (comment.type == "remove") {
//                    iconClass = 'fa fa-times';
//                    iconColor = 'red';
//                } else if(comment.type == 'comment') {
//                    iconClass = 'fa fa-comment';
//                    iconColor = 'cornflowerblue';
//                } else if(comment.type == 'change') {
//                    iconClass = 'i i-switch';
//                    iconColor = 'blueviolet';
//                } else {
//                    iconClass = 'fa fa-check';
//                    iconColor = 'cadetblue';
//                }
//                comment.iconClass = iconClass;
//                comment.iconColor = iconColor;
//                return comment;
//            }
//        });
//
//        Show.views.History = Application.Views.CompositeView.extend({
//            template: "batches/show/templates/history_view",
//
//            itemView: Show.views.Comment,
//            itemViewContainer: "#historySection",
//
//            events: {
//                'click #addComment': 'addComment'
//            },
//
//            onRender: function() {
//                Backbone.Validation.bind(this);
//            },
//
//            addComment: function(evt) {
//                evt.preventDefault();
//                var data = Backbone.Syphon.serialize(this);
////                data.type = "comment";
//                console.log(data);
//                this.trigger(Show.addCommentEvt, data);
//            }
//        });
//
//        Show.views.Admin = Application.Views.ItemView.extend({
//            template: "batches/show/templates/admin_view",
//
//            onRender: function() {
//                Backbone.Validation.bind(this);
//                this.setupAdminView();
//            },
//
//            setupAdminView: function() {
//                Show.setupSelect2EditableBox(this.$el, this.model, "staff", this.options.allStaff, "Assigned To", this.options.addedStaff);
//                Show.setupEditableBox(this.$el, this.model, "enquiryStatus", "Add Status", this.model.get('enquiryStatus').id, 'select', this.options.allStatus);
//                Show.setupEditableBox(this.$el, this.model, "remarks", "Enter Remarks", this.model.get('remarks'), 'textarea');
//                Show.setupEditableBox(this.$el, this.model, "source", "Enter Source", this.model.get('source'), 'text');
//                Show.setupDateTimeEditableBox(this.$el, this.model, "followUp", "Follow Up On", this.model.get('followUp'));
//            }
//        });
//
        Show.setupEditableBox = function(el, model, id, emptyText, initialValue, type, source, placement){
            var successCB = function (response, value) {
//                console.log("[" + id + ":" + value + "]");
                model.save(id, value, {
                    wait: true,
                    patch: true,
                    success: function (updatedStudent) {
                        console.log("Saved on server!!");
//                        Application.execute(Show.UPDATE_HISTORY_EVT, updatedStudent);
                    },

                    error: function (x, response) {
                        console.log("Error on server!! -- " + response.msg);
                        return response.msg;
                    }
                })
            };

            Application.Views.setupEditableBox(el, id, emptyText, initialValue, type, source, placement, successCB);
        };

        Show.setupDateTimeEditableBox = function(el, model, id, emptyText, initialValue, placement){

            var successCB = function(response, value) {
                if (!value) {
                    console.log("No value!!!");
                    return;
                }

                model.save(id, value, {
                    wait: true,
                    patch: true,
                    success: function(updatedStudent){
                        console.log("Saved on server!!");
//                        Application.execute(Show.UPDATE_HISTORY_EVT, updatedStudent);
                    },

                    error: function(x, response) {
                        console.log(response);
                        console.log("Error on server!! -- ");
                        return response.msg;
                    }
                })
            };

            Application.Views.setupDateTimeEditableBox(el, id, emptyText, initialValue, successCB, placement, "ddd, MMM DD 'YY", 'DD MMM YYYY');
        };

        Show.setupSelect2EditableBox = function(el, model, id, source, emptyText, initialValue, placement){


            console.log("Printing this...");
            console.dir(this);
            var successCB = function(response, value) {
//                console.log(value);
                model.save(id, value, {
                    wait: true,
                    patch: true,
                    success: function(updatedStudent){
                        console.log("Saved on server!!");
//                        Application.execute(Show.UPDATE_HISTORY_EVT, updatedStudent);
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