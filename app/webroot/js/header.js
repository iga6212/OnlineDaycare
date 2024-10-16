
jQuery.ajaxSetup({cache: false});

// 読み込み用メソッドを定義
// ここに定義して良いのか？
(function($) {
  $.getScriptsSequencial = function(scripts, callback) {
    var f = function(i) {
      $.getScript(scripts[i], function(){
        if (i+1 < scripts.length) {
          f(i+1);
        } else {
          callback();
        }
      });
    };
    f(0);
  };
})(jQuery);

// 日時を返す関数(別な場所で再定義しているかも)
function GetDateTime(){
	var dateobj = new Date();
	var datetime =
		dateobj.getYear() + "-" + dateobj.getMonth() + "-" +
		dateobj.getDay() + " " + dateobj.getHours() + ":" +
		dateobj.getMinutes() + ":" + dateobj.getSeconds();
	return( datetime );
}

// 描画処理とコールバックを切る処理
function ResetCallbacks(){
	// Three.js が呼び出されていたら描画を終了させる
	window.cancelAnimationFrame(function(){});
	
	// 入力系コールバック
	window.onmousemove = function(ev){};
	window.onmousedown = function(ev){};
	window.onmouseup = function(ev){};

	// setInterval したのを全て解除
	for( var i=1; i<99999; i++ ){
		window.clearInterval(i);
	}
};

function click_search_button( pushstate ){
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

	// ボタンを白くする
	$('#search-button').removeClass('button-box-style1');
	$('#search-button').addClass('button-box-style2');

	// 他のボタンは緑にする
	$('#blog-button').removeClass('button-box-style2');
	$('#blog-button').addClass('button-box-style1');

	$('#bbs-button').removeClass('button-box-style2');
	$('#bbs-button').addClass('button-box-style1');

	$('#netcare-button').removeClass('button-box-style2');
	$('#netcare-button').addClass('button-box-style1');

	$('#nextcare-button').removeClass('button-box-style2');
	$('#nextcare-button').addClass('button-box-style1');

	$('#favorite-button').removeClass('button-box-style2');
	$('#favorite-button').addClass('button-box-style1');

	$('#setting-button').removeClass('button-box-style2');
	$('#setting-button').addClass('button-box-style1');
	
	// #main-containts 内部を検索画面に切り替える
	$.ajax({
		'type': 'GET',
		'url': '/green/Farbe/search_page',
		//'data': { 'search_word': 'testword' },
		'success': function( retdata ){
			$('#main-containts').html( retdata );
		},
		'error': function(){ alert('ajax-error'); }
	});

	// コールバック等をリセット
	ResetCallbacks();

	// pushstate が null なら履歴を残す
	if( pushstate == null ){
		history.pushState( {}, '', '/green/farbe/search' );
	}
};

function click_blog_button( pushstate ){
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

	// ボタンを白くする
	$('#blog-button').removeClass('button-box-style1');
	$('#blog-button').addClass('button-box-style2');

	// 他のボタンは緑にする
	$('#search-button').removeClass('button-box-style2');
	$('#search-button').addClass('button-box-style1');

	$('#bbs-button').removeClass('button-box-style2');
	$('#bbs-button').addClass('button-box-style1');

	$('#netcare-button').removeClass('button-box-style2');
	$('#netcare-button').addClass('button-box-style1');

	$('#nextcare-button').removeClass('button-box-style2');
	$('#nextcare-button').addClass('button-box-style1');

	$('#favorite-button').removeClass('button-box-style2');
	$('#favorite-button').addClass('button-box-style1');

	$('#setting-button').removeClass('button-box-style2');
	$('#setting-button').addClass('button-box-style1');

	// #main-containts 内を日記・Blogページに書き換える
	$.ajax({
		'type': 'GET',
		'url': '/green/Farbe/blog_page',
		//'data': { 'search_word': 'testword' },
		'success': function( retdata ){
			$('#main-containts').html( retdata );
		},
		'error': function(){ alert('ajax-error'); }
	});

	// コールバック等をリセット
	ResetCallbacks();

	// pushstate が null なら履歴を残す
	if( pushstate == null ){
		history.pushState( {}, '', '/green/farbe/blog' );
	}
};

