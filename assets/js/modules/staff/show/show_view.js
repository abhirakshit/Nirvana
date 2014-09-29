define([], function () {
    Application.module("Staff.Show", function (Show, Application, Backbone, Marionette, $, _) {
        this.prefix = "Show";
        this.templatePath = "js/modules/";
        this.views = {};

        this.template = function (str) {
            return this.prefix + '-' + str;
        };

        Show.STAFF_EDIT_SAVE = 'staff:edit:save';
//        Show.STAFF_EDIT_SAVE = 'staff:edit:save';
        Show.views.Layout = Application.Views.Layout.extend({
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

//            serializeData: function() {
//                var staff = this.model.toJSON();
////                staff.statusChange = "Deactivate";
//                staff.statusChange = "Activate";
//                return staff;
//            },

            events: {
                "click #statusBtn": "toggleStatus"
            },

            toggleStatus: function (evt) {
                evt.preventDefault();
                var statusVal;
                if (this.model.get('user').status == Application.USER_STATUS_ACTIVE) {
                    statusVal = Application.USER_STATUS_INACTIVE;
                } else {
                    statusVal = Application.USER_STATUS_ACTIVE;
                }
                this.trigger(Show.STAFF_EDIT_SAVE, this.model, "status", statusVal);
                Application.Views.toggleBtnState(this.$el, "#statusBtn");
            },

            onRender: function () {
                Backbone.Validation.bind(this);
                this.setupProfile();
                if (this.model.get('user').status == Application.USER_STATUS_INACTIVE) {
                    Application.Views.toggleBtnState(this.$el, "#statusBtn");
                }
            },

            setupProfile: function () {
                Show.setupEditableBox(this, "firstName", "First Name", this.model.get('firstName'), 'text', null, 'right');
                Show.setupEditableBox(this, "lastName", "Last Name", this.model.get('lastName'), 'text', null, 'right');
                Show.setupEditableBox(this, "phoneNumber", "Enter Phone", this.model.get('phoneNumber'), 'text', null, 'right');
                Show.setupEditableBox(this, "email", "Enter Email", this.model.get('email'), 'text', null, 'right');
                Show.setupEditableBox(this, "address", "Enter Address", this.model.get('address'), 'textarea', null, 'right');
                Show.setupSelect2EditableBox(this, "location", this.options.allLocations, "Add Location", this.options.addedLocation, 'right');

            }
        });

        Show.setupEditableBox = function (view, id, emptyText, initialValue, type, source, placement) {
            var successCB = function (response, value) {
                view.trigger(Show.STAFF_EDIT_SAVE, view.model, id, value);
            };

            Application.Views.setupEditableBox(view.$el, id, emptyText, initialValue, type, source, placement, successCB)
        };

        Show.setupSelect2EditableBox = function (view, id, source, emptyText, initialValue, placement) {
            var successCB = function (response, value) {
                view.trigger(Show.STAFF_EDIT_SAVE, view.model, id, value);
            };

            Application.Views.setupSelect2EditableBox(view.$el, id, source, emptyText, initialValue, placement, successCB)
        };

    });
});