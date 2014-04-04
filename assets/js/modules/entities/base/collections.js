define([], function(){
    Application.module("Entities", function(Entities, Application, Backbone, Marionette, $, _) {
        Entities.Collection = Backbone.Collection.extend({
//            getIdToTitleArrayMap: function() {
//                return this.getIdToTextMap("title");
//            },
//
//            getValueToTitleArrayMap: function() {
//                return _.map(this.models, function(model){
//                    return {value: model.get("id"), text: model.get("title")}
//                });
//            },

            getIdToTextMap: function(textField) {
                return _.map(this.models, function(model){
                    return {id: model.get("id"), text: model.get(textField)}
                });
            },

            getValueToTextMap: function(textField) {
                return _.map(this.models, function(model){
                    return {value: model.get("id"), text: model.get(textField)}
                });
            }

        });

        Entities.TitleSortedCollection = Entities.Collection.extend({
            comparator: function( collection ){
                return( collection.get( 'title' ) );
            }
        });

    });
});