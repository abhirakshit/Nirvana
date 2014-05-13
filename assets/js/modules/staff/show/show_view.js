define([
], function () {
    Application.module("Staff.Show", function (Show, Application, Backbone, Marionette, $, _) {


        this.prefix = "Show";
        this.templatePath = "js/modules/";
        this.views = {};

        this.template = function (str) {
            return this.prefix + '-' + str;
        };

        Show.STAFF_EDIT_SAVE = 'staff:edit:save';
        Show.views.Layout = Application.Views.Layout.extend({
            initialize: function () {
                console.log('I am in staff:show view');
            },

            template: "staff/show/templates/show_layout",
            className: "someClass",
            regions: {
                personalRegion: "#personal",
                careerRegion: "#career",
                //locationRegion: "#location",
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
                // Show.setupEditableBox(this.$el, this.model, "firstName", "John", this.model.get('firstName'), 'text', null, 'right');
                Show.setupEditableBox(this, "firstName", "First Name", this.model.get('firstName'), 'text', null, 'right');
                Show.setupEditableBox(this, "lastName", "Last Name", this.model.get('lastName'), 'text', null, 'right');
                Show.setupEditableBox(this, "phoneNumber", "Enter Phone", this.model.get('phoneNumber'), 'text', null, 'right');
                Show.setupEditableBox(this, "email", "Enter Email", this.model.get('email'), 'text', null, 'right');
                Show.setupEditableBox(this, "address", "Enter Address", this.model.get('address'), 'textarea', null, 'right');
                //Show.setupSelect2EditableBox(this, "location", "Add Location", this.model.get('address'), 'textarea', null, 'right');
            Show.setupSelect2EditableBox(this, "location", this.options.allLocations, "Add Location", this.options.addedLocation, 'right');

            }
        });



        // Show.setupEditableBox = function(el, model, id, emptyText, initialValue, type, source, placement){
        Show.setupEditableBox = function(view, id, emptyText, initialValue, type, source, placement){
          
            var successCB =  function (response,value){

                console.log('in success..');

                view.trigger(Show.STAFF_EDIT_SAVE, view.model, id, value);

            };

           Application.Views.setupEditableBox(view.$el, id, emptyText, initialValue, type, source, placement, successCB) 

        };

        Show.setupSelect2EditableBox = function(view, id, source , emptyText, initialValue, placement){
          
            var successCB =  function (response,value){

                console.log('in success..');

                view.trigger(Show.STAFF_EDIT_SAVE, view.model, id, value);

            };

           Application.Views.setupSelect2EditableBox(view.$el, id, source, emptyText, initialValue, placement, successCB) 

        };




        
    });
});