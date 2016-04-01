<?php 
namespace Adminuser\Controller;

use Adminuser\Form\FormUserFilter;
use Zend\Form\FormInterface;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;

class UserController extends AbstractActionController{
	public function indexAction(){
		$table    =  $this->getServiceLocator()->get("UserTable");
	
		$items    =  $table->listItem();	

		return new ViewModel(array(
			"items"           => $items,
		));
	}
                
        //Abc@123456
	public function addAction(){
                        $id   =   $this->params('id');
                        
                        $table    =  $this->getServiceLocator()->get("UserTable");

                        $user = $table->getUserById($id);
                        
                        $form = $this->serviceLocator->get("FormElementManager")->get('formUser');
                        
                        if(empty($user)){
                                $options = [  'task' => 'add' ];
                            
                                $message = 'User đã được thêm thành công !';
                        }else{
                                $options = [ 'task' => 'edit' ];
                                $message = 'User đã được sửa thành công !';
                                $form->setInputFilter(new FormUserFilter(array("id"=>$id )));
                                $form->setUseInputFilterDefaults(false);
                                $form->bind($user);
                                
                        }
                        
                        $options['tableWard']   = $this->getServiceLocator()->get("WardTable");
                        $options['tableCity']      = $this->getServiceLocator()->get("CityTable");
                        $options['tableDistrict']  = $this->getServiceLocator()->get('DistrictTable');
                        
                        

                        if($this->request->isPost()){

                                $post = $this->request->getPost();
                                
                               
                                $post['role_list'] = key_exists('role_list',$post) ? $post['role_list'] : '';

                               

                                $form->setData($post);                                                                

                                if($form->isValid()){

                                        $data       =   $form->getData(\Zend\Form\FormInterface::VALUES_AS_ARRAY);
     
                                        $tableUser =   $this->getServiceLocator()->get("UserTable");

                                        $tableUser->save($data,$options);

                                        $this->flashMessenger()->addMessage($message);

                                        $this->redirect()->toRoute('home');
                                }
                        }

                        return new ViewModel([
                                'form' => $form,
                                'action' => $options['task'],
                                'user'  => $user
                        ]);
	}
        
                public function destroyAction(){
                        $id   =   $this->params('id',false);
                        if($id){
                                $table    =  $this->getServiceLocator()->get("UserTable");
                                
                                if($table->deleteItem($id)){
                                        $message = "Các phần tử đã được xóa";
                                }
                        }
                        $this->flashMessenger()->addMessage($message);
                        
                        return $this->redirect()->toRoute('home');
                }
        


}
?>