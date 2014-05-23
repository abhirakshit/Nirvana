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
                    _collection = this.getStaffSideBarOptionCollection();
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

            getStaffSideBarOptionCollection: function () {
                return new Application.Entities.Collection([
                    new Application.Entities.Model({id: Application.ENQUIRIES_SHOW, name: "Enquiries", icon: "fa fa-home"}),
                    new Application.Entities.Model({id: Application.PAYMENTS_SHOW, name: "Payments", icon: "fa fa-rupee"}),
                    new Application.Entities.Model({id: Application.BATCHES_SHOW, name: "Batches", icon: "fa fa-calendar"}),
                    new Application.Entities.Model({id: Application.TOPICS_SHOW, name: "Topics", icon: "i i-book"}),
                    new Application.Entities.Model({id: Application.SETTINGS_SHOW, name: "Settings", icon: "fa fa-cogs"}),
                    new Application.Entities.Model({id: "students:show", name: "Students", icon: "fa fa-users"}),
                    new Application.Entities.Model({id: "staff:show", name: "Staff", icon: "fa fa-user-md"})

                ]);
            },

            getStudentSideBarOptionCollection: function () {
                return new Application.Entities.Collection([
                    new Application.Entities.Model({id: Application.ENQUIRIES_SHOW, name: "Enquiries", icon: "fa fa-home"}),
                    new Application.Entities.Model({id: Application.PAYMENTS_SHOW, name: "Payments", icon: "fa fa-rupee"}),
                    new Application.Entities.Model({id: Application.BATCHES_SHOW, name: "Batches", icon: "fa fa-calendar"}),
                    new Application.Entities.Model({id: Application.TOPICS_SHOW, name: "Topics", icon: "i i-book"}),
                    new Application.Entities.Model({id: Application.SETTINGS_SHOW, name: "Settings", icon: "fa fa-cogs"}),
                    new Application.Entities.Model({id: "students:show", name: "Students", icon: "fa fa-users"}),
                new Application.Entities.Model({id: "staff:show", name: "Staff", icon: "fa fa-user-md"})
                ]);
            }
        });
    });
});
