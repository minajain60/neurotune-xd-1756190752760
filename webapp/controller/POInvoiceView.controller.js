sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageToast",
  "sap/m/MessageBox",
  "sap/m/MessagePopover",
  "sap/m/MessageItem",
  "sap/ui/core/library",
  "sap/ui/core/UIComponent",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/ui/model/Sorter",
  "sap/ui/core/util/Export",
  "sap/ui/core/util/ExportTypeCSV"
], function (Controller, JSONModel, MessageToast, MessageBox, MessagePopover, MessageItem, coreLibrary, UIComponent, Filter, FilterOperator, Sorter, Export, ExportTypeCSV) {
  "use strict";

  // Shortcut for sap.ui.core.MessageType
  var MessageType = coreLibrary.MessageType;

  /**
   * @class POInvoiceView controller.
   * This class is responsible for controlling the POInvoiceView view.
   * @alias converted.poinvoiceview.controller.POInvoiceView
   * @extends sap.ui.core.mvc.Controller
   */
  return Controller.extend("converted.poinvoiceview.controller.POInvoiceView", {
    /**
     * Called when a view is instantiated and its controls (if available) are already created.
     * Used to perform one-time initialization tasks.
     */
    onInit: function () {
      var oView = this.getView();

      // Load header data from mock data
      var oHeaderModel = new JSONModel();
      oHeaderModel.loadData("model/mockData/header.json");
      oView.setModel(oHeaderModel, "header");

      // Load item data from mock data
      var oItemsModel = new JSONModel();
      oItemsModel.loadData("model/mockData/items.json");
      oView.setModel(oItemsModel, "items");

      // Load customer data from mock data
      var oCustomerModel = new JSONModel();
      oCustomerModel.loadData("model/mockData/customers.json");
      oView.setModel(oCustomerModel, "customers");

      // Load product data from mock data
      var oProductModel = new JSONModel();
      oProductModel.loadData("model/mockData/products.json");
      oView.setModel(oProductModel, "products");

      // Load order data from mock data
      var oOrderModel = new JSONModel();
      oOrderModel.loadData("model/mockData/orders.json");
      oView.setModel(oOrderModel, "orders");

      // Initialize message model for MessageArea/MessagePopover
      var oMessageModel = new JSONModel({
        messages: [{
          type: MessageType.Success,
          title: "System Information",
          description: "Application converted successfully, Use AI optimize for better result",
          subtitle: "Conversion complete",
          counter: 1
        }]
      });
      oView.setModel(oMessageModel, "messages");

      // Initialize a default item for the Item Details Section
      var oSelectedItemModel = new JSONModel({
        selectedItem: {
          description: "[10] NGL-PHARM-1R, Kontrastmittel Ultravist 300"
        }
      });
      oView.setModel(oSelectedItemModel, "selectedItem");
      // Converted from WebDynpro: 2025-08-26T06:45:57.816Z
    },

    // Event handlers
    onBeforeRendering: function () {
      // Prepare data before rendering
    },

    onAfterRendering: function () {
      // Adjust UI after rendering
    },

    // Enhanced event handlers for special WebDynpro elements

    /**
     * Handle value help request (for ValueHelp / F4 elements)
     * @param {sap.ui.base.Event} oEvent The event object
     */
    handleValueHelp: function (oEvent) {
      var oSource = oEvent.getSource();

      // Create value help dialog if it doesn't exist
      if (!this._valueHelpDialog) {
        this._valueHelpDialog = new sap.m.SelectDialog({
          title: "Select Value",
          confirm: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem");
            if (oSelectedItem) {
              oSource.setValue(oSelectedItem.getTitle());
            }
          }
        });

        // Sample items - would be filled with actual data in a real app
        var oDialogModel = new JSONModel({
          items: [{
            title: "Item 1",
            description: "Description 1"
          }, {
            title: "Item 2",
            description: "Description 2"
          }, {
            title: "Item 3",
            description: "Description 3"
          }]
        });

        this._valueHelpDialog.setModel(oDialogModel);
        this._valueHelpDialog.bindAggregation("items", {
          path: "/items",
          template: new sap.m.StandardListItem({
            title: "{title}",
            description: "{description}"
          })
        });
      }

      // Open the dialog
      this._valueHelpDialog.open();
    },

    /**
     * Handle file download requests (for FileDownload elements)
     * @param {sap.ui.base.Event} oEvent The event object
     */
    onFileDownload: function (oEvent) {
      // In a real application, this would be connected to a backend service
      // For now, we'll show a message
      MessageToast.show("File download initiated");

      // Sample approach to download a file:
      // var sUrl = "/api/downloadFile?id=123";
      // var link = document.createElement("a");
      // link.href = sUrl;
      // link.download = "filename.pdf";
      // link.click();
    },

    /**
     * Open message popover (for MessageArea elements)
     * @param {sap.ui.base.Event} oEvent The event object
     */
    handleMessagePopoverPress: function (oEvent) {
      if (!this._messagePopover) {
        this._messagePopover = new MessagePopover({
          items: {
            path: "messages>/messages",
            template: new MessageItem({
              type: "{messages>type}",
              title: "{messages>title}",
              description: "{messages>description}",
              subtitle: "{messages>subtitle}",
              counter: "{messages>counter}"
            })
          }
        });

        this.getView().byId("messagePopoverBtn").addDependent(this._messagePopover);
      }

      this._messagePopover.toggle(oEvent.getSource());
    },

    /**
     * Handle navigation link press events
     * @param {sap.ui.base.Event} oEvent The event object
     */
    onNavigationLinkPress: function (oEvent) {
      var oSource = oEvent.getSource();
      var sHref = oSource.getHref();

      if (sHref) {
        // If href is set, let the default behavior handle it
        return;
      }

      // Otherwise, handle the navigation programmatically
      var sNavTarget = oSource.data("navTarget");
      if (sNavTarget) {
        MessageToast.show("Navigating to: " + sNavTarget);
        // In a real application, this would navigate to the appropriate view or application
        // using the router
      }
    },

    /**
     * Handle office control rendering
     * @param {sap.ui.base.Event} oEvent The event object
     */
    onOfficeControlRendered: function (oEvent) {
      // This would normally integrate with MS Office API or similar
      // In a converted application, this would be replaced by a more appropriate solution
      console.log("Office control container rendered");

      var oSource = oEvent.getSource();
      var sDomRef = oSource.getDomRef();
      if (sDomRef) {
        sDomRef.innerHTML = '<div class="sapUiMediumMargin">' +
          '<div class="sapUiMediumMarginBottom">' +
          '<span class="sapUiIcon sapUiIconMirrorInRTL" style="font-family:SAP-icons;color:#0854a0;font-size:2.5rem">&#xe0ef;</span>' +
          '</div>' +
          '<div class="sapMText">' +
          '<p>Office document integration would be configured here.</p>' +
          '<p>In SAPUI5, this typically uses OData services with MS Graph API integration.</p>' +
          '</div>' +
          '</div>';
      }
    },

    /**
     * Open dialog
     * This is a generic handler for WebDynpro dialog elements
     * @param {sap.ui.base.Event} oEvent The event object
     */
    openDialog: function (oEvent) {
      // Get the dialog ID from the source control
      var oSource = oEvent.getSource();
      var sDialogId = oSource.data("dialogId") || "confirmDialog";

      // Find the dialog in the view
      var oDialog = this.getView().byId(sDialogId);
      if (oDialog) {
        oDialog.open();
      } else {
        MessageToast.show("Dialog with ID '" + sDialogId + "' not found");
      }
    },

    /**
     * Close dialog
     * @param {sap.ui.base.Event} oEvent The event object
     */
    closeDialog: function (oEvent) {
      var oDialog = oEvent.getSource().getParent();
      oDialog.close();
    },

    /**
     * Handle dialog confirm button press
     * @param {sap.ui.base.Event} oEvent The event object
     */
    onDialogConfirm: function (oEvent) {
      // Handle dialog confirmation logic
      MessageToast.show("Dialog confirmed");
      this.closeDialog(oEvent);
    },

    /**
     * Handle dialog cancel button press
     * @param {sap.ui.base.Event} oEvent The event object
     */
    onDialogCancel: function (oEvent) {
      // Handle dialog cancellation
      this.closeDialog(oEvent);
    },

    /**
     * Navigate to SecondView
     * @param {sap.ui.base.Event} oEvent The event object
     */
    onNextPress: function (oEvent) {
      // Get the router instance
      var oRouter = UIComponent.getRouterFor(this);

      // Navigate to the 'second' route
      oRouter.navTo("second");
    },

    /**
     * Navigate back to main view
     * @param {sap.ui.base.Event} oEvent The event object
     */
    onBackPress: function (oEvent) {
      // Get the router instance
      var oRouter = UIComponent.getRouterFor(this);

      // Navigate to the 'main' route
      oRouter.navTo("main");
    },

    /**
     * Navigate to a specific route
     * @param {string} sRoute The route name to navigate to
     */
    navTo: function (sRoute) {
      var oRouter = UIComponent.getRouterFor(this);
      oRouter.navTo(sRoute);
    },

    /**
     * Event handler for Save button press
     */
    onActionSave: function () {
      MessageToast.show("Save action triggered");
    },

    /**
     * Event handler for Save Options dropdown
     */
    onActionSaveOptions: function () {
      MessageToast.show("More save options selected");
    },

    /**
     * Event handler for Document Overview link
     */
    onActionDocumentOverview: function () {
      MessageToast.show("Navigate to Document Overview");
    },

    /**
     * Event handler for Print Preview button
     */
    onActionPrintPreview: function () {
      MessageToast.show("Open Print Preview");
    },

    /**
     * Event handler for Messages button
     */
    onActionMessages: function () {
      this.handleMessagePopoverPress(); // Using existing handler
    },

    /**
     * Event handler for Information button
     */
    onActionShowInfo: function () {
      MessageToast.show("Display information");
    },

    /**
     * Event handler for Personal Setting button
     */
    onActionPersonalSetting: function () {
      MessageToast.show("Open Personal Settings");
    },

    /**
     * Event handler for Cancel button
     */
    onActionCancel: function () {
      MessageToast.show("Cancel changes");
    },

    /**
     * Event handler for Header Tab selection
     * @param {sap.ui.base.Event} oEvent The event object
     */
    onSelectHeaderTab: function (oEvent) {
      var sTabId = oEvent.getParameter("selectedKey");
      MessageToast.show("Selected tab: " + sTabId);
    },

    /**
     * Event handler for Item Table Zoom In button
     */
    onActionItemTableZoomIn: function () {
      MessageToast.show("Zoom In on Item Table");
    },

    /**
     * Event handler for Item Table Layout button
     */
    onActionItemTableLayout: function () {
      MessageToast.show("Change Item Table Layout");
    },

    /**
     * Event handler for Item Table Grid Lines button
     */
    onActionItemTableGridLines: function () {
      MessageToast.show("Toggle Item Table Grid Lines");
    },

    /**
     * Event handler for Select All Items checkbox
     */
    onActionSelectAllItems: function () {
      MessageToast.show("Select All Items in Table");
    },

    /**
     * Event handler for Display Material link
     * @param {sap.ui.base.Event} oEvent The event object
     */
    onActionDisplayMaterial: function (oEvent) {
      var sMaterialId = oEvent.getSource().getText(); // Assuming the text is the material ID
      MessageToast.show("Display Material: " + sMaterialId);
    },

    /**
     * Event handler for Item Settings button from row
     * @param {sap.ui.base.Event} oEvent The event object
     */
    onActionItemSettingsFromRow: function (oEvent) {
      var sItemNumber = oEvent.getSource().getBindingContext("items").getProperty("itemNumber"); // Assuming "items" model and "itemNumber" property
      MessageToast.show("Item Settings for Item: " + sItemNumber);
    },

    /**
     * Event handler for Item Search button
     */
    onActionItemSearch: function () {
      MessageToast.show("Search Item");
    },

    /**
     * Event handler for Item Duplicate button
     */
    onActionItemDuplicate: function () {
      MessageToast.show("Duplicate Item");
    },

    /**
     * Event handler for Item Add button
     */
    onActionItemAdd: function () {
      MessageToast.show("Add Item");
    },

    /**
     * Event handler for Item Delete button
     */
    onActionItemDelete: function () {
      MessageToast.show("Delete Item");
    },

    /**
     * Event handler for Item Lock button
     */
    onActionItemLock: function () {
      MessageToast.show("Lock Item");
    },

    /**
     * Event handler for Item Unlock button
     */
    onActionItemUnlock: function () {
      MessageToast.show("Unlock Item");
    },

    /**
     * Event handler for Item Attach button
     */
    onActionItemAttach: function () {
      MessageToast.show("Attach Document to Item");
    },

    /**
     * Event handler for Item Details button
     */
    onActionItemDetails: function () {
      MessageToast.show("Show Item Details");
    },

    /**
     * Event handler for Item Filter button
     */
    onActionItemFilter: function () {
      MessageToast.show("Filter Items");
    },

    /**
     * Event handler for Item Sort button
     */
    onActionItemSort: function () {
      MessageToast.show("Sort Items");
    },

    /**
     * Event handler for Item Layout button
     */
    onActionItemLayout: function () {
      MessageToast.show("Table Layout Settings");
    },

    /**
     * Event handler for Item Export button
     */
    onActionItemExport: function () {
      MessageToast.show("Export Items");
    },

    /**
     * Event handler for Item Settings button
     */
    onActionItemSettings: function () {
      MessageToast.show("Table Settings");
    },

    /**
     * Event handler for Additional Planning button
     */
    onActionAddlPlanning: function () {
      MessageToast.show("Additional Planning");
    },

    /**
     * Event handler for Item Selector Dropdown
     */
    onActionItemSelectorDropdown: function () {
      MessageToast.show("Item Selector Dropdown");
    },

    /**
     * Event handler for Item Navigation Up button
     */
    onActionItemNavUp: function () {
      MessageToast.show("Navigate to Previous Item");
    },

    /**
     * Event handler for Item Navigation Down button
     */
    onActionItemNavDown: function () {
      MessageToast.show("Navigate to Next Item");
    },

    /**
     * Event handler for Item Detail Tab selection
     * @param {sap.ui.base.Event} oEvent The event object
     */
    onSelectItemTab: function (oEvent) {
      var sTabId = oEvent.getParameter("selectedKey");
      MessageToast.show("Selected Item Detail Tab: " + sTabId);
    },

    /**
     * Event handler for Inv. Receipt CheckBox
     */
    onToggleInvReceipt: function () {
      MessageToast.show("Inv. Receipt toggled");
    },

    /**
     * Event handler for Final Invoice CheckBox
     */
    onToggleFinalInvoice: function () {
      MessageToast.show("Final Invoice toggled");
    },

    /**
     * Event handler for GR-Bsd IV CheckBox
     */
    onToggleGRBsdIV: function () {
      MessageToast.show("GR-Bsd IV toggled");
    },

    /**
     * Event handler for ERS CheckBox
     */
    onToggleERS: function () {
      MessageToast.show("ERS toggled");
    },

    /**
     * Event handler for Tax Code Enter
     */
    onEnterTaxCode: function () {
      MessageToast.show("Tax Code entered");
    },

    /**
     * Event handler for Taxes button
     */
    onActionTaxes: function () {
      MessageToast.show("Show Taxes");
    },
    /* Comprehensive Button Functionality Implementation */
    /**
     * Export table data to CSV format.
     */
    onExportToCSV: function () {
      var oTable = this.byId("itemTable"); // Assuming the table ID is "itemTable"
      var aData = oTable.getModel("items").getData().items; // Get data from the "items" model
      var sCsvContent = this._convertToCSV(aData);
      var oBlob = new Blob([sCsvContent], {
        type: 'text/csv'
      });
      var sUrl = URL.createObjectURL(oBlob);
      var oLink = document.createElement('a');
      oLink.href = sUrl;
      oLink.download = 'po_invoice_items.csv'; // File name
      oLink.click();
      URL.revokeObjectURL(sUrl);
    },
    /**
     * Convert JSON data to CSV format.
     * @param {Array} aData Array of JSON objects.
     * @returns {string} CSV formatted string.
     * @private
     */
    _convertToCSV: function (aData) {
      if (!aData || aData.length === 0) {
        return '';
      }
      var aHeaders = Object.keys(aData[0]);
      var sCsv = aHeaders.join(',') + '\n';
      aData.forEach(function (row) {
        var aValues = aHeaders.map(function (header) {
          return '"' + (row[header] || '').toString().replace(/"/g, '""') + '"';
        });
        sCsv += aValues.join(',') + '\n';
      });
      return sCsv;
    },
    /**
     * Export table data to Excel format.
     */
    onExportToExcel: function () {
      var oTable = this.byId("itemTable");
      var oExport = new Export({
        exportType: new ExportTypeCSV({
          fileExtension: 'xlsx',
          mimeType: 'application/vnd.ms-excel'
        }),
        models: oTable.getModel("items"), // Ensure the model name is correct
        rows: {
          path: "/items"
        },
        columns: this._getExportColumns()
      });
      oExport.saveFile("po_invoice_items").then(function () {
        MessageToast.show("Export completed successfully");
      });
    },
    /**
     * Define the columns for the export.
     * @returns {Array} Array of column definitions.
     * @private
     */
    _getExportColumns: function () {
      return [{
        name: "Item Number",
        template: {
          content: "{items>itemNumber}"
        }
      }, {
        name: "Material",
        template: {
          content: "{items>material}"
        }
      }, {
        name: "Short Text",
        template: {
          content: "{items>shortText}"
        }
      }, {
        name: "PO Quantity",
        template: {
          content: "{items>poQuantity}"
        }
      }, {
        name: "Delivery Date",
        template: {
          content: "{items>deliveryDate}"
        }
      }, {
        name: "Net Price",
        template: {
          content: "{items>netPrice}"
        }
      }, {
        name: "Currency",
        template: {
          content: "{items>currency}"
        }
      }];
    },
    /**
     * Live search functionality for the item table.
     * @param {sap.ui.base.Event} oEvent The search event.
     */
    onSearch: function (oEvent) {
      var sQuery = oEvent.getParameter("newValue") || oEvent.getParameter("query");
      var oTable = this.byId("itemTable");
      var oBinding = oTable.getBinding("items");
      var aFilters = [];
      if (sQuery && sQuery.length > 0) {
        var aSearchFilters = [];
        // Search across multiple fields
        aSearchFilters.push(new Filter("material", FilterOperator.Contains, sQuery));
        aSearchFilters.push(new Filter("shortText", FilterOperator.Contains, sQuery));
        aFilters.push(new Filter({
          filters: aSearchFilters,
          and: false
        }));
      }
      oBinding.filter(aFilters);
      this._updateSearchResultsCount(oBinding.getLength());
    },
    /**
     * Update the search results count.
     * @param {number} iCount The number of search results.
     * @private
     */
    _updateSearchResultsCount: function (iCount) {
      var oTitle = this.byId("tableTitle");
      if (oTitle) {
        oTitle.setText("Items (" + iCount + ")");
      }
    },
    /**
     * Open the filter dialog.
     */
    onFilterPress: function () {
      if (!this._oFilterDialog) {
        this._oFilterDialog = sap.ui.xmlfragment("converted.poinvoiceview.view.FilterDialog", this); //Ensure FilterDialog.fragment.xml exists
        this.getView().addDependent(this._oFilterDialog);
      }
      this._oFilterDialog.open();
    },
    /**
     * Confirm the filter settings.
     * @param {sap.ui.base.Event} oEvent The event containing the filter items.
     */
    onConfirmFilter: function (oEvent) {
      var aFilterItems = oEvent.getParameter("filterItems");
      var aFilters = [];
      aFilterItems.forEach(function (oItem) {
        var sPath = oItem.getKey();
        var sValue = oItem.getText();
        aFilters.push(new Filter(sPath, FilterOperator.EQ, sValue));
      });
      var oTable = this.byId("itemTable");
      var oBinding = oTable.getBinding("items");
      oBinding.filter(aFilters);
    },
    /**
     * Open the sort dialog.
     */
    onSortPress: function () {
      if (!this._oSortDialog) {
        this._oSortDialog = sap.ui.xmlfragment("converted.poinvoiceview.view.SortDialog", this); //Ensure SortDialog.fragment.xml exists
        this.getView().addDependent(this._oSortDialog);
      }
      this._oSortDialog.open();
    },
    /**
     * Confirm the sort settings.
     * @param {sap.ui.base.Event} oEvent The event containing the sort item.
     */
    onConfirmSort: function (oEvent) {
      var sSortPath = oEvent.getParameter("sortItem").getKey();
      var bDescending = oEvent.getParameter("sortDescending");
      var oSorter = new Sorter(sSortPath, bDescending);
      var oTable = this.byId("itemTable");
      var oBinding = oTable.getBinding("items");
      oBinding.sort(oSorter);
    },
    /**
     * Validate the form inputs.
     * @returns {boolean} True if the form is valid, false otherwise.
     * @private
     */
    _validateForm: function () {
      var bValid = true;
      var aInputs = [this.byId("idTaxCodeField")];
      aInputs.forEach(function (oInput) {
        if (oInput) {
          var sValue = oInput.getValue();
          if (!sValue || sValue.trim() === "") {
            oInput.setValueState(coreLibrary.ValueState.Error);
            oInput.setValueStateText("This field is required");
            bValid = false;
          } else {
            oInput.setValueState(coreLibrary.ValueState.None);
          }
        }
      });
      return bValid;
    },
    /**
     * Submit the form data.
     * @private
     */
    _submitForm: function () {
      if (this._validateForm()) {
        var oData = {
          taxCode: this.byId("idTaxCodeField").getValue()
        };
        // Simulate API call
        this.byId("idTaxesButton").setBusy(true);
        setTimeout(function () {
          this.byId("idTaxesButton").setBusy(false);
          MessageToast.show("Data saved successfully");
        }.bind(this), 1000);
      } else {
        MessageToast.show("Please correct the errors");
      }
    },
    /**
     * Event handler for the "Taxes" button press.
     */
    onTaxesButtonPress: function () {
      this._submitForm();
    }
  });
});
