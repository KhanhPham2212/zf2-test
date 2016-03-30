<?php

namespace Admincp\Controller;

use My\Controller\MyController,
    Zend\Crypt\Password\Bcrypt,
    My\Validator\Validate;

class UserController extends MyController {
    /* @var $serviceUser \My\Models\User */
    /* @var $serviceCity \My\Models\City */
    /* @var $serviceDistrict \My\Models\District */
    /* @var $serviceWard \My\Models\Ward */

    public function __construct() {
        
    }

    public function indexAction() {
        $params = $this->params()->fromQuery();
        $intLimit = 30;

        $digisFilter = new \Zend\Filter\Digits();
        $phoneNumber = $digisFilter->filter($this->params()->fromQuery('phoneNumber', 0));

        $arrConditions = array(
            'is_deleted' => 0,
            'phone' => $phoneNumber,
            'email' => trim($this->params()->fromQuery('email')),
            'fullname' => trim($this->params()->fromQuery('fullname')),
            'user_role' => trim($this->params()->fromQuery('userRole'))
        );
        //check if user using filter
        $isFilter = $this->isFilter($arrConditions);
        $arrUserList = array();

        if ($isFilter) {
            $route = 'backend-user-search';

            $searchUser = new \My\Search\User();
            $searchUser->setParams($arrConditions)
                    ->setLimit($intLimit);

            $arrUserList = $searchUser->getSearchData();
            $intTotal = $searchUser->getTotalHits();
        } else {
            $route = 'admincp';
            $intPage = $this->params()->fromRoute('page', 1);

            $serviceUser = $this->serviceLocator->get('My\Models\User');
            $arrCol      = array('user_id', 'fullname', 'email', 'address', 'phone', 'user_role_list');
            $arrUserList = $serviceUser->getListLimit($arrConditions, $intPage, $intLimit, 'user_id DESC', $arrCol);
            $intTotal    = $serviceUser->getTotal($arrConditions);
        }
        $params = $this->params()->fromRoute();
        //merge params
        $params = array_merge($params, $this->params()->fromQuery());

        $helper = $this->serviceLocator->get('viewhelpermanager')->get('Paging');
        $paging = $helper($intTotal, $intPage, $intLimit, $route, $params);

        // get group list
        $groupCondition = array(
            'is_deleted' => 0,
            'status'     => 1,
        );
        $serviceGroup = $this->serviceLocator->get('My\Models\Group');
        $roleList = $serviceGroup->getList($groupCondition);
        $groups = array();
        foreach ($roleList as $role) {
            $groups[$role['group_id']] = $role;
        }

        return array(
            'params' => $params,
            'paging' => $paging,
            'arrUserList' => $arrUserList,
            'isFilter' => $isFilter,
            'arrRole' => $groups
        );
    }

