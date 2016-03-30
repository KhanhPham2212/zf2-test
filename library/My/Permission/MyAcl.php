<?php

namespace My\Permission;

use Zend\Permissions\Acl\Acl,
    Zend\Permissions\Acl\Role\GenericRole as Role,
    Zend\Permissions\Acl\Resource\GenericResource as Resource;

class MyAcl {

    protected $acl;

    public function __construct($serviceLocator) {
        $this->serviceLocator = $serviceLocator;
        $this->acl = new Acl();
        $this->buildPermission();
    }

    private function buildPermission() {
        $servicePermission = $this->serviceLocator->get('My\Models\UserPermission');
        $arrPermissionList = $servicePermission->getList(['user_id', UID]);
        if (is_array($arrPermissionList) && count($arrPermissionList) > 0) {
            foreach ($arrPermissionList as $arrPermission) {
                $roleID = $this->formatRole($arrPermission['user_id']);
                $strResource = $arrPermission['module_name'] . ':' . $arrPermission['controller_name'];
                if (!$this->acl->hasResource($strResource)) {
                    $this->acl->addResource(new Resource($strResource));
                }
                if (!$this->acl->hasRole($roleID)) {
                    $this->acl->addRole(new Role($roleID));
                }
                $this->acl->allow($roleID, $strResource, $arrPermission['action_name']);
            }
        }
    }

    public function checkPermission($roleID, $strModuleName, $strControllerName, $strActionName = null) {
        if ($strActionName != null) {
            $strActionName = trim(strtolower($strActionName));
        }
        $roleID = $this->formatRole($roleID);
        $strResource = trim(strtolower($strModuleName . ':' . $strControllerName));

        if (!$this->acl->hasRole($roleID) || !$this->acl->hasResource($strResource) || !$this->acl->isAllowed($roleID, $strResource, $strActionName)) {
            return false;
        }
        return true;
    }

    private function formatRole($roleID) {
        return 'role_' . $roleID;
    }

}
