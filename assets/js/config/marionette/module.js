define(function () {
    (function (Marionette) {
        console.log("Extended Marionette Renderer");
        var func = Marionette.Module._addModuleDefinition;
        Marionette.Module._addModuleDefinition = function(parentModule, module) {
            module.parent = parentModule;
            func.apply(this, arguments);
        }
    })(Marionette);
});