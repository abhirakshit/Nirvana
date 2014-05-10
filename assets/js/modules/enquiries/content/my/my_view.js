define([
], function () {
    Application.module("Enquiries.Content.My", function (My, Application, Backbone, Marionette, $, _) {

        this.prefix = "My";
        this.templatePath = "js/modules/";
        this.views = {};

        this.template = function (str) {
            return this.prefix + '-' + str;
        };


        My.views.Layout = Application.Views.Layout.extend({
//            template: "enquiries/content/my/templates/layout",
            template: "enquiries/content/templates/layout",
            regions: {
                pendingEnquiriesRegion: "#pending-enquiries",
                todaysEnquiriesRegion: "#todays-enquiries",
                futureEnquiriesRegion: "#future-enquiries"
            }
        });


//        var tableTitleHtml = "<%=args.title%>";
//        My.views.TableTitle = Application.Views.ItemView.extend({
//            template: function(serialized_model) {
//                return _.template(tableTitleHtml,
//                    {title: serialized_model.title},
//                    {variable: 'args'});
//            },
//            tagName:"span"
//        });


        //Table Head
        My.views.TableHeadColumn = Application.Views.ItemView.extend({
            template: function(serialized_model){
                return _.template("<%=args.columnName%>", {
                    columnName: serialized_model.columnName
                }, {variable: "args"})
            },

            tagName: "th"
        });

        My.views.TableHeadComposite = Application.Views.CompositeView.extend({
            template: function(serialized_model){
                return _.template("");
            },
            tagName: "tr",
            itemView: My.views.TableHeadColumn
        });


        My.views.Row_Today = Application.Views.ItemView.extend({
//            template: "enquiries/content/my/templates/row_today",
            template: "enquiries/content/templates/row_today",
            tagName: "tr",

            serializeData: function() {
                var data = this.model.toJSON();
                data.serviceNames = _.pluck(data.services, 'name').join(', ');
                data.countryNames = _.pluck(data.countries, 'name').join(', ');
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

        My.views.Row = Application.Views.ItemView.extend({
//            template: "enquiries/content/my/templates/row",
            template: "enquiries/content/templates/row",
            tagName: "tr",

            intialize: function() {
                console.log("Init....");
            },

            serializeData: function() {
                var data = this.model.toJSON();
                data.serviceNames = _.pluck(data.services, 'name').join(', ');
                data.countryNames = _.pluck(data.countries, 'name').join(', ');
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
        My.views.TableComposite = Application.Views.CompositeView.extend({
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
                    return My.views.Row_Today;
                else {
                    return My.views.Row;
                }
            },

            onRender: function() {
                //Render Table Head
                var theadView = new My.views.TableHeadComposite({
                    collection: this.model.attributes.theadColumns
                });

                this.$el.find("thead").append(theadView.render().el);

                //Add Datatables
                Application.Views.addDatatable(this.$el.find('#' + this.model.get('tableId')));
//                this.$el.find('#' + this.model.get('tableId')).dataTable();
//                this.$el.find('#' + this.model.get('tableId')).DataTable();
            }

//            events: {
//                "click #createBtn" : "validate"
//            },
//
//            validate: function(evt) {
//                evt.preventDefault();
//                console.log("Validate");
//                this.parselyForm= $('#registration_form').parsley();
//                console.log($('input[name=firstname]'));
//                $('input[name=firstname]').parsley('addConstraint', {required:true})
//
////                console.dir(this.parselyForm);
////                $('#registration_form').parsley('validate');
//                var isValid = this.parselyForm.validate();
////                console.log(isValid);
//            }
        });

    });
});