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


// Although this is already set in pimcore's startup.js it won't
// work here without setting it again. Why?
Ext.Loader.setPath('Ext.ux', '/pimcore/static6/js/lib/ext/ux');
Ext.require([
    "Ext.ux.form.ItemSelector"
]);

pimcore.registerNS("pimcore.object.tags.itemselector");
pimcore.object.tags.itemselector = Class.create(pimcore.object.tags.multiselect, {
    delimiter:',',
    type: "itemselector",

    getLayoutEdit: function() {
        if (typeof this.data == "string") {
            var values = this.data.split(",");
        }
        var sort_by = this.fieldConfig.sort_by == "byvalue" ? "value" : "id";

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
            displayField: "key",
            valueField: "value",
            fieldLabel: this.fieldConfig.title,
            store: this.options_store,
            fromTitle: t('itemselector_available'),
            toTitle: t('itemselector_selected'),
            width: 600
        };

        if (this.fieldConfig.width) {
            options.width = this.fieldConfig.width;
        }

        this.component = new Ext.ux.form.ItemSelector(options);
        return this.component;


    },

    getGridColumnEditor:function (field) {
        return null;
    },

    getGridColumnFilter:function (field) {
        return null;
    }


});