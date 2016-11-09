/**
 *
 * @copyright  Copyright (c) 2016 Weblizards GmbH (http://www.weblizards.de)
 * @author     Thomas Keil <thomas@weblizards.de>
 * @author     Thomas Akkermans <thomas.akkermans@amgate.com>
 * @license    GPLv3
 */

pimcore.registerNS("pimcore.object.classes.data.dynamicDropdownMultiple");
pimcore.object.classes.data.dynamicDropdownMultiple = Class.create(pimcore.object.classes.data.dynamicDropdown, {

    type: "dynamicDropdownMultiple",

    initialize: function (treeNode, initData) {
        this.type = "dynamicDropdownMultiple";
        this.initData(initData);
        this.treeNode = treeNode;
    },

    getTypeName: function () {
        return t("dynamicDropdownMultiple");
    },

    getIconClass: function () {
        return "pimcore_icon_dynamicDropdownMultiple";
    }

});
