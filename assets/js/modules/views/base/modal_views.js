define([
    "modules/views/base/base_setup"
], function(){
    Application.module("Views.Base", function(Base, Application, Backbone, Marionette, $, _) {
      Base.views.ConfirmationModal = Application.Views.ItemView.extend({
          template: "views/templates/confirmation",

          events: {
            "click #confirmBtn" : "confirm"
          },

          confirm: function(evt) {
              evt.preventDefault();
              console.log("Confirm Clicked");
              Application.Views.hideModal(this.model.get("modalId"));
              this.trigger(Application.CONFIRM);
          }


      })

    })
});
