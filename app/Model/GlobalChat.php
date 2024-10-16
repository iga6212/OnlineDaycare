<?php

	class GlobalChat extends AppModel{
		public $useTable = 'global_chat_table';
		public $name = 'GlobalChat';
		
		public $belongsTo = array(
				'Nickname' => array(
						'className' => 'Nickname',
						'foreignKey' => 'nickname_id'
						)
				);
	}
	
?>