define([
    "modules/enquiries/show/show_view"
], function () {
    Application.module("Enquiries.Show", function (Show, Application, Backbone, Marionette, $, _) {

        Show.Controller = Application.Controllers.Base.extend({
            initialize: function () {
//                var user = Application.request(Application.GET_LOGGED_USER);
                var student = Application.request(Application.GET_USER, this.options.studentId);
                var allCountries = Application.request(Application.GET_COUNTRIES);
                var allServices = Application.request(Application.GET_SERVICES);
                var allCounselors = Application.request(Application.GET_COUNSELORS);
                var allStatus = Application.request(Application.GET_STATUS_All);

                this.layout = this.getLayout();

                this.listenTo(this.layout, Application.SHOW, function () {
                    this.showStudent(student, allCountries, allServices, allCounselors, allStatus)
                });


                this.show(this.layout, {
                    loading: {
                        entities: [student, allCountries, allServices, allCounselors, allStatus]
                    }
                });
            },

            showStudent: function (student, allCountries, allServices, allCounselors, allStatus) {
                var personalView = new Show.views.Personal({
                    model: student
                });
                this.layout.personalRegion.show(personalView);

                var academicView = new Show.views.Academic({
                    model: student
                });
                this.layout.academicRegion.show(academicView);

                this.showCareerView(student, allCountries, allServices);

                this.showAdminView(student, allCounselors, allStatus);

                this.showHistoryView(student);
            },

            showHistoryView: function(student) {
                var historyView = new Show.views.History({
                   model: student,
                   collection: new Application.Entities.Collection(student.get('enquiryCommentsAdded'))
                });
                this.layout.historyRegion.show(historyView);
            },

            showAdminView: function(student, allCounselors, allStatus) {
                var addedCounselors = new Application.Entities.UsersCollection(student.get('counselors'));
                var addedCounselorsIdList = addedCounselors.pluck("id");
                var adminView = new Show.views.Admin({
                    model: student,
                    allCounselors: allCounselors.getIdToTextMap('name'),
                    addedCounselors: addedCounselorsIdList,
                    allStatus: allStatus.getValueToTextMap('name')
                });
                this.layout.adminRegion.show(adminView);

            },

            showCareerView: function(student, allCountries, allServices) {
                var addedCountries = new Application.Entities.CountryCollection(student.get('countries'));
                var addedCountriesIdList = addedCountries.pluck("id");

                var addedServices = new Application.Entities.ServiceCollection(student.get('services'));
                var addedServicesIdList = addedServices.pluck("id");

                var careerView = new Show.views.Career({
                    model: student,
                    allCountries: allCountries.getIdToTextMap('name'),
                    addedCountries: addedCountriesIdList,

                    allServices: allServices.getIdToTextMap('name'),
                    addedServices: addedServicesIdList
                });
                this.layout.careerRegion.show(careerView);
            },

            getLayout: function () {
                return new Show.views.Layout();
            }

        });


    });
});
