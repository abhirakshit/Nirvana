define([

    "modules/settings/settings_view",
    "modules/settings/profile/profile_app",
    "modules/settings/admin/admin_app",

    "modules/entities/user",
    "modules/entities/school",
    "modules/entities/country"
], function () {
    Application.module("Settings", function (Settings, Application, Backbone, Marionette, $, _) {

//        Settings.changePasswordEvt = "changePassword";
        Settings.createAdminEvt = "createAdmin";
        Settings.createSchoolEvt = "createSchool";
        Settings.createCountryEvt = "createCountry";


        //Event
        Settings.CREATE_TOPIC = "create:topic";
        Settings.TAB_SELECTED = "tab:selected";

        //Enquiry Tab Id's
        Settings.PROFILE_TAB = "profile";
        Settings.ADMIN_TAB = "admin";

        var tabCollection = new Application.Entities.Collection([
            new Application.Entities.Model({text:"Profile", id: Settings.PROFILE_TAB}),
            new Application.Entities.Model({text:"Admin", id: Settings.ADMIN_TAB})
        ]);

        Settings.Controller = Application.Controllers.Base.extend({
            initialize: function () {
                var user = Application.request(Application.GET_LOGGED_USER);
                var tabId = this.options.tabId;

                this.layout = this.getLayout();

                this.listenTo(this.layout, Application.SHOW, function () {

                    if (!tabId) {
                        tabId = Settings.PROFILE_TAB;
                    }

                    this.showNavTabs(tabId);
                    this.showTab(tabId);
                });

                this.show(this.layout, {
                    loading: {
                        entities: user
                    }
                });

            },

            showNavTabs: function (tabId) {
                var tabContainerView = new Settings.views.TabContainer({
                    collection: tabCollection
                });
                this.layout.tabsRegion.show(tabContainerView);

//                if (tabId) {
                    tabContainerView.selectTabView(tabId);
                    Application.navigate(Settings.rootRoute + "/" +tabId);
//                }

                var that = this;
                this.listenTo(tabContainerView, Settings.TAB_SELECTED, function(tabId){
                    that.showTab(tabId);
                    tabContainerView.selectTabView(tabId);
                    Application.navigate(Settings.rootRoute + "/" +tabId);
                });
            },

            showTab: function (tabId) {
                if (Settings.PROFILE_TAB === tabId) {
                    Application.execute(Application.SETTINGS_PROFILE, this.layout.contentRegion);
                } else if (Settings.ADMIN_TAB === tabId) {
                    Application.execute(Application.SETTINGS_ADMIN, this.layout.contentRegion);
                }
            },

            getLayout: function () {
                return new Settings.views.Layout();
            }
        });
    })
});