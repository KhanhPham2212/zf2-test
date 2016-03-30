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
                "UserTableGateway" => function($sm){
                    $adapter = $sm->get("Zend\Db\Adapter\Adapter");

                    $resultSetPrototype = new HydratingResultSet();
                    $resultSetPrototype->setHydrator(new ObjectProperty());
                    $resultSetPrototype->setObjectPrototype(new \Adminuser\Model\Entity\User());
                    
                    return $tableGateway = new TableGateway("users",$adapter,null,$resultSetPrototype);
                },
                "Database\Model\User" => function($sm){
                    $tableGateway = $sm->get("UserTableGateway");
                    return  new \Adminuser\Model\UserTable($tableGateway);
                },
                "GroupTableGateway" => function($sm){
                    $adapter = $sm->get("Zend\Db\Adapter\Adapter");

                    $resultSetPrototype  = new HydratingResultSet();
                    $resultSetPrototype->setHydrator(new ObjectProperty());
                    $resultSetPrototype->setObjectPrototype(new \Adminuser\Model\Entity\Group());
                    
                    return $tableGateway = new TableGateway("groups",$adapter,null,$resultSetPrototype);
                },
                "Database\Model\Group" => function($sm){
                    $tableGateway = $sm->get("GroupTableGateway");
                    return  new \Adminuser\Model\GroupTable($tableGateway);
                },
                "CityTableGateway" => function($sm){
                    $adapter = $sm->get("Zend\Db\Adapter\Adapter");

                    $resultSetPrototype  = new HydratingResultSet();
                    $resultSetPrototype->setHydrator(new ObjectProperty());
                    $resultSetPrototype->setObjectPrototype(new \Adminuser\Model\Entity\City());
                    
                    return $tableGateway = new TableGateway("cities",$adapter,null,$resultSetPrototype);
                },
                "Database\Model\City" => function($sm){
                    $tableGateway = $sm->get("CityTableGateway");
                    return  new \Adminuser\Model\CityTable($tableGateway);
                },
                "DistrictTableGateway" => function($sm){
                    $adapter = $sm->get("Zend\Db\Adapter\Adapter");

                    $resultSetPrototype  = new HydratingResultSet();
                    $resultSetPrototype->setHydrator(new ObjectProperty());
                    $resultSetPrototype->setObjectPrototype(new \Adminuser\Model\Entity\District());
                    
                    return $tableGateway = new TableGateway("districts",$adapter,null,$resultSetPrototype);
                },
                "Database\Model\District" => function($sm){
                    $tableGateway = $sm->get("DistrictTableGateway");
                    return  new \Adminuser\Model\DistrictTable($tableGateway);
                },
                "WardTableGateway" => function($sm){
                    $adapter = $sm->get("Zend\Db\Adapter\Adapter");

                    $resultSetPrototype  = new HydratingResultSet();
                    $resultSetPrototype->setHydrator(new ObjectProperty());
                    $resultSetPrototype->setObjectPrototype(new \Adminuser\Model\Entity\Ward());
                    
                    return $tableGateway = new TableGateway("wards",$adapter,null,$resultSetPrototype);
                },
                "Database\Model\Ward" => function($sm){
                    $tableGateway = $sm->get("WardTableGateway");
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
                    $form      = new \Adminuser\Form\FormUser();
                    $form->setInputFilter(new \Adminuser\Form\FormUserFilter());
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
      
    
}
?>