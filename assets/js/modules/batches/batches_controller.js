define([
    //Views
    "modules/batches/batches_view",

    //SubModules
//    "modules/batches/content/all/all_app",
//    "modules/batches/content/closed/closed_app",
//    "modules/batches/content/my/my_app",
//    "modules/batches/show/show_app",

    //Models
    "modules/entities/user",
    "modules/entities/comment",
    "modules/entities/service",
    "modules/entities/education",
    "modules/entities/enquiryStatus"
], function () {
    Application.module("Batches", function (Batches, Application, Backbone, Marionette, $, _) {

        //Event
        Batches.TAB_SELECTED = "tab:selected";

        //Enquiry Tab Id's
        Batches.CURRENT_TAB = "current";
        Batches.ALL_TAB = "all";
//        Batches.CLOSED_TAB = "closed";

        var tabCollection = new Application.Entities.Collection([
            new Application.Entities.Model({text:"Current", id: Batches.CURRENT_TAB}),
            new Application.Entities.Model({text:"All", id: Batches.ALL_TAB}),
//            new Application.Entities.Model({text:"Closed", id: Batches.CLOSED_TAB})
        ]);

        Batches.Controller = Application.Controllers.Base.extend({
            initialize: function () {
                var user = Application.request(Application.GET_LOGGED_USER);
                var tabId = this.options.tabId;
//                var studentId = this.options.studentId;

                this.layout = this.getLayout();

                this.listenTo(this.layout, Application.SHOW, function () {
//                    if (studentId) {
//                        this.showNavTabs();
//                        this.showEnquiry(studentId);
//                    } else {
                        if (!tabId) //Show default tab
                            tabId = Batches.CURRENT_TAB;
                        this.showNavTabs(tabId);
//                        this.showTab(tabId);
//                    }
                });

                this.show(this.layout, {
                    loading: {
                        entities: [user]
                    }
                });
            },

            showNavTabs: function (tabId) {
                var tabContainerView = new Batches.views.TabContainer({
                    collection: tabCollection
//                    model: new Application.Entities.Model({
//                        modalId: Batches.addStudentModalFormId
//                    })
                });
                this.layout.tabsRegion.show(tabContainerView);
                if (tabId) {
                    tabContainerView.selectTabView(tabId);
                    Application.navigate(Batches.rootRoute + "/" +tabId);
                }

                var that = this;
                this.listenTo(tabContainerView, Batches.TAB_SELECTED, function(tabId){
                    that.showTab(tabId);
                    tabContainerView.selectTabView(tabId);
                    Application.navigate(Batches.rootRoute + "/" +tabId);
                });

            },

//            showTab: function (tabId) {
////                Application.execute(Application.ENQUIRIES_CONTENT_SHOW, this.layout.enqContentRegion, tabId);
//                if (Batches.MY_TAB === tabId) {
//                    Application.execute(Application.ENQUIRIES_CONTENT_MY, this.layout.enqContentRegion);
//                } else if (Batches.ALL_TAB === tabId) {
//                    Application.execute(Application.ENQUIRIES_CONTENT_ALL, this.layout.enqContentRegion);
//                } else if (Batches.ALL_BY_DATE_TAB === tabId) {
//                    Application.execute(Application.ENQUIRIES_CONTENT_ALL_BY_DATE, this.layout.enqContentRegion);
//                }
////                else if (Batches.JOINED_TAB === tabId) {
////                    Application.execute(Application.ENQUIRIES_CONTENT_JOINED, this.layout.enqContentRegion);
////                }
//                else if (Batches.CLOSED_TAB === tabId) {
//                    Application.execute(Application.ENQUIRIES_CONTENT_CLOSED, this.layout.enqContentRegion);
//                }
//            },

            showEnquiry: function(studentId) {
                Application.execute(Application.ENQUIRY_SHOW, this.layout.enqContentRegion, studentId);
            },

            getLayout: function () {
                return new Batches.views.Layout();
            }

        });


    });
});
