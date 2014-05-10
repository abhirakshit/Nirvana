define([
], function () {
    Application.module("Staff.Show", function (Show, Application, Backbone, Marionette, $, _) {


        this.prefix = "Show";
        this.templatePath = "js/modules/";
        this.views = {};

        this.template = function (str) {
            return this.prefix + '-' + str;
        };


        Show.views.Layout = Application.Views.Layout.extend({
            initialize: function () {console.log('I am in staff:show view');},
            template: "staff/show/templates/show_layout",
            className: "someClass",
            regions: {
                personalRegion: "#personal",
                careerRegion: "#career",
                locationRegion: "#location",
                adminRegion: "#admin",
                historyRegion: "#history"
            }
        });


        Show.views.Personal = Application.Views.ItemView.extend({
            template: "staff/show/templates/personal_view",

            onRender: function() {
                Backbone.Validation.bind(this);
                this.setupProfile();
            },

            setupProfile: function() {
                Show.setupEditableBox(this.$el, this.model, "firstName", "John", this.model.get('firstName'), 'text');
                Show.setupEditableBox(this.$el, this.model, "lastName", "", this.model.get('lastName'), 'text');
                Show.setupEditableBox(this.$el, this.model, "phoneNumber", "Enter Phone", this.model.get('phoneNumber'), 'text');
                Show.setupEditableBox(this.$el, this.model, "email", "Enter Email", this.model.get('email'), 'text');
                Show.setupEditableBox(this.$el, this.model, "address", "Enter Address", this.model.get('address'), 'textarea');
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
            template: "staff/show/templates/location_view",
            itemViewContainer: "#locationFields",
            itemView: Show.views.LocationField,

            initialize: function() {
                var that = this;
                this.on(Application.CHILD_VIEW + ":" + Show.deleteEducationEvt, function(childView) {
//                    console.log('Delete edu...');
                    that.trigger(Show.deleteLocationEvt, childView);
                })
            },

            serializeData: function() {
                var data = this.model.toJSON();
                data.modalId = Show.addLocationFormId;
                return data;
            },

            events: {
                "click #addLocationInfo" : "showAddLocationModal"
            },

            showAddLocationModal: function(evt) {
                evt.preventDefault();
                this.trigger(Show.showAddLocationModalEvt, this);
            }
        });







        Show.setupEditableBox = function(el, model, id, emptyText, initialValue, type, source){
            var that = this;
            el.find("#" + id).editable({
                type: type,
                title: emptyText,
                emptytext: emptyText,
                value: initialValue,
                source: source, //For DropDowns/Selects
                success: function(response, value) {
                    console.log("[" + id + ":" + value + "]");
//                    console.log(model.get('url'));
//                    console.log(model.get('urlRoot'));
                    model.save(id, value, {
                        wait: true,
                        patch: true,
                        success: function(updatedStudent){
                            console.log("Saved on server!!");
                            Application.execute(Show.UPDATE_HISTORY_EVT, updatedStudent);
                        },

                        error: function(x, response) {
                            console.log("Error on server!! -- " + response.msg)
                            return response.msg;
                        }
                    })
                }
            })
        };

        Show.setupComboBoxEditableBox = function(el, model, id, emptyText, initialValue){
            el.find("#" + id).editable({
                type: 'combodate',
                title: emptyText,
                emptytext: emptyText,
                value: initialValue,
                format: Show.dateFormat,
                template: 'D MMM YYYY hh:mm a', //Template used for displaying dropdowns.
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
                        success: function(updatedStudent){
                            console.log("Saved on server!!");
                            Application.execute(Show.UPDATE_HISTORY_EVT, updatedStudent);
                        },

                        error: function(x, response) {
                            console.log("Error on server!! -- " + response)
                            return response.msg;
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
                }
            });
        }

    });
});