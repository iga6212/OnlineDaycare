<?php
	echo( '<p>' . $logindata['nickname']  . 'さんのプロフィール</p>' );
	//echo( '<p>UserName(ID)：' . $logindata['username'] . '</p>' );
	echo( '<p>プロフィール画像：<img src="' . $logindata['pic_path'] . '" class="profile_img_size1"></p>' );
	echo( '<p>Nickname：' . $logindata['nickname'] . '</p>' );
	echo( '<p>自己紹介：' . $logindata['introduction'] . '</p>' );

	//debug( $logindata );
?>

