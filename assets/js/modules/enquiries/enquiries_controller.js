define([
    //Views
    "modules/enquiries/enquiries_view",

    //SubModules
    "modules/enquiries/content/content_app",
    "modules/enquiries/show/show_app",

    //Models
    "modules/entities/user",
    "modules/entities/comment",
    "modules/entities/service",
    "modules/entities/education",
    "modules/entities/enquiryStatus"
], function () {
    Application.module("Enquiries", function (Enquiries, Application, Backbone, Marionette, $, _) {

        //Event
        Enquiries.TAB_SELECTED = "tab:selected";
        Enquiries.SELECTED_ENQUIRY = "selected:enquiry";

        //Enquiry Tab Id's
        Enquiries.MY_TAB = "my";
        Enquiries.ALL_BY_DATE_TAB = "allByDate";
        Enquiries.ALL_TAB = "all";
        Enquiries.JOINED_TAB = "joined";
        Enquiries.CLOSED_TAB = "closed";

        var tabCollection = new Application.Entities.Collection([
            new Application.Entities.Model({text:"My Enquiries", id: Enquiries.MY_TAB}),
            new Application.Entities.Model({text:"All By Date", id: Enquiries.ALL_BY_DATE_TAB}),
            new Application.Entities.Model({text:"All", id: Enquiries.ALL_TAB}),
            new Application.Entities.Model({text:"Joined", id: Enquiries.JOINED_TAB}),
            new Application.Entities.Model({text:"Closed", id: Enquiries.CLOSED_TAB})
        ]);

        Enquiries.Controller = Application.Controllers.Base.extend({
            initialize: function () {
                var user = Application.request(Application.GET_LOGGED_USER);
                var tabId = this.options.tabId;
                var studentId = this.options.studentId;

                this.layout = this.getLayout();

                this.listenTo(this.layout, Application.SHOW, function () {
                    if (studentId) {
                        this.showNavBar();
                        this.showEnquiry(studentId);
                    } else {
                        if (!tabId) //Show default tab
                            tabId = Enquiries.MY_TAB;
                        this.showNavBar(tabId);
                        this.showTab(tabId);
                    }
                });

                this.show(this.layout, {
                    loading: {
                        entities: [user]
                    }
                });
            },

            showNavBar: function (tabId) {
                var tabContainerView = new Enquiries.views.TabContainer({
                    collection: tabCollection,
                    model: new Application.Entities.Model({
                        modalId: Enquiries.addStudentModalFormId
                    })
                });
                this.layout.enqTabRegion.show(tabContainerView);
                if (tabId) {
                    tabContainerView.selectTabView(tabId);
                    Application.navigate(Enquiries.rootRoute + "/" +tabId);
                }

                var that = this;
                this.listenTo(tabContainerView, Enquiries.TAB_SELECTED, function(tabId){
                    that.showTab(tabId);
                    tabContainerView.selectTabView(tabId);
                    Application.navigate(Enquiries.rootRoute + "/" +tabId);
                });

//                this.listenTo(tabContainerView, Application.CREATE_STUDENT, this.createUser);
            },

//            createUser: function() {
//
//                //Show Modal Dialog
//                var newStudent = Application.request(Application.GET_STUDENT);
//                newStudent.attributes.modalId = Enquiries.addStudentModalFormId;
//                var addStudentModalView = new Enquiries.views.addStudentForm({
//                    model: newStudent
//                });
//
//                var that = this;
//                addStudentModalView.on(Enquiries.createStudentEvt, function(modalFormView, data){
////                    var data = Backbone.Syphon.serialize(modalFormView);
//                    modalFormView.model.save(data, {
//                        wait: true,
//                        patch: true,
//                        success: function(updatedStudent){
//                            console.log("Saved on server!!");
//                            console.dir(updatedStudent);
//                            that.showEnquiry(updatedStudent.id);
//
//                            //TODO: Update enquiry collection (Assigned to me or all)
//                        },
//
//                        error: function(x, response) {
//                            console.log("Error on server!! -- " + response.text)
//                            return response;
//                        }
//                    });
//                });
//                Application.modalRegion.show(addStudentModalView);
//            },

            showTab: function (tabId) {
                Application.execute(Application.ENQUIRIES_CONTENT_SHOW, this.layout.enqContentRegion, tabId);
            },

            showEnquiry: function(studentId) {
                Application.execute(Application.ENQUIRY_SHOW, this.layout.enqContentRegion, studentId);
            },

            getLayout: function () {
                return new Enquiries.views.Layout();
            }

        });


    });
});
