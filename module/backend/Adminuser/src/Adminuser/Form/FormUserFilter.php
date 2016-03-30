<?php 
namespace Adminuser\Form;

use Zend\Db\TableGateway\Feature\GlobalAdapterFeature;
use Zend\InputFilter\InputFilter;
use Zend\Validator\Db\NoRecordExists;
use Zend\Validator\NotEmpty;

class FormUserFilter extends InputFilter{

    protected  $_field = [
            'myFullName',
            'myPhoneNumber',
            'myPassword',
            'myRePassword',
            'myAddress',
        ];
    public function __construct(array $options = null){
            foreach($this->_field as $field){
                $this->add(array(
                    'name'    => $field,
                    "validators" => array(
                        $this->checkEmpty()
                    )
                ));
            }
              
//            $valid = new \Zend\Validator\GreaterThan(1,true);
//                        if(!$valid->isValid($post['myGender'])){
//                                $message = $valid->getMessages();
//                                echo current($message);exit();
//                        }else{
//                                echo "ok";exit();
//                        }
//            $this->add(array(
//                    'name'       => 'myGender',
//                    "validators" => array(
//                        array(
//                            "name" => "GreaterThan",
//                            "options" => array(
//                                "min" => 1,  
//                                'inclusive' => true,
//                                "messages" => array(
//                                    \Zend\Validator\GreaterThan::NOT_GREATER => "Dữ liệu không được rỗng"
//                                )
//                            ),
//                            "break_chain_on_failure" => true
//                        ),
//                    )
//            ));
            
            
            $this->add(array(
                  'name'    => 'myEmail',
                  "validators" => array(
                      $this->checkEmpty(),
                      $this->checkExists('users','email'),
                      $this->checkEmail()
                  )
            ));

	}
        
        private function checkEmpty($breakChain = true) {
            
            return array(
                "name" => "NotEmpty",
                "options" => array(
                        "messages" => array(
                                NotEmpty::IS_EMPTY => "Dữ liệu không được rỗng",
                                
                        )
                ),
                "break_chain_on_failure" => $breakChain
            );			
		
        }
        
        private function checkSelect($breakChain = true) {
           
            return array(
                "name" => "Digits",
                "options" => array(
 
                        "messages" => array(
                            \Zend\Validator\Digits::NOT_DIGITS => "Dữ liệu không được rỗng"
                                
                        )
                ),
                "break_chain_on_failure" => $breakChain
            );			
		
        }
        
        private function checkExists($table,$field){
            return array(
                        "name" => "DbNoRecordExists",
                        "options" => array(
                                "table"   => $table,
                                "field"   => $field,
                                "adapter" => GlobalAdapterFeature::getStaticAdapter(),
//                                "exclude" => $exclude,
                                "messages" => array(
                                        NoRecordExists::ERROR_RECORD_FOUND => ucfirst($field) . " đã tồn tại"
                                )
                        ),
                        "break_chain_on_failure" => "true"
                );
        }
        
        private function checkEmail(){
            return array(
                            "name" => "EmailAddress",
                            "options" => array(
                                    "messages" => array(
                                        \Zend\Validator\EmailAddress::INVALID_FORMAT   => "Email không hợp lệ",
                                        \Zend\Validator\EmailAddress::INVALID_HOSTNAME => "Email không hợp lệ",
                                        \Zend\Validator\EmailAddress::INVALID          => "Email không hợp lệ",
                                        \Zend\Validator\EmailAddress::DOT_ATOM         => "Email không hợp lệ",
                                    )
                            ),
                            "break_chain_on_failure" => "true"
                    );
        }
}
?>