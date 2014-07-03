define([], function(){
    Application.module("Views", function(Views, Application, Backbone, Marionette, $, _) {
        _.extend(Marionette.View.prototype, {
            templateHelpers: {
                showFormattedDate: function(date){
                    if (!date)
                        return "";

                    return moment(date).format(Application.DATE_FORMAT);
                },

                showOnlyDate: function(date){
                    return moment(date).format(Application.DATE_ONLY_FORMAT);
                },

                showDurationInSec: function(millsec) {
                    var duration = moment.duration(parseInt(millsec));
                    var hours = duration.hours();
                    var minutes = duration.minutes();

                    var durationStr = '';
                    if (hours > 0)
                        durationStr = hours + ' hour ';
                    if (minutes > 0)
                        durationStr += minutes + ' minutes';
//                    return moment.duration(parseInt(millsec)).minutes();
                    return durationStr;
                }
            }
        });
    });
});