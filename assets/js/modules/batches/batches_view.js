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

        Batches.views.Layout = Application.Views.Layout.extend({
            template: "views/templates/page_layout",
            regions: {
                tabsRegion: "#tabs",
                contentRegion: "#ontent"
            }
        });

//        var tabHtml = "<a href='#'><%=args.text%></a>";
        Batches.views.Tab = Application.Views.ItemView.extend({
            template: "views/templates/tab",
            tagName: "li",

//            template: function(serialized_model) {
//                return _.template(tabHtml,
//                    {text: serialized_model.text},
//                    {variable: 'args'});
//            },

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
//            template: "batches/templates/tab_container",
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


//        Batches.views.addStudentForm = Application.Views.ItemView.extend({
//            template: "batches/templates/add_student_form",
//
//            events: {
//                "click #createNewStudent" : "createNewStudent"
//            },
//
//            onRender: function() {
//                Backbone.Validation.bind(this);
//
//                console.log("Add picker");
//                //Add datetime field
//                Application.Views.addDateTimePicker(this.$el.find('#followUpDiv'));
//
//                //TODO Add Assigned to
//
//
//                //TODO Add status
//
//            },
//
//            createNewStudent: function(evt) {
//                evt.preventDefault();
//                var data = Backbone.Syphon.serialize(this);
//                this.model.set(data);
//
//                var isValid = this.model.isValid(true);
//                if (isValid) {
//                    Application.Views.hideModal(Batches.addStudentModalFormId);
//                    this.trigger(Batches.createStudentEvt, this, data);
//                }
//            }
//
//        });
    });
});