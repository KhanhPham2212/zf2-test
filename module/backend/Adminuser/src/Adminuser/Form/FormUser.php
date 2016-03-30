<?php
namespace Adminuser\Form;


use Zend\Form\Form;

class FormUser extends Form{
	public function __construct(){
		parent::__construct();

		$this->setAttributes(
			array(
				"action"  => "#",
				"method"  => "POST",
				"class"   => "form-horizontal tasi-form",
				"role"    => "form",
				"name"    => "frm",
				"id"      => "frm",
			));
	
		//name
		$this->add(array(
			"type" => "text",
			"name" => "myFullName",
			"attributes" => array(
				"class"       => "form-control round-input",
				"id"          => "name",
				"placeholder" => "Vui lòng nhập Họ và Tên ",
			),
			"options" => array(
				"label" => "Họ và Tên ",
				"label_attributes" => array(
					"class" => "col-lg-2 col-sm-2 control-label",
					"for"   => "myFullName"
				),
			)	
		));


                //email
		$this->add(array(
			"type" => "text",
			"name" => "myEmail",
			"attributes" => array(
				"class"       => "form-control round-input",
				"id"          => "email",
				"placeholder" => "Vui lòng nhập Email",
			),
			"options" => array(
				"label" => "Email ",
				"label_attributes" => array(
					"class" => "col-lg-2 col-sm-2 control-label",
					"for"   => "myEmail"
				),
            		)	
		));

                // Giới tính
		$this->add(array(
			"type" => "select",
			"name" => "myGender",
			"required" => true,
			"attributes" => array(
                            "id"    => "gender",
                            "class" => "form-control round-input",  
			),
			"options" => array(
                            "value_options" => array(
                                    "0"  => "Vui lòng chọn giới tính",
                                    "1"  => "Nam",
                                    "2"  => "Nử"
                            ),
                            "label" => "Giới tính ",
                            "label_attributes" => array(
                                    "class" => "col-lg-2 col-sm-2 control-label",
                                    "for"   => "myGender"
                            )
			)	
		));

		//ngay sinh
		$this->add(array(
			"type" => "text",
			"name" => "myBirthDate",	
			"attributes" => array(
				"class"       => "form-control round-input",
				"id"          => "birthdate",
				"placeholder" => "Vui lòng nhập Ngày sinh",
			),
			"options" => array(
				"label" => "Ngày sinh ",
				"label_attributes" => array(
					"class" => "col-lg-2 col-sm-2 control-label",
					"for"   => "myBirthDate"
				),
			)	
		));

		//so dien thoai
		$this->add(array(
			"type" => "text",
			"name" => "myPhoneNumber",	
			"attributes" => array(
				"class"       => "form-control round-input",
				"id"          => "phoneNumber",
				"placeholder" => "Vui lòng nhập số điện thoại",
			),
			"options" => array(
				"label" => "Số điện thoại ",
				"label_attributes" => array(
					"class" => "col-lg-2 col-sm-2 control-label",
					"for"   => "myPhoneNumber"
				),
			)	
		));

                //password
                $this->add(array(
			"type" => "password",
			"name" => "myPassword",
			"attributes" => array(
				"class"       => "form-control round-input",
				"id"          => "password",
				"placeholder" => "Vui lòng nhập mật khẩu",
			),
			"options" => array(
				"label"            => "Mật khẩu ",
				"label_attributes" => array(
					"class" => "col-lg-2 col-sm-2 control-label",
					"for"   => "myPassword"
				),
			)	
		));

		//re-password
        $this->add(array(
			"type" => "password",
			"name" => "myRePassword",
			"attributes" => array(
				"class"       => "form-control round-input",
				"id"          => "rePassword",
				"placeholder" => "Vui lòng nhập lại mật khẩu",
			),
			"options" => array(
				"label"            => "Nhập lại mật khẩu ",
				"label_attributes" => array(
					"class" => "col-lg-2 col-sm-2 control-label",
					"for"   => "myRePassword"
				),
			)	
		));

		//address
                $this->add(array(
			"type" => "text",
			"name" => "myAddress",
			"attributes" => array(
				"class"       => "form-control round-input",
				"id"          => "address",
				"placeholder" => "Lưu ý: Chỉ nhập số nhà và tên đường",
			),
			"options" => array(
				"label"            => "Số nhà, tên đường ",
				"label_attributes" => array(
					"class" => "col-lg-2 col-sm-2 control-label",
					"for"   => "myAddress"
				),
			)	
		));

	    //tỉnh
		$this->add(array(
			"type" => "select",
			"name" => "city",
			"attributes" => array(
				"id"    => "city",
				"class" => "form-control round-input"
			),
			"options" => array(
				"label" => "Tỉnh / Thành ",
				"label_attributes" => array(
					"class" => "col-lg-2 control-label",
					"for"   => "city"
				)
			)	
		));
 
        //quận
		$this->add(array(
			"type" => "select",
			"name" => "district",
			"attributes" => array(
				"id"    => "district",
				"class" => "form-control round-input"
			),
			"options" => array(
				"label" => "Quận / Huyện ",
				"label_attributes" => array(
					"class" => "col-lg-2 control-label",
					"for"   => "district"
				)
			)	
		));

                //xã
		$this->add(array(
			"type" => "select",
			"name" => "ward",
			"attributes" => array(
				"id"    => "ward",
				"class" => "form-control round-input"
			),
			"options" => array(
				"label" => "Phường / Xã ",
				"label_attributes" => array(
					"class" => "col-lg-2 control-label",
					"for"   => "ward"
				)
			)	
		));

		//group
		$this->add(array(
			"type" => "select",
			"name" => "role_list",
			"attributes" => array(
				"id"       => "userRoleList",
				"class"    => "form-control round-input sumoselect",
				"multiple" => "multiple",
			),
			"options" => array(
				"value_options" => array(
					"1" => "Nam",
					"2" => "Nử"
				),
				"label" => "Group",
				"label_attributes" => array(
					"class" => "col-lg-2 control-label",
					"for"   => "role_list"
				)
			)	
		));


		//submit
		$this->add(array(
			"type" => "submit",
			"name" => "ok",
			"attributes" => array(
				"class"       => "btn btn-info",
				"value"       => "Hoàn tất"
			),	
		));

	}

	public function showError(){
		if(empty($this->getMessages())) return false;

		$error = '<div class="alert alert-danger" role="alert">';
		foreach($this->getMessages() as $key=>$val){
			$error .= sprintf('<p><b>%s : </b>%s</p>',ucfirst($this->convertToPrettyName($key)),current($val));
		}
		$error .= '</div>';
		
		return $error;
	}
        
        private function convertToPrettyName($fieldName) {
             switch($fieldName){
                case "myFullName" :
                    return "Họ và tên";
                    break;
                case "myEmail":
                    return "Email";
                    break;
                case "myGender":
                    return "Giới tính";
                    break;
                case "myBirthDate":
                    return "Ngày sinh";
                    break;
                case "myPhoneNumber":
                    return "Số điện thoại";
                    break;
                case "myPassword":
                    return "Mật khẩu";
                    break;
                case "myRePassword":
                    return "Mật khẩu nhập lại";
                    break;
                case "myAddress":
                    return "Địa chỉ";
                    break;
                case "city":
                    return "Tỉnh / Thành";
                    break;
                case "district":
                    return "Quận / Huyện";
                    break;
                case "ward":
                    return "Phường / Xã";
                    break;
                case "role_list":
                    return "Nhóm";
                    break;
            }
        }
}
?>