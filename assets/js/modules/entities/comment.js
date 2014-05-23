define([], function(){
    Application.module("Entities", function(Entities, Application, Backbone, Marionette, $, _) {

        Entities.commentUrl = "/comment";

        Entities.Comment = Entities.Model.extend({
            urlRoot: Entities.commentUrl,
            validation: {
                name: {required: true}
            }
        });

        Entities.CommentCollection = Entities.Collection.extend({
            url: Entities.commentUrl,
            model: Entities.Comment
        });

        var API = {
            getStudentComments: function(studentId) {
                if (!studentId)
                    return null;

                var comments = new Entities.CommentCollection();
                comments.url = Entities.studentUrl + "/" + studentId + Entities.commentUrl;
                comments.fetch();
                return comments;
            }

        };

        Application.reqres.setHandler(Application.GET_STUDENT_COMMENTS, function(studentId){
            return API.getStudentComments(studentId);
        });

//        Application.reqres.setHandler(Application.GET_SERVICES, function(update){
//            return API.getAllComments(update);
//        });
//
//        Application.reqres.setHandler(Application.GET_SERVICE, function(commentId){
//            return API.getComment(commentId);
//        });
    })
});