/** SpagoBI, the Open Source Business Intelligence suite

 * Copyright (C) 2012 Engineering Ingegneria Informatica S.p.A. - SpagoBI Competency Center
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0, without the "Incompatible With Secondary Licenses" notice.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/. **/







/**
  *
  * Authors
  *
  * - Alberto Ghedin (alberto.ghedin@eng.it), Davide Zerbetto (davide.zerbetto@eng.it)
  */

Ext.ns("Sbi.cockpit.widgets.table");

Sbi.cockpit.widgets.table.QueryFieldsContainerPanel = function(config) {

	var defaultSettings = {
		title: LN('sbi.cockpit.widgets.table.tabledesignerpanel.fields')
	};

	if (Sbi.settings && Sbi.settings.worksheet && Sbi.settings.worksheet.designer && Sbi.settings.worksheet.designer.queryFieldsContainerPanel) {
		defaultSettings = Ext.apply(defaultSettings, Sbi.settings.worksheet.designer.queryFieldsContainerPanel);
	}

	var c = Ext.apply(defaultSettings, config || {});

	Ext.apply(this, c); // this operation should overwrite this.initialData content, that is initial grid's content

	this.addEvents('attributeDblClick');
	//this.addEvents('storeChanged', 'attributeDblClick', 'attributeRemoved');

	this.init(c);

	Ext.apply(c, {
        store: this.store
//        , width: 250
        , width: 650
        , height: 380
        , cls : 'table'
        , hideHeaders: true
	    , layout: 'fit'
	    , viewConfig: {
	    	plugins: {
				ptype: 'gridviewdragdrop',
	            ddGroup : this.ddGroup || 'crosstabDesignerDDGroup',
	            wcId: this.wcId
	        },
	    	forceFit: true,
//	    	getRowClass: function(record, rowIndex, rowParams, store){
//	            return record.get("hiddenForCalculatedFieldFlag") == true ? "hidden" : "x-grid-row";
//	        }
	    }
		, tools: [
//			        {
//			        	  type: 'help'
//			        	, handler: function(){
//							Ext.Msg.show({
//								   title: LN('Sbi.cockpit.widgets.table.QueryFieldsContainerPanel.infoTitle'),
//								   msg: LN('Sbi.cockpit.widgets.table.QueryFieldsContainerPanel.info'),
//								   buttons: Ext.Msg.OK,
//								   icon: Ext.MessageBox.INFO 	});
//			            }
//			          }
//		          ,
			{ // PLUS BUTTON
				type:'plus'
				, handler: function(){
					this.showInLineCalculatedFieldWizard(null);
				
				}
				, scope: this
				, qtip: LN('sbi.cockpit.widgets.table.tabledesignerpanel.fields.addcalculated')
			}
			, {
				type: 'close'
				, handler: this.removeAllValues
				, scope: this
				, qtip: LN('sbi.crosstab.attributescontainerpanel.tools.tt.removeall')
			}
		]
        , listeners: {
			render: function(grid) { // hide the grid header
				//grid.getView().el.select('.x-grid3-header').setStyle('display', 'none');
    		}
        	, cellkeydown: function(grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
        		if (e.keyCode === Ext.EventObject.DELETE) {
        			this.removeSelectedValues();
      	      	}
      	    }
        	, itemmouseenter: function(grid, record, item, index, e, eOpts) {
        		this.targetRowIndex = index; // for Drag&Drop
        	}
        	, itemmouseleave: function(grid, record, item, index, e, eOpts) {
        		this.targetRowIndex = -1;  // for Drag&Drop
        	}
        	, scope: this
		}
        , scope: this
        , type: 'queryFieldsContainerPanel'
	});

	// constructor
	Sbi.cockpit.widgets.table.QueryFieldsContainerPanel.superclass.constructor.call(this, c);

	//this.on('rowdblclick', this.rowDblClickHandler, this);
};

