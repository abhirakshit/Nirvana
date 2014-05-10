define([
    "config/app/consts",
    "config/app/utils",
    "modules/entities/base/_utilities",
    "modules/entities/base/models",
    "modules/entities/base/collections",
    "modules/entities/user",
//    "modules/entities/*",

    "modules/views/_view",
    "modules/views/collectionview",
    "modules/views/compositeview",
    "modules/views/itemview",
    "modules/views/layout",
    "modules/views/region",
    "modules/views/utils/xeditable",
    "modules/views/utils/utils",
    "modules/views/validation/validationMessages",

    "modules/controllers/base_controller",
    "modules/loading/loading_controller",

    "config/app/config_app"
], function(){
    Application.module("Main", function(Main, Application, Backbone, Marionette) {
        console.log("Load Main Dependencies");
        Application.ForumUrl = "http://counsela.org/";
        Application.Config.setApplicationConfig();

        //Modal
        Application.modalRegion = new Application.Views.ModalRegion({el:'#modal'});

        if (Application.request(Application.IS_USER_ADMIN)) {
            Application.USER_IS_ADMIN = true;
        }

        Application.commands.setHandler(Application.MODULES_LOADED, function (rootRoute) {
            Application.startHistory();
            if (!Application.getCurrentRoute())
                Application.navigate(rootRoute, {trigger: true});
        });

        Application.commands.setHandler(Application.SHOW_MODULE, function(moduleEvt){
            console.log(moduleEvt);
            if (Application.FORUM_SHOW === moduleEvt) {
                window.open(Application.ForumUrl,'_blank');
                return;
            }

            Application.execute(Application.SET_SIDEBAR, moduleEvt);
            Application.execute(moduleEvt);
        });
    });
});