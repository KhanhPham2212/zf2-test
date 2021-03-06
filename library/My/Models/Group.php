<?php

namespace My\Models;

class Group extends ModelAbstract {

    private function getParentTable() {
        $dbAdapter = $this->serviceLocator->get('Zend\Db\Adapter\Adapter');
        return new \My\Storage\storageGroup($dbAdapter);
    }

    public function __construct() {
        $this->setTmpKeyCache('tmpGroups');
        parent::__construct();
    }

    public function getList($arrCondition = []) {
        $keyCaching = APPLICATION_ENV . ':getListGroup:' . http_build_query($arrCondition, '', ':') . ':tmp:' . $this->cache->read($this->tmpKeyCache);
        $keyCaching = crc32($keyCaching);
        $arrResult = $this->cache->read($keyCaching);
        if (empty($arrResult)) {
            $arrResult = $this->getParentTable()->getList($arrCondition);
            $this->cache->add($keyCaching, $arrResult, 60 * 60 * 24 * 7);
        }
        return $arrResult;
    }

    public function getListLimit($arrCondition = [], $intPage = 1, $intLimit = 15, $strOrder = 'group_id DESC') {
        $keyCaching = APPLICATION_ENV . ':' . 'getListLimitGroups:' . $intPage . ':' . $intLimit . ':' . str_replace(' ', '_', $strOrder) . ':' . $this->cache->read($this->tmpKeyCache);
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

    public function getDetail($arrCondition = []) {
        $keyCaching = APPLICATION_ENV . ':' . 'groupDetail:';
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

    public function getTotal($arrCondition = []) {
        return $this->getParentTable()->getTotal($arrCondition);
    }

    public function add($p_arrParams) {
        $intResult = $this->getParentTable()->add($p_arrParams);
        if ($intResult) {
            $this->cache->increase($this->tmpKeyCache, 1);
        }
        return $intResult;
    }

    public function edit($p_arrParams, $intPermissionID) {
        $intResult = $this->getParentTable()->edit($p_arrParams, $intPermissionID);
        if ($intResult) {
            $this->cache->increase($this->tmpKeyCache, 1);
        }
        return $intResult;
    }

    public function remove($arrCondition) {
        $intResult = $this->getParentTable()->remove($arrCondition);
        if ($intResult) {
            $this->cache->increase($this->tmpKeyCache, 1);
        }
        return $intResult;
    }

}
