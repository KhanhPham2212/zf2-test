<?php 
namespace Adminuser;

use Adminuser\Model\CityTable;
use Zend\Db\ResultSet\HydratingResultSet;
use Zend\Db\ResultSet\ResultSet;
use Zend\Db\TableGateway\Feature\GlobalAdapterFeature;
use Zend\Db\TableGateway\TableGateway;
use Zend\Mvc\ModuleRouteListener;
use Zend\Mvc\MvcEvent;
use Zend\Stdlib\Hydrator\ObjectProperty;

class Module {
    public function onBootstrap(MvcEvent $e){
       $eventManager        = $e->getApplication()->getEventManager();
       $moduleRouteListener = new ModuleRouteListener();
       $moduleRouteListener->attach($eventManager);
       
       $adapter = $e->getApplication()->getServiceManager()->get('Zend\Db\Adapter\Adapter');
       GlobalAdapterFeature::setStaticAdapter($adapter);
    }

    public function getConfig(){
        
        return array_merge(
            include __DIR__."/config/module.config.php",
            include __DIR__."/config/router.config.php"
        );  
    }

    public function getServiceConfig(){
        return array(
            "factories" => array(          
                "Database\Model\User" => function($sm){
                        $tableGateway = $this->getTableGateway($sm, 'users',new \Adminuser\Model\Entity\User());
                        return  new \Adminuser\Model\UserTable($tableGateway);
                },    
                "Database\Model\Group" => function($sm){
                    $tableGateway = $this->getTableGateway($sm, 'groups',new \Adminuser\Model\Entity\Group());
                    return  new \Adminuser\Model\GroupTable($tableGateway);
                },     
                "Database\Model\City" => function($sm){
                    $tableGateway = $this->getTableGateway($sm, 'cities',new \Adminuser\Model\Entity\City());
                    return  new \Adminuser\Model\CityTable($tableGateway);
                },
                "Database\Model\District" => function($sm){
                    $tableGateway = $this->getTableGateway($sm, 'districts',new \Adminuser\Model\Entity\District());
                    return  new \Adminuser\Model\DistrictTable($tableGateway);
                },
                "Database\Model\Ward" => function($sm){
                    $tableGateway = $this->getTableGateway($sm, 'wards',new \Adminuser\Model\Entity\Ward());
                    return  new \Adminuser\Model\WardTable($tableGateway);
                }
            ),
            "aliases" => array(
                "UserTable"     => "Database\Model\User",
                "GroupTable"    => "Database\Model\Group",
                "CityTable"     => "Database\Model\City",
                "DistrictTable" => "Database\Model\District",
                "WardTable"     => "Database\Model\Ward",
            )
        );
    }

    public function getFormElementConfig(){
        return array(
            "factories" => array(           
                "FormUser" => function($sm){
                    $tableGroup = $sm->getServiceLocator()->get('GroupTable');
            
                    $form      = new \Adminuser\Form\FormUser($tableGroup);
                    $form->setInputFilter(new \Adminuser\Form\FormUserFilter());
                    $form->setUseInputFilterDefaults(false);
                    return $form;
                },

            )
        );
    }

    public function getAutoloaderConfig(){
        return array(
            //Standard chỉ cần khai báo namespace
            "Zend\Loader\StandardAutoloader" => array(
                "namespaces" => array(
                    __NAMESPACE__ => __DIR__."/src/".__NAMESPACE__,
                )
            )
        );
    }
    
    private function getTableGateway($sm,$table = null,$entity = null){
                $adapter = $sm->get("Zend\Db\Adapter\Adapter");

                $resultSetPrototype = new HydratingResultSet();
                $resultSetPrototype->setHydrator(new ObjectProperty());
                $resultSetPrototype->setObjectPrototype($entity);

                return $tableGateway = new TableGateway($table,$adapter,null,$resultSetPrototype);
    }
        
}
?>