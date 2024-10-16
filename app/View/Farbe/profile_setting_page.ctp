<p>プロフィール設定ページ</p>


<?php
	debug( $userdata );

	echo( '<p>UserName(ID)：' . $userdata['username'] . '</p>' );

	echo( '<form action="/green/farbe/profile_setting_page" enctype="multipart/form-data" method="post">' );
	echo( '<p>プロフィール画像：<img src="' .  $userdata['pic_path'] . '" class="profile_img_size1">' );
	echo( '<input type="file" value="" name="picture"></p>' );
	echo( '<p>Nickname：<input type="text" id="nickname" name="nickname"></p>' );
	echo( '<p>自己紹介：<input type="text" id="introduction" name="introduction"></p>' );
	echo( '<p><input type="submit" value="変更"></p>' );
	echo( '</form>' );
/*
	echo( '<p>Nickname：<input type="text" id="nickname"></p>' );
	echo( '<p>自己紹介：<input type="text" id="introduction"></p>' );

	echo( '<p><input type="button" value="変更" onclick="ModifyUserProfile();"></p>' );
*/

?>
