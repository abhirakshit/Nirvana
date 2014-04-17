define([], function(){
    Application.module("Students", function(Students, Application, Backbone, Marionette, $, _) {
        //Setup
        this.prefix = "Students";
        this.templatePath = "js/modules/";
        this.views = {};

        this.template = function (str) {
            return this.prefix + '-' + str;
        };

        // This has been added to only keep class naming consistent with views.
        this.models = {};
        this.collections = {};
        //*************


        Students.views.Layout = Application.Views.Layout.extend({
            template: "students/templates/students_layout",

            regions : {
                profileRegion: "#profileSection",
                changePasswordRegion: "#changePasswordSection",
                adminRegion: "#adminSection"
            }
        });




        Students.views.Show = Application.Views.ItemView.extend({
            className: 'studentsClass',
            template: 'students/templates/show_student'

        });

        Students.views.StudentsCollection = Application.Views.CollectionView.extend({
            itemView: Students.views.Show,
            template: 'students/templates/show_students'

        });


    })
});