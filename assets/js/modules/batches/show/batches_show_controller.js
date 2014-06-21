define([
    "modules/entities/class",
    "modules/batches/show/batches_show_view"
], function () {
    Application.module("Batches.Show", function (Show, Application, Backbone, Marionette, $, _) {

        Show.Controller = Application.Controllers.Base.extend({
            initialize: function () {
                var batch = Application.request(Application.GET_BATCH, this.options.batchId);
                //TODO: Get students who are enrolled for the batch service
                var students = Application.request(Application.GET_STUDENTS);

                var allServices = Application.request(Application.GET_SERVICES);
                var allTopics = Application.request(Application.GET_TOPICS);
                var allStaff = Application.request(Application.GET_ALL_STAFF);
                var allClasses = Application.request(Application.GET_CLASSES);

                this.layout = this.getLayout();

                this.listenTo(this.layout, Application.SHOW, function () {
//                    console.dir(batch);
                    this.showDetails(batch, allServices);
                    this.showStudents(batch, students);
                    this.showClasses(batch, allTopics, allStaff, allClasses);
                });


                this.show(this.layout, {
                    loading: {
                        entities: [batch, allServices, students, allTopics, allStaff, allClasses]
                    }
                });
            },

            showDetails: function (batch, allServices) {
                var batchDetailsView = new Show.views.BatchDetails({
                    model: batch,
                    allServices: allServices.getValueToTextMap('name')
                });

                this.layout.batchDetailsRegion.show(batchDetailsView);
            },

            showClasses: function(batch, allTopics, allStaff, allClasses) {
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
                    that.showNewClassModal(batch, allTopics, allStaff)
                });
                classSectionLayout.addClassBtnRegion.show(addClassButtonView);

                //Add Classes Table
                this.showClassesTable(classSectionLayout.classTableRegion, allClasses);

            },

            showClassesTable: function(region, allClasses) {
                var columns = new Application.Entities.Collection([
                    new Application.Entities.Model({columnName: "Topic"}),
                    new Application.Entities.Model({columnName: "Date/Time"}),
//                    new Application.Entities.Model({columnName: "Time"}),
                    new Application.Entities.Model({columnName: "Assigned To"})
                ]);
                var tableComposite = Application.Views.getTableView("classTable", "Classes", columns, allClasses,
                    Application.CLASS_SHOW, Show.views.ClassRow);

                var that = this;
                this.listenTo(tableComposite, Application.CLASS_SHOW, function(classId){
                    Application.execute(Application.CLASS_SHOW, that.options.region, classId);
                });
                region.show(tableComposite);
            },

            showNewClassModal: function(batch, allTopics, allStaff) {
                var newClass = Application.request(Application.GET_CLASS);
                newClass.attributes.modalId = Show.addClassModalFormId;
                var addClassFormView = new Show.views.AddClassForm({
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
                        patch: true,
                        success: function(newClass){
                            console.log("Saved on server!!");
                            console.dir(newClass);
//                            that.showBatch(newBatch);

                        },

                        error: function(x, response) {
                            console.log("Error on server!! -- " + response.text);
                            return response;
                        }
                    });
                });
                Application.modalRegion.show(addClassFormView);
            },


            showStudents: function(batch, allStudents) {
                var addedStudents = new Application.Entities.UsersCollection(batch.get('students'));
                var addCallback = function(batchModel) {
                    batchModel.save("addStudents", batchModel.get('id'), {
                        wait: true,
                        patch: true,
                        success: function(updatedBatch){
                            that.showStudents(updatedBatch, allStudents);
                        },

                        error: function(x, response) {
                            return response;
                        }
                    })
                };

                var studentView = new Show.views.StudentComposite({
                    model: batch,
                    collection: addedStudents,
                    allStudents: allStudents.getValueToTextMap('name'),
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
                            that.showStudents(updatedBatch, allStudents);
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
                            that.showStudents(updatedBatch, allStudents);
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
