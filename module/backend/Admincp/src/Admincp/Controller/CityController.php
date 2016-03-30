<?php

namespace Backend\Controller;

use My\General,
    My\Validator\Validate,
    My\Controller\MyController;

class CityController extends MyController {

    public function __construct() {
    }

    public function indexAction() {
        $params = $this->params()->fromRoute();

        $intPage = $this->params()->fromRoute('page', 1);
        $arrCondition = array('is_deleted' => 0);
        $intLimit = 15;
        $serviceCity = $this->serviceLocator->get('My\Models\City');
      //  $intTotal = $serviceCity->getTotal($arrCondition);
        $arrCityList = $serviceCity->getListLimit($arrCondition, $intPage, $intLimit, 'ordering ASC');

        if ($this->request->isPost()) {
            $errors = array();
            $params = $this->params()->fromPost();
            $strCityName = trim($params['cityName']);

            if (empty($strCityName)) {
                $errors['cityName'] = 'Vui lòng nhập tên Tỉnh / Thành.';
            }

            $validator = new Validate();
            $isNotExist = $validator->noRecordExists($strCityName, 'cities', 'city_name', $this->serviceLocator->get('Zend\Db\Adapter\Adapter'));
            if (empty($isNotExist)) {
                $errors['cityName'] = 'Tỉnh / Thành đã tồn tại trong hệ thống.';
            }
            if (empty($errors)) {
                $arrData = array(
                    'city_name' => $strCityName,
                    'city_slug' => General::getSlug($strCityName),
                    'area_id' => (int) $params['areaID'],
                    'ordering' => (int) trim($params['ordering']),
                    'is_focus' => (int) trim($params['isFocus']),
                );
                $intResult = $serviceCity->add($arrData);
                if ($intResult) {
                    $this->flashMessenger()->setNamespace('success-add-city')->addMessage('Thêm Tỉnh / Thành mới thành công');
                    return $this->redirect()->toRoute('backend', array('controller' => 'city', 'action' => 'index'));
                }
            }
        }
        $helper = $this->serviceLocator->get('viewhelpermanager')->get('Paging');
        $paging = $helper($params['module'], $params['__CONTROLLER__'], $params['action'], $intTotal, $intPage, $intLimit, 'backend', array('controller' => 'city', 'action' => 'index', 'page' => $intPage));
        return array(
            'errors' => $errors,
            'params' => $params,
            'paging' => $paging,
            'arrCityList' => $arrCityList,
        );
    }

    public function editAction() {
        if ($this->request->isPost()) {
            $params = $this->params()->fromPost();

            $intCityID = (int) $this->params()->fromRoute('id', 0);
            $strCityName = trim($params['cityName']);
            if (empty($intCityID)) {
                return $this->redirect()->toRoute('backend', array('controller' => 'city', 'action' => 'index'));
            }
            if (empty($strCityName)) {
                $errors['cityName'] = 'Vui lòng nhập tên Tỉnh / Thành.';
            }
            $validator = new Validate();
            $isNotExist = $validator->noRecordExists($strCityName, 'cities', 'city_name', $this->serviceLocator->get('Zend\Db\Adapter\Adapter'), array('field' => 'city_id', 'value' => $intCityID));
            if (empty($isNotExist)) {
                $errors['cityName'] = 'Tỉnh / Thành đã tồn tại trong hệ thống.';
            }

            if (empty($errors)) {
                $arrData = array(
                    'city_name' => $strCityName,
                    'city_slug' => General::getSlug($strCityName),
                    'area_id' => (int) $params['areaID'],
                    'ordering' => (int) trim($params['ordering']),
                    'is_focus' => (int) trim($params['isFocus']),
                );
                $serviceCity = $this->serviceLocator->get('My\Models\City');
                $intResult = $serviceCity->edit($arrData, $intCityID);

                if ($intResult) {
                    $this->flashMessenger()->setNamespace('success-edit-city')->addMessage('Chỉnh sửa Tỉnh / Thành thành công');
                    return $this->redirect()->toRoute('backend', array('controller' => 'city', 'action' => 'index'));
                }
            }
        }
        return $this->redirect()->toRoute('backend', array('controller' => 'city', 'action' => 'index'));
    }

    public function deleteAction() {
        if ($this->request->isPost()) {
            $params = $this->params()->fromPost();
            $intCityID = (int) $params['cityID'];
            if (empty($intCityID)) {
                return $this->getResponse()->setContent(json_encode(array('error' => 1, 'success' => 0, 'message' => 'Xảy ra lỗi trong quá trình xử lý. Xin vui lòng thử lại')));
            }
            $serviceCity = $this->serviceLocator->get('My\Models\City');
            $serviceCity->edit(array('is_deleted' => 1), $intCityID);
            return $this->getResponse()->setContent(json_encode(array('error' => 0, 'success' => 1, 'message' => 'Xóa Tỉnh / Thành hoàn tất')));
        }
        return $this->getResponse()->setContent(json_encode(array('error' => 1, 'success' => 0, 'message' => 'Xảy ra lỗi trong quá trình xử lý. Xin vui lòng thử lại')));
    }

}
