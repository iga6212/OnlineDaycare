
<?php
	echo( '<h1>Event Data Viewer</h1>' );
	echo( '<table border="1">' );

	echo( '<tr>' );
	echo( '<td>id</td><td>datetime</td><td>user_id</td><td>event_id</td><td>json_data</td><td>Nickname</td><td>EventName</td>' );
	echo( '</tr>' );

foreach( $eventdata as $event ){
	echo( '<tr>' );

	echo( '<td>' . $event['EventData']['id'] . '</td>' );
	echo( '<td>' . $event['EventData']['datetime'] . '</td>' );
	echo( '<td>' . $event['EventData']['user_id'] . '</td>' );
	echo( '<td>' . $event['EventData']['event_id'] . '</td>' );
	echo( '<td>' . $event['EventData']['json_data'] . '</td>' );
	echo( '<td>' . $event['Nickname']['nickname'] . '</td>' );

	foreach( $events as $key => $value ){
		if( $event['EventData']['event_id'] == $value ){
			echo( '<td>' . $key . '</td>' );
			break;
		}
	}

	echo( '</tr>' );
}

	echo( '</table>' );
?>
