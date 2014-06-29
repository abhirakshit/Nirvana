define([
    "modules/views/_view",
    "modules/views/collectionview",
    "modules/views/compositeview",
    "modules/views/itemview"
], function(){
    Application.module("Views.Base", function(Base, Application, Backbone, Marionette, $, _) {
        this.prefix = "Base";
        this.templatePath = "js/modules/";
        this.views = {};

        this.template = function (str) {
            return this.prefix + '-' + str;
        };
    })
});
