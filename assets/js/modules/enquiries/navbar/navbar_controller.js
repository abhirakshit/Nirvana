define([
    "modules/enquiries/navbar/navbar_view"
], function(){
    Application.module("Enquiries.Navbar", function(Navbar, Application, Backbone, Marionette, $, _) {

        Navbar.Controller = Application.Controllers.Base.extend({
            initialize: function() {
                this.layout = this.getLayout();

                this.listenTo(this.layout, Application.SHOW, function(){
                    this.activateTab(this.options.activeTabId);
                });

                this.show(this.layout);
            },

//            setupNavBar: function() {
//               var tabContainer = new Navbar.views.TabContainer({
//                   collection: tabCollection
//               });
//
//               this.layout
//            },

            activateTab:  function(id) {
                this.layout.selectTabView(id);
            },

            getLayout: function() {
//                    return new Enquiries.views.Layout();
                return new Navbar.views.TabContainer({
                    collection: this.options.tabCollection
                });
            }

        });



    });
});