    public function addAction() {
        $serviceCity = $this->serviceLocator->get('My\Models\City');
        $arrCityList = $serviceCity->getList(array('is_deleted' => 0));
        $params = $this->params()->fromRoute();
        if ($this->request->isPost()) {
            $params = $this->params()->fromPost();

            $errors = array();
            $validator = new Validate();

            $strEmail = trim($params['email']);
            $strPassword = trim($params['password']);

            if (!$validator->notEmpty($params['fullName'])) {
                $errors['fullName'] = 'Tên người dùng không được bỏ trống.';
            }
            if (!$validator->notEmpty($strEmail)) {
                $errors['email'] = 'Địa chỉ email không được bỏ trống.';
            } elseif (!$validator->emailAddress($strEmail)) {
                $errors['email'] = 'Địa chỉ email không không đúng.';
            }
            if (!$validator->notEmpty($params['phoneNumber'])) {
                $errors['phoneNumber'] = 'Số điện thoại không được bỏ trống.';
            }
            if (!$validator->notEmpty($params['birthdate'])) {
                $errors['birthdate'] = 'Vui lòng nhập ngày sinh.';
            }
            if (!$validator->notEmpty($params['gender'])) {
                $errors['gender'] = 'Vui lòng chọn giới tính.';
            }
            if (!$validator->notEmpty($strPassword)) {
                $errors['password'] = 'Mật khẩu không được bỏ trống.';
            }
            if (!$validator->notEmpty($params['rePassword'])) {
                $errors['rePassword'] = 'Vui lòng nhập lại mật khẩu.';
            }
            if ($strPassword !== $params['rePassword']) {
                $errors['passwordNotMatch'] = 'Mật khẩu không trùng khớp';
            }
            if (!$validator->notEmpty($params['role_list'])) {
                $errors['role_list'] = 'Vui lòng chọn phân quyền người dùng.';
            }

            $roleList = !empty($params['role_list']) && is_array($params['role_list']) ? implode(',', $params['role_list']) : 0;

            $serviceUser = $this->serviceLocator->get('My\Models\User');
            $arrUser = $serviceUser->getDetail(['email' => $strEmail, 'is_deleted' => 0]);
            if ($arrUser) {
                $errors['exist-email'] = 'Email này đã tồn tại, xin quý khách nhập email khác.';
            }
            
            if (empty($errors)) {
                $arrCity = $serviceCity->getDetail(array('city_id' => $params['city']));
                $serviceDistrict = $this->serviceLocator->get('My\Models\District');
                $arrDistrict = $serviceDistrict->getDetail(array('district_id' => $params['district']));

                $serviceWard = $this->serviceLocator->get('My\Models\Ward');
                $arrWard = $serviceWard->getDetail(array('ward_id' => $params['ward']));

                $strFullAddress = $params['address'] . ', ' . $arrWard['ward_name'] . ', ' . $arrDistrict['district_name'] . ', ' . $arrCity['city_name'];

                list($day, $month, $year) = explode('-', $params['birthdate']);
                $birthDate = mktime(0, 0, 0, $month, $day, $year);

                $strPassword = $this->createPassword($strPassword);

                $arrData = array(
                    'fullname' => trim($params['fullName']),
                    'email' => $strEmail,
                    'phone' => $params['phoneNumber'],
                    'birthdate' => $birthDate,
                    'gender' => (int) $params['gender'],
                    'city_id' => (int) $params['city'],
                    'district_id' => (int) $params['district'],
                    'ward_id' => (int) $params['ward'],
                    'address' => trim($params['address']),
                    'full_address' => $strFullAddress,
                    'password' => $strPassword,
                    'user_role_list' => $roleList,
                    'is_actived' => 1,
                    'created_date' => time(),
                );
                $intResult = $serviceUser->add($arrData);

                /* grant permission */
                // get permission from group
                $serviceUserPermission = $this->serviceLocator->get('My\Models\UserPermission');
                $userPermissionList = $serviceUserPermission->getList(array('user_id' => $intResult));

                $userCondition = array('group_id_list' => $roleList, 'group_by' => true);
                $serviceGroupPermission = $this->serviceLocator->get('My\Models\GroupPermission');

                $groupPermissionList = $serviceGroupPermission->getList($userCondition);
                // curent permission of user. We need delete all before add new permission
                if (is_array($userPermissionList) && count($userPermissionList) > 0) {
                    //@todo delete all
                    $deleteCondition = array('user_id' => $intResult);
                    $serviceUserPermission->remove($deleteCondition);
                }
                // Lấy thông tin nhóm
                $serviceGroup = $this->serviceLocator->get('My\Models\Group');
                $arrGroup = $serviceGroup->getList(array('group_list_id' => $roleList));

                $isACP = 0;
                $isFullAccess = 0;
                if (!empty($arrGroup)) {
                    foreach ($arrGroup as $group) {
                        $isACP = $isACP == 0 ? $group['is_acp'] : $isACP;
                        $isFullAccess = $isFullAccess == 0 ? $group['is_fullaccess'] : $isFullAccess;
                    }
                }

                // nếu là user thường sẽ ko add vào bảng user permission
                if (!empty($arrGroup) && $isACP != 0) {
                    $arrPermissionList = array();
                    foreach ($groupPermissionList as $key => $arrData) {
                        $arrPermissionList[$key]['group_id'] = $arrData['group_id'];
                        $arrPermissionList[$key]['module_name'] = $arrData['module_name'];
                        $arrPermissionList[$key]['controller_name'] = $arrData['controller_name'];
                        $arrPermissionList[$key]['action_name'] = $arrData['action_name'];
                        $arrPermissionList[$key]['user_id'] = $intResult;
                    }

                    $serviceUserPermission->addAll($arrPermissionList);
                }

                if ($intResult > 0) {
                    $this->flashMessenger()->setNamespace('success-add-user')->addMessage('Thêm người dùng thành công.');
                    $this->redirect()->toRoute('backend', array('controller' => 'user', 'action' => 'edit', 'id' => $intResult));
                } else {
                    $errors[] = 'Không thể thêm dữ liệu. Hoặc email đã tồn tại. Xin vui lòng kiểm tra lại';
                }
            }
        }
        $groupCondition = array(
            'is_deleted' => 0,
            'status' => 1,
        );
        $serviceGroup = $this->serviceLocator->get('My\Models\Group');
        $roleList = $serviceGroup->getList($groupCondition);

        return array(
            'params' => $params,
            'errors' => $errors,
            'arrCityList' => $arrCityList,
            'arrRole' => $roleList
        );
    }

