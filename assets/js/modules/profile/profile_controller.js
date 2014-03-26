define([
    "modules/profile/profile_view",
    "modules/entities/school",
    "modules/entities/user"
], function(){
    Application.module("Profile", function(Profile, Application, Backbone, Marionette, $, _) {
        Profile.Controller = Application.Controllers.Base.extend({
            initialize: function() {
                var user = Application.request(Application.GET_LOGGED_USER);
                var allSchools = Application.request(Application.SCHOOLS_GET);
                var allCounselors = Application.request(Application.COUNSELORS_GET);
                var allStreams = Application.request(Application.STREAMS_GET);
                var allOccupations = Application.request(Application.OCCUPATIONS_GET);
                var allCountries = Application.request(Application.COUNTRIES_GET);

                this.layout = this.getLayout(user);

                this.listenTo(this.layout, Application.SHOW, function(){
                    this.populateView(user, allSchools, allCounselors, allStreams, allOccupations, allCountries);
                });

                this.show(this.layout, {
                    loading: {
                        entities: [user, allSchools, allCounselors, allStreams, allOccupations, allCountries]
                    }
                });
            },

            populateView: function(user, allSchools, allCounselors, allStreams, allOccupations, allCountries) {
//                if (user.get('role') === Application.STUDENT_ROLE ||
//                    user.get('rolerole== Application.ADMIN_ROLE) {
                    var institutionalView = new Profile.views.InstitutionalView({
                        model : user,
                        allSchoolsMap: allSchools.getIdToTitleArrayMap(),
                        allCounselorsMap: allCounselors.getIdToTextMap("fullName")
                    });
                    this.layout.institutionRegion.show(institutionalView);

                    var careerView = new Profile.views.CareerView({
                        model : user,
                        allStreamsMap: allStreams.getIdToTitleArrayMap(),
                        allOccupationsMap: allOccupations.getIdToTitleArrayMap(),
                        allCountriesMap: allCountries.getIdToTitleArrayMap()
                    });
                    this.layout.careerRegion.show(careerView);

                    var academicView = new Profile.views.AcademicView({
                        model : user
                    });
                    this.layout.academicRegion.show(academicView);
//                }
            },

            getLayout: function(user) {
//                if (user.get('roleType') === Application.STUDENT_ROLE ||
//                    user.get('roleType') === Application.ADMIN_ROLE) {
                    return new Profile.views.StudentProfileLayout();
//                };

            }

        });
    });
});
