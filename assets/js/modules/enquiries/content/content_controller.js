define([
    "modules/enquiries/content/content_view"
], function(){
    Application.module("Enquiries.Content", function(Content, Application, Backbone, Marionette, $, _) {

        Content.Controller = Application.Controllers.Base.extend({
            initialize: function() {
                var user = Application.request(Application.GET_LOGGED_USER);
                var studentsAssigned = Application.request(Application.GET_STUDENTS_ASSIGNED);
                this.layout = this.getLayout();

                this.listenTo(this.layout, Application.SHOW, function(){
                    this.setupContent(user, studentsAssigned);
                });

                this.show(this.layout, {
                    loading: {
                        entities: user
                    }
                });
            },

            setupContent: function(user, studentsAssigned) {
                if (this.options.tabId === Content.parent.MY_TAB) {
                    this.setupMyTabContent(user, studentsAssigned);
                }
            },

            setupMyTabContent: function(user, studentsAssigned) {
                //Pending Region
                var pendingColumns = new Application.Entities.Collection([
                    new Application.Entities.Model({columnName: "Name"}),
                    new Application.Entities.Model({columnName: "Phone"})
                ]);
                var enquiriesComposite = this.getTableView("Pending Enquiries", pendingColumns, studentsAssigned);

                var that = this;
                this.listenTo(enquiriesComposite, Content.parent.SELECTED_ENQUIRY, function(studentId){
                    Application.execute(Application.ENQUIRY_SHOW, that.options.region, studentId);
                });

                this.layout.enquiriesRegion.show(enquiriesComposite);

            },

            getTableView: function(title, theadColumns, rows) {
                return new Content.views.TableComposite({
                    model: new Application.Entities.Model({
                        title: title,
                        theadColumns: theadColumns
                    }),
                    collection: rows
                });
            },

            getLayout: function() {
                return new Content.views.Layout();
            }

        });



    });
});
