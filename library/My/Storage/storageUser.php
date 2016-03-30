<?php

namespace My\Storage;

use Zend\Db\TableGateway\AbstractTableGateway,
    Zend\Db\Adapter\Adapter,
    Zend\Db\Sql\Sql,
    My\Validator\Validate;

class storageUser extends AbstractTableGateway {

    protected $table = 'users';
    protected $adapter;

    public function __construct(Adapter $adapter) {
        $adapter->getDriver()->getConnection()->connect();
        $this->adapter = $adapter;
    }

    public function __destruct() {
        $this->adapter->getDriver()->getConnection()->disconnect();
    }

    public function getList($arrCondition, $arrColumn) {
        try {
            $strWhere = $this->_buildStrWhere($arrCondition);
            $adapter = $this->adapter;
            $sql = new Sql($adapter);
            $select = $sql->Select($this->table)
                    ->where('1=1' . $strWhere)
                    ->order(array('user_id DESC'));
            if ($arrColumn) {
                $select->columns($arrColumn);
            }
            $query = $sql->getSqlStringForSqlObject($select);
            return $adapter->query($query, $adapter::QUERY_MODE_EXECUTE)->toArray();
        } catch (\Exception $exc) {
            if (APPLICATION_ENV !== 'production') {
                throw new \Exception($exc->getMessage());
            }
            return array();
        }
    }

    public function getListLimit($arrCondition, $intPage, $intLimit, $strOrder, $arrColumn) {


        try {
            $strWhere = $this->_buildStrWhere($arrCondition);

            $adapter = $this->adapter;
            $sql = new Sql($adapter);
            $select = $sql->Select($this->table);
            $select->where('1=1' . $strWhere)
                    ->order($strOrder)
                    ->limit($intLimit)
                    ->offset($intLimit * ($intPage - 1));
            if ($arrColumn) {
                $select->columns($arrColumn);
            }
            $query = $sql->getSqlStringForSqlObject($select);
            return $adapter->query($query, $adapter::QUERY_MODE_EXECUTE)->toArray();
        } catch (\Exception $exc) {
            if (APPLICATION_ENV !== 'production') {
                throw new \Exception($exc->getMessage());
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
            $result = $adapter->query($query, $adapter::QUERY_MODE_EXECUTE);
            return (int) current($result->toArray())['total'];
        } catch (\Exception $exc) {
            if (APPLICATION_ENV !== 'production') {
                throw new \Exception($exc->getMessage());
            }
            return false;
        }
    }

    public function getDetail($arrCondition, $arrColumn) {
        try {
            $strWhere = $this->_buildStrWhere($arrCondition);
            $adapter = $this->adapter;
            $sql = new Sql($adapter);
            $select = $sql->Select($this->table)->where('1=1' . $strWhere);

            if ($arrColumn) {
                $select->columns($arrColumn);
            }

            $query = $sql->getSqlStringForSqlObject($select);
            return current($adapter->query($query, $adapter::QUERY_MODE_EXECUTE)->toArray());
        } catch (\Exception $exc) {
            if (APPLICATION_ENV !== 'production') {
                throw new \Exception($exc->getMessage());
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
                throw new \Exception($exc->getMessage());
            }
            return false;
        }
    }

    public function edit($p_arrParams, $intUserID) {
        if (!is_array($p_arrParams) || empty($p_arrParams) || empty($intUserID)) {
            return false;
        }

        $validator = new Validate();
        $arrExclude = array(
            'field' => 'user_id',
            'value' => $intUserID
        );
        $noRecordExists = $validator->noRecordExists($p_arrParams['email'], $this->table, 'email', $this->adapter, $arrExclude);
        if (!$noRecordExists) {
            return false;
        }

        try {
            $adapter = $this->adapter;
            $sql = new Sql($adapter);
            $query = $sql->update($this->table)->set($p_arrParams)->where('1=1 AND user_id = ' . $intUserID);
            $query = $sql->getSqlStringForSqlObject($query);
            $result = $adapter->query($query, $adapter::QUERY_MODE_EXECUTE);
            $result ? $result = true : $result = false;

            return $result;
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
        if ($arrCondition['user_id'] !== '' && !is_array($arrCondition['user_id']) && $arrCondition['user_id'] !== NULL) {
            $strWhere .= " AND user_id=" . $arrCondition['user_id'];
        }

        if (is_array($arrCondition['user_id']) && !empty($arrCondition['user_id'])) {
            $strUser = '';
            foreach ($arrCondition['user_id'] as $item) {
                $strUser.=' user_id=' . $item . ' OR';
            }
            $strWhere .= ' AND (' . trim($strUser, 'OR') . ')';
        }

        if ($arrCondition['is_deleted'] !== '' && $arrCondition['is_deleted'] !== NULL) {
            $strWhere .= " AND is_deleted=" . $arrCondition['is_deleted'];
        }
        if (isset($arrCondition['email']) && $arrCondition['email']) {
            $strWhere .= " AND LOWER(email)='" . strtolower($arrCondition['email']) . "'";
        }
        if (isset($arrCondition['email']) && $arrCondition['email']) {
            $strWhere .= " AND LOWER(email)='" . strtolower($arrCondition['email']) . "'";
        }
        if (isset($arrCondition['or_phone']) && $arrCondition['or_phone']) {
            $strWhere .= " OR phone='" . strtolower($arrCondition['or_phone']) . "'";
        }
        if (isset($arrCondition['fullname']) && $arrCondition['fullname']) {
            $keyword = "'%" . $arrCondition['fullname'] . "%'";
            $strWhere .= ' AND fullname LIKE ' . $keyword;
        }
        if (isset($arrCondition['name_or_email']) && $arrCondition['name_or_email']) {
            $keyword = '*' . $arrCondition['name_or_email'] . '*';
            $strWhere .= " AND ( MATCH(fullname, email) AGAINST ('" . $keyword . "'  IN BOOLEAN MODE))";
        }
        if (isset($arrCondition['phone']) && $arrCondition['phone']) {
            $strWhere .= " AND phone=" . $arrCondition['phone'];
        }
        if (isset($arrCondition['gender'])) {
            $strWhere .= " AND gender=" . $arrCondition['gender'];
        }

        if ($arrCondition['find_in_user_role'] !== '' && $arrCondition['find_in_user_role'] !== NULL) {
            $strWhere .= " AND (FIND_IN_SET(" . $arrCondition['find_in_user_role'] . ",user_role_list) )";
        }


        if (isset($arrCondition['is_actived'])) {
            $strWhere .= " AND is_actived=" . $arrCondition['is_actived'];
        }
        if (isset($arrCondition['active_code'])) {
            $strWhere .= " AND active_code='" . $arrCondition['active_code'] . "'";
        }
        
        return $strWhere;
    }

}
