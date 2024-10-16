
// 記事を投稿する関数
function PostBlogData(){

	// check_loginアクションにアクセスして、
	// ログイン情報を取得する
	var logindataobj = {};
	$.ajax({
		'type': 'GET',
		'url': '/green/Farbe/check_login',
		'async': false,
		//'data': { 'search_word': 'testword' },
		'success': function( retdata ){
			logindataobj = $.parseJSON( retdata );
		},
		'error': function(){ alert('ajax-error'); }
	});
	// username変数が存在していたら、ログインしてるとみなす
	if( logindataobj == null ){
		// null ならログインページへ移動
		window.location.href = '/green/Farbe/login';
		return;
	}

	// PostBlogDataアクションへ接続して記事を書く
	var postdata = {
		'id': logindataobj.id,
		'text': $('#blog_text').val()
	};
	
	$.ajax({
		'type': 'POST',
		'url': '/green/Farbe/PostBlogData',
		'data': postdata,
		'success': function( retdata ){},
		'error': function(){ alert('ajax-error'); }
	});
	

	// header.jsのblogボタン用関数を実行して更新
	click_blog_button();
};

function ModifyBlog( id ){

	$.ajax({
		'type': 'POST',
		'url': '/green/Farbe/ModifyBlog',
		'data': { 'modify_id': id },
		'success': function( retdata ){
			$('#main-containts').html( retdata );
		},
		'error': function(){ alert( 'ajax-error' ); }
	});
};

// 修正した日記データをポストする関数
function PostModifyBlog( id ){
	var postdata = {
		'modify_id': id,
		'text': $('#blog_text').val()
	};	

	$.ajax({
		'type': 'POST',
		//'url': '/green/Farbe/ModifyBlog',
		'url': '/green/Farbe/UpdateBlog',
		'data': postdata,
		'success': function( retdata ){
			click_blog_button();	// 記事一覧へ移動する
		},
		'error': function(){ alert( 'ajax-error' ); }
	});
}

function DeleteBlog( id ){
	$.ajax({
		'type': 'POST',
		'url': '/green/Farbe/DeleteBlog',
		'data': { 'delete_id': id },
		'success': function( retdata ){},
		'error': function(){ alert( 'ajax-error' ); }
	});


	// header.jsのblogボタン用関数を実行して更新
	click_blog_button();
}

// コメントするボタンをクリックした後に、
// 入力ボックスとボタンを挿入する関数
// blogid: コメント挿入先のBlogID
// userid: コメント挿入される側のユーザーID
function InsertCommentBox( blogid, userid ){
	//alert( id );
	var idstr = '#blog_comment_button_' + blogid;
	var replace = '<input type="text" id="comment_text_' + blogid + '">';
	replace += '<input type="button" value="コメントする" onclick="PostComment(' +blogid+ ',' +userid+ ');">';
	$( idstr ).html( replace );

	$( idstr ).removeAttr( 'onclick' );
};

// コメントをPOSTする関数
function PostComment( blogid, userid ){
	var comment = $( '#comment_text_' + blogid ).val();
	
	$.ajax({
		'type': 'POST',
		'url': '/green/Farbe/PostBlogComment',
		'data': { 'blog_id': blogid, 'comment': comment },
		'success': function( retdata ){},
		'error': function(){ alert( 'ajax-error' ); }
	});

	ViewBlog( userid );
};