Ext.extend(Sbi.cockpit.widgets.table.QueryFieldsContainerPanel, Ext.grid.GridPanel, {

	initialData: undefined

	, targetRowIndex: -1

	, calculateTotalsCheckbox: null
	, calculateSubtotalsCheckbox: null

	, validFields: null

	, chooserWindow : null

	, Record: Ext.data.Record.create([
	      {name: 'id', type: 'string'}
	      , {name: 'alias', type: 'string'}
	      , {name: 'funct', type: 'string'}
	      , {name: 'iconCls', type: 'string'}
	      , {name: 'nature', type: 'string'}
	      , {name: 'values', type: 'string'}
	      , {name: 'sortable', type: 'boolean'}
//	      , {name: 'width', type: 'int'}
	      , {name: 'columnName', type: 'string'}
	      , {name: 'columnType', type: 'string'}
	      , {name: 'typeSecondary', type: 'string'}
	      , {name: 'decimals', type: 'int'}
	      , {name: 'scale', type: 'string'}
	      , {name: 'backgroundColor', type: 'string'}
	      , {name: 'columnWidth', type: 'string'}
	      , {name: 'fontType', type: 'string'}
	      , {name: 'fontSize', type: 'int'}
	      , {name: 'fontWeight', type: 'string'}
	      , {name: 'fontColor', type: 'string'}
	      , {name: 'fontDecoration', type: 'string'}
	      , {name: 'calculatedFieldFlag', type: 'boolean'}
	      , {name: 'calculatedFieldFormula', type: 'string'}
	      , {name: 'hiddenForCalculatedFieldFlag', type: 'boolean'}
	])
	
	, calculatedFieldWizard : null
	, inLineCalculatedFieldWizard : null

	, renderTpl1: [
		'<a id="button-{id}" class="x-btn x-unselectable x-btn-default-medium x-icon-text-left x-btn-icon-text-left x-btn-default-medium-icon-text-left" tabindex="0" unselectable="on" hidefocus="on" role="button">',
		'<span id="{id}-btnWrap" class="{baseCls}-wrap',
		     '<tpl if="splitCls"> {splitCls}</tpl>',
		     '{childElCls}" unselectable="on">',
		     '<span id="{id}-btnEl" class="{baseCls}-button">',
		         '<span id="{id}-btnInnerEl" class="{baseCls}-inner {innerCls}',
		             '{childElCls}" unselectable="on">',
		             '{text}',
		         '</span>',
		         '<span role="img" id="{id}-btnIconEl" class="{baseCls}-icon-el {iconCls}',
		             '{childElCls} {glyphCls}" unselectable="on" style="',
		             '<tpl if="iconUrl">background-image:url({iconUrl});</tpl>',
		             '<tpl if="glyph && glyphFontFamily">font-family:{glyphFontFamily};</tpl>">',
		             '<tpl if="glyph">&#{glyph};</tpl><tpl if="iconCls || iconUrl">&#160;</tpl>',
		         '</span>',
		     '</span>',
		 '</span>',
		 // if "closable" (tab) add a close element icon
		 '<tpl if="closable">',
		     '<span id="{id}-closeEl" class="{baseCls}-close-btn" title="{closeText}" tabIndex="0"></span>',
		 '</tpl>'
		 , '</a>'

    ]

  	, renderTpl2: ['<table id="{id}" cellspacing="0" class="x-btn x-btn-text-icon"><tbody class="x-btn-small x-btn-icon-small-left">',
  	                '<tr><td class="x-btn-tl"><i>&#160;</i></td><td class="x-btn-tc"></td><td class="x-btn-tr"><i>&#160;</i></td></tr>',
  	                '<tr><td class="x-btn-ml"><i>&#160;</i></td><td class="x-btn-mc"><button type="button" class=" x-btn-text {iconCls}"></button>{text}</td><td class="x-btn-mr"><i>&#160;</i></td></tr>',
  	                '<tr><td class="x-btn-bl"><i>&#160;</i></td><td class="x-btn-bc"></td><td class="x-btn-br"><i>&#160;</i></td></tr>',
  	                '</tbody></table>']

 	, templateArgs: {
         innerCls : '',
         splitCls : '',
         baseCls : Ext.baseCSSPrefix + 'btn',
         //iconUrl  : me.icon,
         iconCls  : '',//me.iconCls,
         //glyph: glyph,
         glyphCls: '',
         glyphFontFamily: Ext._glyphFontFamily,
         text     : '&#160;',
         funct : ''
    }

	, init: function(c) {
		this.initStore(c);
		this.initColumnModel(c);
	}

	, initStore: function(c) {
		this.store =  new Ext.data.ArrayStore({
	        fields: ['id', 		'alias', 	'funct', 'columnType', 	'typeSecondary', 'decimals',
	                 'scale', 	'backgroundColor', 'columnWidth', 'fontType', 'fontSize', 
	                 'fontWeight', 'fontColor', 'fontDecoration', 'calculatedFieldFlag', 
	                 'calculatedFieldFormula', 'hiddenForCalculatedFieldFlag', 'iconCls',  'nature', 
	                 'values', 'valid',  'sortable', /*'width', */ 'columnName'
	                 ]
		});
		// if there are initialData, load them into the store
		if (this.initialData !== undefined) {
			for (var i = 0; i < this.initialData.length; i++) {
				this.addField(this.initialData[i]);
			}
		}
		this.store.on('remove', function (theStore, theRecord, index ) {
			this.fireEvent('attributeRemoved', this, theRecord.data);
		}, this);
		/*
		 * unfortunately, when removing all record with removeAll method, the event remove is not raised
		 */
		this.store.on('bulkremove', function (theStore, theRecords ) {
			for (var i = 0 ; i < theRecords.length; i++) {
				var aRecord = theRecords[i];
				this.fireEvent('attributeRemoved', this, aRecord.data);
			}
		}, this);
	}

	, initColumnModel: function(c) {
		this.template = new Ext.XTemplate(this.renderTpl1);
        this.template.compile();

        var thePanel = this;
        
	    var fieldColumn = {
	    	header:  ''
	    	, dataIndex: 'alias'
	    	, flex: 1
	    	, hideable: false
	    	, hidden: false
	    	, sortable: false
	   	    , renderer : function(value, metaData, record, rowIndex, colIndex, store){
	   	    	Sbi.trace("[WidgetEditorFieldPalette.renderGridRow]: IN");

   	    		var functVar = '';
   	    		if(record.get("funct") != null && record.get("funct") != '' && record.get("funct") != 'NaN' && record.get("funct") != 'null')
   	    		{
   	    			functVar = record.get("funct");
   	    			functVar = '('+functVar+')';
   	    		}
   	    		
   	    		var templateData = Ext.apply({}, {
   	    			id: Ext.id()
   	    			, text:  record.get("alias")
   	    			, funct: functVar
   	    			, iconCls: (record.data.valid != undefined && !record.data.valid)? 'x-btn-invalid': record.get("iconCls")
   	    		}, this.templateArgs);
   	    		var htmlFragment = this.template.apply(templateData);
   	    		
   	    		//Sbi.trace("[WidgetEditorFieldPalette.renderGridRow]: htmlFragment ["  + htmlFragment + "]");
   	    		Sbi.trace("[WidgetEditorFieldPalette.renderGridRow]: OUT");
   	    		return htmlFragment;
	    	}
	        , scope: this
	    };
	    
	    var actionColumn = {
    		menuDisabled: true,
    		sortable: false,
    		xtype: 'actioncolumn',
    		width: 70,
    		align : 'right',
    		scope: this,
    		items: [{
//    			iconCls: 'icon_configure_tablerow_calculated_formula',
    			tooltip: LN('sbi.cockpit.widgets.table.inlineCalculatedFields.title'),
    			handler: function(grid, rowIndex, colIndex) {
					var rec = grid.getStore().getAt(rowIndex);
						
    				this.showInLineCalculatedFieldWizard(rec);
    			},
    			isDisabled : function(grid, rowIndex, colIndex) {
    				var rec = grid.getStore().getAt(rowIndex);
    				
    				var calculatedFieldFlag = rec.get('calculatedFieldFlag');
    				return !calculatedFieldFlag;
    			},
    			getClass : function(grid, metadata, model, rowIndex, colIndex, store) {
    				var rec = store.getAt(rowIndex);
    				
    				var calculatedFieldFlag = rec.get('calculatedFieldFlag');
    				return calculatedFieldFlag ? 'icon_configure_tablerow_calculated_formula' : 'hidden';
    			}
    		}, {
				iconCls: 'icon_configure_tablerow',
				tooltip: LN('sbi.cockpit.widgets.table.tabledesignerpanel.configure'),
				handler: function(grid, rowIndex, colIndex) {
					var rec = grid.getStore().getAt(rowIndex);
					thePanel.rowDblClickHandler(grid, rec);
					
				}
			}, {
		 		iconCls: 'icon_delete_tablerow',
		 		tooltip: LN('sbi.qbe.selectgridpanel.headers.delete.column'),
		 		handler: function(grid, rowIndex, colIndex) {
		 			var rec = grid.getStore().getAt(rowIndex);
		 			grid.getStore().remove(rec);
		 	        this.fireEvent('storeChanged', grid.getStore().getCount());
		 		}
		 	}]
	    }
	    
	    this.columns =[fieldColumn, actionColumn];
	}

	, notifyDropFromQueryFieldsPanel: function(ddSource) {
		Sbi.trace("[QueryFieldsContainerPanel.notifyDropFromQueryFieldsPanel]: IN");
		var rows = ddSource.dragData.records;
		var i = 0;
		for (; i < rows.length; i++) {
			var aRow = rows[i];
			// OLD: if the attribute is already present show a warning
			// NOW: now is permitted to add more attribute than one, to aggregate it in different ways
//			if (this.store.findExact('id', aRow.data.id) !== -1) {
//				Ext.Msg.show({
//					   title: LN('sbi.crosstab.attributescontainerpanel.cannotdrophere.title'),
//					   msg: LN('sbi.crosstab.attributescontainerpanel.cannotdrophere.attributealreadypresent'),
//					   buttons: Ext.Msg.OK,
//					   icon: Ext.MessageBox.WARNING
//				});
//				return;
//			}
			
			// Checks if there is a runtime hidden field created by a calculated field
			// and if present removes it
			var recordIndexInsideStore = this.store.findExact('id', aRow.data.id);
			if (recordIndexInsideStore !== -1) {
				var record = this.store.getAt(recordIndexInsideStore);
				var recordHiddenForCalculatedFieldFlag = record.get('hiddenForCalculatedFieldFlag');
				
				if(recordHiddenForCalculatedFieldFlag) {
					this.store.remove(record);
				}
			}
			
			if(aRow.data.nature === 'attribute'){
				if (recordIndexInsideStore !== -1) {
					Ext.Msg.show({
						   title: LN('sbi.crosstab.attributescontainerpanel.cannotdrophere.title'),
						   msg: LN('sbi.crosstab.attributescontainerpanel.cannotdrophere.attributealreadypresent'),
						   buttons: Ext.Msg.OK,
						   icon: Ext.MessageBox.WARNING
					});
					return;
				}
			}
			
			
			Sbi.trace("[QueryFieldsContainerPanel.notifyDropFromQueryFieldsPanel]: 1");

			// if the field is a postLineCalculated show an error
			if (aRow.data.nature === 'postLineCalculated') {
				Ext.Msg.show({
					   title: LN('sbi.crosstab.attributescontainerpanel.cannotdrophere.title'),
					   msg: LN('sbi.crosstab.attributescontainerpanel.cannotdrophere.postlinecalculated'),
					   buttons: Ext.Msg.OK,
					   icon: Ext.MessageBox.ERROR
				});
				return;
			}
			Sbi.trace("[QueryFieldsContainerPanel.notifyDropFromQueryFieldsPanel]: 2");

			this.addField(aRow.data);
			this.fireEvent('storeChanged', this.store.getCount());
		}
		Sbi.trace("[QueryFieldsContainerPanel.notifyDropFromQueryFieldsPanel]: OUT");
	}

	, notifyDropFromItSelf: function(ddSource) {
		Sbi.trace("[QueryFieldsContainerPanel.notifyDropFromItSelf]: IN");

        var sm = this.getSelectionModel();
        var store = this.getStore();
        var records = sm.getSelections();

        records = records.sort(function(r1, r2) {
            return store.indexOf(r2) - store.indexOf(r1);
        });

        // this.targetRowIndex is the row index on which the tree node has been dropped on
        if (this.targetRowIndex == -1) {
           records = records.reverse();
        }

        for (var i = 0; i < records.length; i++) {
        	var record = records[i];
        	store.remove(record);
            if (this.targetRowIndex != -1) {
            	store.insert(this.targetRowIndex, record);
            } else {
            	store.add(record);
            }
        }

        this.getView().refresh();

		Sbi.trace("[QueryFieldsContainerPanel.notifyDropFromItSelf]: OUT");
	}

//	, rowDblClickHandler: function(grid, rowIndex, event) {
//		var record = grid.store.getAt(rowIndex);
//		if (record.data.nature == 'attribute' || record.data.nature == 'segment_attribute') {
//	     	this.fireEvent("attributeDblClick", this, record.data);
//		}
//	}

	// double clicking on a field
	, rowDblClickHandler: function(grid, record, event) {

		Sbi.trace("[QueryFieldsContainerPanel.rowDblClickHandler]: IN");
		
		var thisPanel = this;
		var thisGrid = grid;
		var thisRecord = record;
		
		var elementTypes = Sbi.cockpit.widgets.table.AggregationChooserWindow.elementTypes;

		if(record != undefined){

			// OLD: if is a measure open aggregation chooser window
			// NEW: open a window and shot aggregation chooser for measure only
			//if (record.data.nature == 'measure') {


				// instantiate window

//				if(this.chooserWindow != null){
//					this.chooserWindow.close();
//					this.chooserWindow.destroy();
//				}

				// pass actual funct value for default case
				var defFormState = {
					alias: record.data.alias,
					funct: record.data.funct,
					nature: record.data.nature,
					columnType: 
						(record.data.columnType && record.data.columnType != '' ? record.data.columnType :
							record.data.nature == 'measure' ? 
									elementTypes.NUMBER : ''),
					typeSecondary: record.data.typeSecondary,
					decimals: record.data.decimals,
					scale: record.data.scale,
					backgroundColor: record.data.backgroundColor,
					columnWidth: record.data.columnWidth,
					fontType: record.data.fontType,
					fontSize: record.data.fontSize,
					fontWeight: record.data.fontWeight,
					fontColor: record.data.fontColor,
					fontDecoration: record.data.fontDecoration,
					calculatedFieldFlag: record.data.calculatedFieldFlag,
					calculatedFieldFormula: record.data.calculatedFieldFormula,
					hiddenForCalculatedFieldFlag: record.data.hiddenForCalculatedFieldFlag,
				};
			
				this.chooserWindow = new Sbi.cockpit.widgets.table.AggregationChooserWindow(defFormState);

				// on save set aggregation function
				this.chooserWindow.on('aggregationSave', function(window, formState){
					var recordIndex  = thisGrid.store.findExact('id', thisRecord.data.id);
					var record = thisGrid.store.getAt(recordIndex);
					
					var aliasSelected = formState.fieldAlias;
					
					if(aliasSelected !== undefined && aliasSelected !== null && aliasSelected !== ""){
						
						var indexAlias = thisGrid.store.findExact('alias', aliasSelected);
						
						if(indexAlias !== -1 && indexAlias !== recordIndex){
							Ext.Msg.show({
								   title: LN('sbi.cockpit.widgets.table.tabledesignerpanel.aliasalreadypresent.title'),
								   msg: LN('sbi.cockpit.widgets.table.tabledesignerpanel.aliasalreadypresent.msg'),
								   buttons: Ext.Msg.OK,
								   icon: Ext.MessageBox.WARNING
							});
							return;
						}else{
							record.data.alias = aliasSelected;
						}
					}
					
					if (record.data.nature == 'measure'){
						var aggregationSelected = formState.aggregation;
						
						record.data.funct = aggregationSelected;
						if(aggregationSelected == 'NONE'){
							record.data.funct = null;
						}
					}					
					
					var columnType = formState.columnType,
						typeSecondary = formState.typeSecondary,
						scale = formState.scale,
						decimals = formState.decimals,
						backgroundColor = formState.backgroundColor,
						columnWidth = formState.columnWidth,
						fontType = formState.fontType,
						fontSize = formState.fontSize,
						fontWeight = formState.fontWeight,
						fontColor = formState.fontColor,
						fontDecoration = formState.fontDecoration;
						calculatedFieldFlag = formState.calculatedFieldFlag;
						calculatedFieldFormula = formState.calculatedFieldFormula;
						hiddenForCalculatedFieldFlag = formState.hiddenForCalculatedFieldFlag;
					
					if(columnType !== undefined && columnType !== null && columnType !== "") {
						record.data.columnType = columnType;
					}
					
					if(typeSecondary !== undefined && typeSecondary !== null) {
						record.data.typeSecondary = typeSecondary;
					}
					
					if(decimals !== undefined) {
						record.data.decimals = decimals;
					}
					
					if(scale !== undefined && scale !== null) {
						record.data.scale = scale;
					}
					
					if(backgroundColor !== undefined && backgroundColor !== null) {
						record.data.backgroundColor = backgroundColor;
					}
					
					if(columnWidth !== undefined) {
						record.data.columnWidth = columnWidth;
					}
					
					if(fontType !== undefined && fontType !== null && fontType !== "") {
						record.data.fontType = fontType;
					}
					
					if(fontSize !== undefined) {
						record.data.fontSize = fontSize;
					}
					
					if(fontWeight !== undefined && fontWeight != null && fontWeight != "") {
						record.data.fontWeight = fontWeight;
					}
					
					if(fontColor !== undefined && fontColor != null) {
						record.data.fontColor = fontColor;
					}
					
					if(fontDecoration !== undefined && fontDecoration != null && fontDecoration != "") {
						record.data.fontDecoration = fontDecoration;
					}
					
					if(calculatedFieldFlag !== undefined && calculatedFieldFlag != null) {
						record.data.calculatedFieldFlag = calculatedFieldFlag;
						
						if(calculatedFieldFormula !== undefined && calculatedFieldFormula != null) {
							record.data.calculatedFieldFormula = calculatedFieldFormula;
						}
					}
					
					if(hiddenForCalculatedFieldFlag !== undefined && hiddenForCalculatedFieldFlag != null && hiddenForCalculatedFieldFlag != "") {
						record.data.hiddenForCalculatedFieldFlag = hiddenForCalculatedFieldFlag;
					}
					
					thisPanel.getView().refresh();

				});

				this.chooserWindow.show();

		}
		Sbi.trace("[QueryFieldsContainerPanel.rowDblClickHandler]: OUT");
	}

	, getContainedValues: function () {
		var attributes = [];
		for(var i = 0; i < this.store.getCount(); i++) {
			var record = this.store.getAt(i);
			attributes.push(record.data);
		}
		return attributes;
	}

	, setValues: function (attributes) {
		Sbi.trace("[QueryFieldsContainerPanel.setValues]: IN");
		this.removeAllValues();
		var i = 0;
		for (; i < attributes.length; i++) {
  			var attribute = attributes[i];
  			this.addField(attribute);
  		}
		this.fireEvent('storeChanged', this.store.getCount());
		Sbi.trace("[QueryFieldsContainerPanel.setValues]: OUT");
	}

	, addField : function (field) {
		//Default values
		if(field.columnName == undefined || field.columnName === null || field.columnName == ''){
			field.columnName = field.alias;
		}	
		
		field.sortable = true;
		if(field.nature == 'measure'){
			if(field.funct == null || field.funct == ''){
				field.funct = null;
			} else if((field.funct == undefined) || (typeof field.funct == typeof NaN)){
				field.funct = 'SUM';
			}
		}

		Sbi.trace("[QueryFieldsContainerPanel.addField]: IN");
		var data = Ext.apply({}, field); // making a clone
		
		var fieldCounter = 1;
		var tempId = data.id;
		var tempAlias = data.alias;
		
		while (this.store.findExact('id', tempId) !== -1){
			
			tempId = data.id + '(' + fieldCounter + ')';
			tempAlias = data.alias + '(' + fieldCounter + ')';
			fieldCounter++;
		}
		
		data.id = tempId;
		data.alias = tempAlias;
		
		var record = new this.Record(data);
		this.store.add(record);
		Sbi.trace("[QueryFieldsContainerPanel.addField]: field [" + Sbi.toSource(field)+ "] succesfully added");
		Sbi.trace("[QueryFieldsContainerPanel.addField]: OUT");
	}

	, removeSelectedValues: function() {
		Sbi.trace("[QueryFieldsContainerPanel.removeSelectedValues]: IN");
        var sm = this.getSelectionModel();
        var rows = sm.getSelections();
        this.store.remove(rows);
        this.fireEvent('storeChanged', this.store.getCount());
        Sbi.trace("[QueryFieldsContainerPanel.removeSelectedValues]: OUT");
	}

	, removeAllValues: function() {
		Sbi.trace("[QueryFieldsContainerPanel.removeAllValues]: IN");
		this.store.removeAll(false); // CANNOT BE SILENT!!! it must throw the clear event for attributeRemoved event
		this.fireEvent('storeChanged',0);
		Sbi.trace("[QueryFieldsContainerPanel.removeAllValues]: OUT");
	}

	, containsAttribute: function (attributeId) {
		if (this.store.findExact('id', attributeId) !== -1) {
			return true;
		}
		return false;
	}
	, validate: function (validFields) {

		this.validFields = validFields;

		var invalidFields = this.modifyStore(validFields);
		if(this.rendered){
			this.store.fireEvent("datachanged", this, null);
		}
		return invalidFields;

	}
	, modifyStore: function (validFields) {
		var invalidFields = '';
		var num = this.store.getCount();
		for(var i = 0; i < num; i++) {
			var record = this.store.getAt(i);
			var isValid = this.validateRecord(record,validFields);
			record.data.valid = isValid;
			if(isValid == false){
				invalidFields+=''+record.data.alias+',';
			}
		}
		return invalidFields;
	}
	, validateRecord: function (record, validFields) {
		var isValid = false;
		var i = 0;
		for(; i<validFields.length && isValid == false; i++){
			if(validFields[i].id == record.data.id){
			isValid = true;
			}
		}
		return isValid;
	}
	
	, showInLineCalculatedFieldWizard: function(targetRecord) { //copied by SelectGridPanel.js
		// get all records
		var datasetStore = Sbi.storeManager.getStoresById('datasetStore_' + this.wcId)[0];
		var records = datasetStore.queryBy( function(record) {
			return record;
		});
		
		var fields = new Array();
		//removes from the fields the calculated fields
		records.each(function(r) {
			if( ! r.data.calculatedFieldFlag ){
				var field = Ext.apply(r.data, {
						uniqueName: r.data.id,
						alias: r.data.alias,
						text: r.data.alias, 
						qtip: r.data.entity + ' : ' + r.data.field, 
						value: 'fields[\'' + r.data.alias + '\']'
				});
				fields.push(field);
			}
		});			
		
		if(this.inLineCalculatedFieldWizard != null) {
			this.inLineCalculatedFieldWizard.close();
		}
		this.initInLineCalculatedFieldWizard(fields);
		
		this.inLineCalculatedFieldWizard.show();
		this.inLineCalculatedFieldWizard.validationService.params = {
			fields: (fields.length > 0)? Ext.JSON.encode(fields) : ''
		};

		this.inLineCalculatedFieldWizard.setExpItems('fields', fields);
		this.inLineCalculatedFieldWizard.setTargetRecord(targetRecord);
		this.inLineCalculatedFieldWizard.show();
	}

	, initInLineCalculatedFieldWizard: function(fields) {
		
		fields = (fields && fields != null)? fields : new Array();
		
		this.inLineCalculatedFieldWizard = new Sbi.cockpit.widgets.table.wizard.CalculatedFieldWizard({
    		title: LN('sbi.cockpit.widgets.table.inlineCalculatedFields.title'),
    		expItemGroups: [
    		    {name:'fields', text: LN('sbi.cockpit.widgets.table.calculatedFields.fields')}, 
    		    {name:'arithmeticFunctions', text:  LN('sbi.cockpit.widgets.table.calculatedFields.functions.arithmentic')},
    		],
    		fields: fields,
    		arithmeticFunctions: Sbi.commons.Constants.INLINE_CALCULATED_FIELD_EDITOR_ARITHMETIC_FUNCTIONS, // functionsForInline,
    		expertMode: false,
        	scopeComboBoxData :[
        	     ['STRING','String', LN('sbi.cockpit.widgets.table.calculatedFields.string.type')],
    	         ['NUMBER', 'Number', LN('sbi.cockpit.widgets.table.calculatedFields.num.type')],
    	         ['DATE', 'Date', LN('sbi.cockpit.widgets.table.calculatedFields.num.type')]
    	    ],
    		validationService: {
				serviceName: 'VALIDATE_EXPRESSION_ACTION'
				, baseParams: {contextType: 'query'}
				, params: null
			}
    	});
		
    	this.inLineCalculatedFieldWizard.on('apply', function(win, formState, targetRecord){
    		var datasetMetafields = this.getDatasetMetafields();
    		var calculatedFieldFormula = this.inLineCalculatedFieldWizard.getCalculatedFieldFormula().trim();
    		
    		var fieldsToAddMap = {}; //object containing the fields to add to the table for calculated fields computes
    		
    		
    		var calculatedFieldFormulaToMatch = ' ' + calculatedFieldFormula + ' ';
    		for(var metafieldIndex = 0; metafieldIndex < datasetMetafields.length; metafieldIndex++) {
    			var metafield = datasetMetafields[metafieldIndex];
    			
    			var metafieldId = metafield.id;
    			
    			metafieldId = metafieldId //regex substitution
					.replace(/\\/g, '\\\\') //NB. this must be the first replace!!
					.replace(/\(/g, '\\(')
					.replace(/\)/g, '\\)')
					.replace(/\^/g, '\\^')
					.replace(/\$/g, '\\$')
					.replace(/\{/g, '\\{')
					.replace(/\}/g, '\\{')
					.replace(/\[/g, '\\[')
					.replace(/\]/g, '\\]')
					.replace(/\./g, '\\.')
					.replace(/\*/g, '\\*')
					.replace(/\+/g, '\\+')
					.replace(/\?/g, '\\?')
					.replace(/\|/g, '\\|')
					.replace(/\</g, '\\<')
					.replace(/\>/g, '\\>')
					.replace(/\-/g, '\\-')
					.replace(/\&/g, '\\&')
				;
				
				var re = new RegExp('\\s+' + metafieldId + '\\s+', 'g');
				
				if(calculatedFieldFormulaToMatch.match(re) && !fieldsToAddMap[metafieldId]) {
					fieldsToAddMap[metafieldId] = metafield;
				}
    		}
    		
    		var fieldsMetaKeys = Object.keys(fieldsToAddMap);
    		var storeDataColumnKeys = this.store.data.keys;
    		for(var i = 0; i < fieldsMetaKeys.length; i++){
    			var key = fieldsMetaKeys[i];
    			
    			if(storeDataColumnKeys.indexOf( fieldsToAddMap[key].id ) < 0) { //if the column is not yet present in the store
    				this.addField({
        				id: fieldsToAddMap[key].id, 
        				alias: fieldsToAddMap[key].alias, 
        				calculatedFieldFlag: false, 
        				columnType: "TEXT",
        				columnWidth: 0,
        				decimals: 0,
        				funct: 'NONE',
        				iconCls: fieldsToAddMap[key].nature,
        				hiddenForCalculatedFieldFlag: true,
        				nature: fieldsToAddMap[key].nature,
        				text: fieldsToAddMap[key].alias,
        				uniqueName: fieldsToAddMap[key].alias,
        				value: 'fields["' + fieldsToAddMap[key].id + '"]"',
        				values: "[]"
        			});
    			}
    		}
    		
    		var calculatedId = 'calculated_' + formState.alias.replace(/\s+/g, '_');
    		
    		var field = {
				id: calculatedId, 
				alias: formState.alias, 
				calculatedFieldFlag: true,
				calculatedFieldFormula: calculatedFieldFormula
			};
    		
    		if(targetRecord) {
    			Ext.apply(targetRecord.data, field);
    			this.store.fireEvent('datachanged', this.store);
    		} else {
    			this.addField({
    				id: calculatedId, 
    				alias: formState.alias, 
    				calculatedFieldFlag: true, 
    				calculatedFieldFormula: this.inLineCalculatedFieldWizard.getCalculatedFieldFormula().trim(),
    				columnType: "TEXT",
    				decimals: 0,
    				columnWidth: null
    			});
    		}
    		
    		this.fireEvent('storeChanged', this.store.getCount());
    	}, this);
	}
	
	, getDatasetMetafields : function() {
		var metafields = [];
		
		var datasetStore = Sbi.storeManager.getStoresById('datasetStore_' + this.wcId)[0];
		var data = datasetStore.data;
		
		for(i = 0; i < data.length; i++) {
			var record = data.items[i];
			var metafield = Ext.apply({}, record.data );
			
			metafields.push(metafield);
		}
		
		return metafields;
	}
});