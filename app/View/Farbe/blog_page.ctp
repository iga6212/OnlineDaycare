
<p>日記・Blogページ</p>

<p><textarea id="blog_text" rows="4" cols="40">投稿する記事をここに書く。</textarea></p>
<p><input type="button" value="投稿" onclick="PostBlogData();"></p>
<p>投稿された記事一覧</p>
<?php
//debug( $BlogData )

	foreach( $BlogData as $data ){
		echo( '<div class="blog_wrapper1">' );
		echo( '<div class="blog_time_style1">投稿日時：' .
			$data['BlogTable']['modified'] .
			'<div class="blog_midify" onclick="ModifyBlog(' .
			$data['BlogTable']['id'] .');">編集</div>' .
			'<div class="blog_delete" onclick="DeleteBlog(' .
			$data['BlogTable']['id'] .');">削除</div>' .
			'</div>' );
		echo( '<div class="blog_data_style1">' .
			$data['BlogTable']['text'] .
			'</div>' );
		echo( '<div class="comment_data_style1" id="blog_comment_' .
			$data['BlogTable']['id'] .
			'">' .
			'コメント欄：' );

		foreach( $data['BlogComment'] as $comment ){
			echo( '<div class="comment_data_style1">' .
				'<img src="' . $comment['User']['pic_path'] . '" class="profile_img_size3">' .
				'<div onclick="ViewProfile(' .
				$comment['User']['id'] .
				');" class="clickable">' .
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
		echo( '</div>' );	// blog_wrapper1
	}


?>
