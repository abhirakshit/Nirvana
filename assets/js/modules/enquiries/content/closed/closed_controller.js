define([
    "modules/enquiries/content/closed/closed_view"
//    "modules/enquiries/content/base/base_view"
], function(){
    Application.module("Enquiries.Content.Closed", function(Closed, Application, Backbone, Marionette, $, _) {

        Closed.Controller = Application.Controllers.Base.extend({
            initialize: function() {
                var user = Application.request(Application.GET_LOGGED_USER);
                var closedEnquiries = Application.request(Application.GET_ENQUIRIES_CLOSED);
                this.layout = this.getLayout();

                this.listenTo(this.layout, Application.SHOW, function(){
                    this.setupClosedTabContent(user, closedEnquiries);
                });

                this.show(this.layout, {
                    loading: {
                        entities: [user, closedEnquiries]
                    }
                });
            },

            setupClosedTabContent: function(user, closedEnquiries) {
                var columns = new Application.Entities.Collection([
                    new Application.Entities.Model({columnName: "Name"}),
                    new Application.Entities.Model({columnName: "Created"}),
                    new Application.Entities.Model({columnName: "Phone"}),
                    new Application.Entities.Model({columnName: "Services"}),
                    new Application.Entities.Model({columnName: "Countries"}),
                    new Application.Entities.Model({columnName: "Closed On"}),
                    new Application.Entities.Model({columnName: "Assigned To"})
                ]);
//                this.setUpEnquiryTableView(closedEnquiries.models, columns, "Closed Enquiries", "closedTable", this.layout.pendingEnquiriesRegion);
                this.setUpEnquiryTableView(closedEnquiries, columns, "Closed Enquiries", "closedTable", this.layout.pendingEnquiriesRegion);
            },

            setUpEnquiryTableView: function(rows, headerColumns, tableTitle, tableId, region) {
//                var rows = new Application.Entities.StudentCollection(rowModels);
                var tableComposite = this.getTableView(tableId, tableTitle, headerColumns, rows);

                var that = this;
                this.listenTo(tableComposite, Application.ENQUIRY_SHOW, function(studentId){
                    Application.execute(Application.ENQUIRY_SHOW, that.options.region, studentId);
                });
                region.show(tableComposite);
            },

            getTableView: function(tableId, title, theadColumns, rows) {
                return new Closed.views.TableComposite({
//                return new Closed.parent.views.TableComposite({
                    model: new Application.Entities.Model({
                        tableId: tableId,
                        title: title,
                        theadColumns: theadColumns
                    }),
                    collection: rows
                });
            },

            getLayout: function() {
                return new Closed.views.Layout();
//                return new Closed.parent.views.Layout();
            }

        });



    });
});
