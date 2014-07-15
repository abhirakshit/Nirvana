define([
    "modules/batches/list/all/batches_all_view"
], function () {
    Application.module("Batches.List.All", function (All, Application, Backbone, Marionette, $, _) {

        All.Controller = Application.Controllers.Base.extend({
            initialize: function () {
                var user = Application.request(Application.GET_LOGGED_USER);
//                var allBatches = Application.request(Application.GET_BATCHES);
                var allBatches;
                if (this.options.showAll)
                    allBatches = Application.request(Application.GET_BATCHES);
                else
                    allBatches = Application.request(Application.GET_BATCHES_CURRENT);


                    this.layout = this.getLayout();

                this.listenTo(this.layout, Application.SHOW, function () {
                    this.setupTabContent(user, allBatches);
                });

                this.show(this.layout, {
                    loading: {
                        entities: [user, allBatches]
                    }
                });
            },

            setupTabContent: function (user, allBatches) {
                var columns = new Application.Entities.Collection([
                    new Application.Entities.Model({columnName: "Name"}),
                    new Application.Entities.Model({columnName: "Start Date"}),
                    new Application.Entities.Model({columnName: "End Date"}),
                    new Application.Entities.Model({columnName: "Service"}),
                    new Application.Entities.Model({columnName: "Type"})
                ]);
                this.setupBatchTableView(allBatches, columns, "Batches", "allTable", this.layout.batchesRegion);
            },

            setupBatchTableView: function (allBatches, headerColumns, tableTitle, tableId, region) {
                var tableComposite = Application.Views.getTableView(tableId, tableTitle, headerColumns, allBatches, Application.BATCH_SHOW, All.views.Row);

                var that = this;
                this.listenTo(tableComposite, Application.BATCH_SHOW, function (batchId) {
                    Application.execute(Application.BATCH_SHOW, that.options.region, batchId);
                });

                region.show(tableComposite);
            },

            getLayout: function () {
                return new All.views.Layout();
            }

        });


    });
});
