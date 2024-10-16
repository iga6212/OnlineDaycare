<?php
App::uses( 'BlowfishPasswordHasher', 'Controller/Component/Auth');
App::uses( 'SimplePasswordHasher', 'Controller/Component/Auth' );

class User extends AppModel {
	
	public $useTable = 'users';
	
	public function beforeSave( $options = array() ){
		if( isset($this->data[$this->alias]['password']) ){
			//$passwordHasher = new BlowfishPasswordHasher();
			/*
			$this->data[$this->alias]['password'] = $passwordHasher->hash(
						$this->data[$this->alias]['password']
					);
			*/
			$passwordHasher = new SimplePasswordHasher();
			$this->data[$this->alias]['password'] =
				$passwordHasher->hash(
						$this->data[$this->alias]['password']
				);
		}
	}
}

?>
