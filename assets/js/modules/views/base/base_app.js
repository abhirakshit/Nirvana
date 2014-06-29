define([
    "modules/views/base/modal_views",
    "modules/views/base/table_views"
], function(){
    Application.module("Views.Base", function(Base, Application, Backbone, Marionette, $, _) {

        Base.setup = function() {
            console.log("Setup base views")
        };
        Marionette.TemplateLoader.loadModuleTemplates(Base, Base.setup);
    })
});
