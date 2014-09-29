define([
    "modules/staff/list/list_view"
], function () {
    Application.module("Staff.List", function (List, Application, Backbone, Marionette, $, _) {

        List.Controller = Application.Controllers.Base.extend({
            initialize: function () {
                var tabId = this.options.tabId;
                var staffList;

                if (tabId == List.parent.ACTIVE_TAB) {
                    staffList = Application.request(Application.GET_ACTIVE_STAFF);
                } else if (tabId == List.parent.CLOSED_TAB) {
                    staffList = Application.request(Application.GET_CLOSED_STAFF);
                } else if (tabId == List.parent.ALL_TAB) {
                    staffList = Application.request(Application.GET_ALL_STAFF);
                }
                this.layout = this.getLayout();
                this.listenTo(this.layout, Application.SHOW, function () {
//                    this.showAllStaff(allStaff);
                    this.setupTabContent(staffList);
                });

                this.show(this.layout, {
                    loading: {
                        entities: [staffList]
                    }
                });
            },

//            showAllStaff: function (allStaff) {
//                var allStaffView = new List.views.StaffCollection({collection: allStaff});
//                this.layout.staffListRegion.show(allStaffView);
//                var that = this;
//                this.listenTo(allStaffView, Application.SELECTED_STAFF, function (staffId) {
//                    Application.execute(Application.SELECTED_STAFF, that.layout.contentRegion, staffId);
//                });
//            },

            setupTabContent: function (staffList) {
                var headerColumns = new Application.Entities.Collection([
                    new Application.Entities.Model({columnName: "Name"}),
                    new Application.Entities.Model({columnName: "Phone"}),
                    new Application.Entities.Model({columnName: "Email"}),
                    new Application.Entities.Model({columnName: "Locations"})
                ]);

                var that = this;
                var title = '<i style="color: green;" class="i i-users3"></i>&nbsp;Staff';
                var tableComposite = this.getTableView("staffTable", title, headerColumns, staffList, List.views.Row, Application.SELECTED_STAFF);
                this.listenTo(tableComposite, Application.SELECTED_STAFF, function (studentId) {
                    Application.execute(Application.SELECTED_STAFF, that.layout.contentRegion, studentId);
                });
                this.layout.staffListRegion.show(tableComposite);
            },

            setupTableView: function (allStaff, headerColumns, tableTitle, tableId, region) {
                var tableComposite = this.getTableView(tableId, tableTitle, headerColumns, allStaff, List.views.Row, Application.SELECTED_STAFF);
                region.show(tableComposite);
            },

            getTableView: function (tableId, title, theadColumns, rows, rowView, childClickEvt) {
                return new Application.Views.Base.views.TableComposite({
                    model: new Application.Entities.Model({
                        tableId: tableId,
                        title: title,
                        theadColumns: theadColumns,
                        childClickEvt: childClickEvt,
                        rowView: rowView
                    }),
                    collection: rows
                });
            },

            getLayout: function () {
                return new List.views.Layout();
            }

        });


    });
});
