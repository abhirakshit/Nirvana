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
                Show.setupEditableBox(this.$el, this.model, "lastName", "Smith", this.model.get('lastName'), 'text');
                Show.setupEditableBox(this.$el, this.model, "phoneNumber", "999-999-9999", this.model.get('phoneNumber'), 'text');
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