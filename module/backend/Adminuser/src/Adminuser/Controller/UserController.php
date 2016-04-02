<?php 
namespace Adminuser\Controller;

use Adminuser\Form\FormUser2;
use Adminuser\Form\FormUserFilter2;
use My\Controller\MyController;
use Zend\Form\FormInterface;
use Zend\View\Model\ViewModel;

class UserController extends MyController{
	public function indexAction(){
		$table    =  $this->getServiceLocator()->get("UserTable");
	
		$items    =  $table->listItem();	

		return new ViewModel(array(
			"items"           => $items,
		));
	}
                
        //Abc@123456
	public function addAction(){
                        $id         =   $this->params('id');
                        
                        $table    =  $this->getServiceLocator()->get("UserTable");

                        $user     = $table->getUserById($id);
                        
                        
                        $form     = $this->serviceLocator->get("FormElementManager")->get('formUser');
                        
                        if(empty($user)){
                                $options = [  'task' => 'add' ];
                            
                                $message = 'User đã được thêm thành công !';
                        }else{
                                $options = [ 'task' => 'edit' ];
                                $message = 'User đã được sửa thành công !';
                                
                                $nameInput = array();
                                                 
                                foreach($form->getElements() as $key => $val){
                                        $nameInput[$key] = $key;
                                }
                                
                                $result = array_diff_key($nameInput,$user->getArrayCopy());
                           
                                if(count($result) > 1){
                                   
                                        $tableGroup = $this->getServiceLocator()->get('GroupTable');
                    
                                        $form   =  new FormUser2($tableGroup,$user->getArrayCopy()); 
                                        $form->setInputFilter(new FormUserFilter2(array("id"=>$id )));
                                        $form->setUseInputFilterDefaults(false);
                                        
                                }else{
                                        $form->bind($user);
                                }
                                
                                
                        }
                        
                        $options['tableWard']   = $this->getServiceLocator()->get("WardTable");
                        $options['tableCity']      = $this->getServiceLocator()->get("CityTable");
                        $options['tableDistrict']  = $this->getServiceLocator()->get('DistrictTable');
                        
                        

                        if($this->request->isPost()){

                                $post = $this->request->getPost();
                                
                               
                                $post['role_list'] = key_exists('role_list',$post) ? $post['role_list'] : '';

                               

                                $form->setData($post);                                                                

                                if($form->isValid()){

                                        $data       =   $form->getData(FormInterface::VALUES_AS_ARRAY);
                                        
                                        $tableUser =   $this->getServiceLocator()->get("UserTable");

                                        $tableUser->save($data,$options);

                                        $this->flashMessenger()->addMessage($message);

                                        $this->redirect()->toRoute('home');
                                }
                        }

                        $viewModel =  new ViewModel();
                        
                        $viewModel->setVariables([
                                'form' => $form,
                                'action' => $options['task'],
                                'user'  => $user
                        ]);
                        
//                        $viewModel->setTemplate("adminuser/user/add2.phtml");
                        
                        return $viewModel;
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