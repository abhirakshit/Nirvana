define([
], function () {
    Application.module("Enquiries.Content.All", function (All, Application, Backbone, Marionette, $, _) {

        this.prefix = "All";
        this.templatePath = "js/modules/";
        this.views = {};

        this.template = function (str) {
            return this.prefix + '-' + str;
        };


        All.views.Layout = Application.Views.Layout.extend({
            template: "enquiries/content/templates/layout",
            regions: {
                pendingEnquiriesRegion: "#pending-enquiries",
                todaysEnquiriesRegion: "#todays-enquiries",
                futureEnquiriesRegion: "#future-enquiries"
            }
        });


        //Table Head
        All.views.TableHeadColumn = Application.Views.ItemView.extend({
            template: function(serialized_model){
                return _.template("<%=args.columnName%>", {
                    columnName: serialized_model.columnName
                }, {variable: "args"})
            },

            tagName: "th"
        });

        All.views.TableHeadComposite = Application.Views.CompositeView.extend({
            template: function(serialized_model){
                return _.template("");
            },
            tagName: "tr",
            itemView: All.views.TableHeadColumn
        });


        All.views.Row_Today = Application.Views.ItemView.extend({
            template: "enquiries/content/all/templates/row_today",
            tagName: "tr",

            events: {
                "click": "click"
            },

            click: function(evt) {
                evt.preventDefault();
                this.trigger(Application.ENQUIRY_SHOW, this);
            }
        });

        All.views.Row = Application.Views.ItemView.extend({
            template: "enquiries/content/all/templates/row",
            tagName: "tr",

            events: {
                "click": "click"
            },

            click: function(evt) {
                evt.preventDefault();
                this.trigger(Application.ENQUIRY_SHOW, this);
            }
        });

        //Table Body
        All.views.TableComposite = Application.Views.CompositeView.extend({
            template: "enquiries/content/templates/table_composite",
            itemViewContainer: "tbody",

            initialize: function(){
                var that = this;
                this.on(Application.CHILD_VIEW + ":" + Application.ENQUIRY_SHOW, function(childView){
                    that.trigger(Application.ENQUIRY_SHOW, childView.model.get('id'));
                });
            },

            getItemView: function(item) {
                var tableId = this.model.get('tableId');
                if (tableId == 'todaysTable')
                    return All.views.Row_Today;
                else {
                    return All.views.Row;
                }
            },

            onRender: function() {
                //Render Table Head
                var theadView = new All.views.TableHeadComposite({
                    collection: this.model.attributes.theadColumns
                });

                this.$el.find("thead").append(theadView.render().el);

                var options = {
                    "sPaginationType": "simple_numbers",
                    "processing": true,
                    "serverSide": true,
                    "deferRender": true,
                    "ajax": $('#' + this.model.get('tableId')).data("/student/enquiry")
                };
                //Add Datatables
                Application.Views.addDatatable(this.$el.find('#' + this.model.get('tableId')), options);
            }
        });

    });
});