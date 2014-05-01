define([
    "modules/enquiries/content/all/all_view"
], function(){
    Application.module("Enquiries.Content.All", function(All, Application, Backbone, Marionette, $, _) {

        All.Controller = Application.Controllers.Base.extend({
            initialize: function() {
                var user = Application.request(Application.GET_LOGGED_USER);
                var allStudents = Application.request(Application.GET_STUDENTS);
                this.layout = this.getLayout();

                this.listenTo(this.layout, Application.SHOW, function(){
                    if (this.options.byDate)
                        this.setupAllDateTabContent(user, allStudents);
                    else
                        this.setupAllTabContent(user, allStudents);
                });

                this.show(this.layout, {
                    loading: {
                        entities: [user, allStudents]
                    }
                });
            },

            setupAllTabContent: function(user, allStudents) {
                var pendingColumns = new Application.Entities.Collection([
                    new Application.Entities.Model({columnName: "Name"}),
                    new Application.Entities.Model({columnName: "Created"}),
                    new Application.Entities.Model({columnName: "Follow Up"}),
                    new Application.Entities.Model({columnName: "Phone"}),
                    new Application.Entities.Model({columnName: "Services"}),
                    new Application.Entities.Model({columnName: "Countries"}),
                    new Application.Entities.Model({columnName: "Status"}),
                    new Application.Entities.Model({columnName: "Assigned To"})
                ]);
                this.setUpEnquiryTableView(allStudents.models, pendingColumns, "Enquiries", "allTable", this.layout.pendingEnquiriesRegion);
            },

            setupAllDateTabContent: function(user, allStudents) {
                var pendingModels = _.filter(allStudents.models,
                    function(student){
                        return moment().isAfter(student.get('followUp'), 'day');
                    }
                );

                var pendingColumns = new Application.Entities.Collection([
                    new Application.Entities.Model({columnName: "Name"}),
                    new Application.Entities.Model({columnName: "Created"}),
                    new Application.Entities.Model({columnName: "Follow Up"}),
                    new Application.Entities.Model({columnName: "Phone"}),
                    new Application.Entities.Model({columnName: "Services"}),
                    new Application.Entities.Model({columnName: "Countries"}),
                    new Application.Entities.Model({columnName: "Status"}),
                    new Application.Entities.Model({columnName: "Assigned To"})
                ]);
                this.setUpEnquiryTableView(pendingModels, pendingColumns, "Pending Enquiries", "pendingTable",this.layout.pendingEnquiriesRegion);


                //Todays
                var todaysModels = _.filter(allStudents.models, function(student){
                    return moment().isSame(student.get('followUp'), 'day');
                });
                var todaysColumns = new Application.Entities.Collection([
                    new Application.Entities.Model({columnName: "Name"}),
                    new Application.Entities.Model({columnName: "Created"}),
                    new Application.Entities.Model({columnName: "Phone"}),
                    new Application.Entities.Model({columnName: "Services"}),
                    new Application.Entities.Model({columnName: "Countries"}),
                    new Application.Entities.Model({columnName: "Status"}),
                    new Application.Entities.Model({columnName: "Assigned To"})
                ]);
                this.setUpEnquiryTableView(todaysModels, todaysColumns, "Todays Enquiries", "todaysTable", this.layout.todaysEnquiriesRegion);

                //Future
                var futureModels = _.filter(allStudents.models, function(student){
                    return moment().isBefore(student.get('followUp'), 'day');
//                    return moment().isBefore(student.get('followUp'));
                });

                this.setUpEnquiryTableView(futureModels, pendingColumns, "Future Enquiries", "futureTable",this.layout.futureEnquiriesRegion);
            },

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
