
<div class="left-wrapper1">
<div class="space1"></div>
<div class="logostyle1"><img src="/green/img/farbe-logo1.png" onclick="click_farbe_logo();"></div>
<div class="prealpha-style1 basic-font1">pre-alpha</div>
</div>

<div class="top-center-space1 basic-font1">
	<!-- 精神障がい者のための<br>コミュニティサイト(ファルベ) -->
	テストで作っているコミュニティサイト
</div>
<div class="logindata-style1 basic-font1">
<!-- ログイン情報 -->
<?php
	if( is_null( $logindata ) == true ){
		echo( '<a href="/green/Farbe/login">ログイン</a>' );
	}else{
		echo( '<a href="/green/Farbe/logout">ログアウト</a>' );
		echo( '<img src="' . $logindata['pic_path'] . '" class="profile_img_size2">' );
		echo( $logindata['nickname'] . 'さん' );
		echo( '<div class="profile_button_style1" onclick="ViewProfile(' .
				$logindata['id'] . ');">プロフィール</div>' );
	}
	
	//debug( $logindata );
?>
</div>

<div class="clear-left1"></div>

<div id="search-button" class="button-box-style1 basic-font1" onclick="click_search_button();">検索</div>
<div id="blog-button" class="button-box-style1 basic-font1" onclick="click_blog_button();">日記・Blog</div>
<div id="bbs-button" class="button-box-style1 basic-font1" onclick="click_bbs_button();">掲示板</div>
<div id="netcare-button" class="button-box-style1 basic-font1" onclick="click_netcare_button();">ネットケア</div>
<div id="nextcare-button" class="button-box-style1 basic-font1" onclick="click_nextcare_button();">ネクストケア</div>
<div id="favorite-button" class="button-box-style1 basic-font1" onclick="click_favorite_button();">お気に入り</div>
<div id="setting-button" class="button-box-style1 basic-font1" onclick="click_setting_button();">設定</div>

<div class="clear-left1"></div>
