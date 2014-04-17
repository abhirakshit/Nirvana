define([], function(){
    Application.module("Entities", function(Entities, Application, Backbone, Marionette, $, _) {

        Entities.educationUrl = "/education";

        Entities.Education = Entities.Model.extend({
            urlRoot: Entities.educationUrl,
            validation: {
                programName: {
                    required : true
                },
                score: {
                    required : true
                }
            }
        });

        Entities.EducationCollection = Entities.Collection.extend({
            url: Entities.educationUrl,
            model: Entities.Education
        });

        var API = {
            getEducation: function(educationId) {
                if (!educationId)
                    return new Entities.Education();

                var education = new Entities.Education();
                education.id = educationId;
                education.fetch();
                return education;
            },

            getAllEducation: function(update) {
                //Update is called after a new education is added/removed and the collection needs to be updated
                if (!Entities.allEducationCollection || update){
                    Entities.allEducationCollection = new Entities.EducationCollection();
                    Entities.allEducationCollection.fetch();
                }
                return Entities.allEducationCollection;
            }
        };

        Application.reqres.setHandler(Application.GET_EDUCATION, function(update){
            return API.getAllEducation(update);
        });

        Application.reqres.setHandler(Application.GET_EDUCATION, function(educationId){
            return API.getEducation(educationId);
        });
    })
});