define([
//    "modules/topics/topics_setup"
], function () {
    Application.module("Topics", function (Topics, Application, Backbone, Marionette, $, _) {

        //***View Setup
        this.prefix = "Topics";
        this.templatePath = "js/modules/";
        this.views = {};

        this.template = function (str) {
            return this.prefix + '-' + str;
        };
        //***//

        Topics.addTopicModalFormId = "addTopicModal";
        Topics.SHOW_NEW_TOPIC_MODAL = "show:new:topic:modal";
        Topics.CREATE_TOPIC = "create:topic";

        Topics.views.Layout = Application.Views.Layout.extend({
            template: "views/templates/page_layout",
            regions: {
                tabsRegion: "#tabs",
                addButtonRegion: "#addButton",
                contentRegion: "#content"
            }
        });

        Topics.views.AddTopicButton = Application.Views.ItemView.extend({
            template: "views/templates/tab_add_button",

            events: {
                "click" : "showAddTopicModal"
            },

            showAddTopicModal: function(evt){
                evt.preventDefault();
                this.trigger(Topics.SHOW_NEW_TOPIC_MODAL);
            }

        });

        Topics.views.Tab = Application.Views.ItemView.extend({
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
                this.trigger(Topics.TAB_SELECTED, this);
            }

        });

        Topics.views.TabContainer = Application.Views.CompositeView.extend({
            template: "views/templates/tab_container",
            tagName: "span",
            itemViewContainer: "#tabsUL",
            itemView: Topics.views.Tab,

            initialize: function(){
                var that = this;
                this.on(Application.CHILD_VIEW + ":" + Topics.TAB_SELECTED, function(childView){
                    that.trigger(Topics.TAB_SELECTED, childView.model.get('id'));
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


        Topics.views.AddTopicForm = Application.Views.ItemView.extend({
            template: "topics/templates/add_topic_form",
//            template: "header/show/templates/add_user_form",

            events: {
                "click #createNewTopic" : "createNewTopic"
            },

            onRender: function() {
                Backbone.Validation.bind(this);

                this.renderServiceSelect(this.options.allServices, "#service");

                //Add datetime field
//                Application.Views.addDateTimePicker(this.$el.find('#startDateDiv'), null, {pickTime: false});
//                Application.Views.addDateTimePicker(this.$el.find('#endDateDiv'), moment().add('days', 30) ,{pickTime: false});

            },

            renderServiceSelect :function (serviceIdToTextMap, element) {
                var that = this;
                _.each(serviceIdToTextMap, function(service){
                    that.$el.find(element).append("<option value='" + service.id + "'>" + service.text + "</option>");
                });
            },

            createNewTopic: function(evt) {
                evt.preventDefault();
                var data = Backbone.Syphon.serialize(this);
                this.model.set(data);

                var isValid = this.model.isValid(true);
                if (isValid) {
                    Application.Views.hideModal(Topics.addTopicModalFormId);
                    this.trigger(Topics.CREATE_TOPIC, this, data);
                }
            }

        });
    });
});