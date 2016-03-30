<?php

namespace My\Storage;

use Zend\Db\TableGateway\AbstractTableGateway,
    Zend\Db\Sql\Sql,
    Zend\Db\Adapter\Adapter,
    My\Validator\Validate;

class storageCity extends AbstractTableGateway {

    protected $table = 'cities';

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
            $validator = new Validate();
            $noRecordExists = $validator->noRecordExists($p_arrParams['city_name'], $this->table, 'city_name', $this->adapter);
            if (!$noRecordExists) {
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

    public function edit($p_arrParams, $intCityID) {
        try {
            $result = array();
            if (!is_array($p_arrParams) || empty($p_arrParams) || empty($intCityID)) {
                return $result;
            }
            return $this->update($p_arrParams, 'city_id=' . $intCityID);
        } catch (\Exception $exc) {
            if (APPLICATION_ENV !== 'production') {
                die($exc->getMessage());
            }
            return false;
        }
    }

}