    public function editAction() {
        $params = $this->params()->fromRoute();
        if (empty($params['id'])) {
            return $this->redirect()->toRoute('backend', array('controller' => 'user', 'action' => 'index'));
        }
        $intUserID = (int) $params['id'];
        $arrCondition = array('user_id' => $intUserID);
        $serviceUser = $this->serviceLocator->get('My\Models\User');
        $arrUser = $serviceUser->getDetail($arrCondition);

        if (empty($arrUser)) {
            return $this->redirect()->toRoute('backend', array('controller' => 'user', 'action' => 'index'));
        }

        $errors = array();
        $arrDistrict = array();
        $arrWardList = array();

        $serviceCity = $this->serviceLocator->get('My\Models\City');
        $serviceDistrict = $this->serviceLocator->get('My\Models\District');
        $serviceWard = $this->serviceLocator->get('My\Models\Ward');

        $arrCityList = $serviceCity->getList(array('is_deleted' => 0));

        if ($arrUser['city_id']) {
            $arrDistrict = $serviceDistrict->getList(array('city_id' => $arrUser['city_id']));
        }

        if ($arrUser['city_id'] && $arrUser['district_id']) {
            $arrWardList = $serviceWard->getList(array('city_id' => $arrUser['city_id'], 'district_id' => $arrUser['district_id']));
        }

        if ($this->request->isPost()) {
            $params = $this->params()->fromPost();
            if ($params && is_array($params)) {
                $validator = new Validate();
                if (!$validator->notEmpty($params['fullName'])) {
                    $errors['fullname'] = 'Tên người dùng không được bỏ trống.';
                }
                
                $roleList = !empty($params['role_list']) && is_array($params['role_list']) ? implode(',', $params['role_list']) : null;
                if (empty($errors)) {
                    $arrCity = $serviceCity->getDetail(array('city_id' => $params['city']));
                    $arrDistrict = $serviceDistrict->getDetail(array('district_id' => $params['district']));
                    $arrWard = $serviceWard->getDetail(array('ward_id' => $params['ward']));

                    $strFullAddress = $params['address'] . ', ' . $arrWard['ward_name'] . ', ' . $arrDistrict['district_name'] . ', ' . $arrCity['city_name'];

                    list($day, $month, $year) = explode('-', $params['birthdate']);
                    $birthDate = mktime(0, 0, 0, $month, $day, $year);

                    $strPassword = trim($params['password']);
                    if ($validator->notEmpty($strPassword)) {
                        $strPassword = $this->createPassword($strPassword);
                    } else {
                        $strPassword = $arrUser['password'];
                    }

                    $arrData = [
                        'fullname' => trim($params['fullName']),
                        'phone' => $params['phoneNumber'],
                        'password' => $strPassword,
                        'birthdate' => $birthDate,
                        'gender' => (int) $params['gender'],
                        'city_id' => (int) $params['city'],
                        'district_id' => (int) $params['district'],
                        'ward_id' => (int) $params['ward'],
                        'address' => trim($params['address']),
                        'full_address' => $strFullAddress,
                        'user_role_list' => $roleList,
                        'updated_date' => time(),
                    ];

                    $intResult = $serviceUser->edit($arrData, $intUserID);


                    /* grant permission */
                    // get permission from group
                    $serviceUserPermission = $this->serviceLocator->get('My\Models\UserPermission');
                    $userPermissionList = $serviceUserPermission->getList(array('user_id' => $intUserID));

                    $userCondition = array('group_id_list' => $roleList, 'group_by' => true);
                    $serviceGroupPermission = $this->serviceLocator->get('My\Models\GroupPermission');

                    $groupPermissionList = $serviceGroupPermission->getList($userCondition);
                    // curent permission of user. We need delete all before add new permission
                    if (is_array($userPermissionList) && count($userPermissionList) > 0) {
                        //@todo delete all
                        $deleteCondition = array('user_id' => $intUserID);
                        $serviceUserPermission->remove($deleteCondition);
                    }
                    // Lấy thông tin nhóm
                    $serviceGroup = $this->serviceLocator->get('My\Models\Group');
                    $arrGroup = $serviceGroup->getList(array('group_list_id' => $roleList));

                    $isACP = 0;
                    $isFullAccess = 0;
                    if (!empty($arrGroup)) {
                        foreach ($arrGroup as $group) {
                            $isACP = $isACP == 0 ? $group['is_acp'] : $isACP;
                            $isFullAccess = $isFullAccess == 0 ? $group['is_fullaccess'] : $isFullAccess;
                        }
                    }

                    // nếu là user thường sẽ ko add vào bảng user permission
                    if (!empty($arrGroup) && $isACP != 0) {
                        $arrPermissionList = array();
                        foreach ($groupPermissionList as $key => $arrData) {
                            $arrPermissionList[$key]['group_id'] = $arrData['group_id'];
                            $arrPermissionList[$key]['module_name'] = $arrData['module_name'];
                            $arrPermissionList[$key]['controller_name'] = $arrData['controller_name'];
                            $arrPermissionList[$key]['action_name'] = $arrData['action_name'];
                            $arrPermissionList[$key]['user_id'] = $intUserID;
                        }

                        $serviceUserPermission->addAll($arrPermissionList);
                    }

                    if ($intResult > 0) {
                        $this->flashMessenger()->setNamespace('success-edit-user')->addMessage('Chỉnh sửa người dùng thành cmn công.');
                        $this->redirect()->toRoute('backend', array('controller' => 'user', 'action' => 'edit', 'id' => $intUserID));
                    } else {
                        $errors[] = 'Không thể sửa dữ liệu hoặc địa chỉ email đã tồn tại. Xin vui lòng kiểm tra lại';
                    }
                }
            }
        }

        $groupCondition = array(
            'is_deleted' => 0,
            'status' => 1,
        );
        $serviceGroup = $this->serviceLocator->get('My\Models\Group');
        $roleList = $serviceGroup->getList($groupCondition);

        return array(
            'params' => $params,
            'arrUser' => $arrUser,
            'message' => $this->flashMessenger()->getMessages(),
            'errors' => $errors,
            'arrCityList' => $arrCityList,
            'arrDistrictList' => $arrDistrict,
            'arrWardList' => $arrWardList,
            'arrRole' => $roleList
        );
    }

