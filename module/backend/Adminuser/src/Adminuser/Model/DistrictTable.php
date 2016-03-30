<?php 
namespace Adminuser\Model;

use Zend\Db\Sql\Select;
use Zend\Db\TableGateway\AbstractTableGateway;
use Zend\Db\TableGateway\TableGateway;

class DistrictTable extends AbstractTableGateway{
	protected $_tableGateway;
	
	public function __construct(TableGateway $tableGateway){
		$this->_tableGateway = $tableGateway;
		return $this;
	}

	public function listItem(){
		$result =   $this->_tableGateway->select(function(Select $select){
							$select->columns(array("district_name","district_id"))
								   ->order(array("ordering ASC"));
					})->toArray();

		return $result;
	}

}
?>