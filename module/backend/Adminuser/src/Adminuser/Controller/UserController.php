<?php 
namespace Adminuser\Controller;

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

	public function AddAction(){
		$form = $this->serviceLocator->get("FormElementManager")->get('formUser');

		if($this->request->isPost()){
                   
                    $post = $this->request->getPost()->toArray();
                    
                    $post['role_list'] = key_exists('role_list',$post) ? $post['role_list'] : '';
                    unset($post['ok']);
                    
                    echo "<pre>";
                    print_r($post);
                    echo "</pre>";
                    
                    $form->setData($post);
                    
                   
                        
                    if($form->isValid()){
                         echo "<pre>";
                    print_r($form);
                    echo "</pre>";  
                        
                         echo "<pre>";
                        print_r($form->getData());
                        echo "</pre>";exit();
                    }
		}

		return new ViewModel([
			'form' => $form
		]);
	}

}
?>