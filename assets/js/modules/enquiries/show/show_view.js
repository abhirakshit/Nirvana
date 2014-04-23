define([
], function () {
    Application.module("Enquiries.Show", function (Show, Application, Backbone, Marionette, $, _) {

        Show.addEducationFormId = 'addEducationModal';
        Show.showAddEducationModalEvt = "showAddEducationModalEvt";
        Show.createEducationEvt = "createEducationEvt";
        Show.deleteEducationEvt = "deleteEducationEvt";


        this.prefix = "Show";
        this.templatePath = "js/modules/";
        this.views = {};

        this.template = function (str) {
            return this.prefix + '-' + str;
        };


        Show.views.Layout = Application.Views.Layout.extend({
            template: "enquiries/show/templates/show_layout",
            className: "someClass",
            regions: {
                personalRegion: "#personal",
                careerRegion: "#career",
                academicRegion: "#academic",
                adminRegion: "#admin",
                historyRegion: "#history"
            }
        });


        Show.views.Personal = Application.Views.ItemView.extend({
            template: "enquiries/show/templates/personal_view",

//            serializeData: function(){
//                var data = this.model.toJSON();
//                data.firstName = data.user.firstName;
//                data.lastName = data.user.lastName;
//                data.phoneNumber = data.user.phoneNumber;
//                data.email = data.user.email;
//                data.address = data.user.address;
//                return data;
//            },

            onRender: function() {
                Backbone.Validation.bind(this);
                this.setupPersonalView();
            },

            setupPersonalView: function() {
                Show.setupEditableBox(this.$el, this.model, "firstName", "John", this.model.get('firstName'), 'text');
                Show.setupEditableBox(this.$el, this.model, "lastName", "", this.model.get('lastName'), 'text');
                Show.setupEditableBox(this.$el, this.model, "phoneNumber", "Enter Phone", this.model.get('phoneNumber'), 'text');
                Show.setupEditableBox(this.$el, this.model, "email", "Enter Email", this.model.get('email'), 'text');
                Show.setupEditableBox(this.$el, this.model, "address", "Enter Address", this.model.get('address'), 'textarea');
            }
        });



//        Show.EducationForm = Application.Entities.Model.extend({
//            validation: {
//                programName: {
//                    required : true
//                },
//                score: {
//                    required : true
//                }
//
//            }
//        });

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
                this.model.set(data);

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
                "click .i-cancel": "delete"
            },

            delete: function(evt) {
                evt.preventDefault();
//                console.log('Delete edu...');
                this.trigger(Show.deleteEducationEvt, this);
            },

            toggleDelete: function (evt) {
                evt.preventDefault();
                var fieldId = this.model.get('programName');
                $('#' + fieldId).toggleClass("basicBorder");
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
//                    console.log('Delete edu...');
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



//        Show.views.AcademicComposite = Application.Views.ItemView.extend({
//            template: "enquiries/show/templates/academic_view",
//
////            onRender: function() {
//////                Backbone.Validation.bind(this);
//////                this.setupAcademicView();
////            },
//
//            setupAcademicView: function() {
////                Show.setupEditableBox(this.$el, this.model, "highSchoolScore", "Enter X Score", this.model.get('highSchoolScore'), 'text');
////                Show.setupEditableBox(this.$el, this.model, "seniorSecondaryScore", "Enter XII Score", this.model.get('seniorSecondaryScore'), 'text');
////                Show.setupEditableBox(this.$el, this.model, "graduationScore", "Enter Grad Score", this.model.get('graduationScore'), 'text');
////                Show.setupEditableBox(this.$el, this.model, "satScore", "Enter SAT Score", this.model.get('satScore'), 'text');
////                Show.setupEditableBox(this.$el, this.model, "toeflScore", "Enter TOEFL Score", this.model.get('toeflScore'), 'text');
////                Show.setupEditableBox(this.$el, this.model, "ieltsScore", "Enter IELTS Score", this.model.get('ieltsScore'), 'text');
////                Show.setupEditableBox(this.$el, this.model, "greScore", "Enter GRE Score", this.model.get('greScore'), 'text');
////                Show.setupEditableBox(this.$el, this.model, "gmatScore", "Enter GMAT Score", this.model.get('gmatScore'), 'text');
//            }
//        });

        Show.views.Career = Application.Views.ItemView.extend({
            template: "enquiries/show/templates/career_view",

            onRender: function() {
                Backbone.Validation.bind(this);
                this.setupCareerView();
            },

            setupCareerView: function() {
                Show.setupSelect2EditableBox(this.$el, this.model, "countries", this.options.allCountries, "Add Country", this.options.addedCountries);
                Show.setupSelect2EditableBox(this.$el, this.model, "services", this.options.allServices, "Add Service", this.options.addedServices);
                Show.setupEditableBox(this.$el, this.model, "intake", "Enter Program", this.model.get('intake'), 'text');
                Show.setupEditableBox(this.$el, this.model, "intakeYear", "Enter Intake year", this.model.get('intakeYear'), 'text');
            }
        });

        Show.views.Comment = Application.Views.ItemView.extend({
            template: "enquiries/show/templates/comment_view",

            templateHelpers: {
                showFormattedDate: function(){
                    return moment(this.createdAt).format("ddd, MMM Do 'YY, h:mm a");
                }
            }
        }),

        Show.views.History = Application.Views.CompositeView.extend({
            template: "enquiries/show/templates/history_view",

            itemView: Show.views.Comment,
            itemViewContainer: "#historySection",

            events: {
                'click #addComment': 'addComment'
            },

            addComment: function(evt) {
                evt.preventDefault();
            }

        }),

        Show.views.Admin = Application.Views.ItemView.extend({
            template: "enquiries/show/templates/admin_view",

            onRender: function() {
                Backbone.Validation.bind(this);
                this.setupAdminView();
            },

            setupAdminView: function() {
                var followUp = moment(this.model.get('followUp')).format(Show.dateFormat);
//                console.log(moment(this.model.get('followUp')).format(Show.dateFormat));
                Show.setupSelect2EditableBox(this.$el, this.model, "staff", this.options.allStaff, "Assigned To", this.options.addedStaff);
                Show.setupEditableBox(this.$el, this.model, "enquiryStatus", "Add Status", this.model.get('enquiryStatus').id, 'select', this.options.allStatus);
                Show.setupEditableBox(this.$el, this.model, "remarks", "Enter Remarks", this.model.get('remarks'), 'textarea');
//                Show.setupComboBoxEditableBox(this.$el, this.model, "followUp", "Follow Up On", this.model.get('followUp'));
                Show.setupComboBoxEditableBox(this.$el, this.model, "followUp", "Follow Up On", followUp);
            }
        });



        //TODO All these need to be moved to the controller
        Show.setupEditableBox = function(el, model, id, emptyText, initialValue, type, source){
            el.find("#" + id).editable({
                type: type,
                title: emptyText,
                emptytext: emptyText,
                value: initialValue,
                source: source, //For DropDowns/Selects
                success: function(response, value) {
                    console.log("[" + id + ":" + value + "]");
                    model.save(id, value, {
                        wait: true,
                        patch: true,
                        success: function(newModel){
                            console.log("Saved on server!!")
                        },

                        error: function(x, response) {
                            console.log("Error on server!! -- " + response)
                            return response;
                        }
                    })
                }
            })
        };

        Show.dateFormat = 'DD-MM-YYYY HH:mm';
        Show.setupComboBoxEditableBox = function(el, model, id, emptyText, initialValue){
            el.find("#" + id).editable({
                type: 'combodate',
                title: emptyText,
                emptytext: emptyText,
                value: initialValue,
                format: Show.dateFormat,
                viewformat: "MMM D, YYYY hh:mm a",
                template: 'D MMM YYYY hh:mm a',
                combodate: {
                    minYear: 2010,
                    maxYear: 2020,
                    minuteStep: 15
                },
                success: function(response, value) {
                    console.log("[" + id + ":" + value + "]");
                    if(!value) {
                        console.log("No value!!!");
                        return;
                    }

                    model.save(id, value, {
                        wait: true,
                        patch: true,
                        success: function(newModel){
                            console.log("Saved on server!!")
                        },

                        error: function(x, response) {
                            console.log("Error on server!! -- " + response)
                            return response;
                        }
                    })
                }
            })
        };

        Show.setupSelect2EditableBox = function(el, model, id, source, emptyText, initialValue){
            el.find('#' + id).editable({
                source: source,
                type: "select2",
                value: initialValue,
                emptytext: emptyText,
                title: emptyText,
                select2: {
                    placeholder: emptyText,
                    multiple: true
                },
                success: function(response, value) {
                    console.log(value);

                    model.save(id, value, {
                        wait: true,
                        patch: true,
                        success: function(newModel){
                            console.log("Saved on server!!")
                        },

                        error: function(x, response) {
                            console.log("Error on server!! -- " + response)
                            return response;
                        }
                    });
                }
            });
        }

    });
});