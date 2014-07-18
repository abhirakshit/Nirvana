define([
], function () {
    Application.module("Batches.Show", function (Show, Application, Backbone, Marionette, $, _) {

//        Show.addEducationFormId = 'addEducationModal';
        Show.showAddEducationModalEvt = "showAddEducationModalEvt";
//        Show.createEducationEvt = "createEducationEvt";
        Show.removeStudentEvt = "removeStudentEvt";
        Show.addStudentEvt = "addStudentEvt";
//        Show.addCommentEvt = "addCommentEvt";

        Show.addClassModalFormId = "addClassModal";
        Show.deleteClassModalFormId = "deleteClassModal";

        Show.SHOW_NEW_CLASS_MODAL = "show:new:class:modal";
        Show.CREATE_CLASS = "create:class";


        this.prefix = "Show";
        this.templatePath = "js/modules/";
        this.views = {};

        this.template = function (str) {
            return this.prefix + '-' + str;
        };


        Show.views.Layout = Application.Views.Layout.extend({
            template: "batches/show/templates/show_layout",
//            className: "someClass",
            regions: {
                batchDetailsRegion: "#batchDetails",
                studentsRegion: "#students",
                classesRegion: "#classes"
            }
        });

        Show.views.ClassSectionLayout = Application.Views.Layout.extend({
            template: "batches/show/templates/classes_layout",
            regions: {
                addClassBtnRegion: "#addClass",
                classTableRegion: "#classesTable"
            }
        });

        Show.views.BatchDetails = Application.Views.ItemView.extend({
            template: "batches/show/templates/batch_details_view",

            events: {
                "click #deleteBatch": "deleteBatch"
            },

            deleteBatch: function(evt) {
                evt.preventDefault();
                this.trigger(Application.DELETE, this.model.get('id'));
            },

            onRender: function() {
                Show.setupEditableBox(this.$el, this.model, "name", "Name", this.model.get('name'), 'text', null, 'right');
                Show.setupEditableBox(this.$el, this.model, "type", "Type", this.model.get('type'), 'text', null, 'right');
                Show.setupEditableBox(this.$el, this.model, "service", "Service", this.model.get('service').id, 'select', this.options.allServices, null, 'right');
                Show.setupDateTimeEditableBox(this.$el, this.model, "startDate", "Enter begin date", this.model.get('startDate'), 'right');
                Show.setupDateTimeEditableBox(this.$el, this.model, "endDate", "Enter end date", this.model.get('endDate'), 'right');
            }
        });

        Show.views.EnrolledStudentView = Application.Views.ItemView.extend({
            template: "batches/show/templates/student_field",
            tagName: "div",
            className: "col-md-12",

            events: {
                "mouseenter": "toggleDelete",
                "mouseleave": "toggleDelete",
                "click .i-cancel": "deleteStudent"
            },

            deleteStudent: function(evt) {
                evt.preventDefault();
                this.trigger(Show.removeStudentEvt, this);
            },

            toggleDelete: function (evt) {
                evt.preventDefault();
                var fieldId = this.model.get('id');
                $('#' + fieldId).find('.i-cancel').toggleClass("display-none");
            }

        });

        Show.views.StudentComposite = Application.Views.CompositeView.extend({
            template: "batches/show/templates/students_view",
            itemView: Show.views.EnrolledStudentView,
            itemViewContainer: "#enrolledStudents",

            initialize: function() {
                var that = this;
                this.on(Application.CHILD_VIEW + ":" + Show.removeStudentEvt, function(childView) {
                    that.trigger(Show.removeStudentEvt, childView.model);
                })
            },

            onRender: function() {
                var that = this;
                var successCB = function(response, value) {
                    console.log("Add students: " + value);
                    that.trigger(Show.addStudentEvt, value);
                };
                var multiSelectOptions = {
                    multiple: true,
                    placeholder: "Start Typing...",
                    minimumInputLength: 1
                };

                Application.Views.setupSelect2EditableBox(this.$el, "addStudents", this.options.allStudents,
                    "Add Students", this.options.addedStudents, 'right', successCB, multiSelectOptions)
            }
        });

        Show.views.DeleteBatchButton = Application.Views.ItemView.extend({
            template: "views/templates/round_button",

            events: {
                "click" : "deleteBatchModal"
            },

            deleteBatchModal: function(evt){
                evt.preventDefault();
                this.trigger(Application.CONFIRM);
            }

        });

        Show.views.AddClassButton = Application.Views.ItemView.extend({
            template: "views/templates/tab_add_button",

            events: {
                "click a" : "showAddClassModal"
            },

            showAddClassModal: function(evt){
                evt.preventDefault();
                this.trigger(Show.SHOW_NEW_CLASS_MODAL);
            }

        });


        Show.views.ClassForm = Application.Views.ItemView.extend({
            template: "batches/show/templates/add_class_form",

            events: {
                "click #createNewClass" : "createNewClass"
            },

            onRender: function() {

                Backbone.Validation.bind(this);

                this.renderSelect(this.options.allTopics, "#topic", this.model.get('topic'));
                this.renderSelect(this.options.allStaff, "#staff", this.model.get('staff'));
//
//                //Add datetime field
                Application.Views.addDateTimePicker(this.$el.find('#dateDiv'), moment(this.model.get('date')));
            },

            renderSelect :function (idToTextMap, element, selectedId) {
                var that = this;
                console.log(selectedId);
                _.each(idToTextMap, function(select){
                    if (selectedId && select.id === selectedId) {
                        that.$el.find(element).append("<option value=" + select.id + " selected=selected" + ">" + select.text + "</option>");
                    } else {
                        that.$el.find(element).append("<option value=" + select.id + ">" + select.text + "</option>");
                    }
                });
                this.$el.find(element).select2();
            },

            createNewClass: function(evt) {
                evt.preventDefault();
                var data = Backbone.Syphon.serialize(this);
                this.model.set(data);

                if (!data.name) {
                    var val = _.find(this.options.allTopics, function(topic){
                        return topic.id == data.topic;
                    });
                    data.name = val.text;
                }

                var isValid = this.model.isValid(true);
                if (isValid) {
                    Application.Views.hideModal(Show.addClassModalFormId);
                    this.trigger(Show.CREATE_CLASS, this, data);
                }
            }

        });

        Show.views.ClassRow = Application.Views.ItemView.extend({
            template: "batches/show/templates/class_row",
            tagName: "tr",

            serializeData: function() {
                var data = this.model.toJSON();
                data.staffName = "";
                if (data.staff){
                    data.staffName = data.staff.name;
                }
                return data;
            },

            events: {
                "click": "click",
                "click .edit": "edit",
                "click .delete": "delete"
            },

            edit: function(evt) {
                evt.preventDefault();
                this.trigger(Application.CLASS_SHOW, this);
            },

            delete: function(evt) {
                evt.preventDefault();
                this.trigger(Application.DELETE);
            }
        });

        Show.setupEditableBox = function(el, model, id, emptyText, initialValue, type, source, placement){
            var successCB = function (response, value) {
                model.save(id, value, {
                    wait: true,
                    patch: true,
                    success: function (updatedStudent) {
                        console.log("Saved on server!!");
//                        Application.execute(Show.UPDATE_HISTORY_EVT, updatedStudent);
                    },

                    error: function (x, response) {
                        console.log("Error on server!! -- " + response.msg);
                        return response.msg;
                    }
                })
            };

            Application.Views.setupEditableBox(el, id, emptyText, initialValue, type, source, placement, successCB);
        };

        Show.setupDateTimeEditableBox = function(el, model, id, emptyText, initialValue, placement){
            var successCB = function(response, value) {
                if (!value) {
                    console.log("No value!!!");
                    return;
                }

                model.save(id, value, {
                    wait: true,
                    patch: true,
                    success: function(updatedStudent){
                        console.log("Saved on server!!");
//                        Application.execute(Show.UPDATE_HISTORY_EVT, updatedStudent);
                    },

                    error: function(x, response) {
                        console.log(response);
                        console.log("Error on server!! -- ");
                        return response.msg;
                    }
                })
            };

            Application.Views.setupDateTimeEditableBox(el, id, emptyText, initialValue, successCB, placement, "ddd, MMM DD 'YY", 'DD MMM YYYY');
        };

        Show.setupSelect2EditableBox = function(el, model, id, source, emptyText, initialValue, placement){
            var successCB = function(response, value) {
                model.save(id, value, {
                    wait: true,
                    patch: true,
                    success: function(updatedStudent){
                        console.log("Saved on server!!");
//                        Application.execute(Show.UPDATE_HISTORY_EVT, updatedStudent);
                    },

                    error: function(x, response) {
                        console.dir(response);
                        console.log("Error on server!! -- " + response.msg);
                        return response.msg;
                    }
                });
            };

            Application.Views.setupSelect2EditableBox(el, id, source, emptyText, initialValue, placement, successCB);
        }

    });
});