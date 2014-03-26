define([], function(){
    Application.module("Views", function(Views, Application, Backbone, Marionette, $, _) {
        Views.CompositeView = Marionette.CompositeView.extend({
            itemViewEventPrefix: "child:view"
        });
    });
});