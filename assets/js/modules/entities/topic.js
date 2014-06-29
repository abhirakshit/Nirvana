define([], function(){
    Application.module("Entities", function(Entities, Application, Backbone, Marionette, $, _) {

        Entities.topicUrl = "/topic";

        Entities.Topic = Entities.Model.extend({
            urlRoot: Entities.topicUrl,
            validation: {
                name: {required: true},
                section: {required: true},
                duration_hr: {
//                    required: false,
                    range: [1, 5],
                    pattern: 'digits',
                    msg: 'Hour between 1-5 and Min between 1-59'
                },

                duration_min: {
//                    required: false,
                    pattern: 'digits',
                    range: [1, 59],
                    msg: 'Hour between 1-5 and Min between 1-59'
                },
                sequence: {
                    required: false,
                    pattern: 'digits',
                    range: [1, 20]
                }
            }
        });

        Entities.TopicCollection = Entities.Collection.extend({
            url: Entities.topicUrl,
            model: Entities.Topic
        });

        var API = {
            getTopic: function(topicId) {
                if (!topicId)
                    return new Entities.Topic();

                var topic = new Entities.Topic();
                topic.id = topicId;
                topic.fetch();
                return topic;
            },

            getAllTopics: function(update) {
                //Update is called after a new topic is added/removed and the collection needs to be updated
                if (!Entities.allTopics || update){
                    Entities.allTopics = new Entities.TopicCollection();
                    Entities.allTopics.fetch();
                }
                return Entities.allTopics;
            }
        };

        Application.reqres.setHandler(Application.GET_TOPICS, function(update){
            return API.getAllTopics(update);
        });

        Application.reqres.setHandler(Application.GET_TOPIC, function(topicId){
            return API.getTopic(topicId);
        });
    })
});