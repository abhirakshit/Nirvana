define([],
    function () {
        Application.module("Utils", function (Utils, Application, Backbone, Marionette, $, _) {
            String.prototype.capitalizeFirst = function () {
                return this.charAt(0).toUpperCase() + this.slice(1);
            }

        });
    });