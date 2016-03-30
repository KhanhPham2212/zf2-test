<?php

namespace My\Storage;

use Zend\Db\Sql\Sql,
    Zend\Db\Adapter\Adapter,
    Zend\Db\TableGateway\AbstractTableGateway;

class storageGroup extends AbstractTableGateway {

    protected $table = 'groups';

    public function __construct(Adapter $adapter) {
        $adapter->getDriver()->getConnection()->connect();
        $this->adapter = $adapter;
    }

    public function __destruct() {
        $this->adapter->getDriver()->getConnection()->disconnect();
    }

    public function getList($arrCondition = array()) {
        try {
            $strWhere = $this->_buildStrWhere($arrCondition);

            $adapter = $this->adapter;
            $sql     = new Sql($adapter);
            $select  = $sql->Select($this->table)
                    ->where('1=1' . $strWhere)
                    ->order(array('group_id DESC'));
            $query = $sql->getSqlStringForSqlObject($select);
            return $adapter->query($query, $adapter::QUERY_MODE_EXECUTE)->toArray();
        } catch (\Exception $exc) {
            if (APPLICATION_ENV !== 'production') {
                die($exc->getMessage());
            }
            return array();
        }
    }

    public function getListLimit($arrCondition, $intPage, $intLimit, $strOrder) {
        try {
            $strWhere = $this->_buildStrWhere($arrCondition);

            $adapter = $this->adapter;
            $sql = new Sql($adapter);
            $select = $sql->Select($this->table);
            $select->where('1=1' . $strWhere)
                    ->order($strOrder)
                    ->limit($intLimit)
                    ->offset($intLimit * ($intPage - 1));
            $query = $sql->getSqlStringForSqlObject($select);

            return $adapter->query($query, $adapter::QUERY_MODE_EXECUTE)->toArray();
        } catch (\Exception $exc) {
            if (APPLICATION_ENV !== 'production') {
                die($exc->getMessage());
            }
            return array();
        }
    }

    public function getTotal($arrCondition) {
        try {
            $strWhere = $this->_buildStrWhere($arrCondition);

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
            $strWhere = $this->_buildStrWhere($arrCondition);

            $adapter = $this->adapter;
            $sql = new Sql($adapter);
            $select = $sql->Select($this->table)
                    ->where('1=1' . $strWhere)
                    ->order(array('group_id DESC'));
            $query = $sql->getSqlStringForSqlObject($select);
            return current($adapter->query($query, $adapter::QUERY_MODE_EXECUTE)->toArray());
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

    public function edit($p_arrParams, $intPermissionID) {
        try {
            $result = array();
            if (!is_array($p_arrParams) || empty($p_arrParams) || empty($intPermissionID)) {
                return $result;
            }
            return $this->update($p_arrParams, 'group_id=' . $intPermissionID);
        } catch (\Exception $exc) {
            if (APPLICATION_ENV !== 'production') {
                die($exc->getMessage());
            }
            return false;
        }
    }

    private function _buildStrWhere($arrCondition) {
        $strWhere = null;
        if (empty($arrCondition)) {
            return $strWhere;
        }

        if (isset($arrCondition['group_id'])) {
            $strWhere .= ' AND group_id=' . $arrCondition['group_id'];
        }

        if (isset($arrCondition['group_list_id'])) {
            $strWhere .= ' AND group_id IN(' . $arrCondition['group_list_id'] . ')';
        }

        if (isset($arrCondition['group_name'])) {
            $strWhere .= " AND group_name='" . $arrCondition['group_name'] . "'";
        }
        if (isset($arrCondition['is_deleted'])) {
            $strWhere .= " AND is_deleted='" . $arrCondition['is_deleted'] . "'";
        }
        if (isset($arrCondition['not_is_acp'])) {
            $strWhere .= " AND is_acp !='" . $arrCondition['not_is_acp'] . "'";
        }


        return $strWhere;
    }

}
