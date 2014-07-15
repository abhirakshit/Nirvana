define([], function(){
    Application.module("Entities", function(Entities, Application, Backbone, Marionette, $, _) {

      //Entities.allPaymentsUrl = "/countries";
        Entities.paymentUrl = "/payment";
        Entities.TotalpaymentUrl = "/totalpayment";

        Entities.Payment = Entities.Model.extend({
            urlRoot: Entities.paymentUrl,
            validation: {
                amount: {
                    required: true,
                    min: 1,
                    fn: 'lessThanDue'
                },
                receiptNumber: {required: true, min: 1},
                method: {required: true},
                paymentDate: {required: true},
                enroll: {required: true}
            },

            lessThanDue: function(value, attr, computedState) {
                if (value >= Number(computedState.due))
                    return "Amount is greater than due amount";
            }
        });
        
        Entities.TotalPayment = Entities.Model.extend({
            urlRoot: Entities.TotalpaymentUrl
        });


        Entities.PaymentCollection = Entities.Collection.extend({
            url: Entities.paymentUrl,
            model: Entities.Payment
        });


        Entities.TotalPaymentCollection = Entities.Collection.extend({
            url: Entities.paymentUrl,
            model: Entities.Enrollment
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

            getStudentTotalPayments: function(studentId) {
                if (!studentId)
                    return null;

                var payments = new Entities.TotalPaymentCollection();
                totalPayments.url = Entities.studentUrl + "/" + studentId + Entities.TotalpaymentUrl;
                totalPayments.fetch();
                return totalPayments;
            },


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

        Application.reqres.setHandler(Application.GET_TOTAL_PAYMENT, function(studentId){
            return API.getStudentTotalPayments(studentId);
        });
        // Application.reqres.setHandler(Application.GET_PAYMENT_BY_STUDENTID, function(studentId){
        //     return API.getPaymentByStudentId(studentId);
        // });
    })
});