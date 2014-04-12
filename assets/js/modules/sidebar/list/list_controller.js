define([
    "modules/sidebar/list/list_view"
], function () {
    Application.module("Sidebar.List", function (List, Application, Backbone, Marionette, $, _) {

        List.Controller = Application.Controllers.Base.extend({
            initialize: function () {
                this.sidebarView = this.getLayout();
                this.show(this.sidebarView);
            },

            getLayout: function () {
                var _collection;
                if (Application.request(Application.GET_ROLE) == Application.STAFF_ROLE){
                    _collection = this.getCounselorSideBarOptionCollection();
                } else {
                    _collection = this.getStudentSideBarOptionCollection();
                }


                var options =  new List.views.SidebarOptions({
                    collection: _collection
                });

                return options;
            },

            activateSidebarTab:  function(id) {
                this.sidebarView.selectTabView(id);
            },

            getCounselorSideBarOptionCollection: function () {
                return new Application.Entities.Collection([
//                    new Application.Entities.Model({id: Application.CAREER_SHOW, name: "Home", icon: "glyphicon glyphicon-home"}),
                    new Application.Entities.Model({id: Application.ENQUIRIES_SHOW, name: "Enquiries", icon: "fa fa-home"}),
//                    new Application.Entities.Model({id: Application.PROFILE_SHOW, name:"Profiles", icon: "glyphicon glyphicon-user"}),
                    new Application.Entities.Model({id: Application.PAYMENTS_SHOW, name: "Payments", icon: "fa fa-rupee"}),
                    new Application.Entities.Model({id: Application.SETTINGS_SHOW, name: "Settings", icon: "fa fa-cogs"})
//                    new Application.Entities.Model({id: Application.FORUM_SHOW, name: "Forum", icon: "glyphicon glyphicon-globe"})
                ]);
            },

            getStudentSideBarOptionCollection: function () {
                return new Application.Entities.Collection([
//                    new Application.Entities.Model({id: Application.CAREER_SHOW, name: "Home", icon: "glyphicon glyphicon-home"}),
                    new Application.Entities.Model({id: Application.ENQUIRIES_SHOW, name: "Enquiries", icon: "fa fa-home"}),
//                    new Application.Entities.Model({id: Application.PROFILE_SHOW, name:"Profile", icon: "glyphicon glyphicon-user"}),
                    new Application.Entities.Model({id: Application.PAYMENTS_SHOW, name: "Payments", icon: "fa fa-rupee"}),
                    new Application.Entities.Model({id: Application.SETTINGS_SHOW, name: "Settings", icon: "fa fa-cogs"})
                ]);
            }
        });
    });
});
