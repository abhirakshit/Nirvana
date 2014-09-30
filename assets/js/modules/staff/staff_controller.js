define([
    "modules/staff/staff_view",
    "modules/entities/user",
    "modules/staff/show/show_app",
    "modules/staff/list/list_app"
], function () {
    Application.module("Staff", function (Staff, Application, Backbone, Marionette, $, _) {

        Staff.ACTIVE_TAB = "active";
        Staff.ALL_TAB = "all";
        Staff.CLOSED_TAB = "closed";

        var tabCollection = new Application.Entities.Collection([
            new Application.Entities.Model({text:"Active", id: Staff.ACTIVE_TAB}),
            new Application.Entities.Model({text:"All", id: Staff.ALL_TAB}),
            new Application.Entities.Model({text:"Inactive", id: Staff.CLOSED_TAB})
        ]);

        Staff.Controller = Application.Controllers.Base.extend({
            initialize: function () {
                var staffId = this.options.staffId;
                var tabId = this.options.tabId;

                this.layout = this.getLayout();
                this.listenTo(this.layout, Application.SHOW, function () {

                    if (staffId) {
                        //this is coming from URL
                        this.showNavTabs();
                        Application.execute(Application.SELECTED_STAFF, this.layout.contentRegion, staffId);
                    } else {
                        if (!tabId)
                            tabId = Staff.ACTIVE_TAB;
                        this.showNavTabs(tabId);
                        this.showTab(tabId);
                    }

                });

                //Load layout
                this.show(this.layout
//                    {
//                    loading: { entities: allStaff }
//                    }
                );
            },

            showNavTabs: function (tabId) {
                var tabContainerView = new Application.Views.Base.views.TabContainer({
                    collection: tabCollection
                });
                this.layout.tabsRegion.show(tabContainerView);

                if (tabId) {
                    tabContainerView.selectTabView(tabId);
                    Application.navigate(Staff.rootRoute + "/" +tabId);
                }

                var that = this;
                this.listenTo(tabContainerView, Application.TAB_SELECTED, function(tabId){
                    that.showTab(tabId);
                    tabContainerView.selectTabView(tabId);
                    Application.navigate(Staff.rootRoute + "/" +tabId);
                });
            },

            showTab: function (tabId) {
                  Application.execute(Application.STAFF_LIST, this.layout.contentRegion, tabId);
//                if (Staff.ACTIVE_TAB === tabId) {
//                    Application.execute(Application.STAFF_LIST_ACTIVE, this.layout.contentRegion);
////                    this.showAllStaff(allStaff);
//                } else if (Staff.ALL_TAB === tabId) {
//                    Application.execute(Application.STAFF_LIST_ALL, this.layout.contentRegion);
////                    this.showAllStaff(allStaff);
//                } else if (Staff.CLOSED_TAB === tabId) {
//                    Application.execute(Application.STAFF_LIST_CLOSED, this.layout.contentRegion);
//                }
            },


//            showAllStaff: function (user) {
//                var allStaffView = new Staff.views.StaffCollection({collection: user});
////                this.layout.changePasswordRegion.show(allStaffView);
//                this.layout.contentRegion.show(allStaffView);
//                var that = this;
//                this.listenTo(allStaffView, Application.SELECTED_STAFF, function (staffId) {
////                    Application.execute(Application.SELECTED_STAFF, that.options.region, staffId);
//                    Application.execute(Application.SELECTED_STAFF, that.layout.contentRegion, staffId);
//                });
//            },
//
//            showSelectedStaff: function (userId) {
//
//                // var that = this;
//                // this.listenTo(showAllStaff.allStaffView, Application.SELECTED_STAFF, function(staffId){
//                //     Application.execute(Application.SELECTED_STAFF, that.options.region, staffId);
//                //     console.log('Its Working!');
//                // });
//
//
//            },


            getLayout: function () {
                return new Staff.views.Layout();
            }


        });
    })
});