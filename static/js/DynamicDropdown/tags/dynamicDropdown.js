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

pimcore.registerNS("pimcore.object.tags.dynamicDropdown");
pimcore.object.tags.dynamicDropdown = Class.create(pimcore.object.tags.select, {

    type: "dynamicDropdown",

    initialize: function (data, layoutConf) {
        this.data = data;
        this.fieldConfig = layoutConf;
        //this.fieldConfig.width = 250;
        this.mode = 'remote';

        this.fieldConfig.index = 15005;
    },

    getGridColumnEditor:function (field) {
        return null;
    },

    getGridColumnFilter:function (field) {
        return null;
    },
    
    getLayoutEdit: function () {
        // generate store
        options_store = new Ext.data.Store({
            proxy: new Ext.data.HttpProxy({
                url: '/plugin/DynamicDropdown/dynamicdropdown/options'
            }),
            baseParams: {
                source_parent: this.fieldConfig.source_parentid,
                source_methodname: this.fieldConfig.source_methodname,
                source_classname: this.fieldConfig.source_classname,
                source_recursive: this.fieldConfig.source_recursive,
                current_language: pimcore.settings.language,
                sort_by: this.fieldConfig.sort_by
            },
            autoLoad: true,
            loading: true,
            reader: new Ext.data.JsonReader({
                //root: 'data'
            }, [{name: 'value'}, {name: 'key'}]),
            listeners: {
                "load": function(store) {
                    console.log(this);
                    this.component.setValue(this.data);
                }.bind(this)
            }
        });

        var options = {
            name: this.fieldConfig.name,
            triggerAction: "all",
            editable: true,
            typeAhead: true,
            forceSelection: true,
            selectOnFocus: true,
            fieldLabel: this.fieldConfig.title,
            store: options_store,
            itemCls: "object_field",
            width: 300,
            displayField: "key",
            valueField: "value",
            mode: "local",
            autoSelect: true
        };

        if (this.fieldConfig.width) {
            options.width = this.fieldConfig.width;
        }

        // TODO
        //if (typeof this.data == "string" || typeof this.data == "number") {
        //    if (in_array(this.data, validValues)) {
        //        options.value = this.data;
        //    } else {
        //        options.value = "";
        //    }
        //} else {
        //    options.value = "";
        //}

        this.component = new Ext.form.ComboBox(options);
        return this.component;
    }    

//    getGridColumnEditor: function(field) {
//        var store = new Ext.data.JsonStore({
//            autoDestroy: true,
//            root: 'options',
//            fields: ['key',"value"],
//            url: "/plugin/DynamicDropdown/dynamicdropdown/options"
//        });
//        store.load({ params: {
//            source_parent: field.layout.source_parentid,
//                source_methodname: field.layout.source_methodname,
//                source_classname: field.layout.source_classname,
//                source_recursive: field.layout.source_recursive,
//                current_language: pimcore.settings.language
//            }
//        });
//
//        var editorConfig = {};
//
//        if (field.config) {
//            if (field.config.width) {
//                if (intval(field.config.width) > 10) {
//                    editorConfig.width = field.config.width;
//                }
//            }
//        }
//
//        editorConfig = Object.extend(editorConfig, {
//            store: store,
//            triggerAction: "all",
//            editable: false,
//            mode: "local",
//            valueField: 'value',
//            displayField: 'key'
//        });
//
//        return new Ext.form.ComboBox(editorConfig);
//    },
//
//
//    getGridColumnFilter: function(field) {
//        console.log(field);
//        return null;
//
//        var selectFilterFields = [];
//
//        var store = new Ext.data.JsonStore({
//            autoDestroy: true,
//            root: 'options',
//            fields: ['key',"value"],
//            url: "/plugin/DynamicDropdown/dynamicdropdown/options"
//        });
//        store.load({ params: {
//            source_parent: field.layout.source_parentid,
//            source_methodname: field.layout.source_methodname,
//            source_classname: field.layout.source_classname,
//            source_recursive: field.layout.source_recursive,
//            current_language: pimcore.settings.language
//        }
//        });
//
//        store.each(function (rec) {
//            selectFilterFields.push(rec.data.value);
//        });
//
//        return {
//            type: 'list',
//            dataIndex: field.key,
//            options: selectFilterFields
//        };
//      }
});
