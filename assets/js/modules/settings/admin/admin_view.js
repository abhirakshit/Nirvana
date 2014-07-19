define([], function () {
    Application.module("Settings.Admin", function (Admin, Application, Backbone, Marionette, $, _) {

        //Setup
        this.prefix = "Settings";
        this.templatePath = "js/modules/";
        this.views = {};

        this.template = function (str) {
            return this.prefix + '-' + str;
        };

        Admin.deleteMetaEvt = "deleteMetaEvt";
        Admin.createMetaEvt = "createMetaEvt";
        Admin.showAddModalEvt = "showAddModalEvt";

        Admin.views.Layout = Application.Views.Layout.extend({
            template: "settings/admin/templates/admin_layout",

            regions : {
                locationsRegion: "#locations",
                servicesRegion: "#services",
                countriesRegion: "#countries",
                statusTypesRegion: "#statusTypes"
            }
        });

        Admin.views.MetaField = Application.Views.ItemView.extend({
            template: "settings/admin/templates/meta_field",
            tagName: "div",
            className: "col-md-12",

            events: {
                "mouseenter": "toggleDelete",
                "mouseleave": "toggleDelete",
                "click .i-cancel": "delete"
            },

            serializeData: function() {
                var data = this.model.toJSON();
                data.id = data.name.replace(/\s+/g, '');
                return data;
            },

            delete: function (evt) {
                evt.preventDefault();
                this.trigger(Admin.deleteMetaEvt, this);
            },

            toggleDelete: function (evt) {
                evt.preventDefault();
                //Trying to find id from name
                var fieldId = this.model.get('name').replace(/\s+/g, '');

                $('#' + fieldId).toggleClass("basicBorder");
                $('#' + fieldId).find('.i-cancel').toggleClass("display-none");
            }

        });

        Admin.views.MetaComposite = Application.Views.CompositeView.extend({
            template: "settings/admin/templates/meta_view",
            itemViewContainer: "#metaList",
            itemView: Admin.views.MetaField,

            initialize: function () {
                var that = this;
                this.on(Application.CHILD_VIEW + ":" + Admin.deleteMetaEvt, function (childView) {
                    that.trigger(Admin.deleteMetaEvt, childView.model);
                })
            },

            events: {
                "click #add": "add"
            },

            add: function (evt) {
                evt.preventDefault();
                this.trigger(Admin.showAddModalEvt, this);
            }
        });


        Admin.views.AddModalForm = Application.Views.ItemView.extend({
            template: "settings/admin/templates/add_meta_form",

            events: {
                "click #create": "create"
            },

            serializeData: function () {
                var data = this.model.toJSON();
                data.modalId = this.options.modalId;
                data.formHeader = this.options.formHeader;
                data.placeholder = this.options.placeholder;
                return data;
            },

            onRender: function () {
                Backbone.Validation.bind(this);
            },

            create: function (evt) {
                evt.preventDefault();
                var data = Backbone.Syphon.serialize(this);
                data.existingNames = this.options.existingNames;

                this.model.set(data);
                var isValid = this.model.isValid(true);
                if (isValid) {
                    Application.Views.hideModal(this.options.modalId);
                    this.trigger(Admin.createMetaEvt);
                }
            }

        });
    })
});