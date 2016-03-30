<?php

namespace My\Storage;

use Zend\Db\Sql\Sql,
    Zend\Db\Adapter\Adapter,
    Zend\Db\TableGateway\AbstractTableGateway;

class storageUserPermission extends AbstractTableGateway {

    protected $table = 'user_permissions';

    public function __construct(Adapter $adapter) {
        $adapter->getDriver()->getConnection()->connect();
        $this->adapter = $adapter;
    }

    public function __destruct() {
        $this->adapter->getDriver()->getConnection()->disconnect();
    }

    public function getList($arrCondition = []) {
        try {

            $strWhere = $this->_buildStrWhere($arrCondition);

            $adapter = $this->adapter;
            $sql = new Sql($adapter);
            $select = $sql->Select($this->table)
                    ->where('1=1' . $strWhere)
                    ->order(array('user_permission_id DESC'));
            $query = $sql->getSqlStringForSqlObject($select);
            return $adapter->query($query, $adapter::QUERY_MODE_EXECUTE)->toArray();
        } catch (\Exception $exc) {
            if (APPLICATION_ENV !== 'production') {
                die($exc->getMessage());
            }
            return [];
        }
    }

    public function getResourceList($arrCondition = []) {
        try {
            $strWhere = $this->_buildStrWhere($arrCondition);

            $adapter = $this->adapter;
            $sql = new Sql($adapter);
            $select = $sql->Select($this->table)
                    ->columns(['module_name', 'controller_name', 'action_name'])
                    ->where('1=1' . $strWhere)
                    ->order(array('user_permission_id DESC'));
            $query = $sql->getSqlStringForSqlObject($select);
            $arrPermissionList = $adapter->query($query, $adapter::QUERY_MODE_EXECUTE)->toArray();
            if (empty($arrPermissionList)) {
                return [];
            }
            $arrResource = [];
            foreach ($arrPermissionList as $arrPermission) {
                $arrResource[] = $arrPermission['module_name'] . ':' . $arrPermission['controller_name'] . ':' . $arrPermission['action_name'];
            }
            return $arrResource;
        } catch (\Exception $exc) {
            if (APPLICATION_ENV !== 'production') {
                die($exc->getMessage());
            }
            return [];
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
            return [];
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
                    ->order(array('user_permission_id DESC'));
            $query = $sql->getSqlStringForSqlObject($select);
            return current($adapter->query($query, $adapter::QUERY_MODE_EXECUTE)->toArray());
        } catch (\Exception $exc) {
            if (APPLICATION_ENV !== 'production') {
                die($exc->getMessage());
            }
            return [];
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

    public function addAll($p_arrParams) {
        if (!is_array($p_arrParams) || empty($p_arrParams)) {
            return false;
        }
        $adapter = $this->adapter;

        $p_arrParams = array_reverse($p_arrParams);

        $strInsertQuery = 'INSERT INTO ' . $this->table . ' ( group_id, user_id, module_name, controller_name, action_name, created_date) VALUES ';

        foreach ($p_arrParams as $item) {
            $userRole = $item['group_id'] != '' ? $item['group_id'] : 'NULL';
            $userID = $item['user_id'] != '' ? $item['user_id'] : 'NULL';
            $strInsertQuery .= "("
                    . "{$userRole}, "
                    . "{$userID}, "
                    . "'{$item['module_name']}', "
                    . "'{$item['controller_name']}', "
                    . "'{$item['action_name']}', "
                    . time()
                    . "), ";
        }
        $strInsertQuery = rtrim($strInsertQuery, ', ') . ';';
        try {
            $adapter->createStatement($strInsertQuery)->execute();
            $result = $this->adapter->getDriver()->getLastGeneratedValue();

            if ($result) {
                $result = $this->lastInsertValue;
            }
            return $result;
        } catch (\Exception $exc) {
            if (APPLICATION_ENV !== 'production') {
                throw new \Exception($exc->getMessage());
            }
            return false;
        }
    }

    public function edit($p_arrParams, $intPermissionID) {
        try {
            $result = [];
            if (!is_array($p_arrParams) || empty($p_arrParams) || empty($intPermissionID)) {
                return $result;
            }
            return $this->update($p_arrParams, 'user_permission_id=' . $intPermissionID);
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
            $where = [];
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

    public function removeCondition($arrCondition = []) {
        try {
            $result = false;
            $strWhere = $this->_buildStrWhere($arrCondition);
            if (empty($strWhere)) {
                return $result;
            }

            return $this->delete('1=1 ' . $strWhere);
        } catch (\Exception $exc) {
            if (APPLICATION_ENV !== 'production') {
                throw new \Exception($exc->getMessage());
            }
            return false;
        }
    }

    private function _buildStrWhere($arrCondition) {
        $strWhere = null;
        if (empty($arrCondition)) {
            return $strWhere;
        }
        if (isset($arrCondition['user_id']) && !is_array($arrCondition['user_id'])) {
            $strWhere .= ' AND user_id=' . $arrCondition['user_id'];
        }
        if (isset($arrCondition['group_id'])) {
            $strWhere .= ' AND group_id=' . $arrCondition['group_id'];
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

        if (is_array($arrCondition['user_id']) && !empty($arrCondition['user_id'])) {
            $strUser = '';
            foreach ($arrCondition['user_id'] as $item) {
                $strUser.=' user_id=' . $item . ' OR';
            }
            $strWhere .= ' AND (' . trim($strUser, 'OR') . ')';
        }


        return $strWhere;
    }

}
