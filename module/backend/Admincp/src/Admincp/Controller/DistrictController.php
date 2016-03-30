<?php

namespace Admincp\Controller;

use My\General,
    My\Validator\Validate,
    My\Controller\MyController;

class DistrictController extends MyController {

    public function __construct() {
    }

    public function indexAction() {
        $params = $this->params()->fromRoute();
        $intPage = $this->params()->fromRoute('page', 1);
        $arrCondition = array('is_deleted' => 0);
        $intLimit = 15;
        $serviceCity = $this->serviceLocator->get('My\Models\City');
        $arrCityList = $serviceCity->getList($arrCondition);
        if ($this->request->isPost()) {
            $errors = array();
            $params = $this->params()->fromPost();
            if ($params['city_id'] > 0) {
                $serviceDistrict = $this->serviceLocator->get('My\Models\District');
                $districtName = trim($params['districtName']);
                //Validate district name
                $arrData = array(
                    'district_name' => $districtName,
                    'city_id' => (int) $params['city_id'],
                    'is_deleted' => 0,
                );
                $item = $serviceDistrict->getDetail($arrData);
                if (count($item) > 0) {
                    $errors[] = 'Dữ liệu đã tồn tại, Xin vui lòng kiểm tra lại';
                } else {
                    $arrData['district_slug'] = General::getSlug($districtName);
                    $arrData['ordering'] = (int) $params['ordering'];
                    $arrData['is_focus'] = (int) $params['isFocus'];
                    $arrData['is_rural'] = (int) $params['isRural'];
                    $intResult = $serviceDistrict->add($arrData);
                    if ($intResult) {
                        $this->flashMessenger()->setNamespace('success-add-district')->addMessage('Thêm Quận/ Huyện mới thành công');
                        $this->redirect()->toRoute('backend', array('controller' => 'district', 'action' => 'index', 'id' => $params['city_id']));
                    } else {
                        $errors[] = 'Không thể thêm dữ liệu, xin vui lòng kiểm tra lại';
                    }
                }
            }
        }
        //$helper = $this->serviceLocator->get('viewhelpermanager')->get('Paging');
        //$paging = $helper($params['module'], $params['__CONTROLLER__'], $params['action'], $intTotal, $intPage, $intLimit, 'backend', array('controller' => 'city', 'action' => 'index', 'page' => $intPage));
        return array(
            'params' => $params,
            //'page' => $intPage,
            //'limit' => $intLimit,
            'arrCityList' => $arrCityList,
            'message' => $this->flashMessenger()->getMessages(),
            'errors' => $errors,
        );
    }

    public function editAction() {
        if ($this->request->isPost()) {
            $params = $this->params()->fromPost();

            $intDistrictID = (int) $this->params()->fromRoute('id', 0);
            $strDistrictName = trim($params['districtName']);

            if (empty($intDistrictID)) {
                return $this->redirect()->toRoute('backend', array('controller' => 'district', 'action' => 'index'));
            }
            if (empty($strDistrictName)) {
                $errors['districtName'] = 'Vui lòng nhập tên Quận / Huyện.';
            }
            $validator = new Validate();
            $isNotExist = $validator->noRecordExists($strDistrictName, 'districts', 'district_name', $this->serviceLocator->get('Zend\Db\Adapter\Adapter'), array('field' => 'district_id', 'value' => $intDistrictID));
            if (empty($isNotExist)) {
                $errors['districtName'] = 'Quận / Huyện đã tồn tại trong hệ thống.';
            }
            if (empty($errors)) {
                $arrData = array(
                    'district_name' => $strDistrictName,
                    'district_slug' => General::getSlug($strDistrictName),
                    'is_rural' => (int) $params['isRural'],
                    'ordering' => (int) trim($params['ordering']),
                    'is_focus' => (int) trim($params['isFocus']),
                );

                $serviceDistrict = $this->serviceLocator->get('My\Models\District');
                $intResult = $serviceDistrict->edit($arrData, $intDistrictID);
                if ($intResult) {
                    $this->flashMessenger()->setNamespace('success-edit-district')->addMessage('Chỉnh sửa Quận / Huyện thành công');
                    return $this->redirect()->toRoute('backend', array('controller' => 'district', 'action' => 'index'));
                }
            }
        }
        return $this->redirect()->toRoute('backend', array('controller' => 'district', 'action' => 'index'));
    }

    public function getDistrictAction() {
        $data = array('error' => 1,
            'msg' => 'Hiện tại chưa có Quận / Huyện nào'
        );
        if ($this->request->isPost()) {
            $params = $this->params()->fromPost();
            $arrCondition = array('is_deleted' => 0);
            $intLimit = 150;
            if ($params['city_id'] > 0) {
                $arrCondition['city_id'] = $params['city_id'];
                $intPage = $this->params()->fromRoute('page', 1);
                $serviceDistrict = $this->serviceLocator->get('My\Models\District');
                $arrDistrictList = $serviceDistrict->getListLimit($arrCondition, $intPage, $intLimit);
                $intTotal = $serviceDistrict->getTotal($arrCondition);
                if (count($arrDistrictList) > 0) {
                    $data = array('error' => 0,
                        'msg' => 'success',
                        'total' => $intTotal,
                        'data' => $arrDistrictList
                    );
                }
            }
        }
        return $this->getResponse()->setContent(json_encode($data));
    }

    public function getListAction() {
        $arrDistrictList = array();
        $intCityID = $this->params()->fromPost('cityID', 0);
        if ($intCityID) {
            $arrData = array('city_id' => $intCityID, 'is_deleted' => 0);
            $serviceDistrict = $this->serviceLocator->get('My\Models\District');
            $arrDistrictList = $serviceDistrict->getList($arrData);
        }
        if ($this->request->isPost()) {
            return $this->getResponse()->setContent(json_encode($arrDistrictList));
        }
        return $arrDistrictList;
    }

    public function deleteAction() {
        if ($this->request->isPost()) {
            $params = $this->params()->fromPost();
            $intDistrictID = (int) $params['districtID'];
            if (empty($intDistrictID)) {
                return $this->getResponse()->setContent(json_encode(array('error' => 1, 'success' => 0, 'message' => 'Xảy ra lỗi trong quá trình xử lý. Xin vui lòng thử lại')));
            }
            $serviceDistrict = $this->serviceLocator->get('My\Models\District');
            $serviceDistrict->edit(array('is_deleted' => 1), $intDistrictID);
            return $this->getResponse()->setContent(json_encode(array('error' => 0, 'success' => 1, 'message' => 'Xóa Quận / Huyện hoàn tất')));
        }
        return $this->getResponse()->setContent(json_encode(array('error' => 1, 'success' => 0, 'message' => 'Xảy ra lỗi trong quá trình xử lý. Xin vui lòng thử lại')));
    }

}
