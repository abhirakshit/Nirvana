define([], function(){
    Application.module("Views", function(Views, Application, Backbone, Marionette, $, _) {
        Views.CompositeView = Marionette.CompositeView.extend({
            itemViewEventPrefix: "child:view",

//            modelEvents: {
//                "change": "refreshView"
//            },
//
            collectionEvents: {
//                "add": "refreshView",
//                "change": "refreshView"
                "add": "refreshOnAdd",
                "change": "refreshOnChange"
            },

            refreshOnAdd: function() {
                console.log("Refresh View on Add");
            },

            refreshOnChange: function() {
                console.log("Refresh View on Change");
                this.render();
            },

            refreshView: function() {
                console.log("Refresh View");
//                this.render();
            }
        });
    });
});