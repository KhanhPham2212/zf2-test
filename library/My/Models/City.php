<?php

namespace My\Models;

class City extends ModelAbstract {

    private function getParentTable() {
        $dbAdapter = $this->getServiceLocator()->get('Zend\Db\Adapter\Adapter');
        return new \My\Storage\storageCity($dbAdapter);
    }

    public function __construct() {
        $this->setTmpKeyCache('tmpCity');
        parent::__construct();
    }

    public function filter($params) {
        $tmp = array();
        $fields = array('city_id', 'city_name', 'city_slug', 'area_id', 'ordering', 'is_focus', 'is_deleted');
        foreach ($fields as $field) {
            if (isset($params[$field])) {
                if (($field === 'city_name')) {
                    require_once VENDOR_DIR . 'HTMLPurifier/HTMLPurifier.auto.php';
                    $config = \HTMLPurifier_Config::createDefault();
                    $config->set('Attr.EnableID', true);
                    $config->set('HTML.Strict', true);
                    $purifier = new \HTMLPurifier($config);
                    $params[$field] = $purifier->purify($params[$field]);
                }
                $tmp[$field] = $params[$field];
            }
        }
        return $tmp;
    }

    public function getList($arrCondition = array()) {
        $keyCaching = APPLICATION_ENV . ':getListCity:' . http_build_query($arrCondition, '', ':') . ':tmp:' . $this->cache->read($this->tmpKeyCache);
        $keyCaching = crc32($keyCaching);
        $arrResult = $this->cache->read($keyCaching);
        if (empty($arrResult)) {
            $arrResult = $this->getParentTable()->getList($arrCondition);
            $this->cache->add($keyCaching, $arrResult, 60 * 60 * 24 * 7);
        }
        return $arrResult;
    }

    public function getListLimit($arrCondition, $intPage, $intLimit, $strOrder) {
        $keyCaching = APPLICATION_ENV . ':' . 'getListLimitCity:' . $intPage . ':' . $intLimit . ':' . str_replace(' ', '_', $strOrder) . ':' . $this->cache->read($this->tmpKeyCache);
        if (count($arrCondition) > 0) {
            foreach ($arrCondition as $k => $val) {
                $keyCaching .= $k . ':' . $val . ':';
            }
        }
        $keyCaching = crc32($keyCaching);
        $arrResult = $this->cache->read($keyCaching);
        if (empty($arrResult)) {
            $arrResult = $this->getParentTable()->getListLimit($arrCondition, $intPage, $intLimit, $strOrder);
            $this->cache->add($keyCaching, $arrResult, 60 * 60 * 24 * 7);
        }
        return $arrResult;
    }

    public function getTotal($arrCondition) {
        return $this->getParentTable()->getTotal($arrCondition);
    }

    public function getDetail($arrCondition) {
        $keyCaching = APPLICATION_ENV . ':' . 'getDetailCity:';
        if (count($arrCondition) > 0) {
            foreach ($arrCondition as $k => $condition) {
                $keyCaching .= $k . ':' . $condition . ':';
            }
        }
        $keyCaching .= 'tmp:' . $this->cache->read($this->tmpKeyCache);
        $keyCaching = crc32($keyCaching);
        $arrResult = $this->cache->read($keyCaching);
        if (empty($arrResult)) {
            $arrResult = $this->getParentTable()->getDetail($arrCondition);
            $this->cache->add($keyCaching, $arrResult, 60 * 60 * 24 * 7);
        }
        return $arrResult;
    }

    public function add($p_arrParams) {
        $p_arrParams = $this->filter($p_arrParams);
        $intResult = $this->getParentTable()->add($p_arrParams);
        if ($intResult) {
            $this->cache->increase($this->tmpKeyCache, 1);
        }
        return $intResult;
    }

    public function edit($p_arrParams, $intCityID) {
        $ttl = 60 * 60 * 24 * 7;
        $p_arrParams = $this->filter($p_arrParams);
        $intResult = $this->getParentTable()->edit($p_arrParams, $intCityID);
        if ($intResult) {
            $this->cache->increase($this->tmpKeyCache, 1);
        }
        return $intResult;
    }

}
