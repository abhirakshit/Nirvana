define([], function(){
    Application.module("Views", function(Views, Application, Backbone, Marionette, $, _) {
//        Views.addDataTables = function (layout) {
//            //AddDataTables - Sorting, Filter etc
//            layout.$el.find('.dataTable').dataTable({
//                "bJQueryUI": true,
//                "sPaginationType": "full_numbers",
//                "bInfo": false
//            });
//        },

        Views.hideModal = function(modalDialogId) {
            $('#' + modalDialogId).modal('hide')
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
        },

        Views.addDateTimePicker = function(view) {
            view.datetimepicker();
            view.data("DateTimePicker").setDate(moment());
        },

        Views.addDatatable = function(table) {
            table.dataTable({
//                    "sDom": "<'row'<'col-sm-6'l><'col-sm-6'f>r>t<'row'<'col-xs-6'i><'col-xs-6'p>>",
//                    "bJQueryUI": true,
                "sPaginationType": "full_numbers"
//                    "bInfo": false
            });
        }

//        Views.Modal = Backbone.Modal.extend({
//            template: _.template($('#modal-template').html()),
//            cancelEl: '.bbm-button'
//        });

    });
});
