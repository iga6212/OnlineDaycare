
// setting_page.js

// プロフィール設定ボタンをクリックしたときに実行する関数
function click_profile_setting(){
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

	$.ajax({
		'type': 'GET',
		'url': '/green/Farbe/profile_setting_page',
		'async': false,
		'success': function( retdata ){
			$('#main-containts').html( retdata );

			// HTML読み込み後に
			// 入力ボックスの値を書き換える
			$('#nickname').val( logindataobj.nickname );
			$('#introduction').val( logindataobj.introduction );
		},
		'error': function(){ alert( 'ajax-error' ); }
	});

};

// プロフィール設定ページの変更ボタンを押した時に実行する関数
function ModifyUserProfile(){

	// 入力ボックスの値を読み取り、プロフィールを変更する
	$.ajax({
		'type': 'POST',
		'url': '/green/Farbe/profile_setting_page',
		'data': {
			'nickname': $('#nickname').val(),
			'introduction': $('#introduction').val()
		},
		'async': false,
		'success': function( retdata ){},
		'error': function(){ alert( 'ajax-error' ); }
	});

	// もう一度プロフィール変更ページを表示する
	//click_profile_setting();
	// 再ログインしないと、値が変わらないのでメッセージを表示
	alert( '変更を適用するため、再ログインしてください。' );

	// ログアウトする
	location.href = '/green/farbe/logout';
	// ログイン画面を表示する
	location.href = '/green/farbe/login';
};

// メール通知設定ボタンをクリックしたら
function click_mail_notice_setting(){
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

	// 描画データ(HTML)を要求するイベントデータ
	senddata.push({
		'datetime': GetDateTime(),
		'userid': logindataobj.id,
		'eventid': 'RenderMailNoticeSetting'.hashCode(),
		'data': 'no data.'	
	});

	// 設定項目のデータを要求するイベントデータ
	senddata.push({
		'datetime': GetDateTime(),
		'userid': parseInt( logindataobj.id ),
		'eventid': 'LoadMailSetting'.hashCode(),
		'data': 'no data.'
	});

	// mail_notice_setting_page を表示
	$.ajax({
		'type': 'POST',
		//'url': '/green/farbe/mail_notice_setting_page',
		'url': '/green/farbe/PostGetMessages',		// メッセージ処理
		'async': false,
		'data': { 'eventdata': JSON.stringify( senddata ) },
		'success': function( eventdata ){

			eventdata = $.parseJSON( eventdata );
			for( var i in eventdata ){
				var event = eventdata[i];
				// 最初にRenderedMailNoticeSettingが処理されないと中身が変更できない
				if( event.eventid == 'RenderedMailNoticeSetting'.hashCode() ){
					// 一番最初にレンダリングすること
					$('#main-containts').html( event.data );
				}
				// 設定項目を反映させる
				if( event.eventid == 'ReturnLoadMailSetting'.hashCode() ){
					// 送信先メールアドレス
					$('#notice_mailaddress').val( event.data.notice_mailaddress );
					// おはようメールの有無
					$('#morning').prop('checked', event.data.morning );
					// おはようメールの送信時刻
					$('#morning_hour').val( event.data.morning_hour );
					// おやすみメールの有無
					$('#goodnight').prop('checked', event.data.goodnight );
					// おやすみメールの送信時刻
					$('#goodnight_hour').val( event.data.goodnight_hour );
					// 朝のおくすりメールの有無
					$('#morning_drug').prop('checked', event.data.morning_drug );
					// 朝のおくすりメールの送信時刻
					$('#morning_drug_mail_hour').val( event.data.morning_drug_mail_hour );
					// 昼のおくすりメールの有無
					$('#afternoon_drug').prop('checked', event.data.afternoon_drug );
					// 昼のおくすりメールの送信時刻
					$('#afternoon_drug_mail_hour').val( event.data.afternoon_drug_mail_hour );
					// 夕のおくすりメールの有無
					$('#evening_drug').prop('checked', event.data.evening_drug );
					// 夕のおくすりめーるの送信時刻
					$('#evening_drug_mail_hour').val( event.data.evening_drug_mail_hour );
					// 眠前のおくすりメールの有無
					$('#goodnight_drug').prop('checked', event.data.goodnight_drug );
					// 眠前のおくすりメールの送信時刻
					$('#goodnight_drug_mail_hour').val( event.data.goodnight_drug_mail_hour );
				}
			}
		},
		'error': function(){ alert( 'ajax-error' ); }
	});

};

// 設定のメール送信設定の設定変更ボタンが押されたら
function ChangeMailSetting(){

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

	// メール設定変数を作成
	var mailsetting = {};
	mailsetting['notice_mailaddress'] = $('#notice_mailaddress').val();	// 送信先メールアドレス
	mailsetting['morning'] = $('#morning').is(':checked');			// おはようメールの有無
	mailsetting['morning_hour'] = $('#morning_hour').val();			// おはようメールの送信時刻
	mailsetting['goodnight'] = $('#goodnight').is(':checked');		// おやすみメールの有無
	mailsetting['goodnight_hour'] = $('#goodnight_hour').val();		// おやすみメールの送信時刻
	mailsetting['morning_drug'] = $('#morning_drug').is(':checked');	// 朝のおくすりメールの有無
	mailsetting['morning_drug_mail_hour'] = $('#morning_drug_mail_hour').val();	// 朝のおくすりメールの送信時刻
	mailsetting['afternoon_drug'] = $('#afternoon_drug').is(':checked');		// 昼のおくすりメールの有無
	mailsetting['afternoon_drug_mail_hour'] = $('#afternoon_drug_mail_hour').val();	// 昼のおくすりメールの送信時刻
	mailsetting['evening_drug'] = $('#evening_drug').is(':checked');		// 夕のおくすりメールの有無
	mailsetting['evening_drug_mail_hour'] = $('#evening_drug_mail_hour').val();	// 夕のおくすりメールの送信時刻
	mailsetting['goodnight_drug'] = $('#goodnight_drug').is(':checked');		// 眠前のおくすりメールの送信時刻
	mailsetting['goodnight_drug_mail_hour'] = $('#goodnight_drug_mail_hour').val();	// 眠前のおくすりメールの送信時刻

	// 送るメッセージを作成
	var senddata = [];
	senddata.push({
		'datetime': GetDateTime(),
		'userid': parseInt( logindataobj.id ),
		'eventid': 'SaveMailSetting'.hashCode(),
		'data': mailsetting	
	});

	// mail_notice_setting_page を表示
	$.ajax({
		'type': 'POST',
		//'url': '/green/farbe/mail_notice_setting_page',
		'url': '/green/farbe/PostGetMessages',		// メッセージ処理
		'async': false,
		'data': { 'eventdata': JSON.stringify( senddata ) },
		'success': function( eventdata ){

			// eventdata = $.parseJSON( eventdata );
			// for( var i in eventdata ){
			// 	var event = eventdata[i];
			// 	if( event.eventid == 'RenderedMailNoticeSetting'.hashCode() ){
			// 		$('#main-containts').html( event.data );
			// 	}
			// }

			alert( '保存しました' );

		},
		'error': function(){ alert( 'ajax-error' ); }
	});
};
