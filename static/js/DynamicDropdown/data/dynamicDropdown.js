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

pimcore.registerNS("pimcore.object.classes.data.dynamicDropdown");
pimcore.object.classes.data.dynamicDropdown = Class.create(pimcore.object.classes.data.data, {

    type: "dynamicDropdown",
    allowIndex: true,
		
    /**
      * define where this datatype is allowed
      */
    allowIn: {
        object: true,
        objectbrick: true,
        fieldcollection: true,
        localizedfield: true
    },		

    initialize: function (treeNode, initData) {
        this.type = "dynamicDropdown";

        this.initData(initData);

        this.treeNode = treeNode;
        this.id = this.type + "_" + treeNode.attributes.id;
    },

    getTypeName: function () {
        return t("dynamicDropdown");
    },

    getGroup: function () {
        return "select";
    },

    getIconClass: function () {
        return "Dynamicdropdown_icon_element";
    },

    getLayout: function ($super) {

        $super();

        this.specificPanel.removeAll();
        this.specificPanel.add([
            {
                xtype: "spinnerfield",
                fieldLabel: t("width"),
                name: "width",
                value: this.datax.width
            }
        ]);

        this.specificPanel.add([
        {
            xtype: "textfield",
            fieldLabel: t("parentid"),
            name: "source_parentid",
            cls: "input_drop_target",
            value: this.datax.source_parentid,
            listeners: {
                "render": function (el) {
                    new Ext.dd.DropZone(el.getEl(), {
                        reference: this,
                        ddGroup: "element",
                        getTargetFromEvent: function(e) {
                            return this.getEl();
                        }.bind(el),

                        onNodeOver : function(target, dd, e, data) {
                            if (data.node.attributes.type == "folder") {
                                return Ext.dd.DropZone.prototype.dropAllowed;
                            }
                            return Ext.dd.DropZone.prototype.dropNotAllowed;
                        },

                        onNodeDrop : function (target, dd, e, data) {
                            if (data.node.attributes.type == "folder") {
                                this.setValue(data.node.attributes.path);
                                return true;
                            }
                            return false;
                        }.bind(el)
                    });
                }
            }
								
        }
        ]);

        var source_recursive = this.specificPanel.add([{
            xtype: "checkbox",
            fieldLabel: t("recursive"),
            name: "source_recursive",
//            id: "source_recursive",
            checked: this.datax.source_recursive
        }]);

        var sortby_combobox = this.specificPanel.add([
            {
                xtype: "combo",
                fieldLabel: t("Sort by"),
                name: "sort_by",
//                id: "sortby",
                listWidth: 'auto',
                triggerAction: 'all',
                editable: false,
                value: this.datax.sort_by ? this.datax.sort_by : "byid",
                store: [["byid", t("id")],["byvalue", t("value")]]
            }
        ]);

        var classname_combobox = this.specificPanel.add([
        {
            xtype: "combo",
            fieldLabel: t("allowed_classes"),
            name: "source_classname",
            id: this.id + "_classname",
            method_id: this.id + "_methodnames",
            listWidth: 'auto',
            triggerAction: 'all',
            editable: false,
            store: new Ext.data.JsonStore({
                url: '/admin/class/get-tree',
                fields: ["text","id"]
            }),
            displayField: "text",
            valueField: "text",
            summaryDisplay:true,
            value: this.datax.source_classname,

            listeners: {
                expand: {
                    fn:function(combo, value) {
                        var methodnames = Ext.getCmp(this.method_id);
                        methodnames.disable();
                    }
                },
                collapse: {
                    fn:function(combo, value) {
                        var methodnames = Ext.getCmp(this.method_id);

                        var loadDone = function(store, records, options) {
                            store.un("load", loadDone);
                            methodnames.render();
                            methodnames.enable();

                        }

                        methodnames.store.on("load", loadDone);
                        methodnames.store.reload({
                            params: {
                                classname: combo.getValue()
                            }
                        });
                        methodnames.store.baseParams.classname = combo.getValue();
                        methodnames.setValue("");
                    }
                }


            }
        }
        ]);
        this.specificPanel.add([
        {
            xtype: "combo",
            fieldLabel: t("methodname"),
            name: "source_methodname",
            id: this.id + "_methodnames",
            listWidth: 'auto',
            triggerAction: 'all',
            editable: false,
            store: new Ext.data.JsonStore({
                url: '/plugin/DynamicDropdown/dynamicdropdown/methods',
                fields: ["key","value"],
                baseParams: {
                    classname: Ext.getCmp(this.id + "_classname").getValue()
                    }
            }),
            displayField: "value",
            valueField: "key",
            summaryDisplay:true,
            value: this.datax.source_methodname
        }


        ]);

        return this.layout;
    },
    isValid: function ($super) {
        var data = this.getData();
        if (data.source_classname == "" || data.source_methodname == "" || data.source_parentid == "") return false;

        return $super();
    }
});
