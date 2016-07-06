/**
 *
 * @copyright  Copyright (c) 2016 Weblizards GmbH (http://www.weblizards.de)
 * @author     Thomas Keil <thomas@weblizards.de>
 * @license    GPLv3
 */

pimcore.registerNS("pimcore.object.tags.dynamicDropdown");
pimcore.object.tags.dynamicDropdown = Class.create(pimcore.object.tags.select, {

    type: "dynamicDropdown",

    getGridColumnEditor:function (field) {
        return null;
    },

    getGridColumnFilter:function (field) {
        return null;
    },
    
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
                    sort_by: this.fieldConfig.sort_by
                }
            },
            fields: ["key", "value"],
            listeners: {
                "load": function(/* store */) {
                    this.component.setValue(this.data);
                }.bind(this)
            },
            autoLoad: true
        });

        var options = {
            name: this.fieldConfig.name,
            triggerAction: "all",
            editable: true,
            typeAhead: true,
            forceSelection: true,
            selectOnFocus: true,
            fieldLabel: this.fieldConfig.title,
            store: this.options_store,
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