function click_bbs_button( pushstate ){
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

	// ボタンを白くする
	$('#bbs-button').removeClass('button-box-style1');
	$('#bbs-button').addClass('button-box-style2');

	// 他のボタンは緑にする
	$('#search-button').removeClass('button-box-style2');
	$('#search-button').addClass('button-box-style1');

	$('#blog-button').removeClass('button-box-style2');
	$('#blog-button').addClass('button-box-style1');

	$('#netcare-button').removeClass('button-box-style2');
	$('#netcare-button').addClass('button-box-style1');

	$('#nextcare-button').removeClass('button-box-style2');
	$('#nextcare-button').addClass('button-box-style1');

	$('#favorite-button').removeClass('button-box-style2');
	$('#favorite-button').addClass('button-box-style1');

	$('#setting-button').removeClass('button-box-style2');
	$('#setting-button').addClass('button-box-style1');

	// #main-containts 内を掲示板ページに書き換える
	$.ajax({
		'type': 'GET',
		'url': '/green/Farbe/bbs_page',
		//'data': { 'search_word': 'testword' },
		'success': function( retdata ){
			$('#main-containts').html( retdata );
		},
		'error': function(){ alert('ajax-error'); }
	});

	// コールバック等をリセット
	ResetCallbacks();

	// pushstate が null なら履歴を残す
	if( pushstate == null ){
		history.pushState( {}, '', '/green/farbe/bbs' );
	}
};

