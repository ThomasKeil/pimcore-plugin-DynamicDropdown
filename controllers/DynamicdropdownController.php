<?php

/**
 *
 * @category   Pimcore
 * @copyright  Copyright (c) Weblizards GmbH (http://www.weblizards.de)
 * @author     Thomas Keil <thomas@weblizards.de>
 * @license    GPLv3
 */

use Pimcore\Controller\Action;
use Pimcore\Model\Object;

class Dynamicdropdown_DynamicdropdownController extends Action {

  private $separator = " - ";

	/**
	 * Produces the json to feed the dynamic dropdown
	 * Used by pimcore.object.tags.dynamicDropdown
	 */
	public function optionsAction() {

		$filter = new \Zend_Filter_PregReplace(array("match" => "@[^a-zA-Z0-9/\-_]@", "replace" => ""));
		$parentFolderPath = $filter->filter($this->getParam("source_parent"));
		
		
		if ($parentFolderPath) {
			// remove trailing slash
			if($parentFolderPath != "/") {
				$parentFolderPath = rtrim($parentFolderPath,"/ ");
			}

			// correct wrong path (root-node problem)
			$parentFolderPath = str_replace("//","/",$parentFolderPath);
			
			$folder = Object\Folder::getByPath($parentFolderPath);

      if ($folder) {
        $options = $this->walk_path($folder);
			} else {
				Logger::warning("The folder submitted for could not be found: \"".$this->_getParam("source_parent")."\"");
			}
		} else {
			Logger::warning("The folder submitted for source_parent is not valid: \"".$this->_getParam("source_parent")."\"");
		}

    $sort = $this->getParam("sort_by");
    usort($options, function($a, $b) use ($sort) {
      $field = "id";
      if ($sort == "byvalue") $field = "key";
      if ($a[$field] == $b[$field]) return 0;
      return $a[$field] < $b[$field] ? 0 : 1;
    });

		$this->_helper->json($options);
	}

  private function walk_path(Object\AbstractObject $folder, $options = null, $path = "") {
    if (is_null($options)) $options = array();

    if ($folder) {
      $source = $this->_getParam("source_methodname");
      
      $object_name = "Pimcore\\Model\\Object\\" . ucfirst($this->_getParam("source_classname"));

      $children = $folder->getChilds();

      $usesI18n = $this->isUsingI18n($children, $source);
      $current_lang = $this->_getParam("current_language");

      if (!Pimcore\Tool::isValidLanguage($current_lang)) {
        $languages = Pimcore\Tool::getValidLanguages();
        $current_lang = $languages[0]; // TODO: Is this sensible?
      }
      foreach ($children as $child) {
        /** @var Object\Concrete $child */
        $class = get_class($child);
        switch ($class) {
          case "\\Pimcore\\Model\\Object\\Folder":
            /**
             * @var Object\Folder $child
             */

            $key = $child->getProperty("Taglabel") != "" ? $child->getProperty("Taglabel") : $child->getKey();
            if ($this->getParam("source_recursive") == "true")
              $options = $this->walk_path($child, $options, $path.$this->separator.$key);
            break;
          case $object_name:
            $key = $usesI18n ? $child->$source($current_lang) : $child->$source();
            $options[] = array(
              "value" => $child->getId(),
              "key" => ltrim($path.$this->separator.$key, $this->separator)
            );
            if ($this->getParam("source_recursive") == "true")
              $options = $this->walk_path($child, $options, $path.$this->separator.$key);
            break;
        }
      }
    }

    return $options;
  }
	
	/**
	 * Produces the json for the "available methods" dropdown in the backend.
	 * used by pimcore.object.classes.data.dynamicDropdown
	 */
	public function methodsAction() {
		$methods = array();
		
		$filter = new \Zend_Filter_PregReplace(array("match" => "@[^a-zA-Z0-9_\-]@", "replace" => ""));
		$class_name = $filter->filter($this->getParam("classname"));
		if (!empty($class_name)) {
			$class_methods = get_class_methods("Object_".ucfirst($class_name));
			if (!is_null($class_methods)) {
				foreach ($class_methods as $method_name) {
					if (substr($method_name, 0, 3) == "get") $methods[] = array("value" => $method_name, "key" => $method_name);
				}
			}
		}
		$this->_helper->json($methods);
	}
	
	private function isUsingI18n($class, $method) {
		$modelId = $class->classId;
		
		// Stolen from Object_Class_Resource - it's protected there.
		$file = PIMCORE_CLASS_DIRECTORY."/definition_".$modelId.".psf";
		if(!is_file($file)) {
				return false;
		}
		$tree = unserialize(file_get_contents($file));
		$definition = $this->parse_tree($tree, array());
		return $definition[$method];
		
	}
	
	private function parse_tree($tree, $definition) {
		if ($tree instanceof Object\ClassDefinition\Layout || $tree instanceof Object\ClassDefinition\Data\Localizedfields) { // Did I forget something?
			$children = $tree->getChilds();
			foreach ($children as $child) {
				$definition["get".ucfirst($child->name)] = $tree->fieldtype == "localizedfields";
				$definition = $this->parse_tree($child, $definition);
			}
		}
		return $definition;
	}
}
