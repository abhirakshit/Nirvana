define([
    //Views
    "modules/batches/batches_view",

    //SubModules
    "modules/batches/list/all/batches_all_app",
//    "modules/batches/content/closed/closed_app",
    "modules/batches/show/batches_show_app",

    //Models
    "modules/entities/user",
    "modules/entities/service",
    "modules/entities/batch"
], function () {
    Application.module("Batches", function (Batches, Application, Backbone, Marionette, $, _) {

        //Event
        Batches.TAB_SELECTED = "tab:selected";

        //Enquiry Tab Id's
        Batches.CURRENT_TAB = "current";
        Batches.ALL_TAB = "all";
//        Batches.CLOSED_TAB = "closed";

        var tabCollection = new Application.Entities.Collection([
            new Application.Entities.Model({text:"Current", id: Batches.CURRENT_TAB}),
            new Application.Entities.Model({text:"All", id: Batches.ALL_TAB})
//            new Application.Entities.Model({text:"Closed", id: Batches.CLOSED_TAB})
        ]);

        Batches.Controller = Application.Controllers.Base.extend({
            initialize: function () {
                var user = Application.request(Application.GET_LOGGED_USER);
                var allServices = Application.request(Application.GET_SERVICES);
                var allBatches = Application.request(Application.GET_BATCHES);
                var tabId = this.options.tabId;
                var batchId = this.options.batchId;

                this.layout = this.getLayout();

                this.listenTo(this.layout, Application.SHOW, function () {
                    if (batchId) {
                        this.showNavTabs();
                        this.showBatch(batchId);
                    } else {
                        if (!tabId) //Show default tab
                            tabId = Batches.ALL_TAB;
                        this.showNavTabs(tabId, allServices, allBatches);
                        this.showTab(tabId);
                    }
                });

                this.show(this.layout, {
                    loading: {
                        entities: [user, allServices, allBatches]
                    }
                });
            },

            showNavTabs: function (tabId, allServices, allBatches) {
                var tabContainerView = new Batches.views.TabContainer({
                    collection: tabCollection
                });
                this.layout.tabsRegion.show(tabContainerView);
                if (tabId) {
                    tabContainerView.selectTabView(tabId);
                    Application.navigate(Batches.rootRoute + "/" +tabId);
                }

                var that = this;
                this.listenTo(tabContainerView, Batches.TAB_SELECTED, function(tabId){
                    that.showTab(tabId);
                    tabContainerView.selectTabView(tabId);
                    Application.navigate(Batches.rootRoute + "/" +tabId);
                });


                //Show the add button
                var addBatchButtonView = new Batches.views.AddBatchButton({
                    model: new Application.Entities.Model({
                        modalId: Batches.addBatchModalFormId,
                        text: "New Batch"
                    })
                });
//                this.listenTo(addBatchButtonView, Batches.SHOW_NEW_BATCH_MODAL, this.showNewBatchModal(allServices));
                this.listenTo(addBatchButtonView, Batches.SHOW_NEW_BATCH_MODAL, function(){
                    that.showNewBatchModal(allServices, allBatches)
                });
                this.layout.addButtonRegion.show(addBatchButtonView);

            },

            showNewBatchModal: function(allServices, allBatches) {
                var newBatch = Application.request(Application.GET_BATCH);
                newBatch.attributes.modalId = Batches.addBatchModalFormId;
                var addBatchFormView = new Batches.views.AddBatchForm({
                    model: newBatch,
                    allServices: allServices.getIdToTextMap("name")
                });

                var that = this;
                addBatchFormView.on(Batches.CREATE_BATCH, function(modalFormView, data){
                    modalFormView.model.save(data, {
                        wait: true,
                        patch: true,
                        success: function(newBatch){
                            console.log("Saved on server!!");
//                            console.dir(newBatch);
                            allBatches.add(newBatch);
                            that.showBatch(newBatch.id);

//                            Application.execute(Application.BATCHES_LIST_ALL, that.layout.contentRegion);

                        },

                        error: function(x, response) {
                            console.log("Error on server!! -- " + response.text);
                            return response;
                        }
                    });
                });
                Application.modalRegion.show(addBatchFormView);
            },

            showTab: function (tabId) {
//                Application.execute(Application.ENQUIRIES_CONTENT_SHOW, this.layout.enqContentRegion, tabId);
                if (Batches.CURRENT_TAB === tabId) {
                    Application.execute(Application.BATCHES_LIST_CURRENT, this.layout.contentRegion);
                } else if (Batches.ALL_TAB === tabId) {
                    Application.execute(Application.BATCHES_LIST_ALL, this.layout.contentRegion);
                }
//                else if (Batches.CLOSED_TAB === tabId) {
//                    Application.execute(Application.ENQUIRIES_CONTENT_CLOSED, this.layout.enqContentRegion);
//                }
            },

            showBatch: function(batchId) {
                Application.execute(Application.BATCH_SHOW, this.layout.contentRegion, batchId);
            },

            getLayout: function () {
                return new Batches.views.Layout();
            }

        });


    });
});
