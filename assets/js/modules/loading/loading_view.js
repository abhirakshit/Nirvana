define([
    "modules/main/main_app"
], function(){
    Application.module("Loading", function (Loading, Application, Backbone, Marionette, $, _) {

        Loading.View = Marionette.ItemView.extend({
            template: function (serialized_model) {
                return _.template("")
            },

            className: "loading-container",

            onShow: function() {
                var opts = this.getOptions();
                this.$el.spin(opts);
            },

            onClose: function() {
                this.$el.spin(false);
            },

            getOptions: function() {
                return {
                    lines: 10,
                    length: 6,
                    width: 2.5,
                    radius: 7,
                    corners: 1,
                    rotate: 9,
                    direction: 1,
                    color: '#000',
                    speed: 1,
                    trail: 60,
                    shadow: false,
                    hwaccel: true,
                    className: 'spinner',
                    zIndex: 2e9,
                    top: 'auto',
                    left: 'auto'
                };
            }

        })
    });

});