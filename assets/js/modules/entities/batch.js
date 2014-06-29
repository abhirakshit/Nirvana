define([], function(){
    Application.module("Entities", function(Entities, Application, Backbone, Marionette, $, _) {

        Entities.batchUrl = "/batch";

        Entities.Batch = Entities.Model.extend({
            urlRoot: Entities.batchUrl,
            validation: {
                name: {required: true},
                startDate: {required: true},
                endDate: {
                    required: true,
                    fn: 'laterThanStart'
                },
                service: {required: true}
            },

            laterThanStart: function(value, attr, computedState) {
                console.log(value);
                console.log(attr);
                console.log(computedState);

                if (moment(computedState.startDate).isAfter(moment(computedState.endDate)))
                    return "End date should be after start date";
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
            },

            getBatchClasses: function(batchId) {
                if(!batchId) {
                    console.error("Batch id is null");
                    return new Entities.ClassCollection();
                }

                var batch = this.getAllBatches().get(batchId);
                var classArr = batch.get('classes');

                _.forEach(classArr, function(classModel){
                   classModel.staffName = Application.request(Application.GET_STAFF_NAME, classModel.staff)
                });
//                return new Entities.ClassCollection(batch.get('classes'))
                return new Entities.ClassCollection(classArr);
            }
        };

        Application.reqres.setHandler(Application.GET_BATCHES, function(update){
            return API.getAllBatches(update);
        });

        Application.reqres.setHandler(Application.GET_BATCH, function(batchId){
            return API.getBatch(batchId);
        });

        Application.reqres.setHandler(Application.GET_BATCH_CLASSES, function(batchId){
            return API.getBatchClasses(batchId);
        });
    })
});