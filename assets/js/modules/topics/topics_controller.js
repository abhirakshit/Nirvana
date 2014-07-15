define([
    //Views
    "modules/topics/topics_view",

    //SubModules
    "modules/topics/list/all/topics_all_app",

    //Models
    "modules/entities/user",
    "modules/entities/service",
    "modules/entities/topic"
], function () {
    Application.module("Topics", function (Topics, Application, Backbone, Marionette, $, _) {

        //Event
        Topics.TAB_SELECTED = "tab:selected";

        //Enquiry Tab Id's
        Topics.CURRENT_TAB = "current";
        Topics.ALL_TAB = "all";
//        Topics.CLOSED_TAB = "closed";

        var tabCollection = new Application.Entities.Collection([
//            new Application.Entities.Model({text:"Current", id: Topics.CURRENT_TAB}),
            new Application.Entities.Model({text:"All", id: Topics.ALL_TAB})
//            new Application.Entities.Model({text:"Closed", id: Topics.CLOSED_TAB})
        ]);

        Topics.Controller = Application.Controllers.Base.extend({
            initialize: function () {
                var user = Application.request(Application.GET_LOGGED_USER);
                var allServices = Application.request(Application.GET_SERVICES);
//                var allTopics = Application.request(Application.GET_TOPICS);
                var tabId = this.options.tabId;
//                var studentId = this.options.studentId;

                this.layout = this.getLayout();

                this.listenTo(this.layout, Application.SHOW, function () {
//                    if (studentId) {
//                        this.showNavTabs();
//                        this.showEnquiry(studentId);
//                    } else {
                        if (!tabId) //Show default tab
                            tabId = Topics.ALL_TAB;
                        this.showNavTabs(tabId, allServices);
                        this.showTab(tabId);
//                    }
                });

                this.show(this.layout, {
                    loading: {
                        entities: [user, allServices]
                    }
                });
            },

            showNavTabs: function (tabId, allServices) {
                var tabContainerView = new Topics.views.TabContainer({
                    collection: tabCollection
                });
                this.layout.tabsRegion.show(tabContainerView);

                if (tabId) {
                    tabContainerView.selectTabView(tabId);
                    Application.navigate(Topics.rootRoute + "/" +tabId);
                }

                var that = this;
                this.listenTo(tabContainerView, Topics.TAB_SELECTED, function(tabId){
                    that.showTab(tabId);
                    tabContainerView.selectTabView(tabId);
                    Application.navigate(Topics.rootRoute + "/" +tabId);
                });

                //Show the add button
                var addTopicButtonView = new Topics.views.AddTopicButton({
                    model: new Application.Entities.Model({
                        modalId: Topics.addTopicModalFormId,
                        text: "New Topic"
                    })
                });
                this.listenTo(addTopicButtonView, Topics.SHOW_NEW_TOPIC_MODAL, function(){
                    that.showNewTopicModal(allServices)
                });
                this.layout.addButtonRegion.show(addTopicButtonView);

            },

            showNewTopicModal: function(allServices) {
                var newTopic = Application.request(Application.GET_TOPIC);
                newTopic.attributes.modalId = Topics.addTopicModalFormId;
                newTopic.attributes.formTitle = "Add Topic";
                newTopic.attributes.formBtnText = "Create";
                var addTopicFormView = new Topics.views.AddTopicForm({
                    model: newTopic,
                    allServices: allServices.getIdToTextMap("name")
                });

                addTopicFormView.on(Application.SUBMIT, function(modalFormView, data){
                    //Save duration value in ms
                    var duration = moment.duration({
                        minutes: data.duration_min,
                        hours: data.duration_hr
                    });

                    data.duration = duration._milliseconds

                    newTopic.save(data, {
                        wait: true,
                        success: function(savedTopic){
                            Application.execute(Application.UPDATE_TOPICS, savedTopic);
                            Application.Views.showSuccessMsg("Added topic: " + savedTopic.get('name'));
                        },

                        error: function(x, response) {
                            Application.Views.showErrorMsg("Could not update topic: " + newTopic.get('name'));
                            console.log("Error on server!! -- " + response.text);
                            return response;
                        }
                    });
                });
                Application.modalRegion.show(addTopicFormView);
            },

            showTab: function (tabId) {
//                Application.execute(Application.ENQUIRIES_CONTENT_SHOW, this.layout.enqContentRegion, tabId);
                if (Topics.CURRENT_TAB === tabId) {
                    Application.execute(Application.TOPICS_LIST_CURRENT, this.layout.contentRegion);
                } else if (Topics.ALL_TAB === tabId) {
                    Application.execute(Application.TOPICS_LIST_ALL, this.layout.contentRegion);
                }
            },

            showEnquiry: function(studentId) {
                Application.execute(Application.ENQUIRY_SHOW, this.layout.contentRegion, studentId);
            },

            getLayout: function () {
                return new Topics.views.Layout();
            }

        });


    });
});
