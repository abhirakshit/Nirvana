define([
    "modules/enquiries/show/show_controller"
], function () {
    Application.module("Enquiries.Show", function (Show, Application, Backbone, Marionette, $, _) {
        var API = {
            show: function (enqContentRegion, studentId) {
                new Show.Controller({
                    region: enqContentRegion,
                    studentId: studentId
                });
            }
        };

        Application.commands.setHandler(Application.ENQUIRY_SHOW, function (enqContentRegion, studentId) {
            console.log("Show Student: " + studentId);
            API.show(enqContentRegion, studentId);
        });

    });
});