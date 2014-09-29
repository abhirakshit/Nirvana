define([
    "modules/students/students_view",
    "modules/entities/user",
    "modules/entities/school",
    "modules/entities/country",
    "modules/students/show/show_app",
    "modules/students/list/all/students_all_app"

], function () {
    Application.module("Students", function (Students, Application, Backbone, Marionette, $, _) {

        Students.ACTIVE_TAB = "active";
        Students.ALL_TAB = "all";

        var tabCollection = new Application.Entities.Collection([
//            new Application.Entities.Model({text:"Active", id: Students.ACTIVE_TAB})
            new Application.Entities.Model({text:"All", id: Students.ALL_TAB})
//            new Application.Entities.Model({text:"Closed", id: Students.CLOSED_TAB})
        ]);

        Students.Controller = Application.Controllers.Base.extend({
            initialize: function () {
                var enrolledStudents = Application.request(Application.GET_STUDENTS_ENROLLED);
                var tabId = this.options.tabId;
                var studentId = this.options.studentId;

                this.layout = this.getLayout();
                this.listenTo(this.layout, Application.SHOW, function () {
                    if (studentId) {
                        //this is coming from URL
                        Application.execute(Application.STUDENT_SHOW, this.options.region, studentId);
                    } else {
                        if (!tabId)
                            tabId = Students.ALL_TAB;
                        this.showNavTabs(tabId);
                        this.showTab(tabId);
                    }
                });

                //Load layout
                this.show(this.layout, {
                    loading: { entities: enrolledStudents }
                });

            },

            showNavTabs: function (tabId) {
                var tabContainerView = new Application.Views.Base.views.TabContainer({
                    collection: tabCollection
                });
                this.layout.tabsRegion.show(tabContainerView);

                if (tabId) {
                    tabContainerView.selectTabView(tabId);
                    Application.navigate(Students.rootRoute + "/" +tabId);
                }

                var that = this;
                this.listenTo(tabContainerView, Application.TAB_SELECTED, function(tabId){
                    that.showTab(tabId);
                    tabContainerView.selectTabView(tabId);
                    Application.navigate(Students.rootRoute + "/" +tabId);
                });
            },

            showTab: function (tabId) {
                if (Students.ACTIVE_TAB === tabId) {
                    Application.execute(Application.STUDENTS_LIST_ACTIVE, this.layout.contentRegion);
                } else if (Students.ALL_TAB === tabId) {
                    Application.execute(Application.STUDENTS_LIST_ALL, this.layout.contentRegion);
                }
            },

            showStudents: function (user) {
                var studentsView = new Students.views.StudentsCollection({ collection: user});
                this.layout.changePasswordRegion.show(studentsView);
                var that = this;
                this.listenTo(studentsView, Application.STUDENT_SHOW, function (studentId) {
                    Application.execute(Application.STUDENT_SHOW, this.layout.enqContentRegion, studentId);
                });
            },

            getLayout: function () {
                return new Students.views.Layout();
            }
        });
    })
});