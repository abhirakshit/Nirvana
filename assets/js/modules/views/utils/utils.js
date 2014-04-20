define([], function(){
    Application.module("Views", function(Views, Application, Backbone, Marionette, $, _) {
        Views.addDataTables = function (layout) {
            //AddDataTables - Sorting, Filter etc
            layout.$el.find('.dataTable').dataTable({
                "bJQueryUI": true,
                "sPaginationType": "full_numbers",
                "bInfo": false
            });
        },

        Views.hideModal = function(modalDialogId) {
            $('#' + modalDialogId).modal('hide')
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
        },

        Views.addDateTimePicker = function(view) {
            view.datetimepicker();
            view.data("DateTimePicker").setDate(moment());
        }

//        Views.Modal = Backbone.Modal.extend({
//            template: _.template($('#modal-template').html()),
//            cancelEl: '.bbm-button'
//        });

    });
});
