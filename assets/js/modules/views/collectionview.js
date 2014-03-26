define([], function(){
    Application.module("Views", function(Views, Application, Backbone, Marionette, $, _) {
        Views.CollectionView = Marionette.CollectionView.extend({
            itemViewEventPrefix: "child:view"
        });
    });
});