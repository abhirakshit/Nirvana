define(function () {
    (function (Marionette) {
        console.log("Extended Marionette Renderer");
        return _.extend(Marionette.Renderer.prototype, {

        });
    })(Marionette);
});