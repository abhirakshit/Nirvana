define([
    //Views
    "modules/payments/payments_view",

    //SubModules
    "modules/payments/list/all/payments_all_app",
//    "modules/payments/content/closed/closed_app",
//    "modules/payments/content/my/my_app",
//    "modules/payments/show/show_app",

    //Models
    "modules/entities/user",
//    "modules/entities/comment",
    "modules/entities/service",
//    "modules/entities/education",
//    "modules/entities/enquiryStatus"
    "modules/entities/topic"
], function () {
    Application.module("Payments", function (Payments, Application, Backbone, Marionette, $, _) {

        //Event
        Payments.TAB_SELECTED = "tab:selected";

        //Enquiry Tab Id's
        Payments.CURRENT_TAB = "current";
        Payments.ALL_TAB = "all";
//        Payments.CLOSED_TAB = "closed";

        var tabCollection = new Application.Entities.Collection([
//            new Application.Entities.Model({text:"Current", id: Payments.CURRENT_TAB}),
            new Application.Entities.Model({text:"All", id: Payments.ALL_TAB})
//            new Application.Entities.Model({text:"Closed", id: Payments.CLOSED_TAB})
        ]);

        Payments.Controller = Application.Controllers.Base.extend({
            initialize: function () {
                var user = Application.request(Application.GET_LOGGED_USER);
                var allServices = Application.request(Application.GET_SERVICES);
                var tabId = this.options.tabId;
//                var studentId = this.options.studentId;

                this.layout = this.getLayout();

                this.listenTo(this.layout, Application.SHOW, function () {
//                    if (studentId) {
//                        this.showNavTabs();
//                        this.showEnquiry(studentId);
//                    } else {
                        if (!tabId) //Show default tab
                            tabId = Payments.ALL_TAB;
                        this.showNavTabs(tabId, allServices);
                        this.showTab(tabId);
//                    }
                });

                this.show(this.layout, {
                    loading: {
                        entities: [user, allServices]
                    }
                });
            },

            showNavTabs: function (tabId, allServices) {
                var tabContainerView = new Payments.views.TabContainer({
                    collection: tabCollection
//                    model: new Application.Entities.Model({
//                        modalId: Payments.addStudentModalFormId
//                    })
                });
                this.layout.tabsRegion.show(tabContainerView);
                if (tabId) {
                    tabContainerView.selectTabView(tabId);
                    Application.navigate(Payments.rootRoute + "/" +tabId);
                }

                var that = this;
                this.listenTo(tabContainerView, Payments.TAB_SELECTED, function(tabId){
                    that.showTab(tabId);
                    tabContainerView.selectTabView(tabId);
                    Application.navigate(Payments.rootRoute + "/" +tabId);
                });


                //Show the add button
                var addPaymentButtonView = new Payments.views.AddPaymentButton({
                    model: new Application.Entities.Model({
                        modalId: Payments.addPaymentModalFormId,
                        text: "New Payment"
                    })
                });
//                this.listenTo(addPaymentButtonView, Payments.SHOW_NEW_PAYMENT_MODAL, this.showNewPaymentModal(allServices));
                this.listenTo(addPaymentButtonView, Payments.SHOW_NEW_PAYMENT_MODAL, function(){
                    that.showNewPaymentModal(allServices)
                });
                this.layout.addButtonRegion.show(addPaymentButtonView);

            },

            showNewPaymentModal: function(allServices) {
                var newPayment = Application.request(Application.GET_PAYMENT);
                newPayment.attributes.modalId = Payments.addPaymentModalFormId;
                var addPaymentFormView = new Payments.views.AddPaymentForm({
                    model: newPayment,
                    allServices: allServices.getIdToTextMap("name")
                });

//                var that = this;
                addPaymentFormView.on(Payments.CREATE_PAYMENT, function(modalFormView, data){

                    //Save duration value in ms
                    var duration = moment.duration({
                        minutes: data.duration_min,
                        hours: data.duration_hr
                    });

                    data.duration = duration._milliseconds

                    modalFormView.model.save(data, {
                        wait: true,
                        patch: true,
                        success: function(newPayment){
                            console.log("Saved on server!!");
                            console.dir(newPayment);
//                            that.showPayment(newPayment);
                        },

                        error: function(x, response) {
                            console.log("Error on server!! -- " + response.text);
                            return response;
                        }
                    });
                });
                Application.modalRegion.show(addPaymentFormView);
            },

            showTab: function (tabId) {
//                Application.execute(Application.ENQUIRIES_CONTENT_SHOW, this.layout.enqContentRegion, tabId);
                if (Payments.CURRENT_TAB === tabId) {
                    Application.execute(Application.PAYMENTS_LIST_CURRENT, this.layout.contentRegion);
                } else if (Payments.ALL_TAB === tabId) {
                    Application.execute(Application.PAYMENTS_LIST_ALL, this.layout.contentRegion);
                }
//                else if (Payments.CLOSED_TAB === tabId) {
//                    Application.execute(Application.ENQUIRIES_CONTENT_CLOSED, this.layout.enqContentRegion);
//                }
            },

            showEnquiry: function(studentId) {
                Application.execute(Application.ENQUIRY_SHOW, this.layout.contentRegion, studentId);
            },

            getLayout: function () {
                return new Payments.views.Layout();
            }

        });


    });
});
