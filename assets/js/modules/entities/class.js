define([], function(){
    Application.module("Entities", function(Entities, Application, Backbone, Marionette, $, _) {

        Entities.classUrl = "/class";

        Entities.Class = Entities.Model.extend({
            urlRoot: Entities.classUrl,
            validation: {
                date: {required: true},
//                time: {required: true},
                topic: {required: true},
                staff: {required: true}
            }
        });

        Entities.ClassCollection = Entities.Collection.extend({
            url: Entities.classUrl,
            model: Entities.Class
        });

        var API = {
            getClass: function(classId) {
                if (!classId)
                    return new Entities.Class();

                var newClass = new Entities.Class();
                newClass.id = classId;
                newClass.fetch();
                return newClass;
            },

            getAllClasses: function(update) {
                //Update is called after a new class is added/removed and the collection needs to be updated
                if (!Entities.allClasses || update){
                    Entities.allClasses = new Entities.ClassCollection();
                    Entities.allClasses.fetch();
                }
                return Entities.allClasses;
            }
        };

        Application.reqres.setHandler(Application.GET_CLASSES, function(update){
            return API.getAllClasses(update);
        });

        Application.reqres.setHandler(Application.GET_CLASS, function(classId){
            return API.getClass(classId);
        });
    })
});