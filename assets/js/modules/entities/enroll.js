define([], function(){
    Application.module("Entities", function(Entities, Application, Backbone, Marionette, $, _) {

//        Entities.allEnrollsUrl = "/countries";
        Entities.enrollUrl = "/enroll";

        Entities.Enroll = Entities.Model.extend({
            urlRoot: Entities.enrollUrl,
            validation: {
                service: {required: true},
                totalFee: {required: true, min: 1},
                enrollDate: {required: true}

            }
        });

        Entities.EnrollCollection = Entities.Collection.extend({
//            url: Entities.allEnrollsUrl,
            url: Entities.enrollUrl,
            model: Entities.Enroll
        });

        var API = {
            getEnroll: function(enrollId) {
                if (!enrollId)
                    return new Entities.Enroll();

                var enroll = new Entities.Enroll();
                enroll.id = enrollId;
                enroll.fetch();
                return enroll;
            },

            getEnrollByStudentId: function(studentId){
                if(!studentId)
                    return new Entities.Enroll();

                var enroll = new Entities.Enroll();
                enroll.student = studentId;
                enroll.fetch();
                return enroll;
            },

            getAllEnrolls: function(update) {
                //Update is called after a new enroll is added/removed and the collection needs to be updated
                if (!Entities.allEnrolls || update){
                    Entities.allEnrolls = new Entities.EnrollCollection();
                    Entities.allEnrolls.fetch();
                }
                return Entities.allEnrolls;
            }
        };

        Application.reqres.setHandler(Application.GET_ENROLLMENTS, function(update){
            return API.getAllEnrolls(update);
        });

        Application.reqres.setHandler(Application.GET_ENROLLMENT, function(enrollId){
            return API.getEnroll(enrollId);
        });

        Application.reqres.setHandler(Application.GET_ENROLLMENT_BY_STUDENTID, function(studentId){
            return API.getEnrollByStudentId(studentId);
        });
    })
});