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

class Dynamicdropdown_DynamicdropdownController extends Action
{

    private $separator = " - ";

    /**
     * Produces the json to feed the dynamic dropdown
     * Used by pimcore.object.tags.dynamicDropdown
     */
    public function optionsAction()
    {

        $filter = new \Zend_Filter_PregReplace(array("match" => "@[^a-zA-Z0-9/\-_]@", "replace" => ""));
        $parentFolderPath = $filter->filter($this->getParam("source_parent"));
        $sort = $this->getParam("sort_by");
        $options = [];

        if ($parentFolderPath) {
            // remove trailing slash
            if ($parentFolderPath != "/") {
                $parentFolderPath = rtrim($parentFolderPath, "/ ");
            }

            // correct wrong path (root-node problem)
            $parentFolderPath = str_replace("//", "/", $parentFolderPath);

            $folder = Object\Folder::getByPath($parentFolderPath);

            if ($folder) {
                $options = $this->walk_path($folder);
            } else {
                $message = "The folder submitted could not be found: \"" . $this->_getParam("source_parent") . "\"";
                \Pimcore\Logger::crit($message);
                $this->_helper->json([
                    "success" => false,
                    "message" => $message,
                    "options" => $options
                ]);
            }
        } else {
            $message = "The folder submitted for source_parent is not valid: \"" . $this->_getParam("source_parent") . "\"";
            \Pimcore\Logger::warning($message);
            $this->_helper->json([
                "success" => false,
                "message" => $message,
                "options" => $options
            ]);


        }

        if (!is_null($options)) usort($options, function ($a, $b) use ($sort) {
            $field = "id";
            if ($sort == "byvalue") $field = "key";
            if ($a[$field] == $b[$field]) return 0;
            return $a[$field] < $b[$field] ? 0 : 1;
        });


        $this->_helper->json([
            "success" => true,
            "options" => $options
        ]);
    }

    /**
     * @param Object\AbstractObject $folder
     * @param array $options
     * @param string $path
     * @return array
     */
    private function walk_path(Object\AbstractObject $folder, $options = null, $path = "")
    {
        if (is_null($options)) $options = array();

        if ($folder) {
            $source = $this->getParam("source_methodname");

            $object_name = "Pimcore\\Model\\Object\\" . ucfirst($this->_getParam("source_classname"));

            $usesI18n = false;
            $children = $folder->getChildren();
            if (is_array($children)) {
                foreach ($children as $i18n_probe_child) {
                    if ($i18n_probe_child instanceof Object\Concrete) {
                        $usesI18n = $this->isUsingI18n($i18n_probe_child, $source);
                        break;
                    }
                }
            }
            $current_lang = $this->getParam("current_language");

            if (!Pimcore\Tool::isValidLanguage($current_lang)) {
                $current_lang = null;
                if (Pimcore\Version::$revision >= 3159) {
                    $current_lang = Pimcore\Tool::getDefaultLanguage();
                } else {
                    $languages = Pimcore\Tool::getValidLanguages();
                    $current_lang = $languages[0];
                }
                if (is_null($current_lang)) {
                    $usesI18n = false;
                }
            }

            foreach ($children as $child) {
                /** @var Object\Concrete $child */

                switch (true) {
                      case $child instanceof Pimcore\Model\Object\Folder:
                        /**
                         * @var Object\Folder $child
                         */
                        $key = $child->getProperty("Taglabel") != "" ? $child->getProperty("Taglabel") : $child->getKey();
                        if ($this->getParam("source_recursive") == "true")
                            $options = $this->walk_path($child, $options, $path.$this->separator.$key);
                        break;
                      case $child instanceof $object_name:
                        $key = $usesI18n ? $child->$source($current_lang) : $child->$source();
                        $options[] = array(
                            "value" => $child->getId(),
                            "key" => ltrim($path.$this->separator.$key, $this->separator),
                            "published" => $child->getPublished()
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
    public function methodsAction()
    {
        $methods = array();

        $filter = new \Zend_Filter_PregReplace(array("match" => "@[^a-zA-Z0-9_\-]@", "replace" => ""));
        $class_name = $filter->filter($this->getParam("classname"));
        if (!empty($class_name)) {
            $class_methods = $this->get_this_class_methods("\\Pimcore\\Model\\Object\\".ucfirst($class_name));
            if (!is_null($class_methods)) {
                foreach ($class_methods as $method_name) {
                    if (substr($method_name, 0, 3) == "get") $methods[] = array("value" => $method_name, "key" => $method_name);
                }
            }
        }
        $this->_helper->json($methods);
    }

    /**
     * @param string $class
     * @return array
     * @author Dominik Schnieper https://github.com/dominikschnieper
     */
    private function get_this_class_methods($class)
    {
        $class_methods = get_class_methods($class);
        if ($parent_class = get_parent_class($class)) {
            $parent_class_methods = get_class_methods($parent_class);
            return array_diff($class_methods, $parent_class_methods);
        }
        return $class_methods;
    }

    /**
     * @param Object\Concrete $object
     * @param string $method
     * @return bool
     */
    private function isUsingI18n(Object\Concrete $object, $method)
    {
        $class_definition = $object->getClass();
        $definitionFile = $class_definition->getDefinitionFile();

        if(!is_file($definitionFile)) {
            return false;
        }
        $tree = include $definitionFile;
        $definition = $this->parse_tree($tree, array());
        return $definition[$method];
    }

    /**
     * @param Object\ClassDefinition\Layout|Object\ClassDefinition\Data\Localizedfields $tree
     * @param array $definition
     * @return array
     */
    private function parse_tree($tree, $definition)
    {
        if ($tree instanceof Object\ClassDefinition\Layout || $tree instanceof Object\ClassDefinition\Data\Localizedfields) { // Did I forget something?
            $children = $tree->getChildren();
            foreach ($children as $child) {
                $definition["get".ucfirst($child->name)] = $tree->fieldtype == "localizedfields";
                $definition = $this->parse_tree($child, $definition);
            }
        }
        return $definition;
    }
}
