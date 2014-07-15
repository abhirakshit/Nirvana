define([], function(){
    Application.module("Students", function(Students, Application, Backbone, Marionette, $, _) {
        //Setup
        this.prefix = "Students";
        this.templatePath = "js/modules/";
        this.views = {};

        this.template = function (str) {
            return this.prefix + '-' + str;
        };

//        // This has been added to only keep class naming consistent with views.
//        this.models = {};
//        this.collections = {};
//        //*************


        Students.views.Layout = Application.Views.Layout.extend({
            template: "views/templates/page_layout",
            regions: {
                tabsRegion: "#tabs",
                addButtonRegion: "#addButton",
                contentRegion: "#content"
            }

//            template: "students/templates/students_layout",
//
//            regions : {
//                profileRegion: "#profileSection",
//                changePasswordRegion: "#changePasswordSection",
//                adminRegion: "#adminSection"
//            }
        });




        Students.views.Show = Application.Views.ItemView.extend({
            className: 'studentsClass',
            template: 'students/templates/show_student',
            events: {
                "click": "selectedStudent"
            },

            selectedStudent: function(evt){
                evt.preventDefault();
                this.trigger(Application.STUDENT_SHOW, this.model);
            }

        });

//Application.SELECTED_STUDENT = 'student:show';

        Students.views.StudentsCollection = Application.Views.CollectionView.extend({
            itemView: Students.views.Show,
            template: 'students/templates/show_students',

            initialize: function(){
                
                var that = this;
                this.on(Application.CHILD_VIEW + ":" + Application.STUDENT_SHOW, function(childView){

                  //  console.dir(childView.model);
                   // console.log('COLLECTIONVIEW HELLO!!!!');
                    that.trigger(Application.STUDENT_SHOW, childView.model.get('id'));

                });
            }

        });


    })
});