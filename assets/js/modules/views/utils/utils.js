define([], function(){
    Application.module("Views", function(Views, Application, Backbone, Marionette, $, _) {
        Views.addDataTables = function (layout) {
            //AddDataTables - Sorting, Filter etc
            layout.$el.find('.dataTable').dataTable({
                "bJQueryUI": true,
                "sPaginationType": "full_numbers",
                "bInfo": false
            });
        }
    });
});
