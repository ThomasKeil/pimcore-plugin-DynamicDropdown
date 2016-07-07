<?php 

//namespace Pimcore\Model\Object\ClassDefinition\Data;
namespace Object\ClassDefinition\Data;

use Pimcore\Model\Object\ClassDefinition\Data\Href;
use Pimcore\Model\Element\Service;

/**
 * @category   Pimcore
 * @package    Object\Class\Data
 * @copyright  Copyright (c) Weblizards GmbH (http://www.weblizards.de)
 * @author     Thomas Keil <thomas@weblizards.de>
 * @license    GPLv3
 */
class DynamicDropdown extends Href
{

    /**
     * Static type of this element
     *
     * @var string
     */
    public $fieldtype = "dynamicDropdown";

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

    public function setsource_recursive($recursive)
    {
      $this->source_recursive = $recursive;
    }

    public function getsource_recursive()
    {
      return $this->source_recursive;
    }

    public function setsort_by($sort_by)
    {
        $this->sort_by = $sort_by;
    }

    public function getsort_by()
    {
        return $this->sort_by;
    }


//    public function getDataForEditmode($data, $object = null, $params = array())
//    {
//        if ($data) return $data->getId();
//    return;
//    }
//
//    /**
//     * @return boolean
//     */
//    public function getObjectsAllowed()
//    {
//        return array("Object_".ucfirst($this->source_classname));
//    }
//
//    /**
//     * @see Data::getDataFromEditmode
//     * @param array $data
//     * @param null|Object_Abstract $object
//     * @return Asset|Document|Object_Abstract
//     */
//    public function getDataFromEditmode($data, $object = null, $params = array())
//    {
//        return Service::getElementById("object", $data);
//    }
}
