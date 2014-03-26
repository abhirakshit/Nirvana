define([], function () {
    Application.module("Profile.Counselor", function (Counselor, Application, Backbone, Marionette, $, _) {
        /** Setup */
        this.prefix = "Profile.Counselor";
        this.templatePath = "js/modules/";
        this.views = {};

        this.template = function (str) {
            return this.prefix + '-' + str;
        };
        /***/

        Counselor.views.Layout = Application.Views.Layout.extend({
            template: "profile/counselor/templates/layout",
            regions: {
                studentsRegion: "#students"
            }
        });

        var studentRowHtml = '<td><a href="#"><%= args.fullName %></a></td>'
        Counselor.views.AssignedStudentsRow = Application.Views.ItemView.extend({
            template: function(serialized_model){
                    return _.template(studentRowHtml, {
                        fullName: serialized_model.fullName
                    }, {variable: 'args'})
                },
            tagName: "tr"

        });

        Counselor.views.AssignedStudents = Application.Views.CompositeView.extend({
            template: "profile/counselor/templates/student_table",
            itemView: Counselor.views.AssignedStudentsRow,
            itemViewContainer: "tbody"
        })



    });
});