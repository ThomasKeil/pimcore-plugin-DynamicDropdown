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
 * @author     Thomas Akkermans <thomas.akkermans@amgate.com>
 * @license    http://www.pimcore.org/license     New BSD License
 */
class Object_Class_Data_DynamicDropdownMultiple extends Pimcore\Model\Object\ClassDefinition\Data\Multiselect
{
    /**
     * Static type of this element
     *
     * @var string
     */
    public $fieldtype = "dynamicDropdownMultiple";
    public $source_parentid;
    public $source_classname;
    public $source_methodname;

    public function setsource_parentid($id)
    {
        $this->source_parentid = $id;
    }

    public function getsource_parentid()
    {
        return $this->source_parentid;
    }

    public function setsource_classname($classname)
    {
        $this->source_classname = $classname;
    }

    public function getsource_classname()
    {
        return $this->source_classname;
    }

    public function setsource_methodname($methodname)
    {
        $this->source_methodname = $methodname;
    }

    public function getsource_methodname()
    {
        return $this->source_methodname;
    }

    public function setsource_recursive($recursive) {
      $this->source_recursive = $recursive;
    }

    public function getsource_recursive() {
      return $this->source_recursive;
    }

    /**
     * @return boolean
     */
    public function getObjectsAllowed()
    {
        return array("Object_" . ucfirst($this->source_classname));
    }
}
