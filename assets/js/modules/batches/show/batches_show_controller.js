define([
    "modules/batches/show/batches_show_view"
], function () {
    Application.module("Batches.Show", function (Show, Application, Backbone, Marionette, $, _) {

        Show.Controller = Application.Controllers.Base.extend({
            initialize: function () {
                var batch = Application.request(Application.GET_BATCH, this.options.batchId);
                var allServices = Application.request(Application.GET_SERVICES);

                this.layout = this.getLayout();

                this.listenTo(this.layout, Application.SHOW, function () {
                    console.dir(batch);
                    this.showBatchDetails(batch, allServices);
                    this.showStudents(batch);
                });


                this.show(this.layout, {
                    loading: {
                        entities: [batch, allServices]
                    }
                });
            },

            showBatchDetails: function (batch, allServices) {
                var batchDetailsView = new Show.views.BatchDetails({
                    model: batch,
                    allServices: allServices.getValueToTextMap('name')
                });

                this.layout.batchDetailsRegion.show(batchDetailsView);
            },

            showStudents: function(batch) {
                var studentView = new Show.views.StudentSection({
                    model: batch
                });
                this.layout.studentsRegion.show(studentView);
            },

            getLayout: function () {
                return new Show.views.Layout();
            }

        });


    });
});
