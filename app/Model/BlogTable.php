<?php
	class BlogTable extends AppModel {
		public $useTable = 'blog_table';
		public $name = 'BlogTable';

		public $belongsTo = array(
			'User' => array(
				'className' => 'User',
				'foreignKey' => 'user_id'
			)
		);

		public $hasMany = array(
			'BlogComment' => array(
				'className' => 'BlogComment',
				'foreignKey' => 'blog_id'
			)
		);
	}
?>
