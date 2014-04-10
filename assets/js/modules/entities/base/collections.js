define([], function(){
    Application.module("Entities", function(Entities, Application, Backbone, Marionette, $, _) {
        Entities.Collection = Backbone.Collection.extend({

            getIdToTextMap: function(textField) {
                return _.map(this.models, function(model){
                    return {id: model.get("id"), text: model.get(textField)}
                });
            },

            getIntIdToTextMap: function(textField) {
                return _.map(this.models, function(model){
                    return {id: parseInt(model.get("id")), text: model.get(textField)}
                });
            },

            getValueToTextMap: function(textField) {
                return _.map(this.models, function(model){
                    return {value: model.get("id"), text: model.get(textField)}
                });
            },

            getIntValueToTextMap: function(textField) {
                return _.map(this.models, function(model){
                    return {value: parseInt(model.get("id")), text: model.get(textField)}
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