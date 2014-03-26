define([
    "modules/enquiries/navbar/navbar_view"
], function(){
    Application.module("Enquiries.Navbar", function(Navbar, Application, Backbone, Marionette, $, _) {

        var tabCollection = new Application.Entities.Collection([
            new Application.Entities.Model({text:"My Enquiries", id: "myEnq"}),
            new Application.Entities.Model({text:"All By Date", id: "allByDate"}),
            new Application.Entities.Model({text:"All", id: "allEnq"}),
            new Application.Entities.Model({text:"Joined", id: "joined"}),
            new Application.Entities.Model({text:"Closed", id: "closed"})
        ]);

        Navbar.Controller = Application.Controllers.Base.extend({
            initialize: function() {
                this.layout = this.getLayout();

//                this.listenTo(this.layout, Application.SHOW, function(){
//                    this.setupNavBar();
//                });

                this.show(this.layout);
            },

//            setupNavBar: function() {
//               var tabContainer = new Navbar.views.TabContainer({
//                   collection: tabCollection
//               });
//
//               this.layout
//            },

            getLayout: function() {
//                    return new Enquiries.views.Layout();
                return new Navbar.views.TabContainer({
                    collection: tabCollection
                });
            }

        });



    });
});
