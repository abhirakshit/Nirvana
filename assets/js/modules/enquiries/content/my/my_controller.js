define([
    "modules/enquiries/content/my/my_view"
//    "modules/enquiries/content/base/base_view"
], function(){
    Application.module("Enquiries.Content.My", function(My, Application, Backbone, Marionette, $, _) {

        My.Controller = Application.Controllers.Base.extend({
            initialize: function() {
                var user = Application.request(Application.GET_LOGGED_USER);
                var studentsAssigned = Application.request(Application.GET_ENQUIRIES_ASSIGNED);
                this.layout = this.getLayout();

                this.listenTo(this.layout, Application.SHOW, function(){
                    this.setupMyTabContent(user, studentsAssigned);
                });

                this.show(this.layout, {
                    loading: {
                        entities: [user, studentsAssigned]
                    }
                });
            },

            setupMyTabContent: function(user, studentsAssigned) {
                var pendingModels = _.filter(studentsAssigned.models,
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
                    new Application.Entities.Model({columnName: "Status"})
                ]);
                var title = 'Pending Enquiries&nbsp;<i style="color: red;" class="fa fa-exclamation-triangle"></i>'
                this.setUpEnquiryTableView(pendingModels, pendingColumns, title, "pendingTable",this.layout.pendingEnquiriesRegion);


                //Todays
                var todaysModels = _.filter(studentsAssigned.models, function(student){
                    return moment().isSame(student.get('followUp'), 'day');
                });
                var todaysColumns = new Application.Entities.Collection([
                    new Application.Entities.Model({columnName: "Name"}),
                    new Application.Entities.Model({columnName: "Created"}),
                    new Application.Entities.Model({columnName: "Phone"}),
                    new Application.Entities.Model({columnName: "Services"}),
                    new Application.Entities.Model({columnName: "Countries"}),
                    new Application.Entities.Model({columnName: "Status"})
                ]);
                this.setUpEnquiryTableView(todaysModels, todaysColumns, "Todays Enquiries", "todaysTable", this.layout.todaysEnquiriesRegion);

                //Future
                var futureModels = _.filter(studentsAssigned.models, function(student){
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
                return new My.views.TableComposite({
//                return new My.parent.views.TableComposite({
                    model: new Application.Entities.Model({
                        tableId: tableId,
                        title: title,
                        theadColumns: theadColumns
                    }),
                    collection: rows
                });
            },

            getLayout: function() {
                return new My.views.Layout();
//                return new My.parent.views.Layout();
            }

        });



    });
});
