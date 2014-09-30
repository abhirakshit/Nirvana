define([
    "modules/topics/list/all/topics_all_view"
], function(){
    Application.module("Topics.List.All", function(List_All, Application, Backbone, Marionette, $, _) {

        List_All.Controller = Application.Controllers.Base.extend({
            initialize: function() {
                var user = Application.request(Application.GET_LOGGED_USER);
                var allTopics = Application.request(Application.GET_TOPICS);
                var allServices = Application.request(Application.GET_SERVICES);
                this.layout = this.getLayout();

                this.listenTo(this.layout, Application.SHOW, function(){
//                    if (this.options.byDate)
//                        this.setupAllDateTabContent(user, allTopics);
//                    else
                        this.setupTabContent(user, allTopics, allServices);
                });

                this.show(this.layout, {
                    loading: {
                        entities: [user, allTopics, allServices]
                    }
                });
            },

            setupTabContent: function(user, allTopics, allServices) {
                var columns = new Application.Entities.Collection([
                    new Application.Entities.Model({columnName: "Name"}),
                    new Application.Entities.Model({columnName: "Section"}),
                    new Application.Entities.Model({columnName: "Duration"}),
                    new Application.Entities.Model({columnName: "Service"}),
                    new Application.Entities.Model({columnName: "Description"}),
                    new Application.Entities.Model({columnName: "Edit/Delete"})
                ]);
                
        var title = '<i style="color: green;" class="i i-stack"></i>&nbsp;Topics';

                this.setupTableView(allTopics, columns, title, "allTable", this.layout.topicsRegion, allServices);
            },

            setupTableView: function(allTopics, headerColumns, tableTitle, tableId, region, allServices) {
                var tableComposite = this.getTableView(tableId, tableTitle, headerColumns, allTopics);

                var that = this;
                //Edit
                this.listenTo(tableComposite, Application.TOPIC_SHOW, function(topicId){
                    that.showEditTopicModal(topicId, allServices, allTopics, tableComposite);
                });

                //Delete Class
                this.listenTo(tableComposite, Application.DELETE, function(topicId){
                    that.showDeleteTopicModal(topicId, allTopics);
                });
                region.show(tableComposite);
            },

            showDeleteTopicModal: function(topicId, allTopics) {
                //Show delete confirmation dialog
                var confirmationView = Application.Views.getConfirmationView("deleteTopicModal", "Delete Topic",
                    "Are you sure?", "Delete", true);

                this.listenTo(confirmationView, Application.CONFIRM, function() {
                    //Call delete with model
                    var topic = allTopics.get(topicId);
                    topic.destroy({
                        wait: true,
                        success: function (deletedTopic){
                            Application.Views.showSuccessMsg("Removed topic: " + deletedTopic.get('name'));
                        },

                        error: function(x, response) {
                            Application.Views.showErrorMsg("Error removing topic: " + topic.get('name'));
                            console.log("Error on server!! -- " + response.text);
                            return response;
                        }
                    })
                });
                Application.modalRegion.show(confirmationView);
            },

            showEditTopicModal: function(topicId, allServices, allTopics, tableView) {
                var topic = allTopics.get(topicId);
                topic.attributes.modalId = "editTopicModal";
                topic.attributes.formTitle = "Edit Topic";
                topic.attributes.formBtnText = "Update";

                var addTopicFormView = new List_All.parent.parent.views.AddTopicForm({
                    model: topic,
                    allServices: allServices.getIdToTextMap("name")
                });

                addTopicFormView.on(Application.SUBMIT, function(modalFormView, data){
                    //Save duration value in ms
                    var duration = moment.duration({
                        minutes: data.duration_min,
                        hours: data.duration_hr
                    });
                    data.duration = duration._milliseconds;

                    topic.save(data, {
                        wait: true,
                        success: function(newTopic){
                            Application.Views.showSuccessMsg("Updated topic: " + newTopic.get('name'));
                        },

                        error: function(newTopic, response) {
                            Application.Views.showErrorMsg("Could not update topic: " + newTopic.get('name'));
                            console.log("Error on server!! -- " + response.text);
                            return response;
                        }
                    });
                });
                Application.modalRegion.show(addTopicFormView);
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
