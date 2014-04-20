define([
], function () {
    Application.module("Enquiries.Content", function (Content, Application, Backbone, Marionette, $, _) {

        this.prefix = "Content";
        this.templatePath = "js/modules/";
        this.views = {};

        this.template = function (str) {
            return this.prefix + '-' + str;
        };


        Content.views.Layout = Application.Views.Layout.extend({
            template: "enquiries/content/templates/content_layout",
            regions: {
                enquiriesRegion: "#enquiries"
            }
        });


        var tableTitleHtml = "<%=args.title%>";
        Content.views.TableTitle = Application.Views.ItemView.extend({
            template: function(serialized_model) {
                return _.template(tableTitleHtml,
                    {title: serialized_model.title},
                    {variable: 'args'});
            },
            tagName:"span"
        });


        //Table Head
        Content.views.TableHeadColumn = Application.Views.ItemView.extend({
            template: function(serialized_model){
                return _.template("<%=args.columnName%>", {
                    columnName: serialized_model.columnName
                }, {variable: "args"})
            },

            tagName: "th"
        });

        Content.views.TableHeadComposite = Application.Views.CompositeView.extend({
            template: function(serialized_model){
                return _.template("");
            },
            tagName: "tr",
            itemView: Content.views.TableHeadColumn
        });


        //Table Body
        Content.views.Row = Application.Views.ItemView.extend({
            template: "enquiries/content/templates/row",
            tagName: "tr",

//            serializeData: function(){
//                var data = this.model.toJSON();
//                data.firstName = data.user.firstName;
//                data.lastName = data.user.lastName;
//                data.phoneNumber = data.user.phoneNumber;
//                data.email = data.user.email;
//                data.address = data.user.address;
//                return data;
//            },

            events: {
                "click": "click"
            },

            click: function(evt) {
                evt.preventDefault();
                this.trigger(Content.parent.SELECTED_ENQUIRY, this);
            }
        });


        Content.views.TableComposite = Application.Views.CompositeView.extend({
            template: "enquiries/content/templates/table_composite",
            itemView: Content.views.Row,
            itemViewContainer: "tbody",

            initialize: function(){
                var that = this;
                this.on(Application.CHILD_VIEW + ":" + Content.parent.SELECTED_ENQUIRY, function(childView){
                    that.trigger(Content.parent.SELECTED_ENQUIRY, childView.model.get('id'));
                });
            },

            onRender: function() {
                //Render Table Head
                var theadView = new Content.views.TableHeadComposite({
//                    collection: this.options.theadColumns
                    collection: this.model.attributes.theadColumns

                });

                this.$el.find("thead").append(theadView.render().el);

                //Add Datatables
                this.$el.find("#dataTable").dataTable({
                    "sDom": "<'row'<'col-sm-6'l><'col-sm-6'f>r>t<'row'<'col-xs-6'i><'col-xs-6'p>>",
                    "bJQueryUI": true,
                    "sPaginationType": "full_numbers",
                    "bInfo": false
                });


//                console.log($('#registration_form'));
//                this.parselyForm= $('#registration_form').parsley();

//                this.$el.find('#datetimepicker1').datetimepicker();
//                this.$el.find('#datetimepicker').datetimepicker();
//                this.$el.find('#datetimepicker1').data("DateTimePicker").setDate("10/23/2013");
            },

            events: {
                "click #createBtn" : "validate"
            },

            validate: function(evt) {
                evt.preventDefault();
                console.log("Validate");
                this.parselyForm= $('#registration_form').parsley();
                console.log($('input[name=firstname]'));
                $('input[name=firstname]').parsley('addConstraint', {required:true})

                console.dir(this.parselyForm);
//                $('#registration_form').parsley('validate');
                var isValid = this.parselyForm.validate();
                console.log(isValid);
            }
        });

    });
});