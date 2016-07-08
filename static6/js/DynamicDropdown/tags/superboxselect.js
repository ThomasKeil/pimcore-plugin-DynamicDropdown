/**
 * This source file is subject to the new BSD license that is 
 * available through the world-wide-web at this URL:
 * http://www.pimcore.org/license
 *
 * @category   Pimcore
 * @package    Object_Class
 * @copyright  Copyright (c) 2013 Weblizards GbR (http://www.weblizards.de)
 * @author     Thomas Keil <thomas@weblizards.de>
 * @license    http://www.pimcore.org/license     New BSD License
 */

pimcore.registerNS("pimcore.object.tags.superboxselect");
pimcore.object.tags.superboxselect = Class.create(pimcore.object.tags.multihref, {

    type: "superboxselect",

    initialize: function (data, fieldConfig) {

        this.data = data;
        this.fieldConfig = fieldConfig;
        this.mode = 'remote';

        this.fieldConfig.index = 15008;

        remote_data = null;
        jQuery.ajax({
            url: "/plugin/DynamicDropdown/dynamicdropdown/options",
            async: false,
            dataType: "json",
            type: "GET",
            data: {
                source_parent: fieldConfig.source_parentid,
                source_methodname: fieldConfig.source_methodname,
                source_classname: fieldConfig.source_classname,
                source_recursive: fieldConfig.source_recursive,
                current_language: pimcore.settings.language
            },
            success: function(data) {
                remote_data = data;
            }
        });
        
        this.fieldConfig.options = remote_data;			 
    },

    isDirty:function () {
        var dirty = false;

        if (!this.superboxselect.rendered) {
            return false;
        }

        dirty = this.superboxselect.isDirty();

        // once a field is dirty it should be always dirty (not an ExtJS behavior)
        if (this.superboxselect["__pimcore_dirty"]) {
            dirty = true;
        }
        if (dirty) {
            this.superboxselect["__pimcore_dirty"] = true;
        }

        return dirty;

    },

    getLayoutEdit: function () {
        var sort_by = this.fieldConfig.sort_by == "byvalue" ? "value" : "id";

        var store =new Ext.data.ArrayStore({
            sortInfo: { field: sort_by, direction: "ASC" },
            fields: [
                {name: "id", type: "int"},
                {name: "value", type: "string"}
            ]
        });
        for (var i = 0; i < this.fieldConfig.options.length; i++) {
            var value = this.fieldConfig.options[i].value;
            var key = this.fieldConfig.options[i].key;
            var record = new store.recordType({id: value, value: ts(key)});
            store.add(record);
        }

        //this.sortStore(store);
        var options = {
            allowBlank:false,
            queryDelay: 0,
            triggerAction: 'all',
            resizable: true,
            mode: 'local',
            anchor:'100%',
            minChars: 1,
            fieldLabel: this.fieldConfig.title,
            emptyText: t("choose_tags"),
            name: 'superboxselect',
            value: this.data,
            store: store,
            displayField: 'value',
            valueField: 'id',
            forceFormValue: true
        };

        if (this.fieldConfig.width) {
            options.width = this.fieldConfig.width;
        }

        this.superboxselect = new Ext.ux.form.SuperBoxSelect(options);
        this.component = this.superboxselect;
        return this.component;

    },

    getValue: function () {
        if(this.isRendered()) {
            return this.component.getValue();
        }
    }


});