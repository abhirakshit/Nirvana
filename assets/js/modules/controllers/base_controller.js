define([], function(){
    Application.module("Controllers", function(Controllers, Application, Backbone, Marionette) {
        Controllers.Base = Marionette.Controller.extend({
            constructor: function(options) {
                if (!options)
                    options = {};
                this.region = options.region || Application.request(Application.DEFAULT_REGION);
                this._instance_ID = _.uniqueId(Application.CONTROLLER_ID);
                Application.execute(Application.REGISTER_INSTANCE, this, this._instance_ID);
                Controllers.Base.__super__.constructor.call(this, options);
            },

            close: function() {
                Application.execute(Application.UNREGISTER_INSTANCE, this, this._instance_ID);
                Controllers.Base.__super__.close.apply(this);
            },

            show: function(view, options) {
                if (!options)
                    options = {};

                _.defaults(options, {
                    loading: false,
                    region: this.region
                });

                this.setMainView(view);
                this.manageView(view, options);
            },

            setMainView: function(view) {
                if(this.mainView) {
                    return;
                }

                this.mainView = view;
                this.listenTo(view, Application.CLOSE, this.close);
            },

            manageView: function(view, options) {
                if (options.loading) {
                    Application.execute(Application.SHOW_LOADING, view, options)
                } else {
                    options.region.show(view);
                }
            }
        });
    });
});




