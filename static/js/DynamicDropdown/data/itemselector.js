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
 * @copyright  Copyright (c) 2013 Weblizards GbR (http://www.weblizards.de)
 * @author     Thomas Keil <thomas@weblizards.de>
 * @license    http://www.pimcore.org/license     New BSD License
 */

pimcore.registerNS("pimcore.object.classes.data.itemselector");
pimcore.object.classes.data.itemselector = Class.create(pimcore.object.classes.data.dynamicDropdown, {

    type: "itemselector",

    initialize: function (treeNode, initData) {
        this.type = "itemselector";

        this.initData(initData);

        this.treeNode = treeNode;
        this.id = this.type + "_" + treeNode.attributes.id;
    },

    getTypeName: function () {
        return t("itemselector");
    },

    getIconClass: function () {
        return "itemselector_icon_element";
    }

});
