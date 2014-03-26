define([
    "modules/profile/profile_setup"
], function () {
    Application.module("Profile", function (Profile, Application, Backbone, Marionette, $, _) {



        Profile.views.StudentProfileLayout = Application.Views.Layout.extend({
            template: "profile/student/templates/student_layout",
            regions: {
                institutionRegion: "#institution",
                careerRegion: "#career",
                academicRegion: "#academic",
                personalRegion: "#personal"
            }
        });


        Profile.views.InstitutionalView = Application.Views.ItemView.extend({
            template: "profile/student/templates/institutional_view",

            onRender: function() {
                Backbone.Validation.bind(this);
                this.setupInstitutionView();
            },

            setupInstitutionView: function() {
                Profile.setupSelect2EditableBox(this.$el, this.model, "schoolId", this.options.allSchoolsMap, "Enter School Name", this.model.get('school').id);
                Profile.setupSelect2EditableBox(this.$el, this.model, "ownerId", this.options.allCounselorsMap, "Enter Counselor Name", this.model.get('ownerId'));
            }
        });

        Profile.views.CareerView = Application.Views.ItemView.extend({
            template: "profile/student/templates/career_view",

            onRender: function() {
                Backbone.Validation.bind(this);
                this.setupCareerView();
            },

            setupCareerView: function() {
                Profile.setupSelect2EditableBox(this.$el, this.model, "countryInterested", this.options.allCountriesMap, "Select Country", this.model.get('countryInterested'));
                Profile.setupSelect2EditableBox(this.$el, this.model, "fieldInterested", this.options.allStreamsMap, "Select Field", this.model.get('fieldInterested'));
                Profile.setupSelect2EditableBox(this.$el, this.model, "programInterested", this.options.allOccupationsMap, "Select Program", this.model.get('programInterested'));
            }
        });

        Profile.views.AcademicView = Application.Views.ItemView.extend({
            template: "profile/student/templates/academic_view",

            onRender: function() {
                Backbone.Validation.bind(this);
                this.setupAcademicView();
            },

            setupEditableBox: function(id, emptyText, initialValue, type){
                var that = this;
                this.$el.find("#" + id).editable({
                    type: type,
                    emptytext: emptyText,
                    value: initialValue,
                    success: function(response, value) {
                        that.model.save(id, value, {
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
            },

            setupAcademicView: function() {
                this.setupEditableBox("highSchoolScore", "Enter Xth score/grade", this.model.get('highSchoolScore'), "text");
                this.setupEditableBox("seniorSecondaryScore", "Enter XIIth score/grade", this.model.get('seniorSecondaryScore'), "text");
                this.setupEditableBox("gre", "Enter GRE score/grade", this.model.get('gre'), "text");
                this.setupEditableBox("gmat", "Enter GMAT score/grade", this.model.get('gmat'), "text");
                this.setupEditableBox("sat", "Enter SAT score/grade", this.model.get('sat'), "text");
                this.setupEditableBox("toefl", "Enter TOEFL score/grade", this.model.get('toefl'), "text");
                this.setupEditableBox("ielts", "Enter IELTS score/grade", this.model.get('ielts'), "text");
                this.setupEditableBox("remarks", "Enter any other details", this.model.get('remarks'), "textarea");
            }
        });


        Profile.setupSelect2EditableBox = function(el, model, id, source, emptyText, initialValue){
            el.find('#' + id).editable({
                source: source,
                type: "select2",
                value: initialValue,
                emptytext: emptyText,
                select2: {
                    placeholder: emptyText
//                    multiple: true
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