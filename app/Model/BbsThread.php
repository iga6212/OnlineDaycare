<?php
	class BbsThread extends AppModel{
		public $useTable = 'bbs_thread_table';
		public $name = 'BbsThread';

		public $hasMany = array(
			'BbsRess' => array(
				'className' => 'BbsRess',
				'foreignKey' => 'thread_id'
			)
		);
	}
?>
