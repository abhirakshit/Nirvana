define([], function () {
    Application.module("Views", function (Views, Application, Backbone, Marionette, $, _) {

//        XEditable lib: http://vitalets.github.io/x-editable/index.html

        Views.setupDateTimeEditableBox = function (el, id, emptyText, initialValue, successCB, placement, viewFormat, templateFormat) {
            if (!templateFormat) {
                templateFormat = Application.EDITABLE_FORM_DATE_FORMAT
            }

            if (!viewFormat) {
                viewFormat = Application.EDITABLE_DATE_FORMAT
            }

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
                placement: placement,
                format: viewFormat,
                template: templateFormat, //Template used for displaying dropdowns.
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

//        Select2 Lib: http://ivaynberg.github.io/select2/
        Views.setupSelect2EditableBox = function (el, id, source, emptyText, initialValue, placement, successCB, multiSelectOptions) {
            //By Default selects are multi selectable unless specified
//            var multiSelect = true;
//            if (multiple) {
//                multiSelect = multiple
//            }

            if (!multiSelectOptions) {
                var multiSelectOptions = {
                    placeholder: emptyText,
                    multiple: true
                }
            }

            el.find('#' + id).editable({
                source: source,
                type: "select2",
                value: initialValue,
                emptytext: emptyText,
                placement: placement,
                title: emptyText,
                // disabled: 'true',
                select2: multiSelectOptions,
                success: successCB
            });
        }

    });
});