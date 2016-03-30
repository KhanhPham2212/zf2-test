<?php

namespace My\Models;

class UserPermission extends ModelAbstract {

    private function getParentTable() {
        $dbAdapter = $this->getServiceLocator()->get('Zend\Db\Adapter\Adapter');
        return new \My\Storage\storageUserPermission($dbAdapter);
    }

    public function __construct() {
        $this->setTmpKeyCache('tmpUserPermission');
        parent::__construct();
    }

    public function getList($arrCondition = []) {
        $keyCaching = APPLICATION_ENV . ':getListUserPermission:' . http_build_query($arrCondition, '', ':') . ':tmp:' . $this->cache->read($this->tmpKeyCache);
        $keyCaching = crc32($keyCaching);
        $arrResult = $this->cache->read($keyCaching);
        if (empty($arrResult)) {
            $arrResult = $this->getParentTable()->getList($arrCondition);
            $this->cache->add($keyCaching, $arrResult, 60 * 60 * 24 * 7);
        }
        return $arrResult;
    }

    public function getResourceList($arrCondition = []) {
        $keyCaching = APPLICATION_ENV . ':getResourceListByUser:' . http_build_query($arrCondition, '', ':') . ':tmp:' . $this->cache->read($this->tmpKeyCache);
        $keyCaching = crc32($keyCaching);
        $arrResult = $this->cache->read($keyCaching);
        if (empty($arrResult)) {
            $arrResult = $this->getParentTable()->getResourceList($arrCondition);
            $this->cache->add($keyCaching, $arrResult, 60 * 60 * 24 * 7);
        }
        return $arrResult;
    }

    public function getListLimit($arrCondition = [], $intPage = 1, $intLimit = 15, $strOrder = 'permission_id DESC') {
        $keyCaching = APPLICATION_ENV . ':' . 'getListLimitUserPermission:' . $intPage . ':' . $intLimit . ':' . str_replace(' ', '_', $strOrder) . ':' . $this->cache->read($this->tmpKeyCache);
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
        $keyCaching = APPLICATION_ENV . ':' . 'userPermissionDetail:';
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

    public function addAll($p_arrParams) {
        $intResult = $this->getParentTable()->addAll($p_arrParams);
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

    public function removeAll($arrCondition) {
        $intResult = $this->getParentTable()->removeAll($arrCondition);
        if ($intResult) {
            $this->cache->increase($this->tmpKeyCache, 1);
        }
        return $intResult;
    }

    public function removeCondition($arrCondition) {
        $result = $this->getParentTable()->removeCondition($arrCondition);
        if ($result) {
            $this->cache->increase($this->tmpKeyCache, 1);
        }
        return $result;
    }

    public function getAllResource() {
        $dirScanner = new \Zend\Code\Scanner\DirectoryScanner();
        $dirScanner->addDirectory(WEB_ROOT . '/module/Backend/src/Backend/Controller/');
        foreach ($dirScanner->getClasses(true) as $classScanner) {
            list($moduleName, $tmp, $controllerName) = explode('\\', $classScanner->getName());
            $controllerName = str_replace('Controller', '', $controllerName);
            $action = [];
            foreach ($classScanner->getMethods(true) as $method) {
                if (strpos($method->getName(), 'Action')) {
                    $action[] = str_replace('Action', '', $method->getName());
                }
            }
            $arrData[] = array('module' => $moduleName, 'controller' => $controllerName, 'action' => $action);
        }
        return $arrData;
    }

}
