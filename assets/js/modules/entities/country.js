define([], function(){
    Application.module("Entities", function(Entities, Application, Backbone, Marionette, $, _) {

        Entities.allCountriesUrl = "/countries";
        Entities.countryUrl = "/country";

        Entities.Country = Entities.Model.extend({
            urlRoot: Entities.countryUrl,
            validation: {
                title: {required: true}
            }
        });

        Entities.CountryCollection = Entities.Collection.extend({
            url: Entities.allCountriesUrl,
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
                if (!Entities.allCountries || update){
                    Entities.allCountries = new Entities.CountryCollection();
                    Entities.allCountries.fetch();
                }
                return Entities.allCountries;
            }
        };

        Application.reqres.setHandler(Application.COUNTRIES_GET, function(update){
            return API.getAllCountries(update);
        });

        Application.reqres.setHandler(Application.COUNTRY_GET, function(countryId){
            return API.getCountry(countryId);
        });
    })
});