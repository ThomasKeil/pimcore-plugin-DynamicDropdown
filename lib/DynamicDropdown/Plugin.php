<?php
/**
 * @category   Pimcore
 * @copyright  Copyright (c) 2016 Weblizards GmbH (http://www.weblizards.de)
 * @author     Thomas Keil <thomas@weblizards.de>
 * @license    GPLv3
 */

namespace DynamicDropdown;

use Pimcore\API\Plugin\AbstractPlugin;
use Pimcore\API\Plugin\PluginInterface;

class Plugin extends AbstractPlugin implements PluginInterface {

    /**
     *  install function
     * @return string $message statusmessage to display in frontend
     */
	public static function install()
    {
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
    public static function needsReloadAfterInstall()
    {
        return true;
    }

    /**
     *  indicates wether this plugins is currently installed
     * @return boolean
     */
	public static function isInstalled()
    {
        return true;
    }

    /**
     * uninstall function
     * @return string $messaget status message to display in frontend
     */
	public static function uninstall()
    {
		return "uninstall not necessary";
    }


    /**
     * @param string $language
     * @return string path to the translation file relative to plugin direcory
     */
    public static function getTranslationFile($language)
    {
        if(file_exists(PIMCORE_PLUGINS_PATH . "/DynamicDropdown/texts/" . $language . ".csv")){
            return "/DynamicDropdown/texts/" . $language . ".csv";
        }
        return "/DynamicDropdown/texts/en.csv";
        
    }

    public function preDispatch() {
//        class_alias("\\Object\\ClassDefinition\\Data\\DynamicDropdown", "Object_Class_Data_DynamicDropdown");
    }
}