function click_netcare_button( pushstate ){
	/*** debug
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

	// ボタンを白くする
	$('#netcare-button').removeClass('button-box-style1');
	$('#netcare-button').addClass('button-box-style2');

	// 他のボタンは緑にする
	$('#search-button').removeClass('button-box-style2');
	$('#search-button').addClass('button-box-style1');

	$('#blog-button').removeClass('button-box-style2');
	$('#blog-button').addClass('button-box-style1');

	$('#bbs-button').removeClass('button-box-style2');
	$('#bbs-button').addClass('button-box-style1');

	$('#nextcare-button').removeClass('button-box-style2');
	$('#nextcare-button').addClass('button-box-style1');

	$('#favorite-button').removeClass('button-box-style2');
	$('#favorite-button').addClass('button-box-style1');

	$('#setting-button').removeClass('button-box-style2');
	$('#setting-button').addClass('button-box-style1');

	// #main-containts 内部を書き換える
	$.ajax({
		'type': 'GET',
		'url': '/green/Farbe/netcare_page',
		//'data': { 'search_word': 'testword' },
		'success': function( retdata ){
			//$('#main-containts').html( retdata );
			$('#root-containts').html( retdata );

			// ライブラリファイルをロードする
			var scripts = [
				//'/green/js/library1.js' ,// .hashCode() を使うので index で読み込み
				//
				'/green/js/threejs-dev/build/three.js' ,
				'/green/js/threejs-dev/examples/js/renderers/Projector.js' ,	

				'/green/js/threejs-dev/examples/js/BlendCharacter.js' ,
				'/green/js/threejs-dev/examples/js/loaders/ColladaLoader.js' ,
			
				'/green/js/threejs-dev/examples/js/shaders/CopyShader.js' ,
				'/green/js/threejs-dev/examples/js/shaders/ConvolutionShader.js' ,
				'/green/js/threejs-dev/examples/js/shaders/LuminosityHighPassShader.js' ,
				//'/green/js/threejs-dev/examples/js/shaders/SSAOShader.js',
				'/green/js/threejs-r91/examples/js/shaders/SSAOShader.js',

				'/green/js/threejs-dev/examples/js/postprocessing/EffectComposer.js' ,
				'/green/js/threejs-dev/examples/js/postprocessing/RenderPass.js' ,
				'/green/js/threejs-dev/examples/js/postprocessing/ShaderPass.js' ,
				'/green/js/threejs-dev/examples/js/postprocessing/BloomPass.js' ,
				'/green/js/threejs-dev/examples/js/postprocessing/UnrealBloomPass.js' ,
				//'/green/js/threejs-dev/examples/js/postprocessing/SSAOPass.js',
				'/green/js/threejs-r91/examples/js/postprocessing/SSAOPass.js',

				'/green/js/threejs-dev/examples/js/controls/deviceOrientationControls.js' ,
				'/green/js/threejs-dev/examples/js/effects/StereoEffect.js' ,
				'/green/js/threejs-dev/examples/js/cameras/StereoCamera.js' ,

				'/green/js/ammo.js',

				'/green/js/netcare.js'
			];
			// 順番にスクリプトを読込
			$.getScriptsSequencial( scripts, function(){} );

			// スクリプトをロードする
			//$.getScript( '/green/js/netcare.js', function(){} );
		},
		'error': function(){ alert('ajax-error'); }
	});
	***/

	// ライブラリを非同期読み込み
	/*
	$.getScript( '/green/js/murmurHash3.js', function(){} );
	$.getScript( '/green/js/utf.js', function(){} );
	$.getScript( '/green/js/base64.js', function(){} );
	$.getScript( '/green/js/deflate.js', function(){} );
	$.getScript( '/green/js/inflate.js', function(){} );
	$.getScript( '/green/js/md5.js', function(){} );
	$.getScript( '/green/js/library1.js', function(){} );
	$.getScript( '/green/js/three.js', function(){} );
	$.getScript( '/green/js/ColladaLoader.js', function(){} );
	$.getScript( '/green/js/Projector.js', function(){} );
	*/

	var retdata =
		'<div id=canvas_screen_area">' +
		'<canvas id="main_canvas" style="position: absolute;"></canvas>' +
		'<canvas id="text_canvas" style="position: absolute;"></canvas>' +
		'</div>';
		//'<div id="global_chat_area" style="z-index: 2; position: absolute;>';

	$('#root-containts').html( retdata );

	var scripts = [
		//'/green/js/library1.js' ,// .hashCode() を使うので index で読み込み
		//

		//'/green/js/threejs-dev/build/three.js' ,
		//'/green/js/threejs-dev/examples/js/renderers/Projector.js' ,	
		//'/green/js/threejs-dev/examples/js/BlendCharacter.js' ,
		//'/green/js/threejs-dev/examples/js/loaders/ColladaLoader.js' ,
		//'/green/js/threejs-dev/examples/js/shaders/CopyShader.js' ,

		//'/green/js/threejs-dev/examples/js/shaders/ConvolutionShader.js' ,
		//'/green/js/threejs-dev/examples/js/shaders/LuminosityHighPassShader.js' ,
		//'/green/js/threejs-dev/examples/js/shaders/SSAOShader.js',
		//'/green/js/threejs-r91/examples/js/shaders/SSAOShader.js',
		
		//'/green/js/threejs-dev/examples/js/postprocessing/EffectComposer.js' ,
		//'/green/js/threejs-dev/examples/js/postprocessing/RenderPass.js' ,
		//'/green/js/threejs-dev/examples/js/postprocessing/ShaderPass.js' ,
		//'/green/js/threejs-dev/examples/js/postprocessing/UnrealBloomPass.js' ,
		
		//'/green/js/threejs-dev/examples/js/postprocessing/BloomPass.js' ,
		//'/green/js/threejs-dev/examples/js/postprocessing/SSAOPass.js',
		//'/green/js/threejs-r91/examples/js/postprocessing/SSAOPass.js',

		//'/green/js/threejs-dev/examples/js/controls/deviceOrientationControls.js' ,
		//'/green/js/threejs-dev/examples/js/effects/StereoEffect.js' ,
		//'/green/js/threejs-dev/examples/js/cameras/StereoCamera.js' ,

		'/green/js/gfxlibs/three.js',
		'/green/js/gfxlibs/BlendCharacter.js',
		'/green/js/gfxlibs/ColladaLoader.js',
		'/green/js/gfxlibs/Projector.js',
		'/green/js/gfxlibs/EffectComposer.js',
		'/green/js/gfxlibs/RenderPass.js',
		'/green/js/gfxlibs/ShaderPass.js',
		'/green/js/gfxlibs/CopyShader.js',
		'/green/js/gfxlibs/LuminosityHighPassShader.js' ,
		'/green/js/gfxlibs/UnrealBloomPass.js',

		'/green/js/ammo.js',
		'/green/js/netcare.js'
	];
	// 順番にスクリプトを読込
	$.getScriptsSequencial( scripts, function(){} );

	// スクリプトをロードする
	//$.getScript( '/green/js/netcare.js', function(){} );
	// pushstateがnullなら履歴を残す
	if( pushstate == null ){
		history.pushState( {}, '', '/green/farbe/netcare' );
	}
};

