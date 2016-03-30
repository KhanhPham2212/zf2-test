<?php

namespace My\Storage;

use Zend\Db\Sql\Sql,
    Zend\Db\Adapter\Adapter,
    Zend\Db\TableGateway\AbstractTableGateway;

class storageGroupPermission extends AbstractTableGateway {

    protected $table = 'group_permissions';

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
            $sql = new Sql($adapter);
            $select = $sql->Select($this->table)
                    ->where('1=1' . $strWhere)
                    ->order(array('group_permission_id DESC'));
            if (!empty($arrCondition['group_by'])) {
                $select->group('module_name');
                $select->group('controller_name');
                $select->group('action_name');
            }
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
            $strWhere = null;
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
                    ->order(array('group_permission_id DESC'));
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
            return $this->update($p_arrParams, 'group_permission_id=' . $intPermissionID);
        } catch (\Exception $exc) {
            if (APPLICATION_ENV !== 'production') {
                die($exc->getMessage());
            }
            return false;
        }
    }

    public function remove($arrCondition) {
        try {
            if (!is_array($arrCondition) || empty($arrCondition)) {
                return false;
            }
            $where = array();
            if (isset($arrCondition['group_id'])) {
                $where = array_merge($where, array('group_id' => $arrCondition['group_id']));
            }
            if (isset($arrCondition['user_id'])) {
                $where = array_merge($where, array('user_id' => $arrCondition['user_id']));
            }
            if (isset($arrCondition['module_name'])) {
                $where = array_merge($where, array('module_name' => $arrCondition['module_name']));
            }
            if (isset($arrCondition['controller_name'])) {
                $where = array_merge($where, array('controller_name' => $arrCondition['controller_name']));
            }
            if (isset($arrCondition['action_name'])) {
                $where = array_merge($where, array('action_name' => $arrCondition['action_name']));
            }
            return $this->delete($where);
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

        if (isset($arrCondition['group_id_list'])) {
            $strWhere .= ' AND group_id IN(' . $arrCondition['group_id_list'] . ')';
        }
        if (isset($arrCondition['controller_name'])) {
            $strWhere .= " AND controller_name='" . $arrCondition['controller_name'] . "'";
        }
        if (isset($arrCondition['action_name'])) {
            $strWhere .= " AND action_name='" . $arrCondition['action_name'] . "'";
        }
        if (isset($arrCondition['module_name'])) {
            $strWhere .= " AND module_name='" . $arrCondition['module_name'] . "'";
        }


        return $strWhere;
    }

}
