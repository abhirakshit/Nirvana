define([
    "modules/entities/class",
    "modules/batches/show/batches_show_view"
], function () {
    Application.module("Batches.Show", function (Show, Application, Backbone, Marionette, $, _) {

        Show.Controller = Application.Controllers.Base.extend({
            initialize: function () {
                var batch = Application.request(Application.GET_BATCH, this.options.batchId);

                //TODO: Get students who are enrolled for service matching the batch service
                // send the batch id and let it find and get the enrolled students
//                var enrolledStudents = Application.request(Application.GET_STUDENTS_ENROLLED);

                var allServices = Application.request(Application.GET_SERVICES);
                var allBatches = Application.request(Application.GET_BATCHES);
                var batchClasses = Application.request(Application.GET_BATCH_CLASSES, this.options.batchId);
                var allStaff = Application.request(Application.GET_ALL_STAFF);

                this.layout = this.getLayout();

                this.listenTo(this.layout, Application.SHOW, function () {
                    this.showDetails(batch, allServices, allBatches);
//                    this.showStudents(batch, enrolledStudents);
                    this.showStudents(batch);
//                    this.showClasses(batch, allTopics, allStaff, batchClasses);
                    this.showClasses(batch, allStaff, batchClasses);
                });


                this.show(this.layout, {
                    loading: {
//                        entities: [batch, allServices, enrolledStudents, allTopics, allStaff, allBatches, batchClasses]
                        entities: [batch, allServices, allStaff, allBatches, batchClasses]
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


//            showClasses: function(batch, allTopics, allStaff, batchClasses) {
            showClasses: function(batch, allStaff, batchClasses) {
                /*
                This is called here we need the service information from the batch which might not have been received
                at the initialize
                 */
                var allTopics = Application.request(Application.GET_TOPICS_SERVICE, batch.get('service').id);

                var classSectionLayout = new Show.views.ClassSectionLayout();
                this.layout.classesRegion.show(classSectionLayout);

                //Add Class Btn
                var addClassButtonView = new Show.views.AddClassButton({
                    model: new Application.Entities.Model({
                        modalId: Show.addClassModalFormId,
                        text: "New Class"
                    })
                });
                var that = this;
                this.listenTo(addClassButtonView, Show.SHOW_NEW_CLASS_MODAL, function(){
                    that.showNewClassModal(batch, allTopics, allStaff, batchClasses);
                });
                classSectionLayout.addClassBtnRegion.show(addClassButtonView);

                //Add Classes Table
                this.showClassesTable(classSectionLayout.classTableRegion, batchClasses, allTopics, allStaff);
            },

            showClassesTable: function(region, batchClasses, allTopics, allStaff) {
                var columns = new Application.Entities.Collection([
                    new Application.Entities.Model({columnName: "Topic"}),
                    new Application.Entities.Model({columnName: "Date/Time"}),
                    new Application.Entities.Model({columnName: "Assigned To"}),
                    new Application.Entities.Model({columnName: "Edit/Del"})
                ]);
                var dataTableOptions = {"bLengthChange" : false, "sPaginationType": "full_numbers", "bFilter" : false};
                var tableComposite = Application.Views.getTableView("classTable", "Classes", columns, batchClasses,
                    Application.CLASS_SHOW, Show.views.ClassRow, dataTableOptions);

                var that = this;
                //Edit Class
                this.listenTo(tableComposite, Application.CLASS_SHOW, function(classId){
                    that.showEditClassModal(allTopics, allStaff, batchClasses, classId);
                });

                //Delete Class
                this.listenTo(tableComposite, Application.DELETE, function(classId){
                    that.showDeleteClassModal(batchClasses, classId);
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
                    classModel.destroy({
                        wait: true,
                        success: function (deletedClass){
                            Application.Views.showSuccessMsg("Removed class: " + deletedClass.get('topic').name);
                        },

                        error: function(deleteClass, response) {
                            Application.Views.showErrorMsg("Could not remove class: " + deleteClass.get('topic').name);
                            console.log("Error on server!! -- " + response.text);
                            return response;
                        }
                    })
                });
                Application.modalRegion.show(confirmationView);
            },

            showEditClassModal: function(allTopics, allStaff, batchClasses, classId) {
                var classModel = batchClasses.get(classId);
                classModel.attributes.modalId = Show.addClassModalFormId;
                classModel.attributes.formHeader = "Edit Class";
                classModel.attributes.formBtnText = "Update";
                var addClassFormView = new Show.views.ClassForm({
                    model: classModel,
                    allTopics: allTopics.getIdToTextMap("name"),
                    allStaff: allStaff.getIdToTextMap("name")
                });

                addClassFormView.on(Show.CREATE_CLASS, function(modalFormView, data){
                    classModel.save(data, {
                        wait: true,
                        success: function(newClass){
                            Application.Views.showSuccessMsg("Added class: " + newClass.get('topic').name);
                        },

                        error: function(newClass, response) {
                            Application.Views.showErrorMsg("Could not add class: " + newClass.get('topic').name);
                            console.log("Error on server!! -- " + response);
                            return response;
                        }
                    });
                });
                Application.modalRegion.show(addClassFormView);

            },

            showNewClassModal: function(batch, allTopics, allStaff, batchClasses) {
                var newClass = Application.request(Application.GET_CLASS);
                newClass.attributes.modalId = Show.addClassModalFormId;
                newClass.attributes.formHeader = "Add Class";
                newClass.attributes.formBtnText = "Create";
                var addClassFormView = new Show.views.ClassForm({
                    model: newClass,
                    allTopics: allTopics.getIdToTextMap("name"),
                    allStaff: allStaff.getIdToTextMap("name")
                });

                addClassFormView.on(Show.CREATE_CLASS, function(modalFormView, data){
                    data.batch = batch.id;
                    modalFormView.model.save(data, {
                        wait: true,
                        success: function(newClass){
                            batchClasses.add(newClass);
                            Application.Views.showSuccessMsg("Added class: " + newClass.get('topic').name);
                        },

                        error: function(newClass, response) {
                            Application.Views.showErrorMsg("Could not add class: " + newClass.get('topic').name);
                            console.log("Error on server!! -- " + response);
                            return response;
                        }
                    });
                });
                Application.modalRegion.show(addClassFormView);
            },


            showStudents: function(batch) {
                /* This is called here we need the service information from the batch which might not have been received
                 * at the initialize
                 */
                var enrolledStudents = Application.request(Application.GET_STUDENTS_ENROLLED_SERVICE, batch.get('service').id);

                var batchStudents = batch.get('students');

                //Remove added students from all students list
                var addedStudentIds = _.pluck(batchStudents, 'id');
                var studentDropDown = enrolledStudents.getValueToTextMap('name');
                if (addedStudentIds.length > 0) {
                    studentDropDown = _.filter(enrolledStudents.getValueToTextMap('name'), function (obj){
                        return !_.contains(addedStudentIds, obj.value);
                    });
                }

                var addCallback = function(batchModel) {
                    batchModel.save("addStudents", batchModel.get('id'), {
                        wait: true,
                        patch: true,
                        success: function(updatedBatch){
                            that.showStudents(updatedBatch);
                        },

                        error: function(x, response) {
                            return response;
                        }
                    })
                };

                // Show students in the batch
                var studentView = new Show.views.StudentComposite({
                    model: batch,
                    collection: new Application.Entities.UsersCollection(batchStudents),
                    allStudents:studentDropDown,
                    addCallback: addCallback
                });

                var that = this;
                this.listenTo(studentView, Show.removeStudentEvt, function(studentModel) {
                    batch.save("removeStudent", studentModel.get('id'), {
                        wait: true,
                        patch: true,
                        success: function(updatedBatch){
//                            enrolledStudents.add(studentModel);
                            that.showStudents(updatedBatch);
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
                            that.showStudents(updatedBatch);
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
