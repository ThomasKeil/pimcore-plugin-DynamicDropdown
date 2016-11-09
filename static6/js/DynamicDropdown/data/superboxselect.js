/**
 *
 * @copyright  Copyright (c) 2013 Weblizards GbR (http://www.weblizards.de)
 * @author     Thomas Keil <thomas@weblizards.de>
 * @license    http://www.pimcore.org/license     New BSD License
 */

pimcore.registerNS("pimcore.object.classes.data.superboxselect");
pimcore.object.classes.data.superboxselect = Class.create(pimcore.object.classes.data.dynamicDropdown, {

    type: "superboxselect",

    initialize: function (treeNode, initData) {
        this.type = "superboxselect";
        this.initData(initData);
        this.treeNode = treeNode;
    },

    getTypeName: function () {
        return t("superboxselect");
    },

    getIconClass: function () {
        return "pimcore_icon_superboxselect";
    }

});
