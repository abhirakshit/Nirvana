define([], function(){
    Application.module("Entities", function(Entities, Application, Backbone, Marionette, $, _) {

//        Entities.allPaymentsUrl = "/countries";
        Entities.paymentUrl = "/payment";

        Entities.Payment = Entities.Model.extend({
            urlRoot: Entities.paymentUrl,
            validation: {
                amount: {required: true},
                receiptNumber: {required: true, min: 1},
                method: {required: true},
                paymentDate: {required: true},
                enroll: {required: true}

            }
        });

        Entities.PaymentCollection = Entities.Collection.extend({
//            url: Entities.allPaymentsUrl,
            url: Entities.paymentUrl,
            model: Entities.Payment
        });

        var API = {
            getPayment: function(paymentId) {
                if (!paymentId)
                    return new Entities.Payment();

                var payment = new Entities.Payment();
                payment.id = paymentId;
                payment.fetch();
                return payment;
            },

            // getPaymentByStudentId: function(studentId){
            //     if(!studentId)
            //         return new Entities.Payment();

            //     var payment = new Entities.Payment();
            //     payment.student = studentId;
            //     payment.fetch();
            //     return payment;
            // },

            getAllPayments: function(update) {
                //Update is called after a new payment is added/removed and the collection needs to be updated
                if (!Entities.allPayments || update){
                    Entities.allPayments = new Entities.PaymentCollection();
                    Entities.allPayments.fetch();
                }
                return Entities.allPayments;
            }
        };

        Application.reqres.setHandler(Application.GET_PAYMENTS, function(update){
            return API.getAllPayments(update);
        });

        Application.reqres.setHandler(Application.GET_PAYMENT, function(paymentId){
            return API.getPayment(paymentId);
        });
        // Application.reqres.setHandler(Application.GET_PAYMENT_BY_STUDENTID, function(studentId){
        //     return API.getPaymentByStudentId(studentId);
        // });
    })
});