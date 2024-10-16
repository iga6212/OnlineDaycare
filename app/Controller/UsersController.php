<?php

class UsersController extends AppController{
	
	public $components = array(
			'Session',
			'Auth' => array(
					'allowedActions' => array(
							'login',
							'logout'
					)
			)
	);
	
	public function index(){
		
	}
	
	public function login(){
		//$this->autoLayout = false;
		
		if( $this->request->is( 'post' ) ){
			if( $this->Auth->login() ){
				$this->redirect( 'index' );	
			}else{
				debug( $this->request->data );
			}
					
		}else{
			$this->render( 'login' );
		}
	}
	
	public function logout(){
		$this->Auth->logout();
	}
}

?>