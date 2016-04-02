<?php

namespace My\Controller;

use Zend\Mvc\MvcEvent,
    Zend\Mvc\Controller\AbstractActionController;

class MyController extends AbstractActionController {

    protected $js;
    protected $css;
    protected $defaultJS;
    protected $externalJS;
    protected $defaultCSS;
    protected $externalCSS;
    protected $secretKey = 'Http://MiCroLjnk';
    protected $serverUrl;
    protected $authservice;
    protected $arrNews = array();
    protected $resource;
    private $renderer;

    public function onDispatch(MvcEvent $e) {
        
        $this->serverUrl = $this->request->getUri()->getScheme() . '://' . $this->request->getUri()->getHost();
        $this->renderer = $this->serviceLocator->get('Zend\View\Renderer\PhpRenderer');
        if (empty($this->params)) {
            $this->params = $this->params()->fromRoute();
            $this->params['module'] = strtolower($this->params['module']);
            $this->params['controller'] = strtolower($this->params['__CONTROLLER__']);
            $this->params['action'] = strtolower($this->params['action']);
            $this->resource = $this->params['module'] . ':' . $this->params['controller'] . ':' . $this->params['action'];
        }
        
        $this->authenticate($this->params);
        
        $instanceStaticManager = new \My\StaticManager\StaticManager($this->resource, $this->serviceLocator, FRONTEND_TEMPLATE, 1);
        $instanceStaticManager->render(01);

        return parent::onDispatch($e);
    }

    private function permission($params) {
        $intUserRole = (int) UID;

        //check group permission
        $groupService = $this->serviceLocator->get('My\Models\Group');
        $condition = array('group_list_id' => USER_ROLE_LIST);
        $arrGroup = $groupService->getList($condition);
        $isACP = 0;
        $isFullAccess = 0;
        //check can access CPanel
        if (empty($arrGroup)) {
            return false;
        }

        foreach ($arrGroup as $group) {
            $isACP = $isACP == 0 ? $group['is_acp'] : $isACP;
            $isFullAccess = $isFullAccess == 0 ? $group['is_fullaccess'] : $isFullAccess;
        }

        if (empty($isACP)) {
            return;
        }
        //check use in fullaccess role
        define('IS_FULLACCESS', $isFullAccess);
        if ($arrGroup && $isFullAccess) {
            return true;
        }

        $serviceUserPermission = $this->serviceLocator->get('My\Models\UserPermission');
        $arrUserPermissionList = $serviceUserPermission->getResourceList(['user_id' => UID]);
        define('USER_PERMISSION', serialize($arrUserPermissionList));

        $serviceACL = $this->serviceLocator->get('ACL');
        $strActionName = $params['action'];
        if (strpos($params['action'], '-')) {
            $strActionName = '';
            $arrActionName = explode('-', $params['action']);
            foreach ($arrActionName as $k => $str) {
                if ($k > 0) {
                    $strActionName .= ucfirst($str);
                }
            }
            $strActionName = $arrActionName[0] . $strActionName;
        }
        return $serviceACL->checkPermission($intUserRole, $params['module'], $params['controller'], $strActionName);
    }

    protected function getAuthService() {
        if (!$this->authservice) {
            $this->authservice = $this->getServiceLocator()->get('AuthService');
        }
        return $this->authservice;
    }

    private function authenticate($arrData) {
        $arrUserData = $this->getAuthService()->getIdentity();
        
        $arrAuthModule = array('admincp');
        if (in_array($arrData['module'], $arrAuthModule)) {
            if (empty($arrUserData)) {
                if ($this->request->isXmlHttpRequest()) {
                    die(json_encode(['st' => -1, 'msg' => '<strong><center>Tài khoản của bạn đã hết phiên làm việc hoặc đã được đăng xuất<br/> Vui lòng <a href="' . $this->url()->fromRoute('backend', ['controller' => 'auth', 'action' => 'login']) . '">click vào đây</a> để đăng nhập lại</center></strong>']));
                }
                return $this->redirect()->toRoute('admincp', ['controller' => 'auth', 'action' => 'login']);
            }
            
            define('UID', (int) $arrUserData['user_id']);
            define('FULLNAME', $arrUserData['fullname']);
            define('EMAIL', $arrUserData['email']);
            define('USER_ROLE_LIST', $arrUserData['user_role_list'] ? $arrUserData['user_role_list'] : 0);
            define('MODULE', $arrData['module']);
            define('CONTROLLER', $arrData['controller']);
            define('ACTION', $arrData['action']);
            
            if (!$this->permission($arrData)) {
                if ($this->request->isXmlHttpRequest()) {
                    die(json_encode(['st' => -1, 'msg' => 'Permission Denied']));
                }
                
                $this->layout('admincp/error/accessDeny');
                return false;
            }
        }
    }

}
