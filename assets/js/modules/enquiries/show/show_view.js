define([
], function () {
    Application.module("Enquiries.Show", function (Show, Application, Backbone, Marionette, $, _) {

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
                institutionRegion: "#institution",
                careerRegion: "#career",
                academicRegion: "#academic"
            }
        });


        Show.views.Personal = Application.Views.ItemView.extend({
            template: "enquiries/show/templates/personal_view",

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

        Show.views.Academic = Application.Views.ItemView.extend({
            template: "enquiries/show/templates/academic_view",

            onRender: function() {
                Backbone.Validation.bind(this);
                this.setupAcademicView();
            },

            setupAcademicView: function() {
                Show.setupEditableBox(this.$el, this.model, "highSchoolScore", "Enter X Score", this.model.get('highSchoolScore'), 'text');
                Show.setupEditableBox(this.$el, this.model, "seniorSecondaryScore", "Enter XII Score", this.model.get('seniorSecondaryScore'), 'text');
                Show.setupEditableBox(this.$el, this.model, "graduationScore", "Enter Grad Score", this.model.get('graduationScore'), 'text');
                Show.setupEditableBox(this.$el, this.model, "satScore", "Enter SAT Score", this.model.get('satScore'), 'text');
                Show.setupEditableBox(this.$el, this.model, "toeflScore", "Enter TOEFL Score", this.model.get('toeflScore'), 'text');
                Show.setupEditableBox(this.$el, this.model, "ieltsScore", "Enter IELTS Score", this.model.get('ieltsScore'), 'text');
                Show.setupEditableBox(this.$el, this.model, "greScore", "Enter GRE Score", this.model.get('greScore'), 'text');
                Show.setupEditableBox(this.$el, this.model, "gmatScore", "Enter GMAT Score", this.model.get('gmatScore'), 'text');
            }
        });

        Show.views.Career = Application.Views.ItemView.extend({
            template: "enquiries/show/templates/career_view",

            onRender: function() {
                Backbone.Validation.bind(this);
                this.setupCareerView();
            },

            setupCareerView: function() {
                var countries = [
                    {id: 'gb', text: 'Great Britain'},
                    {id: 'us', text: 'United States'},
                    {id: 'ru', text: 'Russia'}
                ];

//                Show.setupSelect2EditableBox(this.$el, this.model, "countries", countries, "Add Country", 'ru, us');
                Show.setupSelect2EditableBox(this.$el, this.model, "countries", this.options.allCountries, "Add Country", this.options.addedCountries);
                Show.setupSelect2EditableBox(this.$el, this.model, "services", this.options.allServices, "Add Service", this.options.addedServices);
//                Profile.setupSelect2EditableBox(this.$el, this.model, "countries", countries, "Add Country", this.model.get('countries'));
//                Profile.setupSelect2EditableBox(this.$el, this.model, "services", countries, "Add Service", this.model.get('services'));

//                Profile.setupSelect2EditableBox(this.$el, this.model, "countries", this.options.allCountriesMap, "Add Country", this.model.get('countries'));
//                Profile.setupSelect2EditableBox(this.$el, this.model, "services", this.options.allStreamsMap, "Add Service", this.model.get('services'));

                Show.setupEditableBox(this.$el, this.model, "program", "Enter Program", this.model.get('program'), 'text');
                Show.setupEditableBox(this.$el, this.model, "intake", "Enter Intake", this.model.get('intake'), 'text');
            }
        });


        Show.setupEditableBox = function(el, model, id, emptyText, initialValue, type){
//            var that = this;
            el.find("#" + id).editable({
                type: type,
                emptytext: emptyText,
                value: initialValue,
                success: function(response, value) {
                    model.save(id, value, {
                        wait: true,
//                        patch: true,
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
                select2: {
                    placeholder: emptyText,
                    multiple: true
                },
                success: function(response, value) {
                    console.log(value);

//                    model.save(id, value, {
//                        wait: true,
////                        patch: true,
//                        success: function(newModel){
//                            console.log("Saved on server!!")
//                        },
//
//                        error: function(x, response) {
//                            console.log("Error on server!! -- " + response)
//                            return response;
//                        }
//                    });
                }
            });
        }

    });
});