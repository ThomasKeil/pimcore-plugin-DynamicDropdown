<?php

namespace Pimcore\Model\Object\ClassDefinition\Data;

/**
 * @category   Pimcore
 * @copyright  Copyright (c) 2016 Weblizards GmbH (http://www.weblizards.de)
 * @author     Thomas Keil <thomas@weblizards.de>
 * @license    GPLv3
 */
class Itemselector extends Multihref {
    /**
     * Static type of this element
     *
     * @var string
     */
    public $fieldtype = "itemselector";

    public $source_parentid;
    public $source_classname;
    public $source_methodname;
    public $source_recursive;
    public $sort_by;

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

    public function getSort_by() {
      return $this->sort_by;
    }

    public function setSort_by($sort_by) {
      $this->sort_by = $sort_by;
    }

//    /**
//     * @return boolean
//     */
//    public function getObjectsAllowed()
//    {
//        return array("Object_" . ucfirst($this->source_classname));
//    }
//
//  /**
//   * @see Object_Class_Data::getDataFromEditmode
//   * @param array $data
//   * @param null|Object_Abstract $object
//   * @return array
//   */
//  public function getDataFromEditmode($data, $object = null) {
//    //if not set, return null
//    if ($data === null or $data === FALSE) {
//      return null;
//    }
//
//    $elements = array();
//    $data = explode(",",$data);
//    if (is_array($data) && count($data) > 0) {
//      foreach ($data as $id) {
//        $elements[] = Element_Service::getElementById("object", $id);
//      }
//
//    }
//    //must return array if data shall be set
//    return $elements;
//  }
//
//  /**
//   * @see Object_Class_Data::getDataForEditmode
//   * @param array $data
//   * @param null|Object_Abstract $object
//   * @return array
//   */
//  public function getDataForEditmode($data, $object = null) {
//    $return = array();
//
//    if (is_array($data) && count($data) > 0) {
//      foreach ($data as $element) {
//        $return[] = $element->geto_id();
//      }
//      return implode(",", $return);
//    }
//
//    return false;
//  }
}
