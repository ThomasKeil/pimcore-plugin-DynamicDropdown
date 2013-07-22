/**
 * This source file is subject to the new BSD license that is 
 * available through the world-wide-web at this URL:
 * http://www.pimcore.org/license
 *
 * @category   Pimcore
 * @package    Object_Class
 * @copyright  Copyright (c) 2011 Weblizards GbR (http://www.weblizards.de)
 * @author     Thomas Keil <thomas@weblizards.de>
 * @author     Thomas Akkermans <thomas.akkermans@amgate.com>
 * @license    http://www.pimcore.org/license     New BSD License
 */

pimcore.registerNS("pimcore.object.tags.dynamicDropdownMultiple");
pimcore.object.tags.dynamicDropdownMultiple = Class.create(pimcore.object.tags.multiselect, {

    type: "dynamicDropdownMultiple",

    initialize: function (data, fieldConfig) {

        this.data = data;
        this.fieldConfig = fieldConfig;
//        this.fieldConfig.width = 250;
        this.mode = 'remote';

        this.fieldConfig.index = 15006;

        remote_data = null;
        jQuery.ajax({
            url: "/plugin/DynamicDropdown/dynamicdropdown/options",
            async: false,
            dataType: "json",
            type: "GET",
            data: {
                source_parent: fieldConfig.source_parentid,
                source_methodname: fieldConfig.source_methodname,
                source_classname: fieldConfig.source_classname,
                source_recursive: layoutConf.source_recursive,
                current_language: pimcore.settings.language
            },
            success: function(data) {
                remote_data = data;
            }
        });
        
        this.fieldConfig.options = remote_data;			 
    }
});