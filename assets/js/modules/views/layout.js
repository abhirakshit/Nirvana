define([], function(){
    Application.module("Views", function(Views, Application, Backbone, Marionette, $, _) {
        Views.Layout = Marionette.Layout.extend();
    });
});