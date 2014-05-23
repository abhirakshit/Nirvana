define([
    //Views
    "modules/topics/topics_view",

    //SubModules
    "modules/topics/list/all/topics_all_app",
//    "modules/topics/content/closed/closed_app",
//    "modules/topics/content/my/my_app",
//    "modules/topics/show/show_app",

    //Models
    "modules/entities/user",
//    "modules/entities/comment",
    "modules/entities/service",
//    "modules/entities/education",
//    "modules/entities/enquiryStatus"
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
//                    model: new Application.Entities.Model({
//                        modalId: Topics.addStudentModalFormId
//                    })
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
//                this.listenTo(addTopicButtonView, Topics.SHOW_NEW_TOPIC_MODAL, this.showNewTopicModal(allServices));
                this.listenTo(addTopicButtonView, Topics.SHOW_NEW_TOPIC_MODAL, function(){
                    that.showNewTopicModal(allServices)
                });
                this.layout.addButtonRegion.show(addTopicButtonView);

            },

            showNewTopicModal: function(allServices) {
                var newTopic = Application.request(Application.GET_TOPIC);
                newTopic.attributes.modalId = Topics.addTopicModalFormId;
                var addTopicFormView = new Topics.views.AddTopicForm({
                    model: newTopic,
                    allServices: allServices.getIdToTextMap("name")
                });

//                var that = this;
                addTopicFormView.on(Topics.CREATE_TOPIC, function(modalFormView, data){

                    //Save duration value in ms
                    var duration = moment.duration({
                        minutes: data.duration_min,
                        hours: data.duration_hr
                    });

                    data.duration = duration._milliseconds

                    modalFormView.model.save(data, {
                        wait: true,
                        patch: true,
                        success: function(newTopic){
                            console.log("Saved on server!!");
                            console.dir(newTopic);
//                            that.showTopic(newTopic);
                        },

                        error: function(x, response) {
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
//                else if (Topics.CLOSED_TAB === tabId) {
//                    Application.execute(Application.ENQUIRIES_CONTENT_CLOSED, this.layout.enqContentRegion);
//                }
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