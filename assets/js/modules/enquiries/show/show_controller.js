define([
    "modules/enquiries/show/show_view"
], function () {
    Application.module("Enquiries.Show", function (Show, Application, Backbone, Marionette, $, _) {

        Show.Controller = Application.Controllers.Base.extend({
            initialize: function () {
//                var user = Application.request(Application.GET_LOGGED_USER);
//                var student = Application.request(Application.GET_STUDENT, this.options.studentId);
                var student = Application.request(Application.GET_USER, this.options.studentId);
                this.layout = this.getLayout();

                this.listenTo(this.layout, Application.SHOW, function () {
                    this.showStudent(student)
                });


                this.show(this.layout, {
                    loading: {
                        entities: student
                    }
                });
            },

            showStudent: function (student) {
                var personalView = new Show.views.Personal({
                    model: student
                });
                this.layout.personalRegion.show(personalView);

                var academicView = new Show.views.Academic({
                    model: student
                });
                this.layout.academicRegion.show(academicView);
            },

            getLayout: function () {
                return new Show.views.Layout();
            }

        });


    });
});
