
<?php
	echo( '<p>' . $threaddata['0']['BbsThread']['thread_name'] . '</p>' );

	foreach( $threaddata['0']['BbsRess'] as $ress ){
		echo( '<div class="thread_data_style1">レス番：' . $ress['ress_num'] . '<BR>' );
		echo( '<div class="clickable" onclick="ViewProfile(' . $ress['User']['id'] . ');">' );
		echo( '<img src="' . $ress['User']['pic_path'] . '" class="profile_img_size3">' );
		echo( $ress['User']['nickname'] . 'さん<BR>' );
		echo( '</div>' );
		echo( $ress['ress'] );
		echo( '</div>' );
	}

	//debug( $threaddata );

	
?>

<textarea name="resstext" rows="4" cols="40" id="resstext"></textarea>
<?php
	echo( '<p><input type="button" value="投稿する" onclick="PostRess(' .
		$threaddata['0']['BbsThread']['id'] .
		');"></p>'
	);
?>
