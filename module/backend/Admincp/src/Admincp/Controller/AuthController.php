<?php

namespace Admincp\Controller;

use Zend\Mvc\MvcEvent,
    Zend\Crypt\Password\Bcrypt,
    Zend\Mvc\Controller\AbstractActionController;
use My\General;

class AuthController extends AbstractActionController {

    protected $storage;
    protected $authservice;

    public function onDispatch(MvcEvent $event) {
        $event->getViewModel()->setTemplate('admincp/auth');
        return parent::onDispatch($event);
    }

    public function getAuthService() {
        if (!$this->authservice) {
            $this->authservice = $this->serviceLocator->get('AuthService');
        }
        return $this->authservice;
    }

    public function getStorage() {
        if (!$this->storage) {
            $this->storage = $this->serviceLocator->get('My\Auth\MyStorage');
        }
        return $this->storage;
    }

    public function indexAction() {
        return $this->redirect()->toRoute('admincp', array('controller' => 'auth', 'action' => 'login'));
    }

    public function loginAction() {
        $params = $this->params()->fromRoute();

        if ($this->getAuthService()->hasIdentity()) {
            $arrUserData = $this->getAuthService()->getIdentity();
            if ($arrUserData['user_role'] == General::MEMBER) {
                return $this->redirect()->toRoute('home');
            }
            return $this->redirect()->toRoute('admincp');
        }

        if ($this->request->isPost()) {
            $params = $this->params()->fromPost();

            $strEmail = trim($params['email']);
            $strPassword = trim($params['password']);
            $params['remember'] ? $intRemember = (int) $params['remember'] : $intRemember = 0;

            $arrReturn = array('params' => $params);

            if (empty($strEmail) || empty($strPassword)) {
                $arrReturn['error']['empty-username-password'] = 'Vui lòng nhập Email và mật khẩu.';
                return $arrReturn;
            }
            $serviceUser = $this->serviceLocator->get('My\Models\User');
            $arrUser = $serviceUser->getDetail(array('email' => $strEmail, 'is_deleted' => 0));

            if (empty($arrUser)) {
                $arrReturn['error']['empty-username-password'] = 'Email không tồn tại trong hệ thống, xin vui lòng kiểm tra lại.';
                return $arrReturn;
            }

            $bcrypt = new Bcrypt();
            $isValidPassword = $bcrypt->verify($strPassword, $arrUser['password']);

            if (empty($isValidPassword)) {
                $arrReturn['error']['empty-username-password'] = 'Mật khẩu không chính xác, xin vui lòng kiểm tra lại.';
                return $arrReturn;
            }

            $this->getAuthService()->clearIdentity();
            unset($arrUser['password']);

            $this->getStorage()->setRememberMe(1);
            $this->getAuthService()->setStorage($this->getStorage());
            
            $this->getAuthService()->getStorage()->write($arrUser);
            
            return $this->redirect()->toRoute('admincp');
        }

        return array(
            'params' => $params,
        );
    }

    public function logoutAction($redirect = true) {
        $this->getAuthService()->clearIdentity();
        if ($redirect) {
            return $this->redirect()->toRoute('admincp', array('controller' => 'auth', 'action' => 'login'));
        }
    }

}
