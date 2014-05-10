define([
], function () {
    Application.module("Enquiries.Content.Closed", function (Closed, Application, Backbone, Marionette, $, _) {

        this.prefix = "Closed";
        this.templatePath = "js/modules/";
        this.views = {};

        this.template = function (str) {
            return this.prefix + '-' + str;
        };


        Closed.views.Layout = Application.Views.Layout.extend({
            template: "enquiries/content/templates/layout",
            regions: {
                pendingEnquiriesRegion: "#pending-enquiries",
                todaysEnquiriesRegion: "#todays-enquiries",
                futureEnquiriesRegion: "#future-enquiries"
            }
        });


        var tableTitleHtml = "<%=args.title%>";
        Closed.views.TableTitle = Application.Views.ItemView.extend({
            template: function(serialized_model) {
                return _.template(tableTitleHtml,
                    {title: serialized_model.title},
                    {variable: 'args'});
            },
            tagName:"span"
        });


        //Table Head
        Closed.views.TableHeadColumn = Application.Views.ItemView.extend({
            template: function(serialized_model){
                return _.template("<%=args.columnName%>", {
                    columnName: serialized_model.columnName
                }, {variable: "args"})
            },

            tagName: "th"
        });

        Closed.views.TableHeadComposite = Application.Views.CompositeView.extend({
            template: function(serialized_model){
                return _.template("");
            },
            tagName: "tr",
            itemView: Closed.views.TableHeadColumn
        });


        Closed.views.Row = Application.Views.ItemView.extend({
            template: "enquiries/content/closed/templates/row",
            tagName: "tr",

            serializeData: function() {
                var data = this.model.toJSON();
                data.serviceNames = _.pluck(data.services, 'name').join(', ');
                data.countryNames = _.pluck(data.countries, 'name').join(', ');
                data.staffNames = _.pluck(data.staff, 'name').join(', ');
                data.statusName = data.enquiryStatus.name;
                return data;
            },

            events: {
                "click": "click"
            },

            click: function(evt) {
                evt.preventDefault();
                this.trigger(Application.ENQUIRY_SHOW, this);
            }
        });

        //Table Body
        Closed.views.TableComposite = Application.Views.CompositeView.extend({
            template: "enquiries/content/templates/table_composite",
            itemViewContainer: "tbody",
            itemView: Closed.views.Row,

            initialize: function(){
                var that = this;
                this.on(Application.CHILD_VIEW + ":" + Application.ENQUIRY_SHOW, function(childView){
                    that.trigger(Application.ENQUIRY_SHOW, childView.model.get('id'));
                });
            },

            onRender: function() {
                //Render Table Head
                var theadView = new Closed.views.TableHeadComposite({
                    collection: this.model.attributes.theadColumns
                });

                this.$el.find("thead").append(theadView.render().el);

                //Add Datatables
                Application.Views.addDatatable(this.$el.find('#' + this.model.get('tableId')));
            }
        });

    });
});