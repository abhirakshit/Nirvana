define([], function(){
    Application.module("Views", function(Views, Application, Backbone, Marionette, $, _) {
        Views.ItemView = Marionette.ItemView.extend({
//            modelEvents: {
//                'change': 'render'
//            }
        });
    });
});