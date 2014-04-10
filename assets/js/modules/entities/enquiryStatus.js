define([], function(){
    Application.module("Entities", function(Entities, Application, Backbone, Marionette, $, _) {

        Entities.statusUrl = "/enquiryStatus";

        Entities.Status = Entities.Model.extend({
            urlRoot: Entities.statusUrl,
            validation: {
                title: {required: true}
            }
        });

        Entities.EnquiryStatusCollection = Entities.Collection.extend({
            url: Entities.statusUrl,
            model: Entities.Status
        });

        var API = {
            getStatus: function(statusId) {
                if (!statusId)
                    return new Entities.Status();

                var status = new Entities.Status();
                status.id = statusId;
                status.fetch();
                return status;
            },

            getAllStatus: function(update) {
                //Update is called after a new service is added/removed and the collection needs to be updated
                if (!Entities.allStatus || update){
                    Entities.allStatus = new Entities.EnquiryStatusCollection();
                    Entities.allStatus.fetch();
                }
                return Entities.allStatus;
            }
        };

        Application.reqres.setHandler(Application.GET_STATUS_All, function(update){
            return API.getAllStatus(update);
        });

        Application.reqres.setHandler(Application.GET_STATUS, function(statusId){
            return API.getStatus(statusId);
        });
    })
});