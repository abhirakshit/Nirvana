define([], function(){
    Application.module("Entities", function(Entities, Application, Backbone, Marionette, $, _) {

        Entities.batchUrl = "/batch";
        Entities.classUrl = "/class";

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
                if (moment(computedState.startDate).isAfter(moment(computedState.endDate)))
                    return "End date should be after start date";
            }

        });

        Entities.BatchCollection = Entities.Collection.extend({
            url: Entities.batchUrl,
            model: Entities.Batch
        });

        Entities.Class = Entities.Model.extend({
            urlRoot: Entities.classUrl,
            validation: {
                date: {required: true},
                topic: {required: true},
                staff: {required: true}
            }
        });

        Entities.ClassCollection = Entities.Collection.extend({
            url: Entities.classUrl,
            model: Entities.Class
        });

        var API = {
            getBatch: function(batchId) {
                if (!batchId)
                    return new Entities.Batch();

                return this.getAllBatches().get(batchId);
            },

            getAllBatches: function() {
                if (!Entities.allBatches){
                    Entities.allBatches = new Entities.BatchCollection();
                    Entities.allBatches.fetch();
                }
                return Entities.allBatches;
            },

            getCurrentBatches: function() {
                if (!Entities.currentBatches){
                    Entities.currentBatches = new Entities.BatchCollection();
                    Entities.currentBatches.url = Entities.batchUrl + "/current";
                    Entities.currentBatches.fetch();
                }
                return Entities.currentBatches;
            },

            getBatchClasses: function(batchId) {
                if(!batchId) {
                    console.error("Batch id is null");
                    return new Entities.ClassCollection();
                }

                var batchClasses = new Entities.ClassCollection();
                batchClasses.url = Entities.batchUrl + "/" + batchId + Entities.classUrl;
                batchClasses.fetch();
                return batchClasses;
            },

            getClass: function(classId) {
                if (!classId)
                    return new Entities.Class();

                return this.getAllBatches().get(classId);
            },

            getAllClasses: function(update) {
                //Update is called after a new class is added/removed and the collection needs to be updated
                if (!Entities.allClasses || update){
                    Entities.allClasses = new Entities.ClassCollection();
                    Entities.allClasses.fetch();
                }
                return Entities.allClasses;
            }
        };

        Application.reqres.setHandler(Application.GET_BATCHES, function(update){
            return API.getAllBatches();
        });

        Application.reqres.setHandler(Application.GET_BATCHES_CURRENT, function(update){
            return API.getCurrentBatches();
        });

        Application.reqres.setHandler(Application.GET_BATCH, function(batchId){
            return API.getBatch(batchId);
        });

        Application.reqres.setHandler(Application.GET_BATCH_CLASSES, function(batchId){
            return API.getBatchClasses(batchId);
        });

        Application.reqres.setHandler(Application.GET_CLASSES, function(update){
            return API.getAllClasses(update);
        });

        Application.reqres.setHandler(Application.GET_CLASS, function(classId){
            return API.getClass(classId);
        });
    })
});