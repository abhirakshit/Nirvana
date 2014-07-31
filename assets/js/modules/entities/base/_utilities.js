define([
    "config/app/consts"
], function(){
    Application.module("Entities", function(Entities, Application, Backbone, Marionette, $, _) {
        Application.commands.setHandler(Application.WHEN_FETCHED, function(entities, callback) {
            var xhrs = _.chain([entities]).flatten().pluck("_fetch").value();
            console.log("When fetched handler function");
            console.log(xhrs);
//            return $.when.apply($, xhrs).done(function() {
            $.when.apply($, xhrs).done(function() {
                return callback();
            });

            $.when.apply($, xhrs).fail(function() {
                return callback();
            });
        });
    });
});