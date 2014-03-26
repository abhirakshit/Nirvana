define([], function(){
    Application.module("Views", function(Views, Application, Backbone, Marionette, $, _) {
        _.extend(Marionette.View.prototype, {
            templateHelpers: function() {}
        });
    });
});