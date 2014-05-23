define([], function () {
    Application.module("Views", function (Views, Application, Backbone, Marionette, $, _) {

        Views.hideModal = function (modalDialogId) {
            $('#' + modalDialogId).modal('hide');
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
        };

        Views.addDateTimePicker = function (view, showDate, options) {
            view.datetimepicker(options);
            if (!showDate)
                var showDate = moment();

            view.data("DateTimePicker").setDate(showDate);
        };

        Views.addDatatable = function (table) {
            table.dataTable({
//                    "sDom": "<'row'<'col-sm-6'l><'col-sm-6'f>r>t<'row'<'col-xs-6'i><'col-xs-6'p>>",
//                    "bJQueryUI": true,
                "sPaginationType": "full_numbers"
//                    "bInfo": false
            });
        };

        Views.showSuccessMsg = function (msg) {
            Views.showMsg(msg, {theme: 'jGrowlSuccess'});
        };

        Views.showErrorMsg = function (msg) {
            Views.showMsg(msg, {theme: 'jGrowlError', sticky: true});
        };

        Views.showMsg = function (msg, options) {
//            $.jGrowl(msg, {theme: theme, sticky: true});
            $.jGrowl(msg, options);
        };


    });
});
