requirejs.config({

    /**
     * Local Setup
     */
//    baseUrl: 'assets/javascripts',

    paths: {
        //Build
        jquery: "lib/jquery/jquery.min",
        underscore: "lib/underscore/underscore-min",
        lodash: "lib/lodash/lodash",
        backbone: "lib/backbone/backbone",
        marionette: "lib/marionette/backbone.marionette",
        bootstrap: "lib/bootstrap/bootstrap.min",

        //Add-On's
        backboneValidation: "lib/backbone-validation/backbone-validation-amd-min",
        backboneSyphon: "lib/backbone-syphon/backbone.syphon.min",
        bootstrapEditable: "lib/bootstrap-editable/bootstrap-editable.min", //Glyphicon error for ok and cancel
//        bootstrapEditable: "lib/bootstrap-editable/bootstrap-editable", //Xeditable
        select2: "lib/select2/select2", //Needed by Xeditable

        //Utils
        spin: "lib/spin/spin",
        jquerySpin: "lib/spin/jquery.spin",
        jqueryUI: "lib/jquery-ui/jquery-ui.min",
        dataTables: "lib/datatables/jquery.dataTables.min",
        dataTablesBootstrap: "lib/datatables/dataTables.bootstrap",
        jasnyBootstrap: "lib/jasny-bootstrap/jasny-bootstrap.min",
        bootstrapDateTimePicker: "lib/bootstrap-datetimepicker/bootstrap-datetimepicker",
        jGrowl: "lib/jquery-jgrowl/jquery.jgrowl.min",
        moment: "lib/moment/moment.min",

        //Application Addons
        marionette_config_application: "config/marionette/application",
        marionette_config_module: "config/marionette/module",
        backbone_config_sync: "config/backbone/sync",
        templateLoader: "config/app/templateLoader/templateLoader"

        //Theme
//        app: "theme/app.v1",
//        appPlugin: "theme/app.plugin"

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


        bootstrapEditable: {
            deps: ["bootstrap"]
        },

        bootstrapDateTimePicker: {
            deps: ["bootstrap", "moment"]
        },


        //Utils
        jquerySpin: {
            deps: ["jquery", "spin"]
        },

        jqueryUI: {
            deps: ["jquery"]
        },

        jGrowl: {
            deps: ["jquery"]
        },

        dataTables: {
            deps: ["jquery"]
        },

        dataTablesBootstrap: {
            deps: ["dataTables"]
        },

//        parsley: {
//            deps: ["jquery"]
//        },

        jasnyBootstrap: {
            deps: ["bootstrap"]
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
        },

        select2: {
            deps: ["jquery"]
        }

//        //Theme
//        app : {
//
//        },
//
//        appPlugin: {
//
//        }

    }

});

var dependencies = [
    "marionette",
    "bootstrap",


    //Add-On's
    "backboneValidation",
    "backboneSyphon",
    "bootstrapEditable",
    "bootstrapDateTimePicker",
//    "backboneModal",

    //Utils
    "jquerySpin",
    "jqueryUI",
    "dataTables",
    "dataTablesBootstrap",
    "jasnyBootstrap",
    "jGrowl",
//    "parsley",


    //App Addons
    "templateLoader",
    "marionette_config_application",
    "marionette_config_module",
    "backbone_config_sync",
    "select2",
    "moment"

    //Theme
//    "app",
//    "appPlugin"
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

        require([
            "modules/main/main_app"
        ], function () {
//            console.log("Setup...");

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
                Application.module("Settings").start();
                Application.module("Enquiries").start();
                Application.module("Batches").start();
                Application.module("Topics").start();
                Application.module("Students").start();
                Application.module("Staff").start();
                Application.module("Student").start();
                Application.module("Payments").start();

            });


            require([
                "modules/header/header_app",
                "modules/footer/footer_app",
                "modules/sidebar/sidebar_app",
                "modules/enquiries/enquiries_app",
                "modules/batches/batches_app",
                "modules/topics/topics_app",
                "modules/settings/settings_app",
                "modules/students/students_app",
                "modules/staff/staff_app",
                "modules/student/student_app",
                "modules/payments/payments_app"

            ], function () {
                console.log("Start Application...");
                Application.start();
            });

        });

        return Application;
    }
);
