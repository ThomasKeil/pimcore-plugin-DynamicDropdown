<?php 

namespace Pimcore\Model\Object\ClassDefinition\Data;

use Pimcore\Model\Asset;
use Pimcore\Model\Document;
use Pimcore\Model\Object\Service;
use Pimcore\Model\Object\AbstractObject;
use Pimcore\Model\Element;
use Pimcore\Model\Object;

/**
 * @category   Pimcore
 * @package    Object\ClassDefinition\Data
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


    public function getDataForEditmode($data, $object = null, $params = array())
    {
        if ($data) return $data->getId();
        return null;
    }


    /**
     * @see Data::getDataFromEditmode
     * @param int $data
     * @param null|AbstractObject $object
     * @return Asset|Document|AbstractObject
     */
    public function getDataFromEditmode($data, $object = null, $params = array())
    {
        return Service::getElementById("object", $data);
    }


    public function getDataForGrid($data, $object = null, $params = [])
    {
        if (is_int($data)) {
            $data = Object::getById($data);
        }
        if ($data instanceof Element\ElementInterface) {
            $method = $this->getsource_methodname();
            return $data->$method();
        }
    }

    public function getDataForResource($data, $object = null, $params = [])
    {
        if (is_int($data)) {
            return [[
                "dest_id" => $data,
                "type" => "object",
                "fieldname" => $this->getName()
            ]];
        }

        return parent::getDataForResource($data, $object, $params);

    }




    public function checkValidity($data, $omitMandatoryCheck = false)
    {
        return;
    }


}
