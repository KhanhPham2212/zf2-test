<?php

namespace My\Validator;

use Zend\Validator;

class Validate {

    public function notEmpty($strValidate) {
        $validator = new Validator\NotEmpty();
        if ($validator->isValid($strValidate)) {
            return true;
        } else {
            return false;
        }
    }

    public function emailAddress($strValidate) {
        $validator = new Validator\EmailAddress();
        if ($validator->isValid($strValidate)) {
            return true;
        } else {
            return false;
        }
    }

    public function noRecordExists($strValidate, $strTable, $strField, $dbAdapter, $arrExclude = array('field' => 'is_deleted', 'value' => 1)) {
        $arrValidate = array(
            'table' => $strTable,
            'field' => $strField,
            'adapter' => $dbAdapter
        );
        $arrExclude ? $arrValidate['exclude'] = $arrExclude : $arrValidate;
        $validator = new Validator\Db\NoRecordExists($arrValidate);
        if ($validator->isValid($strValidate)) {
            return true;
        } else {
            return false;
        }
    }

    public function isUnicode($str) {
        $isUnicode = preg_match('/[ạáàảãẠÁÀẢÃâậấầẩẫÂẬẤẦẨẪăặắằẳẵẫĂẮẰẲẴẶẴêẹéèẻẽÊẸÉÈẺẼếềểễệẾỀỂỄỆọộổỗốồỌỘỔỖỐỒÔôóòỏõÓÒỎÕơợớờởỡƠỢỚỜỞỠụưứừửữựỤƯỨỪỬỮỰúùủũÚÙỦŨịíìỉĩỊÍÌỈĨỵýỳỷỹỴÝỲỶỸđĐ]/u', $str);
        return $isUnicode;
    }

}