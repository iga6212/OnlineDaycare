<?php
	class BlogComment extends AppModel{
		public $useTable = 'blog_comment_table';
		public $name = 'BlogComment';

		public $belongsTo = array(
			'User' => array(
				'className' => 'User',
				'foreignKey' => 'user_id'
			)
		);
	}
?>
