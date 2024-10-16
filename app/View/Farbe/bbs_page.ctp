<p>掲示板ページ</p>

<div class="bbs_create_button_style1" onclick="CreateBbsThread();">スレッドを作る</div>

<p>スレッド一覧</p>
<?php
	foreach( $bbsdata as $thread ){
		echo( '<div class="thread_style1" onclick="ViewThread(' .
			$thread['BbsThread']['id'] . ');">' .
			$thread['BbsThread']['thread_name'] .
			'</div>'
		);
	}
	//debug( $bbsdata );

?>
