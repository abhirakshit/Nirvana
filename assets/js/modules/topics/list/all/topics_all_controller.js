define([
    "modules/topics/list/all/topics_all_view"
], function(){
    Application.module("Topics.List.All", function(List_All, Application, Backbone, Marionette, $, _) {

        List_All.Controller = Application.Controllers.Base.extend({
            initialize: function() {
                var user = Application.request(Application.GET_LOGGED_USER);
                var allTopics = Application.request(Application.GET_TOPICS);
                this.layout = this.getLayout();

                this.listenTo(this.layout, Application.SHOW, function(){
//                    if (this.options.byDate)
//                        this.setupAllDateTabContent(user, allTopics);
//                    else
                        this.setupAllTabContent(user, allTopics);
                });

                this.show(this.layout, {
                    loading: {
                        entities: [user, allTopics]
                    }
                });
            },

            setupAllTabContent: function(user, allTopics) {
                var columns = new Application.Entities.Collection([
                    new Application.Entities.Model({columnName: "Name"}),
                    new Application.Entities.Model({columnName: "Section"}),
                    new Application.Entities.Model({columnName: "Duration"}),
                    new Application.Entities.Model({columnName: "Service"}),
                    new Application.Entities.Model({columnName: "Description"})
                ]);
                this.setupTopicTableView(allTopics, columns, "Topics", "allTable", this.layout.topicsRegion);
            },

            setupTopicTableView: function(rows, headerColumns, tableTitle, tableId, region) {
//                var rows = new Application.Entities.StudentCollection(rowModels);
                var tableComposite = this.getTableView(tableId, tableTitle, headerColumns, rows);

                var that = this;
                this.listenTo(tableComposite, Application.TOPIC_SHOW, function(topicId){
                    console.log("Show topic");
                    Application.execute(Application.TOPIC_SHOW, that.options.region, topicId);
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
                        childClickEvt: Application.TOPIC_SHOW,
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
