define([], function(){
    Application.module("Views", function(Views, Application, Backbone, Marionette, $, _) {
        Views.Region = Marionette.Region.extend();

        Views.ModalRegion = Views.Region.extend({
            constructor: function() {
                Marionette.Region.prototype.constructor.apply(this, arguments);

                this.ensureEl();
                this.$el.on('hidden', {region:this}, function(event) {
                    event.data.region.close();
//                    console.log('Hide Modal!!!');
                });
            },

            onShow: function() {
//                console.log('Show Modal');
                this.$el.modal('show');
            },

            onClose: function() {
//                console.log('Hide Modal');
                this.$el.modal('hide');
            }
        });
    });
});