function click_nextcare_button( pushstate ){
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

	// ボタンを白くする
	$('#nextcare-button').removeClass('button-box-style1');
	$('#nextcare-button').addClass('button-box-style2');

	// 他のボタンは緑にする
	$('#search-button').removeClass('button-box-style2');
	$('#search-button').addClass('button-box-style1');

	$('#blog-button').removeClass('button-box-style2');
	$('#blog-button').addClass('button-box-style1');

	$('#bbs-button').removeClass('button-box-style2');
	$('#bbs-button').addClass('button-box-style1');

	$('#netcare-button').removeClass('button-box-style2');
	$('#netcare-button').addClass('button-box-style1');

	$('#favorite-button').removeClass('button-box-style2');
	$('#favorite-button').addClass('button-box-style1');

	$('#setting-button').removeClass('button-box-style2');
	$('#setting-button').addClass('button-box-style1');

	// #main-containts 内部を書き換える
	$.ajax({
		'type': 'GET',
		'url': '/green/Farbe/nextcare_page',
		//'data': { 'search_word': 'testword' },
		'success': function( retdata ){
			$('#main-containts').html( retdata );
		},
		'error': function(){ alert('ajax-error'); }
	});

	// コールバック等をリセット
	ResetCallbacks();

	// pushstateがnullなら履歴を残す
	if( pushstate == null ){
		history.pushState( {}, '', '/green/farbe/nextcare' );
	}
};

function click_favorite_button( pushstate ){
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

	// ボタンを白くする
	$('#favorite-button').removeClass('button-box-style1');
	$('#favorite-button').addClass('button-box-style2');

	// 他のボタンは緑にする
	$('#search-button').removeClass('button-box-style2');
	$('#search-button').addClass('button-box-style1');

	$('#blog-button').removeClass('button-box-style2');
	$('#blog-button').addClass('button-box-style1');

	$('#bbs-button').removeClass('button-box-style2');
	$('#bbs-button').addClass('button-box-style1');

	$('#netcare-button').removeClass('button-box-style2');
	$('#netcare-button').addClass('button-box-style1');

	$('#nextcare-button').removeClass('button-box-style2');
	$('#nextcare-button').addClass('button-box-style1');

	$('#setting-button').removeClass('button-box-style2');
	$('#setting-button').addClass('button-box-style1');

	// #main-containts 内部を書き換える
	$.ajax({
		'type': 'GET',
		'url': '/green/Farbe/favorite_page',
		//'data': { 'search_word': 'testword' },
		'success': function( retdata ){
			$('#main-containts').html( retdata );
		},
		'error': function(){ alert('ajax-error'); }
	});

	// コールバック等をリセット
	ResetCallbacks();

	// pushstateがnullなら履歴を残す
	if( pushstate == null ){
		history.pushState( {}, '', '/green/farbe/favorite' );
	}
};

function click_setting_button( pushstate ){
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

	// ボタンを白くする
	$('#setting-button').removeClass('button-box-style1');
	$('#setting-button').addClass('button-box-style2');

	// 他のボタンは緑にする
	$('#search-button').removeClass('button-box-style2');
	$('#search-button').addClass('button-box-style1');

	$('#blog-button').removeClass('button-box-style2');
	$('#blog-button').addClass('button-box-style1');

	$('#bbs-button').removeClass('button-box-style2');
	$('#bbs-button').addClass('button-box-style1');

	$('#netcare-button').removeClass('button-box-style2');
	$('#netcare-button').addClass('button-box-style1');

	$('#nextcare-button').removeClass('button-box-style2');
	$('#nextcare-button').addClass('button-box-style1');

	$('#favorite-button').removeClass('button-box-style2');
	$('#favorite-button').addClass('button-box-style1');

	// #main-containts 内部を書き換える
	$.ajax({
		'type': 'GET',
		'url': '/green/Farbe/setting_page',
		//'data': { 'search_word': 'testword' },
		'success': function( retdata ){
			$('#main-containts').html( retdata );
		},
		'error': function(){ alert('ajax-error'); }
	});

	// コールバック等をリセット
	ResetCallbacks();

	// pushstateがnullなら履歴を残す
	if( pushstate == null ){
		history.pushState( {}, '', '/green/farbe/settings' );
	}
};

function click_farbe_logo(){
/*
	// 他のボタンは緑にする
	$('#search-button').removeClass('button-box-style2');
	$('#search-button').addClass('button-box-style1');

	$('#blog-button').removeClass('button-box-style2');
	$('#blog-button').addClass('button-box-style1');

	$('#bbs-button').removeClass('button-box-style2');
	$('#bbs-button').addClass('button-box-style1');

	$('#netcare-button').removeClass('button-box-style2');
	$('#netcare-button').addClass('button-box-style1');

	$('#nextcare-button').removeClass('button-box-style2');
	$('#nextcare-button').addClass('button-box-style1');

	$('#favorite-button').removeClass('button-box-style2');
	$('#favorite-button').addClass('button-box-style1');

	$('#setting-button').removeClass('button-box-style2');
	$('#setting-button').addClass('button-box-style1');


	// コールバック等をリセット
	ResetCallbacks();
*/
	window.location.href = '/green/Farbe/index';
};

