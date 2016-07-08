/**
 * @copyright  Copyright (c) Weblizards GmbH (http://www.weblizards.de)
 * @author     Thomas Keil <thomas@weblizards.de>
 * @license    GPLv3
 */

pimcore.registerNS("pimcore.object.classes.data.itemselector");
pimcore.object.classes.data.itemselector = Class.create(pimcore.object.classes.data.dynamicDropdown, {

    type: "itemselector",

    initialize: function (treeNode, initData) {
        this.type = "itemselector";
        this.initData(initData);
        this.treeNode = treeNode;
    },

    getTypeName: function () {
        return t("itemselector");
    },

    getIconClass: function () {
        return "pimcore_icon_itemselector";
    }

});
