define([
//    "modules/batches/batches_setup"
], function () {
    Application.module("Batches", function (Batches, Application, Backbone, Marionette, $, _) {

        //***View Setup
        this.prefix = "Batches";
        this.templatePath = "js/modules/";
        this.views = {};

        this.template = function (str) {
            return this.prefix + '-' + str;
        };
        //***//

        Batches.addBatchModalFormId = "addBatchModal";
        Batches.SHOW_NEW_BATCH_MODAL = "show:new:batch:modal";
        Batches.CREATE_BATCH = "create:batch";

        Batches.views.Layout = Application.Views.Layout.extend({
            template: "views/templates/page_layout",
            regions: {
                tabsRegion: "#tabs",
                addButtonRegion: "#addButton",
                contentRegion: "#content"
            }
        });

        Batches.views.AddBatchButton = Application.Views.ItemView.extend({
            template: "views/templates/tab_add_button",

            events: {
                "click" : "showAddBatchModal"
            },

            showAddBatchModal: function(evt){
                evt.preventDefault();
                this.trigger(Batches.SHOW_NEW_BATCH_MODAL);
            }

        });

        Batches.views.Tab = Application.Views.ItemView.extend({
            template: "views/templates/tab",
            tagName: "li",

            events: {
                "click": "showView"
            },

            select: function() {
                this.$el.addClass("active")
            },

            unSelect: function() {
                this.$el.removeClass("active")
            },

            showView: function(evt) {
                evt.preventDefault();
                console.log("Show Tab Content: " + this.model.get('text'));
                this.trigger(Batches.TAB_SELECTED, this);
            }

        });

        Batches.views.TabContainer = Application.Views.CompositeView.extend({
            template: "views/templates/tab_container",
            tagName: "span",
            itemViewContainer: "#tabsUL",
            itemView: Batches.views.Tab,

            initialize: function(){
                var that = this;
                this.on(Application.CHILD_VIEW + ":" + Batches.TAB_SELECTED, function(childView){
                    that.trigger(Batches.TAB_SELECTED, childView.model.get('id'));
                });
            },

            events: {
                "click #createEnquiry" : "createEnquiry"
            },

            createEnquiry: function(evt) {
                evt.preventDefault();
                this.trigger(Application.CREATE_STUDENT);
            },

            unSelectAll: function() {
                this.children.each(function(tab){
                    tab.unSelect();
                });
            },

            selectTabView: function(tabId) {
                this.unSelectAll();
                var tabView = this.children.find(function(tab){
                    return tab.model.get('id') == tabId;
                });

                tabView.select();
            }

        });


        Batches.views.AddBatchForm = Application.Views.ItemView.extend({
            template: "batches/templates/add_batch_form",
//            template: "header/show/templates/add_user_form",

            events: {
                "click #createNewBatch" : "createNewBatch"
            },

            onRender: function() {
                Backbone.Validation.bind(this);

                this.renderServiceSelect(this.options.allServices, "#service");

                //Add datetime field
                Application.Views.addDateTimePicker(this.$el.find('#startDateDiv'), null, {pickTime: false});
                Application.Views.addDateTimePicker(this.$el.find('#endDateDiv'), moment().add('days', 30) ,{pickTime: false});

            },

            renderServiceSelect :function (serviceIdToTextMap, element) {
                var that = this;
                _.each(serviceIdToTextMap, function(service){
                    that.$el.find(element).append("<option value='" + service.id + "'>" + service.text + "</option>");
                });
            },

            createNewBatch: function(evt) {
                evt.preventDefault();
                var data = Backbone.Syphon.serialize(this);
                this.model.set(data);

                var isValid = this.model.isValid(true);
                if (isValid) {
                    Application.Views.hideModal(Batches.addBatchModalFormId);
                    this.trigger(Batches.CREATE_BATCH, this, data);
                }
            }

        });
    });
});