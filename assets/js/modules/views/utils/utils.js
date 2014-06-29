define([
    "modules/views/base/base_app"
], function () {
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

        Views.addDatatable = function (table, options) {
            if (!options) {
                var options = {
//                    "sDom": "<'row'<'col-sm-6'l><'col-sm-6'f>r>t<'row'<'col-xs-6'i><'col-xs-6'p>>",
//                    "sDom": "<'row'<'col-sm-6'l><'col-sm-6'f>r>t<'row'<'col-xs-6'i><'col-xs-6'p>>",
//                    "bJQueryUI": true,
//                    "bLengthChange" : false,
                "sPaginationType": "full_numbers"
//                "bFilter" : false
//                    "bInfo": false

                }
            }

            table.dataTable(options);
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

        Views.getTableView =  function(tableId, title, theadColumns, rows, childClickEvt, rowView, dataTableOptions) {
            return new Views.Base.views.TableComposite({
                model: new Application.Entities.Model({
                    tableId: tableId,
                    title: title,
                    theadColumns: theadColumns,
                    childClickEvt: childClickEvt,
                    rowView: rowView
                }),
                collection: rows,
                dataTableOptions: dataTableOptions
            });
        };

        Views.getConfirmationView = function (modalId, header, message, confirmBtnText, isError) {
            var confirmBtnClass = "btn btn-primary";
            if (isError) {
                confirmBtnClass = "btn btn-danger"
            }
            return new Views.Base.views.ConfirmationModal({
                model: new Application.Entities.Model({
                    modalId: modalId,
                    header: header,
                    message: message,
                    confirmBtnText: confirmBtnText,
                    confirmBtnClass: confirmBtnClass
                })
            })
        }


    });
});
