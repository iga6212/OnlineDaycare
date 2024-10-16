<?php
	class BbsRess extends AppModel{
		public $useTable = 'bbs_ress_table';
		public $name = 'BbsRess';

		public $belongsTo = array(
			'User' => array(
				'className' => 'User',
				'foreignKey' => 'user_id'
			)
		);
	}
?>
