/**
 * Pimcore
 *
 * LICENSE
 *
 * This source file is subject to the new BSD license that is bundled
 * with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://www.pimcore.org/license
 *
 * @copyright  Copyright (c) 2011 Weblizards GbR (http://www.weblizards.de)
 * @author     Thomas Keil <thomas@weblizards.de>
 * @license    http://www.pimcore.org/license     New BSD License
 */

pimcore.registerNS("pimcore.object.tags.itemselector");
pimcore.object.tags.itemselector = Class.create(pimcore.object.tags.multiselect, {
    delimiter:',',
    type: "itemselector",

    initialize: function (data, layoutConf) {
        this.data = data;
        this.fieldConfig = layoutConf;
        this.mode = 'remote';
        this.is_dirty = false;
        this.fieldConfig.index = 15007;

        remote_data = null;
        jQuery.ajax({
            url: "/plugin/DynamicDropdown/dynamicdropdown/options",
            async: false,
            dataType: "json",
            type: "GET",
            data: {
                source_parent: layoutConf.source_parentid,
                source_methodname: layoutConf.source_methodname,
                source_classname: layoutConf.source_classname,
                source_recursive: layoutConf.source_recursive,
                current_language: pimcore.settings.language,
                sort_by: layoutConf.sort_by
            },
            success: function(data) {
                remote_data = data;
            }
        });
        this.fieldConfig.options = remote_data;

    },

    getGridColumnEditor:function (field) {
        return null;
    },

    getGridColumnFilter:function (field) {
        return null;
    },

    getLayoutEdit: function () {

        var height = 200;
        var values = [];
        if (typeof this.data == "string") {
            var values = this.data.split(",");
        }
        var sort_by = this.fieldConfig.sort_by == "byvalue" ? "value" : "id";

        // generate store
        var store_from =new Ext.data.ArrayStore({
            sortInfo: { field: sort_by, direction: "ASC" },
            fields: [
                {name: "id", type: "int"},
                {name: "value", type: "string"}
            ]
        });

        var store_to = new Ext.data.ArrayStore({
            sortInfo: { field: sort_by, direction: "ASC" },
            fields: [
                {name: "id", type: "int"},
                {name: "value", type: "string"}
            ]
        });

        for (var i = 0; i < this.fieldConfig.options.length; i++) {
            var value = this.fieldConfig.options[i].value;
            var key = this.fieldConfig.options[i].key;

            if (values.indexOf(value.toString()) >= 0) {
                var record = new store_to.recordType({id: value, value: ts(key)});
                store_to.add(record);
            } else {
                var record = new store_from.recordType({id: value, value: ts(key)});
                store_from.add(record);
            }
        }
        this.sortStore(store_from);
        this.sortStore(store_to);

        var options_from = {
            legend: 'Available',
            triggerAction: "all",
            editable: false,
            store: store_from,
            displayField: "value",
            itemCls: "object_field",
            width: "99%",
            height: height,
            border: true
        };

        var options_to = {
            legend: 'Selected',
            triggerAction: "all",
            editable: false,
            store: store_to,
            displayField: "value",
            itemCls: "object_field",
            width: "99%",
            height: height,
            border: true
        };

        this.fromMultiselect = new Ext.ux.form.MultiSelect(options_from);
        this.fromMultiselect.on('dblclick', this.onRowDblClick, this);

        this.toMultiselect = new Ext.ux.form.MultiSelect(options_to);
        this.toMultiselect.on('dblclick', this.onRowDblClick, this);

        var hBox = new Ext.Panel({
            border: false,
            frame: false,
            width: this.fieldConfig.width,
            height: height,
            fieldLabel: this.fieldConfig.title,
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [{
                xtype: 'panel',
                flex: 9,
                items: [ this.fromMultiselect],
                border: false
            }, {
                xtype: 'panel',
                flex: 1,
                border: false
            }, {
                xtype: 'panel',
                flex: 9,
                items: [ this.toMultiselect ],
                border: false
            }]

        })

        this.component = hBox;
        return this.component;
    },


    getLayoutShow: function () {

        this.component = this.getLayoutEdit();
        this.component.disable();

        return this.component;
    },

    getValue: function () {
        if(this.isRendered()) {
            this.is_dirty = false;

            var record = null;
            var values = [];
            var store = this.toMultiselect.view.store;

            for (var i=0; i<store.getCount(); i++) {
                record = store.getAt(i);
                values.push(record.data.id);
            }
            result = values.join(this.delimiter);
            return result;
        }
    },

    isDirty:function () {
        var dirty = false;

        if (!this.toMultiselect.rendered) {
            return false;
        }

        dirty = this.toMultiselect.isDirty();

        // once a field is dirty it should be always dirty (not an ExtJS behavior)
        if (this.toMultiselect["__pimcore_dirty"]) {
            dirty = true;
        }
        if (dirty) {
            this.toMultiselect["__pimcore_dirty"] = true;
        }

        return dirty;

    },

    onRowDblClick : function(vw, index, node, e) {
        if (vw == this.toMultiselect.view){
            this.toFrom();
        } else if (vw == this.fromMultiselect.view) {
            this.fromTo();
        }
        //return this.fireEvent('rowdblclick', vw, index, node, e);
    },

    fromTo : function() {
        var selectionsArray = this.fromMultiselect.view.getSelectedIndexes();
        var records = [];
        if (selectionsArray.length > 0) {
            for (var i=0; i<selectionsArray.length; i++) {
                record = this.fromMultiselect.view.store.getAt(selectionsArray[i]);
                records.push(record);
            }
            if(!this.allowDup)selectionsArray = [];
            for (var i=0; i<records.length; i++) {
                record = records[i];
                if(this.allowDup){
                    var x=new Ext.data.Record();
                    record.id=x.id;
                    delete x;
                    this.toMultiselect.view.store.add(record);
                }else{
                    this.fromMultiselect.view.store.remove(record);
                    this.toMultiselect.view.store.add(record);
                    selectionsArray.push((this.toMultiselect.view.store.getCount() - 1));
                }
            }
        }
        this.toMultiselect.view.refresh();
        this.fromMultiselect.view.refresh();
        this.sortStore(this.toMultiselect.store);
        this.toMultiselect.view.select(selectionsArray);
        this.toMultiselect["__pimcore_dirty"] = true;
    },

    toFrom : function() {
        var selectionsArray = this.toMultiselect.view.getSelectedIndexes();
        var records = [];
        if (selectionsArray.length > 0) {
            for (var i=0; i<selectionsArray.length; i++) {
                record = this.toMultiselect.view.store.getAt(selectionsArray[i]);
                records.push(record);
            }
            selectionsArray = [];
            for (var i=0; i<records.length; i++) {
                record = records[i];
                this.toMultiselect.view.store.remove(record);
                if(!this.allowDup){
                    this.fromMultiselect.view.store.add(record);
                    selectionsArray.push((this.fromMultiselect.view.store.getCount() - 1));
                }
            }
        }
        this.fromMultiselect.view.refresh();
        this.toMultiselect.view.refresh();
        this.sortStore(this.fromMultiselect.store);
        this.fromMultiselect.view.select(selectionsArray);
        this.toMultiselect["__pimcore_dirty"] = true;
    },

    sortStore : function(store) {
        var si = store.sortInfo;
        if(si){
            store.sort(si.field, si.direction);
        }
    }

});