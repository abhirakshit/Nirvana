define([], function(){
    Application.module("Entities", function(Entities, Application, Backbone, Marionette, $, _) {

//        Entities.allLocationsUrl = "/countries";
        Entities.locationUrl = "/location";

        Entities.Location = Entities.Model.extend({
            urlRoot: Entities.locationUrl,
            validation: {
                name: {
                    required: true,
                    fn: 'doesNotExist'
                }
            },

            doesNotExist: function (value, attr, computedState) {
                if (_.contains(computedState.existingNames, value))
                    return "Location already exists";
            }
        });

        Entities.LocationCollection = Entities.Collection.extend({
//            url: Entities.allLocationsUrl,
            url: Entities.locationUrl,
            model: Entities.Location
        });

        var API = {
            getLocation: function(locationId) {
                if (!locationId)
                    return new Entities.Location();

                var location = new Entities.Location();
                location.id = locationId;
                location.fetch();
                return location;
            },

            getAllLocations: function(update) {
                //Update is called after a new location is added/removed and the collection needs to be updated
                if (!Entities.allLocations || update){
                    Entities.allLocations = new Entities.LocationCollection();
                    Entities.allLocations.fetch();
                }
                return Entities.allLocations;
            }
        };

        Application.reqres.setHandler(Application.GET_LOCATIONS, function(update){
            return API.getAllLocations(update);
        });

        Application.reqres.setHandler(Application.GET_LOCATION, function(locationId){
            return API.getLocation(locationId);
        });
    })
});