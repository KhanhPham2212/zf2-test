<?php 

namespace Adminuser\Model\Entity;

class User
{

	public $user_id;
	public $fullname;
	public $birthdate;
	public $gender;
	public $email;
	public $phone;
	public $address;
	public $full_address;


	public function exchangeArray($data){
		
		$this->user_id      = (!empty($data['user_id']))        ? $data['user_id']      :"";
		$this->fullname     = (!empty($data['fullname']))   	? $data['fullname']    	:"";
		$this->birthdate    = (!empty($data['birthdate']))   	? $data['birthdate']  	:"";
		$this->gender       = (!empty($data['gender']))   	    ? $data['gender']      	:"";
		$this->email        = (!empty($data['email']))   	    ? $data['email']      	:"";
		$this->address      = (!empty($data['address']))   	    ? $data['address']      :"";
		$this->full_address = (!empty($data['full_address']))   ? $data['full_address'] :"";
	
	}	
	public function getArrayCopy(){
		$arr = get_object_vars($this);
		return $arr;
	}

}
?>