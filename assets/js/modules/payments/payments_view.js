define([
//    "modules/payments/payments_setup"
], function () {
    Application.module("Payments", function (Payments, Application, Backbone, Marionette, $, _) {

        //***View Setup
        this.prefix = "Payments";
        this.templatePath = "js/modules/";
        this.views = {};

        this.template = function (str) {
            return this.prefix + '-' + str;
        };
        //***//

        Payments.addPaymentModalFormId = "addPaymentModal";
        Payments.SHOW_NEW_PAYMENT_MODAL = "show:new:payment:modal";
        Payments.CREATE_PAYMENT = "create:payment";

        Payments.views.Layout = Application.Views.Layout.extend({
            template: "views/templates/page_layout",
            regions: {
                tabsRegion: "#tabs",
                addButtonRegion: "#addButton",
                contentRegion: "#content"
            }
        });

        Payments.views.AddPaymentButton = Application.Views.ItemView.extend({
            template: "views/templates/tab_add_button",

            events: {
                "click" : "showAddPaymentModal"
            },

            showAddPaymentModal: function(evt){
                evt.preventDefault();
                this.trigger(Payments.SHOW_NEW_PAYMENT_MODAL);
            }

        });

        Payments.views.Tab = Application.Views.ItemView.extend({
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
                this.trigger(Payments.TAB_SELECTED, this);
            }

        });

        Payments.views.TabContainer = Application.Views.CompositeView.extend({
            template: "views/templates/tab_container",
            tagName: "span",
            itemViewContainer: "#tabsUL",
            itemView: Payments.views.Tab,

            initialize: function(){
                var that = this;
                this.on(Application.CHILD_VIEW + ":" + Payments.TAB_SELECTED, function(childView){
                    that.trigger(Payments.TAB_SELECTED, childView.model.get('id'));
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


        Payments.views.AddPaymentForm = Application.Views.ItemView.extend({
            template: "payments/templates/add_payment_form",
//            template: "header/show/templates/add_user_form",

            events: {
                "click #createNewPayment" : "createNewPayment"
            },

            onRender: function() {
                Backbone.Validation.bind(this);

                this.renderSelect(this.options.allServices, "#service");

                //Add datetime field
//                Application.Views.addDateTimePicker(this.$el.find('#startDateDiv'), null, {pickTime: false});
//                Application.Views.addDateTimePicker(this.$el.find('#endDateDiv'), moment().add('days', 30) ,{pickTime: false});

            },

            renderSelect :function (serviceIdToTextMap, element) {
                var that = this;
                _.each(serviceIdToTextMap, function(service){
                    that.$el.find(element).append("<option value='" + service.id + "'>" + service.text + "</option>");
                });
            },

            createNewPayment: function(evt) {
                evt.preventDefault();
                var data = Backbone.Syphon.serialize(this);
                this.model.set(Application.Views.trimFormData(data));

                var isValid = this.model.isValid(true);
                if (isValid) {
                    Application.Views.hideModal(Payments.addPaymentModalFormId);
                    this.trigger(Payments.CREATE_PAYMENT, this, data);
                }
            }

        });
    });
});