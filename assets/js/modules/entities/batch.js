define([], function(){
    Application.module("Entities", function(Entities, Application, Backbone, Marionette, $, _) {

        Entities.batchUrl = "/batch";

        Entities.Batch = Entities.Model.extend({
            urlRoot: Entities.batchUrl,
            validation: {
                name: {required: true},
                startDate: {required: true},
                endDate: {required: true},
                service: {required: true}
            }
        });

        Entities.BatchCollection = Entities.Collection.extend({
            url: Entities.batchUrl,
            model: Entities.Batch
        });

        var API = {
            getBatch: function(batchId) {
                if (!batchId)
                    return new Entities.Batch();

                var batch = new Entities.Batch();
                batch.id = batchId;
                batch.fetch();
                return batch;
            },

            getAllBatches: function(update) {
                //Update is called after a new batch is added/removed and the collection needs to be updated
                if (!Entities.allBatches || update){
                    Entities.allBatches = new Entities.BatchCollection();
                    Entities.allBatches.fetch();
                }
                return Entities.allBatches;
            }
        };

        Application.reqres.setHandler(Application.GET_BATCHES, function(update){
            return API.getAllBatches(update);
        });

        Application.reqres.setHandler(Application.GET_BATCH, function(batchId){
            return API.getBatch(batchId);
        });
    })
});