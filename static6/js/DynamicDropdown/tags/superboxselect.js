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


    getLayoutEdit: function () {
        this.options_store = new Ext.data.JsonStore({
            proxy: {
                type: 'ajax',
                url: '/plugin/DynamicDropdown/dynamicdropdown/options',
                extraParams: {
                    source_parent: this.fieldConfig.source_parentid,
                    source_methodname: this.fieldConfig.source_methodname,
                    source_classname: this.fieldConfig.source_classname,
                    source_recursive: this.fieldConfig.source_recursive,
                    current_language: pimcore.settings.language,
                    sort_by: this.fieldConfig.sort_by,
                    requesting_field: "superboxselect_" + this.fieldConfig.title
                }
            },
            fields: ["key", "value"],
            listeners: {
                "load": function(/* store */) {
                    this.component.setValue(this.data, null, true);
                }.bind(this)
            },
            autoLoad: true
        });

        var options = {
            name: this.fieldConfig.name,
            displayField: "key",
            valueField: "value",
            fieldLabel: this.fieldConfig.title,
            store: this.options_store,
            width: 600,
            listeners: {
                blur: {
                    fn: function() {
                        this.dataChanged = true;
                    }.bind(this)
                }
            }
        };

        if (this.fieldConfig.width) {
            options.width = this.fieldConfig.width;
        }

        this.component = new Ext.form.field.Tag(options);
        return this.component;


    },

    getGridColumnEditor:function (field) {
        return null;
    },

    getGridColumnFilter:function (field) {
        return null;
    },

    getValue: function () {
        return this.component.getValue();
    }

});