define([], function () {
    Application.module("Views", function (Views, Application, Backbone, Marionette, $, _) {


        Views.setupDateTimeEditableBox = function (el, id, emptyText, initialValue, successCB) {
            if (initialValue) {
                initialValue = moment(initialValue).format(Application.EDITABLE_DATE_FORMAT);
            } else {
                initialValue = moment().format(Application.EDITABLE_DATE_FORMAT);
            }
//            console.log(initialValue);
            el.find("#" + id).editable({
                type: 'combodate',
                title: emptyText,
                emptytext: emptyText,
                value: initialValue,
                format: Application.EDITABLE_DATE_FORMAT,
                template: 'DD MMM YYYY hh:mm a', //Template used for displaying dropdowns.
                combodate: {
                    minYear: 2010,
                    maxYear: 2025,
                    minuteStep: 15,
                    smartDays: true
                },
                success: successCB
            })
        };

        Views.setupEditableBox = function (el, id, emptyText, initialValue, type, source, placement, successCB) {
            el.find("#" + id).editable({
                type: type,
                title: emptyText,
                emptytext: emptyText,
                value: initialValue,
                source: source, //For DropDowns/Selects
                placement: placement,
                success: successCB
            })
        };


        Views.setupSelect2EditableBox = function (el, id, source, emptyText, initialValue, placement, successCB) {
            el.find('#' + id).editable({
                source: source,
                type: "select2",
                value: initialValue,
                emptytext: emptyText,
                placement: placement,
                title: emptyText,
                // disabled: 'true',
                select2: {
                    placeholder: emptyText,
                    multiple: true
                },
                success: successCB
            });
        }

    });
});