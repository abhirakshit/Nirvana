requirejs.config({

    /**
     * Local Setup
     */
//    baseUrl: 'assets/javascripts',

    paths: {
        //Build
        jquery: "lib/jquery/jquery.min",
        underscore: "lib/underscore/underscore-min",
        backbone: "lib/backbone/backbone",
        marionette: "lib/marionette/backbone.marionette",
        bootstrap: "lib/bootstrap/bootstrap.min",

        //Add-On's
        backboneValidation: "lib/backbone-validation/backbone-validation-amd-min",

        //Utils
        spin: "lib/spin/spin",
        jquerySpin: "lib/spin/jquery.spin",

        //Application Addons
        marionette_config_application: "config/marionette/application",
        marionette_config_module: "config/marionette/module",
        backbone_config_sync: "config/backbone/sync",
        templateLoader: "config/app/templateLoader/templateLoader"

    },

    shim: {


        underscore: {
            exports: "_"
        },

        backbone: {
            deps: ["underscore", "jquery"],
            exports: "Backbone"
        },

        marionette: {
            deps: ["backbone"],
            exports: "Marionette"
        },
        bootstrap: {
            deps: ["jquery"]
        },


        //Utils
        jquerySpin: {
            deps: ["jquery", "spin"]
        },


        //App Addons
        marionette_config_application: {
            deps: ["marionette"]
        },

        marionette_config_module: {
            deps: ["marionette"]
        },

        backbone_config_sync: {
            deps: ["backbone"]
        },

        templateLoader: {
            deps: ["marionette"]
        }

    }

});

var dependencies = [
    "marionette",
    "bootstrap",


    //Add-On's
    "backboneValidation",

    //Utils
    "jquerySpin",


    //App Addons
    "templateLoader",
    "marionette_config_application",
    "marionette_config_module",
    "backbone_config_sync"
];

require(dependencies,
    function (Marionette) {
        console.log("Init Application...");
        window.Application = new Marionette.Application();

        Application.MODULES_LOADED = "modules:loaded";
        Application.UNREGISTER_INSTANCE = "unregister:instance";
        Application.REGISTER_INSTANCE = "register:instance";
        Application.DEFAULT_REGION = "default:region";
        Application.rootRoute = "enquiry";

        Application.addRegions({
            headerRegion: "#header-region",
            sidebarRegion: "#sidebar-region",
            pageContentRegion: "#page-content-region",
            footerRegion: "#footer-region"
        });


        Application.reqres.setHandler(Application.DEFAULT_REGION, function () {
            return Application.pageContentRegion;
        });

        Application.commands.setHandler(Application.REGISTER_INSTANCE, function (instance, id) {
            Application.register(instance, id);
        });

        Application.commands.setHandler(Application.UNREGISTER_INSTANCE, function (instance, id) {
            Application.unregister(instance, id);
        });

        Application.addInitializer(function () {
            console.log("addInit");
            Application.module("Header").start();
            Application.module("Footer").start();
            Application.module("Sidebar").start();
            Application.module("Profile").start();
            Application.module("Settings").start();
            Application.module("Enquiries").start();
        });


        require([
            "modules/main/main_app"
        ], function () {
            console.log("Setup...");
//            Application.mainRouter = new Application.Router();
        });

        require([
            "modules/header/header_app",
            "modules/footer/footer_app",
            "modules/sidebar/sidebar_app",
            "modules/profile/profile_app",
            "modules/enquiries/enquiries_app",
            "modules/settings/settings_app"
        ], function () {
            console.log("Start Application...");
            Application.start();
        });

        return Application;
    }
);
