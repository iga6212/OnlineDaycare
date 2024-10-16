<?php
	
	class PlayersPosition extends AppModel{
		public $useTable = 'players_position_table';
		public $name = 'PlayersPosition';
		
		public $belongsTo = array(
				'Nickname' => array(
						'className' => 'Nickname',
						'foreignKey' => 'player_id'
				)
		);
	}
	
?>