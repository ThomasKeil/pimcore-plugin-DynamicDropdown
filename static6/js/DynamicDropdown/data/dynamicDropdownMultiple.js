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
 * @author     Thomas Akkermans <thomas.akkermans@amgate.com>
 * @license    http://www.pimcore.org/license     New BSD License
 */

pimcore.registerNS("pimcore.object.classes.data.dynamicDropdownMultiple");
pimcore.object.classes.data.dynamicDropdownMultiple = Class.create(pimcore.object.classes.data.dynamicDropdown, {

    type: "dynamicDropdownMultiple",

    initialize: function (treeNode, initData) {
        this.type = "dynamicDropdownMultiple";

        this.initData(initData);

        this.treeNode = treeNode;
        this.id = this.type + "_" + treeNode.attributes.id;
    },

    getTypeName: function () {
        return t("dynamicDropdownMultiple");
    },

    getIconClass: function () {
        return "Dynamicdropdown_icon_element";
    }

});
