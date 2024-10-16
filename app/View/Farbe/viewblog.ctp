<?php
	echo( '<p>' . $BlogData['0']['User']['nickname'] . 'さんの日記・Blog</p>' );

	foreach( $BlogData as $data ){
		echo( '<div class="blog_wrapper1">' );
		echo( '<div class="blog_time_style1">投稿日時：' .
			$data['BlogTable']['modified'] .
			'</div>' );	
		echo( '<div class="blog_data_style1">' . 
			$data['BlogTable']['text'] .
			'</div>' );
		echo( '<div class="comment_data_style1" id="blog_comment_' . $data['BlogTable']['id'] . '">' .
			'コメント欄：' );

		foreach( $data['BlogComment'] as $comment ){
			echo( '<div class="comment_data_style1">' .
				'<img src="' . $comment['User']['pic_path'] . '" class="profile_img_size3">' .
				'<div class="clickable" onclick="ViewProfile(' .
				$comment['User']['id'] .
				');">' .
				$comment['User']['nickname'] .
				'さん：' .
				'</div>' .
				$comment['comment'] .
				'</div>'
			);
		}

		echo( '<div class="comment_button_style1" id="blog_comment_button_' .
			$data['BlogTable']['id'] .
			'" onclick="InsertCommentBox(' .
			$data['BlogTable']['id'] .
			',' .
			$data['BlogTable']['user_id'] .
			');">コメントする</div>' ); 
	
		echo( '</div>' );
		echo( '</div>' );
	}

	//debug( $BlogData );
?>
