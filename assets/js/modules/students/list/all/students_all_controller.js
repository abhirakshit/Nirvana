define([
    "modules/students/list/all/students_all_view"
], function(){
    Application.module("Students.List.All", function(List_All, Application, Backbone, Marionette, $, _) {

        List_All.Controller = Application.Controllers.Base.extend({
            initialize: function() {
//                var user = Application.request(Application.GET_LOGGED_USER);
                var allStudents = Application.request(Application.GET_STUDENTS_ENROLLED);
                var allServices = Application.request(Application.GET_SERVICES);
                this.layout = this.getLayout();

                this.listenTo(this.layout, Application.SHOW, function(){
//                    if (this.options.byDate)
//                        this.setupAllDateTabContent(user, allStudents);
//                    else
                        this.setupTabContent( allStudents, allServices);
                });

                this.show(this.layout, {
                    loading: {
                        entities: [allStudents, allServices]
                    }
                });
            },

            setupTabContent: function(allStudents, allServices) {
                var headerColumns = new Application.Entities.Collection([
                    new Application.Entities.Model({columnName: "Name"}),
                    new Application.Entities.Model({columnName: "Phone"}),
                    new Application.Entities.Model({columnName: "Location"}),
                    new Application.Entities.Model({columnName: "Enroll Date"}),
                    new Application.Entities.Model({columnName: "Service"}),
                    new Application.Entities.Model({columnName: "Total Due (<i class='fa fa-rupee'>)"}),
                    new Application.Entities.Model({columnName: "Assigned To"})
                ]);
//                this.setupTableView(allStudents, columns, "Students", "allTable", this.layout.studentsRegion, allServices);

                var that = this;
    var title = '<i style="color: green;" class="i i-users3"></i>&nbsp;Students';



                var tableComposite = this.getTableView("allTable", title, headerColumns, allStudents);
                this.listenTo(tableComposite, Application.STUDENT_SHOW, function(studentId){
                    Application.execute(Application.STUDENT_SHOW, that.options.region, studentId);
                });
                this.layout.studentsRegion.show(tableComposite);

            },

            setupTableView: function(allStudents, headerColumns, tableTitle, tableId, region, allServices) {
                var tableComposite = this.getTableView(tableId, tableTitle, headerColumns, allStudents);
                region.show(tableComposite);
            },

            getTableView: function(tableId, title, theadColumns, rows) {
                return new Application.Views.Base.views.TableComposite({
                    model: new Application.Entities.Model({
                        tableId: tableId,
                        title: title,
                        theadColumns: theadColumns,
                        childClickEvt: Application.STUDENT_SHOW,
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
