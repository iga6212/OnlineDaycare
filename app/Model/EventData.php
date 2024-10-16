<?php

	class EventData extends AppModel{
		public $useTable = 'event_data_table';
		public $name = 'EventData';
		
		public $belongsTo = array(
			// 'Nickname' => array(
			// 		'className' => 'Nickname',
			// 		'foreignKey' => 'user_id'
			// 		),
			'User' =>  array(
					'className' => 'User',
					'foreignKey' => 'user_id'
					)
			);
	}
	
?>
