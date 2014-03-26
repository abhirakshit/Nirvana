define([],
    function () {
        Application.module("Utils", function (Config, Application, Backbone, Marionette, $, _) {
            String.prototype.capitalize = function () {
                return this.charAt(0).toUpperCase() + this.slice(1);
            }
        });
    });