define([], function(){
    Application.module("Entities", function(Entities, Application, Backbone, Marionette, $, _) {

        Entities.enrollmentUrl = "/enrollment";

        Entities.Enrollment = Entities.Model.extend({
            urlRoot: Entities.enrollmentUrl,
            validation: {
                name: {required: true}
            }
        });

        Entities.EnrollmentCollection = Entities.Collection.extend({
            url: Entities.enrollmentUrl,
            model: Entities.Enrollment
        });

        var API = {
            getStudentEnrollments: function(studentId) {
                if (!studentId)
                    return null;

                var enrollments = new Entities.EnrollmentCollection();
                enrollments.url = Entities.studentUrl + "/" + studentId + Entities.enrollmentUrl;
                enrollments.fetch();
                return enrollments;
            }

        };

        Application.reqres.setHandler(Application.GET_STUDENT_ENROLLMENTS, function(studentId){
            return API.getStudentEnrollments(studentId);
        });


    })
});