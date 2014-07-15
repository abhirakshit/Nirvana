define([
    "modules/payments/list/all/payments_all_view"
], function(){
    Application.module("Payments.List.All", function(List_All, Application, Backbone, Marionette, $, _) {

        List_All.Controller = Application.Controllers.Base.extend({
            initialize: function() {
                var user = Application.request(Application.GET_LOGGED_USER);
                var allPayments = Application.request(Application.GET_PAYMENTS);
                this.layout = this.getLayout();

                this.listenTo(this.layout, Application.SHOW, function(){
//                    if (this.options.byDate)
//                        this.setupAllDateTabContent(user, allPayments);
//                    else
                        this.setupTabContent(user, allPayments);
                });

                this.show(this.layout, {
                    loading: {
                        entities: [user, allPayments]
                    }
                });
            },

            setupTabContent: function(user, allPayments) {
                var columns = new Application.Entities.Collection([
                    new Application.Entities.Model({columnName: "Name"}),
                    new Application.Entities.Model({columnName: "Section"}),
                    new Application.Entities.Model({columnName: "Duration"}),
                    new Application.Entities.Model({columnName: "Service"}),
                    new Application.Entities.Model({columnName: "Description"})
                ]);
                this.setupPaymentTableView(allPayments, columns, "Payments", "allTable", this.layout.paymentsRegion);
            },

            setupPaymentTableView: function(rows, headerColumns, tableTitle, tableId, region) {
//                var rows = new Application.Entities.StudentCollection(rowModels);
                var tableComposite = this.getTableView(tableId, tableTitle, headerColumns, rows);

                var that = this;
                this.listenTo(tableComposite, Application.PAYMENT_SHOW, function(paymentId){
                    Application.execute(Application.PAYMENT_SHOW, that.options.region, paymentId);
                });
                region.show(tableComposite);
            },

            getTableView: function(tableId, title, theadColumns, rows) {
                return new Application.Views.Base.views.TableComposite({
//                return new All.views.TableComposite({
                    model: new Application.Entities.Model({
                        tableId: tableId,
                        title: title,
                        theadColumns: theadColumns,
                        childClickEvt: Application.PAYMENT_SHOW,
                        rowView: List_All.views.Row
                    }),
                    collection: rows
                });
            },

            getLayout: function() {
                return new List_All.views.Layout();
            }

        });



    });
});
