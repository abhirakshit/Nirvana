define([
    "modules/batches/list/all/all_view"
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
                    new Application.Entities.Model({columnName: "Created"}),
                    new Application.Entities.Model({columnName: "Follow Up"}),
                    new Application.Entities.Model({columnName: "Phone"}),
                    new Application.Entities.Model({columnName: "Services"}),
                    new Application.Entities.Model({columnName: "Countries"}),
                    new Application.Entities.Model({columnName: "Status"}),
                    new Application.Entities.Model({columnName: "Assigned To"})
                ]);
                this.setUpEnquiryTableView(allBatches.models, columns, "Batches", "allTable", this.layout.pendingBatchesRegion);
//                this.setUpEnquiryTableView(allBatches, columns, "Batches", "allTable", this.layout.pendingBatchesRegion);
            },

//            setupAllDateTabContent: function(user, allBatches) {
//                var pendingModels = _.filter(allBatches.models,
//                    function(enquiry){
//                        return moment().isAfter(enquiry.get('followUp'), 'day');
//                    }
//                );
//
//                var pendingColumns = new Application.Entities.Collection([
//                    new Application.Entities.Model({columnName: "Name"}),
//                    new Application.Entities.Model({columnName: "Created"}),
//                    new Application.Entities.Model({columnName: "Follow Up"}),
//                    new Application.Entities.Model({columnName: "Phone"}),
//                    new Application.Entities.Model({columnName: "Services"}),
//                    new Application.Entities.Model({columnName: "Countries"}),
//                    new Application.Entities.Model({columnName: "Status"}),
//                    new Application.Entities.Model({columnName: "Assigned To"})
//                ]);
//                var title = 'Pending Batches&nbsp;<i style="color: red;" class="fa fa-exclamation-triangle"></i>';
////                this.setUpEnquiryTableView(pendingModels, pendingColumns, "Pending Batches", "pendingTable",this.layout.pendingBatchesRegion);
//                this.setUpEnquiryTableView(pendingModels, pendingColumns, title, "pendingTable",this.layout.pendingBatchesRegion);
//
//
//                //Todays
//                var todaysModels = _.filter(allBatches.models, function(enquiry){
//                    return moment().isSame(enquiry.get('followUp'), 'day');
//                });
//                var todaysColumns = new Application.Entities.Collection([
//                    new Application.Entities.Model({columnName: "Name"}),
//                    new Application.Entities.Model({columnName: "Created"}),
//                    new Application.Entities.Model({columnName: "Phone"}),
//                    new Application.Entities.Model({columnName: "Services"}),
//                    new Application.Entities.Model({columnName: "Countries"}),
//                    new Application.Entities.Model({columnName: "Status"}),
//                    new Application.Entities.Model({columnName: "Assigned To"})
//                ]);
//                this.setUpEnquiryTableView(todaysModels, todaysColumns, "Todays Batches", "todaysTable", this.layout.todaysBatchesRegion);
//
//                //Future
//                var futureModels = _.filter(allBatches.models, function(student){
//                    return moment().isBefore(student.get('followUp'), 'day');
////                    return moment().isBefore(student.get('followUp'));
//                });
//
//                this.setUpEnquiryTableView(futureModels, pendingColumns, "Future Batches", "futureTable",this.layout.futureBatchesRegion);
//            },

            setUpEnquiryTableView: function(rowModels, headerColumns, tableTitle, tableId, region) {
                var rows = new Application.Entities.StudentCollection(rowModels);
                var tableComposite = this.getTableView(tableId, tableTitle, headerColumns, rows);

                var that = this;
                this.listenTo(tableComposite, Application.ENQUIRY_SHOW, function(studentId){
                    Application.execute(Application.ENQUIRY_SHOW, that.options.region, studentId);
                });
                region.show(tableComposite);
            },

            getTableView: function(tableId, title, theadColumns, rows) {
                return new All.views.TableComposite({
//                return new All.parent.views.TableComposite({
                    model: new Application.Entities.Model({
                        tableId: tableId,
                        title: title,
                        theadColumns: theadColumns
                    }),
                    collection: rows
                });
            },

            getLayout: function() {
                return new All.views.Layout();
            }

        });



    });
});
