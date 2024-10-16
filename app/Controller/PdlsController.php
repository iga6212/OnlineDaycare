<?php
App::uses( 'SimplePasswordHasher', 'Controller/Component/Auth' );


	class PdlsController extends AppController
	{
		private static $ajaxdata;	// ajaxで受け取ったデータを格納する変数
		
		public $uses = array( 'User' );
		
		public $components = array(
				'Session',
				'Auth' => array(
						//'authenticate' => array( 'Blowfish' ),
						'loginRedirect' => array( 'controller' => 'Pdls', 'action' => 'index' ),
						'logoutRedirect' => array( 'controller' => 'Pdls', 'action' => 'login' ),
						'loginAction' => array( 'controller' => 'Pdls', 'action' => 'login' )
				)
		);
		
		function beforeFilter(){
			parent::beforeFilter();

			$this->response->header('Access-Control-Allow-Origin','*');
			$this->response->header('Access-Control-Allow-Methods','*');
			$this->response->header('Access-Control-Allow-Headers','X-Requested-With');
			$this->response->header('Access-Control-Allow-Headers','Content-Type, x-xsrf-token');
			$this->response->header('Access-Control-Max-Age','172800');
			
			
			//$this->Auth->allow( 'login', 'logout', 'adduser' );
			$this->Auth->allow(
					'login',
					'logout',
					'postdata',
					'ajaxtest',
					'post'
				);
			
			$this->Auth->authenticate = array(
					'Form' => array(
							'userModel' => 'User',
							'fields' => array( 'username' => 'username', 'password' => 'password')
					)
			);
			
		}
		
		public function index(){
			$this->ajaxdata = array( 'data' => 123 );
			debug( 123 );
			debug( $this->ajaxdata );
			$this->render( 'index' );
		}
		
		public function login(){
			$this->autoLayout = false;
			
			if( $this->request->is('post') ){
				if( $this->Auth->login() ){
					//return $this->redirect( $this->Auth->redirect() );
					$this->redirect( 'index' );
					//debug( 'ログインできました' );
				}
				else{
					$this->redirect( 'login' );
					//debug( $this->request->data );
					//debug( 'ログインできませんでした' );
				}
			}
			else{
				$this->render( 'login' );
				//debug( AuthComponent::password('geust') );
				//$passwordHasher = new SimplePasswordHasher();
				//debug( $passwordHasher->hash( 'guest' ) );
			}			
			
		}
		
		public function logout(){
			$this->Auth->logout();
		}
		
		public function adduser(){
			$this->autoLayout = false;
			
			if( $this->request->is( 'post' ) ){
				$this->User->create();
				$this->User->save( $this->request->data );
				$this->redirect( 'adduser' );
			}else{
				$this->render('adduser');
			}
		}
		
		// Ajax通信を行ってデータを受け取るアクション
		public function postdata(){
			$this->autoRender = false;
			
			// Ajax以外は処理しない
			if( $this->request->is( 'ajax' ) ){
				$this->ajaxdata = $this->request->data;
				$this->ajaxdata = 123;
				
				//return $this->request->data['name'];
				return "postdata";
			}
		}
		
		public function ajaxtest(){
			$this->autoRender = FALSE;
			
			if( $this->request->is( 'ajax' ) ){
				//echo 'ajaxtest';
				return json_encode( array( 'name' => 'test' ) );	
			}
			
		}
		
		public function post(){
			$this->autoRender = false;
			
			if( $this->request->is('post') ){
				echo $this->data['v1'];
			}
		}
		
	}
	
?>