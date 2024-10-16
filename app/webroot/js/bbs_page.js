
// スレッドを作るページを表示する関数
function CreateBbsThread(){

	$.ajax({
		'type': 'GET',
		'url': '/green/Farbe/create_thread',
		'async': false,
		'success': function( retdata ){
			$('#main-containts').html( retdata );
		},
		'error': function(){ alert( 'ajax-error' ); }
	});
			
};

// スレッドを作る関数
function PostCreateThread(){

	$.ajax({
		'type': 'POST',
		'url': '/green/Farbe/create_thread',
		'data': { 'thread_name': $('#thread_title').val() },
		'async': false,
		'success': function( retdata ){},
		'error': function(){ alert( 'ajax-error' ); }
	});

	click_bbs_button();
};

// スレッドの中身を表示する関数
function ViewThread( thread_id ){

	$.ajax({
		'type': 'POST',
		'url': '/green/Farbe/ViewThread',
		'data': { 'thread_id': thread_id },
		'async': false,
		'success': function( retdata ){
			$('#main-containts').html( retdata );
		},
		'error': function(){ alert( 'ajax-error' ); }
	});
};

// レスを投稿する関数
function PostRess( thread_id ){

	$.ajax({
		'type': 'POST',
		'url': '/green/Farbe/PostRess',
		'data': {
			'thread_id': thread_id,
			'resstext': $('#resstext').val()
		},
		'async': false,
		'success': function( retdata ){},
		'error': function(){ alert( 'ajax-error' ); }
	});

	// スレッドの中身を表示する
	ViewThread( thread_id );
};
