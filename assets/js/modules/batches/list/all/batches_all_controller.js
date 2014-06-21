define([
    "modules/batches/list/all/batches_all_view"
], function(){
    Application.module("Batches.List.All", function(All, Application, Backbone, Marionette, $, _) {

        All.Controller = Application.Controllers.Base.extend({
            initialize: function() {
                var user = Application.request(Application.GET_LOGGED_USER);
                var allBatches = Application.request(Application.GET_BATCHES);
                this.layout = this.getLayout();

                this.listenTo(this.layout, Application.SHOW, function(){
//                    if (this.options.byDate)
//                        this.setupAllDateTabContent(user, allBatches);
//                    else
                        this.setupAllTabContent(user, allBatches);
                });

                this.show(this.layout, {
                    loading: {
                        entities: [user, allBatches]
                    }
                });
            },

            setupAllTabContent: function(user, allBatches) {
                var columns = new Application.Entities.Collection([
                    new Application.Entities.Model({columnName: "Name"}),
                    new Application.Entities.Model({columnName: "Start Date"}),
                    new Application.Entities.Model({columnName: "End Date"}),
                    new Application.Entities.Model({columnName: "Service"}),
                    new Application.Entities.Model({columnName: "Type"})
                ]);
                this.setupBatchTableView(allBatches, columns, "Batches", "allTable", this.layout.batchesRegion);
            },

            setupBatchTableView: function(rows, headerColumns, tableTitle, tableId, region) {
//                var tableComposite = this.getTableView(tableId, tableTitle, headerColumns, rows, Application.BATCH_SHOW, All.views.Row);
                var tableComposite = Application.Views.getTableView(tableId, tableTitle, headerColumns, rows, Application.BATCH_SHOW, All.views.Row);

                var that = this;
                this.listenTo(tableComposite, Application.BATCH_SHOW, function(batchId){
                    Application.execute(Application.BATCH_SHOW, that.options.region, batchId);
                });
                region.show(tableComposite);
            },

//            getTableView: function(tableId, title, theadColumns, rows, childClickEvt, rowView) {
//                return new Application.Views.Base.views.TableComposite({
////                return new All.views.TableComposite({
//                    model: new Application.Entities.Model({
//                        tableId: tableId,
//                        title: title,
//                        theadColumns: theadColumns,
//                        childClickEvt: childClickEvt,
//                        rowView: rowView
//                    }),
//                    collection: rows
//                });
//            },

            getLayout: function() {
                return new All.views.Layout();
            }

        });



    });
});
