<?php
/**
 * This source file is subject to the new BSD license that is 
 * available through the world-wide-web at this URL:
 * http://www.pimcore.org/license
 *
 * @category   Pimcore
 * @package    Object_Class
 * @copyright  Copyright (c) 2011 Weblizards GbR (http://www.weblizards.de)
 * @author     Thomas Keil <thomas@weblizards.de>
 * @license    http://www.pimcore.org/license     New BSD License
 */

class DynamicDropdown_Plugin extends Pimcore_API_Plugin_Abstract implements Pimcore_API_Plugin_Interface{

    /**
    *  install function
    * @return string $message statusmessage to display in frontend
    */
	public static function install(){
		if(self::isInstalled()){
			$statusMessage = "installed";
		} else {
			$statusMessage = "not installed";
		}
		return $statusMessage;
    }

    /**
    *
    * @return boolean
    */
    public static function needsReloadAfterInstall(){
        return true;
    }

    /**
    *  indicates wether this plugins is currently installed
    * @return boolean
    */
	public static function isInstalled(){
        return true;
    }

    /**
    * uninstall function
    * @return string $messaget status message to display in frontend
    */
	public static function uninstall(){
		return "uninstall not necessary";
    }


    /**
     * @return string $jsClassName
     */
    public static function getJsClassName(){
        return ""; //pimcore.plugin.customerDb";
    }

    /**
     *
     * @param string $language
     * @return string path to the translation file relative to plugin direcory
     */
    public static function getTranslationFile($language) {
        if(file_exists(PIMCORE_PLUGINS_PATH . "/DynamicDropdown/texts/" . $language . ".csv")){
            return "/DynamicDropdown/texts/" . $language . ".csv";
        }
        return "/DynamicDropdown/texts/en.csv";
        
    }
}