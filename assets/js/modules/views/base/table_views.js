define([
    "modules/views/base/base_setup"
], function(){
    Application.module("Views.Base", function(Base, Application, Backbone, Marionette, $, _) {
//        this.prefix = "Base";
//        this.templatePath = "js/modules/";
//        this.views = {};
//
//        this.template = function (str) {
//            return this.prefix + '-' + str;
//        };

        //Table Head
        Base.views.TableHeadColumn = Application.Views.ItemView.extend({
            template: function(serialized_model){
                return _.template("<%=args.columnName%>", {
                    columnName: serialized_model.columnName
                }, {variable: "args"})
            },

            tagName: "th"
        });

        Base.views.TableHeadComposite = Application.Views.CompositeView.extend({
            template: function(serialized_model){
                return _.template("");
            },
            tagName: "tr",
            itemView: Base.views.TableHeadColumn
        });

        //Table Body
        Base.views.TableComposite = Application.Views.CompositeView.extend({
            template: "views/templates/table_composite",
            itemViewContainer: "tbody",

            initialize: function(){
//                console.log('Base table composite');
                var that = this;
                var childClickEvt = this.model.get('childClickEvt');
                this.on(Application.CHILD_VIEW + ":" + childClickEvt, function(childView){
                    that.trigger(childClickEvt, childView.model.get('id'));
                });

                //Delete
                this.on(Application.CHILD_VIEW + ":" + Application.DELETE, function(childView){
                    that.trigger(Application.DELETE, childView.model.get('id'));
                });
            },

            getItemView: function(item) {
                return this.model.get('rowView');
            },

            onRender: function() {
                //Render Table Head
                var theadView = new Base.views.TableHeadComposite({
                    collection: this.model.attributes.theadColumns
                });

                this.$el.find("thead").append(theadView.render().el);

                //Add Datatables
                Application.Views.addDatatable(this.$el.find('#' + this.model.get('tableId')), this.options.dataTableOptions);
            }
        });


    });
});