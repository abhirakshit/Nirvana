define([], function(){
    Application.module("Entities", function(Entities, Application, Backbone, Marionette, $, _) {

        Entities.paymentUrl = "/payment";

        Entities.Comment = Entities.Model.extend({
            urlRoot: Entities.paymentUrl,
            validation: {
                name: {required: true}
            }
        });

        Entities.CommentCollection = Entities.Collection.extend({
            url: Entities.paymentUrl,
            model: Entities.Comment
        });

        var API = {
            getStudentPayment: function(studentId) {
                if (!studentId)
                    return null;

                var payments = new Entities.CommentCollection();
                payments.url = Entities.studentUrl + "/" + studentId + Entities.paymentUrl;
                payments.fetch();
                return payments;
            }

        };

        Application.reqres.setHandler(Application.GET_STUDENT_PAYMENTS, function(studentId){
            return API.getStudentPayment(studentId);
        });


    })
});