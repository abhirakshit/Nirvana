define([], function () {
    Application.module("Entities", function (Entities, Application, Backbone, Marionette, $, _) {

        Entities.topicUrl = "/topic";

        Entities.Topic = Entities.Model.extend({
            urlRoot: Entities.topicUrl,
            validation: {
                name: {required: true},
                section: {required: true},
                duration_hr: {
                    required: function (value, attr, computedState) {
                        if (!value) {
                            if (!computedState.duration_min || computedState.duration_min === '')
                                return true;
                        }
                        return false;
                    },
                    pattern: 'digits',
                    range: [1, 5],
                    msg: 'Hour between 1-5 or Min between 0-59'
                },

                duration_min: {
                    required: false,
                    pattern: 'digits',
                    range: [0, 59],
                    msg: 'Hour between 1-5 or Min between 1-59'
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
            getTopic: function (topicId) {
                if (!topicId)
                    return new Entities.Topic();

                return this.getAllTopics(true).get(topicId);
            },

            getAllTopics: function (waitForFetch) {
                if (!Entities.allTopics) {
                    Entities.allTopics = new Entities.TopicCollection();
                }
//                if (!Entities.allTopics) {
//                    Entities.allTopics = new Entities.TopicCollection();
                    if (waitForFetch) {
                        Entities.allTopics.fetch({async: false});
                    } else {
                        Entities.allTopics.fetch();
                    }
//                }
                return Entities.allTopics;
            },

            getAllTopicsForService: function (serviceId) {
                var topicArr = _.filter(this.getAllTopics(true).models, function (topic) {
                    return topic.get('service').id == serviceId;
                });

                return new Entities.TopicCollection(topicArr);
            }
        };

        Application.reqres.setHandler(Application.GET_TOPICS, function () {
            return API.getAllTopics();
        });

        Application.reqres.setHandler(Application.GET_TOPICS_SERVICE, function (serviceId) {
            return API.getAllTopicsForService(serviceId);
        });

        Application.reqres.setHandler(Application.GET_TOPIC, function (topicId) {
            return API.getTopic(topicId);
        });

        Application.commands.setHandler(Application.UPDATE_TOPICS, function (newTopic) {
            console.log("Adding topic");
            API.getAllTopics().add(newTopic);
        });
    })
});