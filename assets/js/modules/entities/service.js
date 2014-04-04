define([], function(){
    Application.module("Entities", function(Entities, Application, Backbone, Marionette, $, _) {

        Entities.serviceUrl = "/service";

        Entities.Service = Entities.Model.extend({
            urlRoot: Entities.serviceUrl,
            validation: {
                title: {required: true}
            }
        });

        Entities.ServiceCollection = Entities.Collection.extend({
            url: Entities.serviceUrl,
            model: Entities.Service
        });

        var API = {
            getService: function(serviceId) {
                if (!serviceId)
                    return new Entities.Service();

                var service = new Entities.Service();
                service.id = serviceId;
                service.fetch();
                return service;
            },

            getAllServices: function(update) {
                //Update is called after a new service is added/removed and the collection needs to be updated
                if (!Entities.allServices || update){
                    Entities.allServices = new Entities.ServiceCollection();
                    Entities.allServices.fetch();
                }
                return Entities.allServices;
            }
        };

        Application.reqres.setHandler(Application.GET_SERVICES, function(update){
            return API.getAllServices(update);
        });

        Application.reqres.setHandler(Application.GET_SERVICE, function(serviceId){
            return API.getService(serviceId);
        });
    })
});