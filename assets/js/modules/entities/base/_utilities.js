define([
    "config/app/consts"
], function(){
    Application.module("Entities", function(Entities, Application, Backbone, Marionette, $, _) {
        Application.commands.setHandler(Application.WHEN_FETCHED, function(entities, callback) {
//            console.dir(entities);
//            console.dir(_.chain([entities]).flatten());
            var xhrs = _.chain([entities]).flatten().pluck("_fetch").value();
//            console.log("XHRS: ");

            return $.when.apply($, xhrs).done(function(){
                return callback();
            });
        });
    });
});