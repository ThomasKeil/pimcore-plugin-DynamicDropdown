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