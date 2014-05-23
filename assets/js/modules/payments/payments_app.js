/*
This file dependent on payment_controller: defining all dependencies, make sure to add 
an entry in Nirvana/assets/js/app.js file under Application.addInitializer (this is to make sure application will start)
section to intialize the application and add under require  "modules/payments/payments_app". */


define([
	"modules/payments/payments_controller"
	], function(){
		Application.module("Payments", function(Payments, Application, Backbone, Marionette,$,_){

			Payments.rootRoute = "payments";
			Payments.Router = Marionette.AppRouter.extend({
				AppRoutes: {
					"payments": "show",
					"payments/": "show"
				}
			});

			var API = {
				show: function(){
					console.log("show payments");
					new Payments.Controller({
						region: Application.pageContentRegion
					});
					Application.commands.execute(Application.SET_SIDEBAR, Application.PAYMENTS_SHOW);
				}
			};

			Payments.setup = function(){
				new Payments.Router({
					Controller: API
				});
			};

			Payments.on(Application.START, function(){
				console.log("Payments Start...");

				Marionette.TemplateLoader.loadModuleTemplates(Payments, Payments.setup);
			});

			Application.commands.setHandler(Application.PAYMENTS_SHOW, function(){
				API.show();
				Application.navigate(Payments.rootRoute);
			});

		});



});