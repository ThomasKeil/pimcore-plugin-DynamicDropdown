/**
 * @category   Pimcore
 * @copyright  Copyright (c) 2016 Weblizards GmbH (http://www.weblizards.de)
 * @author     Thomas Keil <thomas@weblizards.de>
 * @author     Thomas Akkermans <thomas.akkermans@amgate.com>
 * @license    GPLv3
 */

pimcore.registerNS("pimcore.object.tags.dynamicDropdownMultiple");
pimcore.object.tags.dynamicDropdownMultiple = Class.create(pimcore.object.tags.multiselect, {

    type: "dynamicDropdownMultiple",

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
            editable: false,
            fieldLabel: this.fieldConfig.title,
            store: this.options_store,
            componentCls: "object_field",
            height: 100,
            displayField: "key",
            valueField: "value",
            labelWidth: this.fieldConfig.labelWidth ? this.fieldConfig.labelWidth : 100
        };

        options.width = 300;
        if (this.fieldConfig.width) {
            options.width = this.fieldConfig.width;
        }

        options.width += options.labelWidth;

        if (this.fieldConfig.height) {
            options.height = this.fieldConfig.height;
        }

        if (typeof this.data == "string" || typeof this.data == "number") {
            options.value = this.data;
        }

        this.component = Ext.create('Ext.ux.form.MultiSelect', options);

        return this.component;
    },

    getGridColumnEditor:function (field) {
        return null;
    },

    getGridColumnFilter:function (field) {
        return null;
    }


});