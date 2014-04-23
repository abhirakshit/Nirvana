define([], function(){
    Application.module("Entities", function(Entities, Application, Backbone, Marionette, $, _) {

//        Entities.allCountriesUrl = "/countries";
        Entities.countryUrl = "/country";

        Entities.Country = Entities.Model.extend({
            urlRoot: Entities.countryUrl,
            validation: {
                name: {required: true}
            }
        });

        Entities.CountryCollection = Entities.Collection.extend({
//            url: Entities.allCountriesUrl,
            url: Entities.countryUrl,
            model: Entities.Country
        });

        var API = {
            getCountry: function(countryId) {
                if (!countryId)
                    return new Entities.Country();

                var country = new Entities.Country();
                country.id = countryId;
                country.fetch();
                return country;
            },

            getAllCountries: function(update) {
                //Update is called after a new country is added/removed and the collection needs to be updated
                if (!Entities.allCountries || update){
                    Entities.allCountries = new Entities.CountryCollection();
                    Entities.allCountries.fetch();
                }
                return Entities.allCountries;
            }
        };

        Application.reqres.setHandler(Application.GET_COUNTRIES, function(update){
            return API.getAllCountries(update);
        });

        Application.reqres.setHandler(Application.GET_COUNTRY, function(countryId){
            return API.getCountry(countryId);
        });
    })
});