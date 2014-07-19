define([
    "modules/settings/admin/admin_view"
], function () {
    Application.module("Settings.Admin", function (Admin, Application, Backbone, Marionette, $, _) {

        Admin.Controller = Application.Controllers.Base.extend({
            initialize: function () {

                var user = Application.request(Application.GET_LOGGED_USER);
                var allLocations = Application.request(Application.GET_LOCATIONS);
                var allCountries = Application.request(Application.GET_COUNTRIES);
                var allServices = Application.request(Application.GET_SERVICES);
                var allStatus = Application.request(Application.GET_STATUS_All);

                this.layout = this.getLayout();

                this.listenTo(this.layout, Application.SHOW, function () {
                    this.showLocations(allLocations);
                    this.showServices(allServices);
                    this.showCountries(allCountries);
                    this.showStatusTypes(allStatus);
                });

                this.show(this.layout,
                    {
                        loading: {
                            entities: [user, allLocations, allCountries, allServices, allStatus]
                        }
                    });
            },

            showLocations: function (allLocations) {
                var addLocationModalId = "addLocationModal";
                var compModel = new Application.Entities.Model({
                    modalId: addLocationModalId,
                    headerText: "Locations",
                    headerClass: "showSectionHeader col-md-12",
                    btnText: "Add Location"
                });

                var locationView  = new Admin.views.MetaComposite({
                    collection: allLocations,
                    model: compModel
                });

                var that = this;

                this.listenTo(locationView, Admin.deleteMetaEvt, function(model) {
//                    that.showDeleteMetaModal(model.get('id'), allLocations, "Delete Location");
                });

                this.listenTo(locationView, Admin.showAddModalEvt, function () {
                    var newLocation = Application.request(Application.GET_LOCATION);

                    var addLocationModalView = new Admin.views.AddModalForm({
                        model: newLocation,
                        modalId: addLocationModalId,
                        formHeader: "Add Location",
                        placeholder: "NSP",
                        existingNames: allLocations.pluck('name')
                    });

                    addLocationModalView.on(Admin.createMetaEvt, function () {
                        newLocation.save([], {
                            wait: true,
                            patch: true,
                            success: function (location) {
                                allLocations.add(location);
                            },
                            error: function (x, response) {
                                console.log("Error on server!! -- " + response.text);
                                return response;
                            }
                        });

                    });
                    Application.modalRegion.show(addLocationModalView);
                });

                this.layout.locationsRegion.show(locationView);
            },

            showServices: function (allServices) {
                var addServiceModalId = "addServiceModal";
                var compModel = new Application.Entities.Model({
                    modalId: addServiceModalId,
                    headerText: "Services",
                    headerClass: "showSectionHeaderWithTopMargin col-md-12",
                    btnText: "Add Service"
                });

                var serviceView  = new Admin.views.MetaComposite({
                    collection: allServices,
                    model: compModel
                });

                var that = this;

                this.listenTo(serviceView, Admin.deleteMetaEvt, function(model) {
//                    that.showDeleteMetaModal(model.get('id'), allServices, "Delete Service");
                });

                this.listenTo(serviceView, Admin.showAddModalEvt, function () {
                    var newService = Application.request(Application.GET_SERVICE);

                    var addServiceModalView = new Admin.views.AddModalForm({
                        model: newService,
                        modalId: addServiceModalId,
                        formHeader: "Add Service",
                        placeholder: "GRE, GMAT, etc",
                        existingNames: allServices.pluck('name')
                    });

                    addServiceModalView.on(Admin.createMetaEvt, function () {
                        newService.save([], {
                            wait: true,
                            patch: true,
                            success: function (service) {
                                allServices.add(service);
                            },
                            error: function (x, response) {
                                console.log("Error on server!! -- " + response.text);
                                return response;
                            }
                        });

                    });
                    Application.modalRegion.show(addServiceModalView);
                });

                this.layout.servicesRegion.show(serviceView);
            },

            showCountries: function (allCountries) {
                var addCountryModalId = "addCountryModal";
                var compModel = new Application.Entities.Model({
                    modalId: addCountryModalId,
                    headerText: "Countries",
                    headerClass: "showSectionHeader col-md-12",
                    btnText: "Add Country"
                });

                var countryView  = new Admin.views.MetaComposite({
                    collection: allCountries,
                    model: compModel
                });

                var that = this;

                this.listenTo(countryView, Admin.deleteMetaEvt, function(model) {
//                    that.showDeleteMetaModal(model.get('id'), allServices, "Delete Service");
                });

                this.listenTo(countryView, Admin.showAddModalEvt, function () {
                    var newCountry = Application.request(Application.GET_COUNTRY);

                    var addCountryModalView = new Admin.views.AddModalForm({
                        model: newCountry,
                        modalId: addCountryModalId,
                        formHeader: "Add Country",
                        placeholder: "UK, USA",
                        existingNames: allCountries.pluck('name')
                    });

                    addCountryModalView.on(Admin.createMetaEvt, function () {
                        newCountry.save([], {
                            wait: true,
                            patch: true,
                            success: function (country) {
                                allCountries.add(country);
                            },
                            error: function (x, response) {
                                console.log("Error on server!! -- " + response.text);
                                return response;
                            }
                        });

                    });
                    Application.modalRegion.show(addCountryModalView);
                });

                this.layout.countriesRegion.show(countryView);
            },

            showStatusTypes: function (allStatusTypes) {
                var addStatusModalId = "addStatusModal";
                var compModel = new Application.Entities.Model({
                    modalId: addStatusModalId,
                    headerText: "Status Types",
                    headerClass: "showSectionHeaderWithTopMargin col-md-12",
                    btnText: "Add Status"
                });

                var statusTypeView  = new Admin.views.MetaComposite({
                    collection: allStatusTypes,
                    model: compModel
                });

                var that = this;

                this.listenTo(statusTypeView, Admin.deleteMetaEvt, function(model) {
//                    that.showDeleteMetaModal(model.get('id'), allServices, "Delete Service");
                });

                this.listenTo(statusTypeView, Admin.showAddModalEvt, function () {
                    var newStatus = Application.request(Application.GET_STATUS);

                    var addStatusModalView = new Admin.views.AddModalForm({
                        model: newStatus,
                        modalId: addStatusModalId,
                        formHeader: "Add Status",
                        placeholder: "UK, USA",
                        existingNames: allStatusTypes.pluck('name')
                    });

                    addStatusModalView.on(Admin.createMetaEvt, function () {
                        newStatus.save([], {
                            wait: true,
                            patch: true,
                            success: function (country) {
                                allStatusTypes.add(country);
                            },
                            error: function (x, response) {
                                console.log("Error on server!! -- " + response.text);
                                return response;
                            }
                        });

                    });
                    Application.modalRegion.show(addStatusModalView);
                });

                this.layout.statusTypesRegion.show(statusTypeView);
            },



            showDeleteMetaModal: function(metaId, allMetaCollection, headerText) {
                //Show delete confirmation dialog
                var confirmationView = Application.Views.getConfirmationView("deleteMetaModal", headerText,
                    "Are you sure?", "Delete", true);

                this.listenTo(confirmationView, Application.CONFIRM, function() {
                    var metaModel = allMetaCollection.get(metaId);
                    console.log("Delete: " + metaModel);
                    metaModel.destroy({
                        wait: true,
                        success: function (deletedMeta){
                            console.dir(deletedMeta);
                        },

                        error: function(x, response) {
                            console.log("Error on server!! -- " + response.text);
                            return response;
                        }
                    })
                });
                Application.modalRegion.show(confirmationView);
            },


            getLayout: function () {
                return new Admin.views.Layout();
            }
        });

    })
});