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

            events: {
                "click #submit" : "submit"
            },

            onRender: function() {
                Backbone.Validation.bind(this);

                var data = this.model.attributes;
                //Set duration
                if (this.model.get('duration')) {
                    var duration = moment.duration(Number(this.model.get('duration')));
                    data.duration_hr = duration.hours();
                    data.duration_min = duration.minutes();
                }

                Backbone.Syphon.deserialize(this, data);

                //Set service dropdown
                this.renderSelect(this.options.allServices, "#service", this.model.get('service'));

            },

            renderSelect :function (idToTextMap, element, object) {
                var that = this;
                _.each(idToTextMap, function(select){
                    if (object && select.id === object.id) {
                        that.$el.find(element).append("<option value=" + select.id + " selected=selected" + ">" + select.text + "</option>");
                    } else {
                        that.$el.find(element).append("<option value=" + select.id + ">" + select.text + "</option>");
                    }
                });
                this.$el.find(element).select2();
            },

            submit: function(evt) {
                evt.preventDefault();
                var data = Backbone.Syphon.serialize(this);
                this.model.set(data);

                var isValid = this.model.isValid(true);
                if (isValid) {
                    Application.Views.hideModal(this.model.get('modalId'));
                    this.trigger(Application.SUBMIT, this, data);
                }
            }

        });
    });
});