define([], function(){
    Application.module("Entities", function(Entities, Application, Backbone, Marionette, $, _) {

        Entities.allSchoolsUrl = "/schools";
        Entities.schoolUrl = "/school";

        Entities.School = Entities.Model.extend({
            urlRoot: Entities.schoolUrl,
            validation: {
                name: {required: true},
                website: {required: false, pattern: 'url'}
            }
        });

        Entities.SchoolCollection = Entities.Collection.extend({
            model: Entities.School
        });

        var API = {
            getSchool: function(schoolId) {
                if (!schoolId)
                    return new Entities.School();

                var school = new Entities.School();
                school.id = schoolId;
                school.fetch();
                return school;
            },

            getAllSchools: function(update) {
                if (!Entities.allSchools || update){
                    Entities.allSchools = new Entities.TitleSortedCollection();
                    Entities.allSchools.url = Entities.allSchoolsUrl;
                    Entities.allSchools.fetch();
                }
                return Entities.allSchools;
            }
        };

        Application.reqres.setHandler(Application.SCHOOLS_GET, function(update){
            return API.getAllSchools(update);
        });

        Application.reqres.setHandler(Application.SCHOOL_GET, function(schoolId){
            return API.getSchool(schoolId);
        });
    })
});