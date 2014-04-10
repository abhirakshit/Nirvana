
//DELETE THIS//
define([], function(){
    Application.module("Entities", function(Entities, Application, Backbone, Marionette, $, _) {

        Entities.allCounselorsUrl = "/users/counselors";

        Entities.School = Entities.Model.extend({
            urlRoot: Entities.schoolUrl
        });

        Entities.SchoolCollection = Entities.Collection.extend({
            model: Entities.School
        });

        var API = {
            getSchool: function(schoolId) {
                if (!schoolId)
                    return new Entities.School;

                var school = new Entities.School;
                school.id = schoolId;
                school.fetch();
                return school;
            },

            getAllSchools: function() {
                if (!Entities.allSchools){
                    Entities.allSchools = new Entities.TitleSortedCollection();
                    Entities.allSchools.url = Entities.allSchoolsUrl;
                    Entities.allSchools.fetch();
                }
                return Entities.allSchools;
            }
        };

        Application.reqres.setHandler(Application.SCHOOLS_GET, function(){
            return API.getAllSchools();
        });

        Application.reqres.setHandler(Application.SCHOOL_GET, function(schoolId){
            return API.getSchool(schoolId);
        });
    })
});