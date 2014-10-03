define([
], function () {
    Application.module("Enquiries.Show", function (Show, Application, Backbone, Marionette, $, _) {

        Show.addEducationFormId = 'addEducationModal';
        Show.showAddEducationModalEvt = "showAddEducationModalEvt";
        Show.createEducationEvt = "createEducationEvt";
        Show.deleteEducationEvt = "deleteEducationEvt";
        Show.addCommentEvt = "addCommentEvt";



        this.prefix = "Show";
        this.templatePath = "js/modules/";
        this.views = {};

        this.template = function (str) {
            return this.prefix + '-' + str;
        };


        Show.views.Layout = Application.Views.Layout.extend({
            template: "enquiries/show/templates/show_layout",
//            className: "someClass",
            regions: {
                personalRegion: "#personal",
                careerRegion: "#career",
                academicRegion: "#academic",
                adminRegion: "#admin",
                historyRegion: "#history"
            }
        });

//        var successCB = function (response, value) {
//            console.log(value);
//            model.save(id, value, {
//                wait: true,
//                patch: true,
//                success: function (updatedStudent) {
//                    console.log("Saved on server!!");
//                    Application.execute(Show.UPDATE_HISTORY_EVT, updatedStudent);
//                },
//
//                error: function (x, response) {
//                    console.dir(response);
//                    console.log("Error on server!! -- " + response.msg);
//                    return response.msg;
//                }
//            });
//        }

        Show.views.Personal = Application.Views.ItemView.extend({
            template: "enquiries/show/templates/personal_view",

            onRender: function() {
                Backbone.Validation.bind(this);
                this.setupProfile();
            },

            setupProfile: function() {
                Show.setupEditableBox(this.$el, this.model, "firstName", "FirstName", this.model.get('firstName'), 'text', null, 'right');
                Show.setupEditableBox(this.$el, this.model, "lastName", "LastName", this.model.get('lastName'), 'text', null, 'right');
                Show.setupEditableBox(this.$el, this.model, "phoneNumber", "Enter Phone", this.model.get('phoneNumber'), 'text', null, 'right');
                Show.setupEditableBox(this.$el, this.model, "email", "Enter Email", this.model.get('email'), 'text');
                Show.setupEditableBox(this.$el, this.model, "address", "Enter Address", this.model.get('address'), 'textarea', null, 'right');
            }
        });

        Show.views.addEducationForm = Application.Views.ItemView.extend({
            template: "enquiries/show/templates/add_education_form",

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
                    Application.Views.hideModal(Show.addEducationFormId);
                    this.trigger(Show.createEducationEvt, this);
                }
            }

        });

        Show.views.EducationField = Application.Views.ItemView.extend({
            template: "enquiries/show/templates/education_field",
            tagName: "div",
            className: "col-md-12",

            events: {
                "mouseenter": "toggleDelete",
                "mouseleave": "toggleDelete",
                "click .i-cancel": "deleteEducation"
            },

            deleteEducation: function(evt) {
                evt.preventDefault();
                this.trigger(Show.deleteEducationEvt, this);
            },

            toggleDelete: function (evt) {
                evt.preventDefault();
                var fieldId = this.model.get('programName');
//                $('#' + fieldId).toggleClass("basicBorder");
                $('#' + fieldId).find('.i-cancel').toggleClass("display-none");
            }

        });

        Show.views.AcademicComposite = Application.Views.CompositeView.extend({
            template: "enquiries/show/templates/academic_view",
            itemViewContainer: "#educationFields",
            itemView: Show.views.EducationField,

            initialize: function() {
                var that = this;
                this.on(Application.CHILD_VIEW + ":" + Show.deleteEducationEvt, function(childView) {
                    that.trigger(Show.deleteEducationEvt, childView);
                })
            },

            serializeData: function() {
                var data = this.model.toJSON();
                data.modalId = Show.addEducationFormId;
                return data;
            },

            events: {
                "click #addEducationInfo" : "showAddEducationModal"
            },

            showAddEducationModal: function(evt) {
                evt.preventDefault();
                this.trigger(Show.showAddEducationModalEvt, this);
            }
        });

        Show.views.Career = Application.Views.ItemView.extend({
            template: "enquiries/show/templates/career_view",

            onRender: function() {
                Backbone.Validation.bind(this);
                this.setupCareerView();
            },

            setupCareerView: function() {
                Show.setupSelect2EditableBox(this.$el, this.model, "countries", this.options.allCountries, "Add Country", this.options.addedCountries, 'right');
                Show.setupSelect2EditableBox(this.$el, this.model, "services", this.options.allServices, "Add Service", this.options.addedServices, 'right');
                Show.setupEditableBox(this.$el, this.model, "intake", "Enter Intake", this.model.get('intake'), 'text', null, 'right');
                Show.setupEditableBox(this.$el, this.model, "intakeYear", "Enter Intake year", this.model.get('intakeYear'), 'text');
            }
        });

        Show.views.Comment = Application.Views.ItemView.extend({
            template: "enquiries/show/templates/comment_view_row",
            tagName: "tr",

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

        Show.views.History = Application.Views.CompositeView.extend({
//            template: "enquiries/show/templates/history_view",
            template: "enquiries/show/templates/history_view_table",

            itemView: Show.views.Comment,
            itemViewContainer: "#historySection",

            events: {
                'click #addComment': 'addComment'
            },

            onRender: function() {
                console.log("On render");
                Backbone.Validation.bind(this);
                    var options = {
                        "oLanguage": {
                            "sEmptyTable": "No comments yet"
                        },
                        "sPaginationType": "full_numbers",
                        "iDisplayLength": 5,
                        "bFilter" : false,
                        "bLengthChange": false
                    };
                    Application.Views.addDatatable(this.$el.find('#historyTable'), options);
            },

            addComment: function(evt) {
                evt.preventDefault();
                var data = Backbone.Syphon.serialize(this);
                this.trigger(Show.addCommentEvt, data);
            }
        });

        Show.views.Admin = Application.Views.ItemView.extend({
            template: "enquiries/show/templates/admin_view",

            onRender: function() {
                Backbone.Validation.bind(this);
                this.setupAdminView();
            },

            setupAdminView: function() {
                Show.setupSelect2EditableBox(this.$el, this.model, "staff", this.options.allStaff, "Assigned To", this.options.addedStaff);
                Show.setupSelect2EditableBox(this.$el, this.model, "locations", this.options.allLocations, "Add Location", this.options.addedLocations);
                Show.setupEditableBox(this.$el, this.model, "enquiryStatus", "Add Status", this.model.get('enquiryStatus').id, 'select', this.options.allStatus);
                Show.setupEditableBox(this.$el, this.model, "remarks", "Enter Remarks", this.model.get('remarks'), 'textarea');
                Show.setupEditableBox(this.$el, this.model, "source", "Enter Source", this.model.get('source'), 'text');
                Show.setupDateTimeEditableBox(this.$el, this.model, "followUp", "Follow Up On", this.model.get('followUp'));
            }
        });

        //TODO All these need to be moved to the controller
        Show.setupEditableBox = function(el, model, id, emptyText, initialValue, type, source, placement){
            var successCB = function (response, value) {
                model.save(id, value, {
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
            };

            Application.Views.setupEditableBox(el, id, emptyText, initialValue, type, source, placement, successCB);
        };

        Show.setupDateTimeEditableBox = function(el, model, id, emptyText, initialValue){
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
                        Application.execute(Show.UPDATE_HISTORY_EVT, updatedStudent);
                    },

                    error: function(x, response) {
                        console.log("Error on server!! -- " + response);
                        return response.msg;
                    }
                })
            };

            Application.Views.setupDateTimeEditableBox(el, id, emptyText, initialValue, successCB);
        };



        Show.setupSelect2EditableBox = function(el, model, id, source, emptyText, initialValue, placement){
            var successCB = function(response, value) {
                console.log(value);
                model.save(id, value, {
                    wait: true,
                    patch: true,
                    success: function(updatedStudent){
                        console.log("Saved on server!!");
                        Application.execute(Show.UPDATE_HISTORY_EVT, updatedStudent);
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