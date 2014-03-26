define([
    "modules/loading/loading_view"
], function(){
    Application.module("Loading", function (Loading, Application, Backbone, Marionette, $, _) {

        Loading.TYPE_SPINNER = "spinner";
        Loading.TYPE_OPACITY = "opacity";

        Loading.Controller = Application.Controllers.Base.extend({
            initialize: function(options) {
                this.view = options.view;
                this.config = options.config;

                if (_.isBoolean(this.config)) {
                    this.config = {};
                }

                _.defaults(this.config, {
                    loadingType: Loading.TYPE_SPINNER,
                    entities: this.getEntities(this.view),
                    debug: false
                });

                switch (this.config.loadingType) {
                    case Loading.TYPE_OPACITY:
                        this.region.currentView.$el.css("opacity", 0.5);
                        break;
                    case Loading.TYPE_SPINNER:
                        var loadingView = this.getLoadingView();
                        this.show(loadingView);
                        break;
                    default:
                        throw new Error("Invalid loadingType");
                }
                this.showRealView(this.view, loadingView, this.config);
            },

            showRealView: function(realView, loadingView, config) {
                var that = this;
                Application.execute(Application.WHEN_FETCHED, config.entities, function(){
                    switch (config.loadingType) {
                        case Loading.TYPE_OPACITY:
                            that.region.currentView.$el.removeAttr("style");
                            break;
                        case Loading.TYPE_SPINNER:
                            if (that.region.currentView !== loadingView) {
                                return realView.close();
                            }
                    }

//                    console.log("Show real view...");
//                    console.dir(config.entities);
                    if (!config.debug) {
                        that.show(realView);
                    }
                })
            },

            getEntities: function(view) {
                return _.chain(view).pick("model", "collection").toArray().compact().value();
            },

            getLoadingView: function() {
                return new Loading.View();
            }

        });

        Application.commands.setHandler(Application.SHOW_LOADING, function(view, options){
            new Loading.Controller({
                view: view,
                region: options.region,
                config: options.loading
            })

        });

    });


});