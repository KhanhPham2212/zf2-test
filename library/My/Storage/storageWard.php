<?php

namespace My\Storage;

use Zend\Db\TableGateway\AbstractTableGateway,
    Zend\Db\Adapter\Adapter,
    Zend\Db\Sql\Sql;

class storageWard extends AbstractTableGateway {

    protected $table = 'wards';
    protected $adapter;

    public function __construct(Adapter $adapter) {
        $adapter->getDriver()->getConnection()->connect();
        $this->adapter = $adapter;
    }

    public function __destruct() {
        $this->adapter->getDriver()->getConnection()->disconnect();
    }

    public function getList($arrCondition = array()) {
        try {
            $strWhere = null;
            if (isset($arrCondition['is_deleted'])) {
                $strWhere .= " AND is_deleted=" . $arrCondition['is_deleted'];
            }
            if (isset($arrCondition['city_id'])) {
                $strWhere .= " AND city_id=" . $arrCondition['city_id'];
            }
            if (isset($arrCondition['district_id'])) {
                $strWhere .= " AND district_id=" . $arrCondition['district_id'];
            }
            $adapter = $this->adapter;
            $sql = new Sql($adapter);
            $select = $sql->Select($this->table);
            $select->where('1=1' . $strWhere);
            $select->order(array('ordering ASC', 'is_focus ASC'));
            $query = $sql->getSqlStringForSqlObject($select);
            $result = $adapter->query($query, $adapter::QUERY_MODE_EXECUTE);
            return $result->toArray();
        } catch (\Exception $exc) {
            if (APPLICATION_ENV !== 'production') {
                die($exc->getMessage());
            }
            return array();
        }
    }

    public function getListLimit($arrCondition = array(), $intPage = 1, $intLimit = 15, $strOrder = 'ordering ASC') {
        try {
            $strWhere = null;
            if (isset($arrCondition['is_deleted'])) {
                $strWhere .= " AND is_deleted=" . $arrCondition['is_deleted'];
            }
            if (isset($arrCondition['is_focus'])) {
                $strWhere .= " AND is_focus=" . $arrCondition['is_focus'];
            }
            if (isset($arrCondition['district_id'])) {
                $strWhere .= " AND district_id=" . $arrCondition['district_id'];
            }
            $adapter = $this->adapter;
            $sql = new Sql($adapter);
            $select = $sql->Select($this->table);
            $select->where('1=1' . $strWhere);
            $select->order($strOrder);
            $select->limit($intLimit);
            $select->offset($intLimit * ($intPage - 1));
            $query = $sql->getSqlStringForSqlObject($select);
            $result = $adapter->query($query, $adapter::QUERY_MODE_EXECUTE);
            return $result->toArray();
        } catch (\Exception $exc) {
            if (APPLICATION_ENV !== 'production') {
                die($exc->getMessage());
            }
            return array();
        }
    }

    public function getTotal($arrCondition = array()) {
        try {
            $strWhere = null;
            if (isset($arrCondition['is_focus'])) {
                $strWhere .= " AND is_focus=" . $arrCondition['is_focus'];
            }
            if (isset($arrCondition['is_deleted'])) {
                $strWhere .= " AND is_deleted=" . $arrCondition['is_deleted'];
            }
            if (isset($arrCondition['district_id'])) {
                $strWhere .= " AND district_id=" . $arrCondition['district_id'];
            }
            $adapter = $this->adapter;
            $sql = new Sql($adapter);
            $select = $sql->Select($this->table);
            $select->columns(array('total' => new \Zend\Db\Sql\Expression('COUNT(*)')));
            $select->where('1=1' . $strWhere);
            $query = $sql->getSqlStringForSqlObject($select);
            $result = $adapter->query($query, $adapter::QUERY_MODE_EXECUTE);
            $result = current($result->toArray());
            return (int) $result['total'];
        } catch (\Exception $exc) {
            if (APPLICATION_ENV !== 'production') {
                die($exc->getMessage());
            }
            return false;
        }
    }

    public function getDetail($arrCondition = array()) {
        try {
            $arrResult = array();
            $arrResult = $this->select($arrCondition);
            $arrResult = $arrResult->current();
            return get_object_vars($arrResult);
        } catch (\Exception $exc) {
            if (APPLICATION_ENV !== 'production') {
                die($exc->getMessage());
            }
            return array();
        }
    }

    public function add($p_arrParams) {
        try {
            if (!is_array($p_arrParams) || empty($p_arrParams)) {
                return false;
            }

            $result = $this->insert($p_arrParams);
            if ($result) {
                $result = $this->lastInsertValue;
            }
            return $result;
        } catch (\Exception $exc) {
            if (APPLICATION_ENV !== 'production') {
                die($exc->getMessage());
            }
            return false;
        }
    }

    public function edit($p_arrParams, $intWardID) {
        try {
            $result = false;
            if (!is_array($p_arrParams) || empty($p_arrParams) || empty($intWardID)) {
                return $result;
            }
            $result = $this->update($p_arrParams, 'ward_id=' . $intWardID);
            return $result;
        } catch (\Exception $exc) {
            if (APPLICATION_ENV !== 'production') {
                die($exc->getMessage());
            }
            return false;
        }
    }

}