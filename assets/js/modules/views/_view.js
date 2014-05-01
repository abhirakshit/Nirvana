define([], function(){
    Application.module("Views", function(Views, Application, Backbone, Marionette, $, _) {
        _.extend(Marionette.View.prototype, {
//            templateHelpers: function() {}
            templateHelpers: {
                showFormattedDate: function(date){
                    return moment(date).format(Application.DATE_FORMAT);
//                    return moment(this.createdAt).format(Application.DATE_FORMAT);
                }
            }
        });
    });
});