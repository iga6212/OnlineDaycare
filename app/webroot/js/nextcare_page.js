
// 頓服薬の管理ページを表示する
function ShowPotionManagement(){

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


	// 送るメッセージを作成
	var senddata = [];

	// 描画データを要求するイベントデータ
	senddata.push({
		'datetime': GetDateTime(),
		'userid': logindataobj.id,
		'eventid': 'RenderPotionManagement'.hashCode(),
		'data': 'no data.'
	});

	// #main-containts 内部を書き換える
	$.ajax({
		'type': 'POST',
		'url': '/green/farbe/PostGetMessages',		// メッセージ処理
		'async': false,
		'data': { 'eventdata': JSON.stringify( senddata ) },
		'success': function( eventdata ){
			
			eventdata = $.parseJSON( eventdata );
			for( var i in eventdata ){
				var event = eventdata[i];
				// 最初にRenderPotionManagementが処理されないと中身が変更できない
				if( event.eventid == 'RenderedPotionManagement'.hashCode() ){
					
					// 一番最初にレンダリングデータを適用すること
					$('#main-containts').html( event.data );

					// サーバーのデータをロードすること
					LoadPotion();
				}

			}
		},
		'error': function(){ alert( 'ajax-error' ); }
	});
};

// 頓服薬を追加ボタンが押された時
function AddPotion(){

	// <p> のインデックスを取得
	var count = 0;
	$('#potion-lines p').each( function( i, elem ){ ++count; } );

	// 要素を追加
	$('#potion-lines').append(
		'<p id="potion-line-' + (count+1) + '">' +
		'<input type="text" id="potion-name-' + (count+1) + '">' +
		'<input type="text" id="potion-stock-' + (count+1) + '">' +
		'<input type="button" value="この頓服をのむ" onclick="DrinkPotion(' + (count+1) + ');">' +
		'<input type="button" value="削除する" onclick="DeletePotion(' + (count+1) + ');">' +
		'</p>'
	);

};

// 頓服を削除する関数
function DeletePotion( num ){

	$('#potion-line-' + num).remove();
	SavePotion();
	ShowPotionManagement();

};

// 頓服薬を服薬するボタン用関数
function DrinkPotion( num ){

	var stock = $('#potion-stock-' + num ).val();
	if( stock == 0 ){
		alert( '薬が残っていません' );
	}
	else{
		-- stock;	// 飲むのでデクリメント
		$('#potion-stock-' + num ).val( stock );	// 値をセット
		SavePotion();	// 全ての値をサーバーへセーブ

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

		// 送るメッセージを作成
		var senddata = [];

		// 頓服を飲んだことを知らせるイベントデータ
		senddata.push({
			'datetime': GetDateTime(),
			'userid': logindataobj.id,
			'eventid': 'DrinkPotion'.hashCode(),
			'data': $('#potion-name-' + num).val()
		});

		$.ajax({
			'type': 'POST',
			'url': '/green/farbe/PostGetMessages',
			'async': false,
			'data': { 'eventdata': JSON.stringify( senddata ) },
			'success': function( eventdata ){
				eventdata = $.parseJSON( eventdata );
				// サーバーから返ってくるメッセージは無い
				for( var i in eventdata ){
					var event = eventdata[i];
				}
			},
			'error': function(){ alert( 'ajax-error' ); }
		});

	} // else{

};

// 頓服薬データを保存する関数
function SavePotion(){

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

	// 送るメッセージを作成
	var senddata = [];

	// イベントデータ用にデータを整形
	var savedata = [];
	$('#potion-lines input[type="text"]:enabled').each( function( i, elem ){
		// 一次元配列にプッシュ
		savedata.push( $(elem).val() );
	});

	// 頓服薬データを保存するイベントを作成
	senddata.push({
		'datetime': GetDateTime(),
		'userid': logindataobj.id,
		'eventid': 'SavePotionData'.hashCode(),
		'data': savedata
	});

	// メッセージ処理URLにアクセス
	$.ajax({
		'type': 'POST',
		//'url': '/green/farbe/mail_notice_setting_page',
		'url': '/green/farbe/PostGetMessages',		// メッセージ処理
		'async': false,
		'data': { 'eventdata': JSON.stringify( senddata ) },
		'success': function( eventdata ){
			alert( '保存しました' );

			eventdata = $.parseJSON( eventdata );
			for( var i in eventdata ){
			}
		},
		'error': function(){ alert( 'ajax-error' ); }
	});

};

// 頓服薬データをロードし画面に反映する関数
function LoadPotion(){

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

	// 送るメッセージを作成
	var senddata = [];

	// 頓服薬データをロードするイベントを作成
	senddata.push({
		'datetime': GetDateTime(),
		'userid': logindataobj.id,
		'eventid': 'LoadPotionData'.hashCode(),
		'data': 'no data.'
	});

	// メッセージ処理URLにアクセス
	$.ajax({
		'type': 'POST',
		'url': '/green/farbe/PostGetMessages',		// メッセージ処理
		'async': false,
		'data': { 'eventdata': JSON.stringify( senddata ) },
		'success': function( eventdata ){
			eventdata = $.parseJSON( eventdata );
			for( var i in eventdata ){
				var event = eventdata[i];
				// サーバーからのデータを処理する
				if( event.eventid == 'SendPotionData'.hashCode() ){
					var lines = event.data.length / 2;

					for( var i=1; lines>=i; ++i ){
						AddPotion();
					}

					$('#potion-lines input[type="text"]:enabled').each( function( i, elem ){
						$(elem).val( event.data[i] );
					});
				}
			}
		},
		'error': function(){ alert( 'ajax-error' ); }
	});
};

