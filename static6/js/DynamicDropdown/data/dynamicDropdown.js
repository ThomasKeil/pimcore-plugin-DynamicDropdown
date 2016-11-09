/**
 *
 * Definition of the Class Definition Tag
 *
 * @copyright  Copyright (c) Weblizards GmbH (http://www.weblizards.de)
 * @author     Thomas Keil <thomas@weblizards.de>
 * @license    GPLV3
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

    // This is for documentation purposes (and to make ide IDE happy)
    // It will be overwritten in this.initData() immediately
    datax: {
        source_sortby: null,
        source_recursive: null,
        source_classname: null,
        source_methodname: null,
        source_parentid: null
    },

    initialize: function (treeNode, initData) {
        this.type = "dynamicDropdown";
        this.initData(initData);
        this.treeNode = treeNode;
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

        this.classesStore = new Ext.data.JsonStore({
            autoDestroy: true,
            proxy: {
                type: 'ajax',
                url: '/admin/class/get-tree'
            },
            fields: ["name", "id"],
            autoLoad: true
        });

        this.classesCombo = new Ext.form.ComboBox({
            fieldLabel: t("allowed_classes"),
            name: "source_classname",
            listWidth: 'auto',
            triggerAction: 'all',
            editable: false,
            store: this.classesStore,
            displayField: "text",
            valueField: "text",
            summaryDisplay:true,
            value: this.datax.source_classname,

            listeners: {
                collapse: {
                    fn: function(combo/*, value*/) {
                        this.methodsCombo.store.reload({
                            params: {
                                classname: combo.getValue()
                            }
                        });
                        this.methodsCombo.setValue("");
                    }.bind(this)
                }
            }
        });

        this.methodsStore = new Ext.data.JsonStore({
            autoDestroy: true,
            proxy: {
                type: 'ajax',
                url: '/plugin/DynamicDropdown/dynamicdropdown/methods'
            },
            fields: ["key", "value"],
        });

        this.methodsStore.load({
            params: {
                classname: this.classesCombo.getValue()
            }
        });

        this.methodsCombo = new Ext.form.ComboBox({
            fieldLabel: t("methodname"),
            name: "source_methodname",
            listWidth: 'auto',
            triggerAction: 'all',
            editable: false,
            store: this.methodsStore,
            displayField: "value",
            valueField: "key",
            summaryDisplay:true,
            value: this.datax.source_methodname
        });

        this.specificPanel.removeAll();
        this.specificPanel.add([
            {
                xtype: "spinnerfield",
                fieldLabel: t("width"),
                name: "width",
                value: this.datax.width
            },
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
                            getTargetFromEvent: function(/* e */) {
                                return this.getEl();
                            }.bind(el),

                            onNodeOver : function(target, dd, e, data) {
                                data = data.records[0].data;
                                if (data.type == "folder") {
                                    return Ext.dd.DropZone.prototype.dropAllowed;
                                }
                                return Ext.dd.DropZone.prototype.dropNotAllowed;
                            },

                            onNodeDrop : function (target, dd, e, data) {
                                data = data.records[0].data;
                                if (data.type == "folder") {
                                    this.setValue(data.path);
                                    return true;
                                }
                                return false;
                            }.bind(el)
                        });
                    }
                }

            },
            {
                xtype: "checkbox",
                fieldLabel: t("recursive"),
                name: "source_recursive",
                checked: this.datax.source_recursive
            },
            {
                xtype: "combo",
                fieldLabel: t("Sort by"),
                name: "sort_by",
                listWidth: 'auto',
                triggerAction: 'all',
                editable: false,
                value: this.datax.sort_by ? this.datax.sort_by : "byid",
                store: [["byid", t("id")],["byvalue", t("value")]]
            },
            this.classesCombo,
            this.methodsCombo
        ]);
        return this.layout;
    },
    isValid: function ($super) {
        var data = this.getData();
        if (data.source_classname == "" || data.source_methodname == "" || data.source_parentid == "") {
            return false;
        }

        return $super();
    }
});
