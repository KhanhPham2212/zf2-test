<?php

namespace My\Storage;

use Zend\Db\TableGateway\AbstractTableGateway,
    Zend\Db\Adapter\Adapter,
    Zend\Db\Sql\Sql;

class storageDistrict extends AbstractTableGateway {

    protected $table = 'districts';

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

    public function getListLimit($arrCondition, $intPage, $intLimit, $strOrder) {
        try {
            $strWhere = null;
            if (isset($arrCondition['is_deleted'])) {
                $strWhere .= " AND is_deleted=" . $arrCondition['is_deleted'];
            }
            if (isset($arrCondition['is_focus'])) {
                $strWhere .= " AND is_focus=" . $arrCondition['is_focus'];
            }
            if (isset($arrCondition['city_id'])) {
                $strWhere .= " AND city_id=" . (int) $arrCondition['city_id'];
            }
            $adapter = $this->adapter;
            $sql = new Sql($adapter);

            $select = $sql->Select($this->table);
            $select->where('1=1' . $strWhere)
                    ->order($strOrder)
                    ->limit($intLimit)
                    ->offset($intLimit * ($intPage - 1));
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

    public function getTotal($arrCondition) {
        try {
            $strWhere = null;
            if (isset($arrCondition['is_focus'])) {
                $strWhere .= " AND is_focus=" . $arrCondition['is_focus'];
            }
            if (isset($arrCondition['is_deleted'])) {
                $strWhere .= " AND is_deleted=" . $arrCondition['is_deleted'];
            }
            if (isset($arrCondition['city_id'])) {
                $strWhere .= " AND city_id=" . (int) $arrCondition['city_id'];
            }
            $adapter = $this->adapter;
            $sql = new Sql($adapter);
            $select = $sql->Select($this->table)
                    ->columns(array('total' => new \Zend\Db\Sql\Expression('COUNT(*)')))
                    ->where('1=1' . $strWhere);
            $query = $sql->getSqlStringForSqlObject($select);
            return (int) current($adapter->query($query, $adapter::QUERY_MODE_EXECUTE)->toArray())['total'];
        } catch (\Exception $exc) {
            if (APPLICATION_ENV !== 'production') {
                die($exc->getMessage());
            }
            return false;
        }
    }

    public function getDetail($arrCondition) {
        try {
            return get_object_vars($this->select($arrCondition)->current());
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

    public function edit($p_arrParams, $intDistrictID) {
        try {
            $result = false;
            if (!is_array($p_arrParams) || empty($p_arrParams) || empty($intDistrictID)) {
                return $result;
            }
            return $this->update($p_arrParams, 'district_id=' . $intDistrictID);
        } catch (\Exception $exc) {
            if (APPLICATION_ENV !== 'production') {
                die($exc->getMessage());
            }
            return false;
        }
    }

}