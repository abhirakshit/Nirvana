define([
    "modules/entities/class",
    "modules/batches/show/batches_show_view"
], function () {
    Application.module("Batches.Show", function (Show, Application, Backbone, Marionette, $, _) {

        Show.Controller = Application.Controllers.Base.extend({
            initialize: function () {
                var batch = Application.request(Application.GET_BATCH, this.options.batchId);

                //TODO: Get students who are enrolled for the batch service
                var enrolledStudents = Application.request(Application.GET_STUDENTS_ENROLLED);

                var allServices = Application.request(Application.GET_SERVICES);
                var allBatches = Application.request(Application.GET_BATCHES);
                var allTopics = Application.request(Application.GET_TOPICS);
                var allStaff = Application.request(Application.GET_ALL_STAFF);
//                var allClasses = Application.request(Application.GET_CLASSES);

                this.layout = this.getLayout();

                this.listenTo(this.layout, Application.SHOW, function () {
//                    console.dir(batch);
                    this.showDetails(batch, allServices, allBatches);
                    this.showStudents(batch, enrolledStudents);
//                    this.showClasses(batch, allTopics, allStaff, allClasses);
                    this.showClasses(batch, allTopics, allStaff);
                });


                this.show(this.layout, {
                    loading: {
//                        entities: [batch, allServices, enrolledStudents, allTopics, allStaff, allClasses, allBatches]
                        entities: [batch, allServices, enrolledStudents, allTopics, allStaff, allBatches]
                    }
                });
            },

            showDetails: function (batch, allServices, allBatches) {
                var batchDetailsView = new Show.views.BatchDetails({
                    model: batch,
                    allServices: allServices.getValueToTextMap('name')
                });

                var that = this;
                this.listenTo(batchDetailsView, Application.DELETE, function(batchId) {
                    that.showDeleteBatchModal(batchId, allBatches);
                });

                this.layout.batchDetailsRegion.show(batchDetailsView);
            },

            showDeleteBatchModal: function(batchId, allBatches) {
                //Show delete confirmation dialog
                var confirmationView = Application.Views.getConfirmationView("deleteBatchModal", "Delete Batch",
                    "Are you sure?", "Delete", true);

                this.listenTo(confirmationView, Application.CONFIRM, function() {
                    //Call delete with model
                    var batchModel = allBatches.get(batchId);
                    console.log("Delete batch" + batchModel);
                    batchModel.destroy({
                        wait: true,
                        success: function (deletedBatch){
                            console.dir(deletedBatch);
                            Application.execute(Application.BATCHES_SHOW);
                        },

                        error: function(x, response) {
                            console.log("Error on server!! -- " + response.text);
                            return response;
                        }
                    })
                });
                Application.modalRegion.show(confirmationView);
            },


//            showClasses: function(batch, allTopics, allStaff, allClasses) {
            showClasses: function(batch, allTopics, allStaff) {
                var classSectionLayout = new Show.views.ClassSectionLayout();
                this.layout.classesRegion.show(classSectionLayout);

                var allClasses = Application.request(Application.GET_BATCH_CLASSES, batch.get("id"));

                //Add Class Btn
                var addClassButtonView = new Show.views.AddClassButton({
                    model: new Application.Entities.Model({
                        modalId: Show.addClassModalFormId,
                        text: "New Class"
                    })
                });
                var that = this;
                this.listenTo(addClassButtonView, Show.SHOW_NEW_CLASS_MODAL, function(){
                    that.showNewClassModal(batch, allTopics, allStaff, allClasses)
                });
                classSectionLayout.addClassBtnRegion.show(addClassButtonView);

                //Add Classes Table
                this.showClassesTable(classSectionLayout.classTableRegion, allClasses, allTopics, allStaff);
            },

            showClassesTable: function(region, allClasses, allTopics, allStaff) {
                var columns = new Application.Entities.Collection([
                    new Application.Entities.Model({columnName: "Topic"}),
                    new Application.Entities.Model({columnName: "Date/Time"}),
                    new Application.Entities.Model({columnName: "Assigned To"}),
                    new Application.Entities.Model({columnName: "Edit/Del"})
                ]);
                var dataTableOptions = {"bLengthChange" : false, "sPaginationType": "full_numbers", "bFilter" : false};
                var tableComposite = Application.Views.getTableView("classTable", "Classes", columns, allClasses,
                    Application.CLASS_SHOW, Show.views.ClassRow, dataTableOptions);

                var that = this;
                //Edit Class
                this.listenTo(tableComposite, Application.CLASS_SHOW, function(classId){
                    console.log("Show Class");
                    that.showClassModal(allTopics, allStaff, allClasses, classId);
                });

                //Delete Class
                this.listenTo(tableComposite, Application.DELETE, function(classId){
//                    console.log("Delete Class");
                    that.showDeleteClassModal(allClasses, classId);
                });

                region.show(tableComposite);
            },

            showDeleteClassModal: function(allClasses, classId) {

                //Show delete confirmation dialog
                var confirmationView = Application.Views.getConfirmationView(Show.deleteClassModalFormId, "Delete Class",
                    "Are you sure?", "Delete", true);

                this.listenTo(confirmationView, Application.CONFIRM, function() {
                    //Call delete with model
                    var classModel = allClasses.get(classId);
                    console.log("Delete class" + classModel);
                    classModel.destroy({
                        wait: true,
                        success: function (deletedClass){
                            console.dir(deletedClass);
                        },

                        error: function(x, response) {
                            console.log("Error on server!! -- " + response.text);
                            return response;
                        }
                    })
                });
                Application.modalRegion.show(confirmationView);
            },

            showClassModal: function(allTopics, allStaff, allClasses, classId) {
                var classModel = allClasses.get(classId);
                classModel.attributes.modalId = Show.addClassModalFormId;
                classModel.attributes.formHeader = "Edit Class";
                classModel.attributes.formBtnText = "Update";
//                console.dir(classModel);
                var addClassFormView = new Show.views.ClassForm({
                    model: classModel,
                    allTopics: allTopics.getIdToTextMap("name"),
                    allStaff: allStaff.getIdToTextMap("name")
                });

                addClassFormView.on(Show.CREATE_CLASS, function(modalFormView, data){
                    console.log("Create Class");
                    console.dir(data);
//                    modalFormView.model.save(data, {
                    classModel.save(data, {
                        wait: true,
                        success: function(newClass){
                            console.log("Saved on server!!");
                            console.dir(newClass);
                            console.dir(classModel);
                        },

                        error: function(x, response) {
                            console.log("Error on server!! -- " + response.text);
                            return response;
                        }
                    });
                });
                Application.modalRegion.show(addClassFormView);

            },

            showNewClassModal: function(batch, allTopics, allStaff, allClasses) {
                var newClass = Application.request(Application.GET_CLASS);
                newClass.attributes.modalId = Show.addClassModalFormId;
                newClass.attributes.formHeader = "Add Class";
                newClass.attributes.formBtnText = "Create";
                console.dir(newClass);
                var addClassFormView = new Show.views.ClassForm({
                    model: newClass,
                    allTopics: allTopics.getIdToTextMap("name"),
                    allStaff: allStaff.getIdToTextMap("name")
                });

//                var that = this;
                addClassFormView.on(Show.CREATE_CLASS, function(modalFormView, data){
                    console.log("Create Class");
                    data.batch = batch.id;
                    console.dir(data);
                    modalFormView.model.save(data, {
                        wait: true,
//                        patch: true,
                        success: function(newClass){
                            console.log("Saved on server!!");
                            console.dir(newClass);
//                            that.showBatch(newBatch);
                            allClasses.add(newClass);

                        },

                        error: function(x, response) {
                            console.log("Error on server!! -- " + response.text);
                            return response;
                        }
                    });
                });
                Application.modalRegion.show(addClassFormView);
            },


            showStudents: function(batch, enrolledStudents) {
                var batchStudents = batch.get('students');

                //Remove added students from all students list
                var addedStudentIds = _.pluck(batchStudents, 'id');
                var studentDropDown = enrolledStudents.getValueToTextMap('name');
                if (addedStudentIds.length > 0) {
                    var studentDropDown = _.filter(enrolledStudents.getValueToTextMap('name'), function (obj){
                        !_.contains(addedStudentIds, obj.value);
                    });
                }

                var addCallback = function(batchModel) {
                    batchModel.save("addStudents", batchModel.get('id'), {
                        wait: true,
                        patch: true,
                        success: function(updatedBatch){
                            that.showStudents(updatedBatch, enrolledStudents);
                        },

                        error: function(x, response) {
                            return response;
                        }
                    })
                };

                var studentView = new Show.views.StudentComposite({
                    model: batch,
//                    collection: addedStudents,
                    collection: new Application.Entities.UsersCollection(batchStudents),
//                    allStudents:enrolledStudents.getValueToTextMap('name'),
                    allStudents:studentDropDown,
                    addCallback: addCallback
                });

                var that = this;
                this.listenTo(studentView, Show.removeStudentEvt, function(studentModel) {
                    batch.save("removeStudent", studentModel.get('id'), {
                        wait: true,
                        patch: true,
                        success: function(updatedBatch){
                            console.log("Saved on server!!");
                            console.dir(updatedBatch);
                            that.showStudents(updatedBatch, enrolledStudents);
                        },

                        error: function(x, response) {
                            console.log("Error on server!! -- " + response.text);
                            return response;
                        }
                    });
                });

                this.listenTo(studentView, Show.addStudentEvt, function(studentIds) {
                    batch.save("addStudents", studentIds, {
                        wait: true,
                        patch: true,
                        success: function(updatedBatch){
                            console.log("Saved on server!!");
                            console.dir(updatedBatch);
                            that.showStudents(updatedBatch, enrolledStudents);
                        },

                        error: function(x, response) {
                            console.log("Error on server!! -- " + response.text);
                            return response;
                        }
                    });
                });

                this.layout.studentsRegion.show(studentView);
            },

            getLayout: function () {
                return new Show.views.Layout();
            }

        });


    });
});
