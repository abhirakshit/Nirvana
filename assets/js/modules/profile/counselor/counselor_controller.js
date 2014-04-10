define([
    "modules/profile/counselor/counselor_view",
//    "modules/entities/school",
    "modules/entities/user"
], function(){
    Application.module("Profile.Counselor", function(Counselor, Application, Backbone, Marionette, $, _) {
        Counselor.Controller = Application.Controllers.Base.extend({
            initialize: function() {
                var counselor = Application.request(Application.GET_LOGGED_USER);
                var studentsAssigned = Application.request(Application.GET_STUDENTS_ASSIGNED);
                this.layout = this.getLayout();

                this.listenTo(this.layout, Application.SHOW, function(){
                    this.showAssignedStudents(studentsAssigned)
                    Application.Views.addDataTables(this.layout);
                });

                this.show(this.layout, {
                    loading: {
                        entities: [counselor, studentsAssigned]
                    }
                });
            },

            showAssignedStudents: function(studentsAssigned) {
                var assignedStudentsView = new Counselor.views.AssignedStudents({
                    collection: studentsAssigned
                });
                this.layout.studentsRegion.show(assignedStudentsView);
            },

            getLayout: function() {
                return new Counselor.views.Layout();
            }
        });
    });
});