    public function viewAction() {
        $params = $this->params()->fromRoute();
        if (empty($params['id'])) {
            $this->redirect()->toRoute('backend', array('controller' => 'user', 'action' => 'index'));
        }
        $intUserID = (int) $params['id'];
        $arrCondition = array('user_id' => $intUserID);
        $serviceUser = $this->serviceLocator->get('My\Models\User');
        $arrUser = $serviceUser->getDetail($arrCondition);
        if (empty($arrUser)) {
            $this->redirect()->toRoute('backend', array('controller' => 'user', 'action' => 'index'));
        }
        return array(
            'arrUser' => $arrUser,
        );
    }

    public function deleteAction() {
        $result = null;
        if ($this->request->isPost()) {
            $params = $this->params()->fromPost();
            if (empty($params['user_id'])) {
                return $this->getResponse()->setContent($result);
            }
            $serviceUser = $this->serviceLocator->get('My\Models\User');
            $result = $serviceUser->edit(array('is_deleted' => 1), $params['user_id']);
            if (!empty($result)) {
                $serviceUserPermission = $this->serviceLocator->get('My\Models\UserPermission');
                //@todo delete all
                $deleteCondition = array('user_id' => $params['user_id']);
                $serviceUserPermission->remove($deleteCondition);
            }
        }
        return $this->getResponse()->setContent($result);
    }

    public function getUserInfoAction() {
        if ($this->request->isPost()) {
            $params = $this->params()->fromPost();
            $serviceUser = $this->serviceLocator->get('My\Models\User');
            $arrUser = $serviceUser->getDetail(array('email' => $params['email']));
            unset($arrUser['password']);
            return $this->getResponse()->setContent(json_encode($arrUser));
        }
        return $this->getResponse()->setContent('');
    }

    /**
     * Check user using filter
     * @param array $arrConditions
     * @return boolean is filter
     */
    private function isFilter($arrConditions) {
        return $arrConditions['phone'] ||
                $arrConditions['fullname'] ||
                $arrConditions['user_role'] ||
                $arrConditions['email'] ? true : false;
    }

    private function createPassword($strPassword) {
        $bcrypt = new Bcrypt(array('salt' => microtime(true) . SECRET_KEY, 'cost' => 12));
        $strPassword = $bcrypt->create($strPassword);

        return $strPassword;
    }

}
