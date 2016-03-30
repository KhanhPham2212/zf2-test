<?php

namespace My\Models;

class User extends ModelAbstract {

    private function getParentTable() {
        $dbAdapter = $this->getServiceLocator()->get('Zend\Db\Adapter\Adapter');
        return new \My\Storage\storageUser($dbAdapter);
    }

    public function __construct() {
        $this->setTmpKeyCache('tmpUsers');
        parent::__construct();
    }

    public function getList($arrCondition = [], $arrColumn = []) {
        return $this->getParentTable()->getList($arrCondition, $arrColumn);
    }

    public function getListLimit($arrCondition = [], $intPage = 1, $intLimit = 15, $strOrder = 'user_id DESC', $arrColumn = []) {
        $keyCaching = APPLICATION_ENV . ':' . 'getListLimitUser:';
        foreach ($arrCondition as $k => $condition) {
            $keyCaching .= $k . ':' . $condition . ':';
        }
        $keyCaching .= $intPage . ':' . $intLimit . ':' . str_replace(' ', '_', $strOrder) . ':' . $this->cache->read($this->tmpKeyCache);
        $keyCaching = crc32($keyCaching);
        $arrResult = $this->cache->read($keyCaching);
        if (empty($arrResult)) {
            $arrResult = $this->getParentTable()->getListLimit($arrCondition, $intPage, $intLimit, $strOrder, $arrColumn);
            $this->cache->add($keyCaching, $arrResult, 60 * 60 * 12);
        }
        return $arrResult;
    }

    public function getTotal($arrCondition = []) {
        return $this->getParentTable()->getTotal($arrCondition);
    }

    /**
     * Get user detail by user_id or by email address
     * @param array $arrCondition
     * @param string $options
     * @return array user detail
     */
    public function getDetail($arrCondition = [], $arrColumn = []) {
        $arrResult = [];
        if ($arrCondition && is_array($arrCondition)) {
            $keyCaching = APPLICATION_ENV . ':' . 'getDetailUser:';
            foreach ($arrCondition as $k => $condition) {
                $keyCaching .= $k . ':' . $condition;
            }
            $keyCaching .= ':' . $this->cache->read($this->tmpKeyCache) . ':' . implode(':', $arrColumn);
            $keyCaching = crc32($keyCaching);
            $arrResult = $this->cache->read($keyCaching);
            if (empty($arrResult)) {
                $arrResult = $this->getParentTable()->getDetail($arrCondition, $arrColumn);
                $this->cache->add($keyCaching, $arrResult, 60 * 60 * 24 * 7);
            }
        }
        return $arrResult;
    }

    public function add($p_arrParams) {
        $intResult = $this->getParentTable()->add($p_arrParams);
        if ($intResult) {
            $this->cache->increase($this->tmpKeyCache, 1);
            $this->cache->increase('tmpOrder', 1); //do orders có map với user
            $this->cache->increase('tmpUserPermission', 1);
        }
        return $intResult;
    }

    public function edit($p_arrParams, $intUserID) {
        $intResult = $this->getParentTable()->edit($p_arrParams, $intUserID);
        if ($intResult) {
            $this->cache->increase($this->tmpKeyCache, 1);
            $this->cache->increase('tmpOrder', 1); //do orders có map với user
            $this->cache->increase('tmpUserPermission', 1);
        }
        return $intResult;
    }

    public function statisticOrder($arrCondition, $intPage, $intLimit, $strOrder = null) {
        $keyCaching = APPLICATION_ENV . ':' . 'getListLimitOrderStatisticUser:';
        foreach ($arrCondition as $k => $condition) {
            $keyCaching .= $k . ':' . $condition . ':';
        }
        $keyCaching .= $intPage . ':' . $intLimit . ':' . str_replace(' ', '_', $strOrder) . ':' . $this->cache->read($this->tmpKeyCache);
        $keyCaching = crc32($keyCaching);
        $arrResult = $this->cache->read($keyCaching);
        if (empty($arrResult)) {
            $arrResult = $this->getParentTable()->statisticOrder($arrCondition, $intPage, $intLimit, $strOrder);
            $this->cache->add($keyCaching, $arrResult, 60 * 60 * 12);
        }
        return $arrResult;
    }

    public function statisticUserRegistered($strBenginDate, $strEndDate) {
        return $this->getParentTable()->statisticUserRegistered($strBenginDate, $strEndDate);
    }

    public function getTotalStatisticOrder($arrCondition = []) {
        return $this->getParentTable()->getTotalStatisticOrder($arrCondition);
    }

    public function deleteUser($intUserID) {
        return $this->getParentTable()->deleteUser($intUserID);
    }

}