// トップページの最新ブログ見出しから
// ブログ閲覧ページを表示するための関数
function ViewBlog( userid, pushstate ){
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

	// #main-containts 内部を書き換える
	$.ajax({
		'type': 'POST',
		'url': '/green/Farbe/viewblog',
		'data': { 'viewid': userid },
		'success': function( retdata ){
			$('#main-containts').html( retdata );
		},
		'error': function(){ alert('ajax-error'); }
	});

	// pushstateがnullなら履歴をプッシュしておく
	if( pushstate == null ){
		history.pushState( {}, '', '/green/farbe/ViewBlog_' + userid );
	}
};

// プロフィールボタンが押された時の処理
function ViewProfile(){

	// #main-containts 内部を書き換える
	$.ajax({
		'type': 'GET',
		'url': '/green/Farbe/ViewProfile',
		//'data': { 'viewid': userid },
		'success': function( retdata ){
			$('#main-containts').html( retdata );
		},
		'error': function(){ alert('ajax-error'); }
	});

	// 履歴に残るようプッシュしておく
	history.pushState( {}, '', '/green/farbe/ViewProfile' );
};

// ユーザーIDからプロフィール画面を表示する関数
function ViewProfile( userid, pushstate ){

	// 送るメッセージを作成
	var senddata = [];
	senddata.push({
		'datetime': GetDateTime(),
		'userid': userid,
		'eventid': 'RenderProfileEvent'.hashCode(),
		'data': 'no data.'	
	});

	// #main-containts 内部を書き換える
	$.ajax({
		'type': 'POST',
		'url': '/green/Farbe/PostGetMessages',
		'data': { 'eventdata': JSON.stringify( senddata ) },
		'success': function( eventdata ){
			eventdata = $.parseJSON( eventdata );
			for( var i in eventdata ){
				var event = eventdata[i];
				if( event.eventid == 'RenderedProfilePage'.hashCode() ){
					$('#main-containts').html( event.data );
				}
			}
		},
		'error': function(){ alert('ajax-error'); }
	});

	// 履歴に残るようプッシュしておく
	if( pushstate == null ){
		history.pushState( {}, '', '/green/farbe/ViewProfile_' + userid );
	}
};

// 戻る、進むボタンを押した時の処理
window.addEventListener( 'popstate', function( event ){
	console.log( location.pathname );

	// ここの処理では、pushStateを行うとループになるため
	// pushStateしません

	// トップページへ戻る処理
	if( location.pathname == '/green/farbe/' ||
		location.pathname.match(/_*index/) == 'index'
	){
		location.href = '/green/farbe/index';
	}

	// 検索ページへ戻る処理
	if( location.pathname.match(/_*search/) == 'search' ){
		click_search_button( true );
	}

	// 日記・Blog へ戻る処理
	if( location.pathname.match(/_*blog/) == 'blog' ){
		click_blog_button( true );
	}

	// 掲示板へ戻る処理
	if( location.pathname.match(/_*bbs/) == 'bbs' ){
		click_bbs_button( true );
	}

	// ネットケアへ戻る処理
	if( location.pathname == '/green/farbe/netcare' ||
		location.pathname.match(/_*netcare/) == 'netcare' ){
		click_netcare_button( true );
	}	

	// ネクストケアページに戻る処理
	if( location.pathname.match(/_*nextcare/) == 'nextcare' ){
		click_nextcare_button( true );
	}

	// お気に入りに戻る処理
	if( location.pathname.match(/_*favorite/) == 'favorite' ){
		click_favorite_button( true );
	}

	// 設定に戻る処理
	if( location.pathname.match(/_*settings/) == 'settings' ){
		click_setting_button( true );
	}

	// VIewBlogに戻る処理
	if( location.pathname.match(/_*ViewBlog_*/) == 'ViewBlog_' ){
		var userid = location.pathname.match(/\d+/);
		ViewBlog( userid, true );	// pushStateを行わない
		console.log( 'userid:' + userid );
	}

	// ViewProfileに戻る処理
	if( location.pathname.match(/_*ViewProfile_*/) == 'ViewProfile_' ){
		var userid = location.pathname.match(/\d+/);
		ViewProfile( userid, true );	
		console.log( 'userid:' + userid );
	}
}, false );
