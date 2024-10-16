<!--
	このテンプレートファイルは使われていません
	app/View/Farbe/netcare_page.ctp に変わりました
-->
<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<title>Farbe pre-alpha ver</title>
<?php
echo $this->Html->script( 'murmurHash3.js' );
echo $this->Html->script( 'utf.js' );
echo $this->Html->script( 'base64.js' );
echo $this->Html->script( 'deflate.js' );
echo $this->Html->script( 'inflate.js' );
echo $this->Html->script( 'md5.js' );
echo $this->Html->script( 'library1.js' );
echo $this->Html->script( 'jquery-3.1.0.js' );
echo $this->Html->script( 'three.js' );
echo $this->Html->script( 'ColladaLoader.js' );
echo $this->Html->script( 'FirstPersonControls.js' );
echo $this->Html->script( 'Projector.js' );
?>
<script>


// GlobalChatScript
//=================================================
var nickname_id = <?php echo $nickname_id; ?>;

jQuery.ajaxSetup({ cache: false });

var DisplayCommentOld = [];	// 取得したグローバルチャットデータ
var DisplayComment = [];	// 新規コメントが格納されている配列
/*
 * DisplayComment
 {	"player_id": num,
	"nickname": str,
 	"comment": str,
 	"timer": num,
 	"mes_id": num
 */
var StuffComment = [];		// 表示すべきスタッフのコメントデータ
/*
	StuffComment = 
	[{
		"stuff_id": num,
		"comment": str,
		"timer": num
	}];
*/


function GetDateTime(){
	var dateobj = new Date();
	var datetime =
		dateobj.getYear() + "-" + dateobj.getMonth() + "-" +
		dateobj.getDay() + " " + dateobj.getHours() + ":" +
		dateobj.getMinutes() + ":" + dateobj.getSeconds();
	return( datetime );
}

// obj is comment data array.
function UpdateDisplayComment( obj ){
	// 配列が空だったら一度全部入れる
	if( DisplayCommentOld.length == 0 ){
		for( var i in obj ){
			DisplayCommentOld.push({
				"player_id": parseInt( obj[i].nickname_id ),
				"nickname": obj[i].nickname,
				"comment": obj[i].text,
				"timer": 0,
				"mes_id": obj[i].message_id
			});
		}
	}
	// 配列が空でない（新規コメント）なら
	// 新規コメントを抽出
	else{
		var newcomment;
		
		// 取得したコメントデータの数だけループ
		for( var i in obj ){
			var newflag = true;
			// DisplayCommentOld配列内に同じメッセージIDのデータがないか検索
			for( var j in DisplayCommentOld ){
				if( DisplayCommentOld[j]["mes_id"] == obj[i].message_id ){
					newflag = false;
				}
			}

			// newflag が true なら obj[i] が新しいデータ
			if( newflag == true ){

				// DisplayComment 配列内に obj[i].nickname_id がないか検索
				var existflag = false;
				for( var p in DisplayComment ){
					if( DisplayComment[p]["player_id"] == obj[i].nickname_id ){
						// 同じIDのデータを上書き
						DisplayComment[p] = {
								"player_id": parseInt( obj[i].nickname_id ),
								"nickname": obj[i].nickname,
								"comment": obj[i].text,
								"timer": 0,
								"mes_id": obj[i].message_id
							};
						existflag = true;	// DisplayComment内に 同じデータがあった
						break;	// p のループを抜ける
					}
				}
				// DisplayComment 配列内に obj[i].nickname_id が存在しない
				if( existflag == false ){
					// DisplayComment 配列に新規データをpush
					DisplayComment.push({
						"player_id": parseInt( obj[i].nickname_id ),
						"nickname": obj[i].nickname,
						"comment": obj[i].text,
						"timer": 0,
						"mes_id": obj[i].message_id
					});
				}

				// DisplayCommentOld 配列に obj のデータを全てコピー
				DisplayCommentOld = [];
				for( var k in obj ){
					DisplayCommentOld.push({
						"player_id": parseInt( obj[k].nickname_id ),
						"nickname": obj[k].nickname,
						"comment": obj[k].text,
						"timer": 0,
						"mes_id": obj[k].message_id
					});
				} // k
			} // if( newflag == true )
		} // i
	} // else if( DisplayCommentOld.length == 0 )
	
}

function GetGlobalChatDataAjax(){
	$.ajax({
		type:"GET",
		url:"/green/Farbe/GetGlobalChatData",
		success: function( data ){
			
			var str = "";
			var obj = $.parseJSON( data );
			/*
			for( var i in obj ){
				str += obj[i].nickname + ":";
				str += obj[i].text + "<BR>";
			}
			$("#global_chat_area").html( str );
			*/

			// 配列が空だったら一度全部入れる
		} // success: function
	});
}

// obj is position array.
function UpdatePlayerPosition( obj ){
	OtherPlayers = [];
	for( var i in obj ){
		
		
		var player_id = obj[i].player_id;
		var nickname = obj[i].nickname;
		var px = parseFloat( obj[i].px );
		var py = parseFloat( obj[i].py );
		var pz = parseFloat( obj[i].pz );

		OtherPlayers.push({
			"player_id": player_id,
			"nickname": nickname,
			"px": px,
			"py": py,
			"pz": pz
		});

		var flag = false;
		for( var j in OtherPlayersPos ){
			if( OtherPlayersPos[j]["player_id"] == player_id ){
				flag = true;
			}
		}
		if( flag == false ){
			/*
			material = new THREE.MeshBasicMaterial({ color: '#FF00FF' });
			geometry = new THREE.CubeGeometry( 10, 10, 10 );
			model = new THREE.Mesh( geometry, material );
			//model.position = new THREE.Vector3( px, py, pz );
			model.position.x = px;
			model.position.y = py;
			model.position.z = pz;
			scene.add( model );
			*/	
			model = CreatePorin( new THREE.Vector3( px, py, pz ) );

			OtherPlayersPos.push({
				"player_id": player_id,
				"nickname": nickname,
				"px": px,
				"py": py,
				"pz": pz,
				"model": model
			});
		}
	}

	// OtherPlayersPos から更新の無いデータを削除
	for( var i in OtherPlayersPos ){
		var eraseflag = true;
		for( var j in obj ){
			if( OtherPlayersPos[i]["player_id"] == obj[j].player_id ){
				eraseflag = false;
			}
		}
		if( eraseflag == true ){
			scene.remove( OtherPlayersPos[i]["model"] );
			OtherPlayersPos.splice( i, 1 );
		}
	}

}

// サーバーとメッセージのやりとりを行う関数
// 数秒おきに呼ばれてメッセージ交換を行う
function PostGetMessages( str ){
	/*
	$.ajax({
		type:"POST",
		url:"/green/Farbe/PostGlobalChatData",
		data:{	"nickname_id": nickname_id,
				"text": str
		},
		success: function( data ){
			$("#global_chat_text").val('');
		}
	});
	*/
	
	var senddata = [];
	for( var i in str ){
		// PostGetGlobalChatText Event
		if( str[i] == 'GetMes' ){
			senddata.push({
				"datetime": GetDateTime(),
				"userid":	nickname_id,
				"eventid":	"PostGetGlobalChatText".hashCode(),
				"data": {
					"nickname_id": nickname_id,
					"text": ''
				}
			});
		}

		if( str[i] == 'PostGetMes' ){
			senddata.push({
				"datetime": GetDateTime(),
				"userid":	nickname_id,
				"eventid":	"PostGetGlobalChatText".hashCode(),
				"data": {
					"nickname_id": nickname_id,
					"text": $('#global_chat_text').val()
				}
			});

			// 入力ボックスを空にする
			$('#global_chat_text').val('');
		}

		if( str[i] == 'PostGetPos' ){
			// PostGetPlayerPosition Event
			senddata.push({
				"datetime": GetDateTime(),
				"userid":	nickname_id,
				"eventid":	'PostGetPlayerPosition'.hashCode(),
				"data": {	// New position data.
					"player_id": nickname_id,
					"px": MovetoMesh.position.x,
					"py": MovetoMesh.position.y,
					"pz": MovetoMesh.position.z
				}
			});
		}

		// スタッフのコメントを取得する
		if( str[i] == 'GetStuffComment' ){
			senddata.push({
				"datetime": GetDateTime(),
				"userid":	nickname_id,
				"eventid":	'GetStuffComment'.hashCode(),
				"data": "no data."
			});
		}

		// ログインイベントを送信
		if( str[i] == 'Login' ){
			senddata.push({
				"datetime": GetDateTime(),
				"userid":	nickname_id,
				"eventid":	'LoginEvent'.hashCode(),
				"data": "no data."
			});
		}

		// ログアウトイベントを送信
		if( str[i] == 'Logout' ){
			senddata.push({
				"datetime": GetDateTime(),
				"userid":	nickname_id,
				"eventid":	'LogoutEvent'.hashCode(),
				"data": "no data."
			});
		}

		// 位置移動イベントを送信
		if( str[i] == 'MovePos' ){
			senddata.push({
				"datetime": GetDateTime(),
				"userid":	nickname_id,
				"eventid":	'MovePosition'.hashCode(),
				"data": {
					"px": MovetoMesh.position.x,
					"py": MovetoMesh.position.y,
					"pz": MovetoMesh.position.z
				}
			});
		}

		// 位置取得イベントを送信
		if( str[i] == 'GetPos' ){
			senddata.push({
				"datetime": GetDateTime(),
				"userid":	nickname_id,
				"eventid":	'GetPosition'.hashCode(),
				"data": "no data."
			});
		}

		// 接続中を知らせるイベント
		if( str[i] == 'Link' ){
			senddata.push({
				"datetime": GetDateTime(),
				"userid":	nickname_id,
				"eventid":	'LinkEvent'.hashCode(),
				"data": "no data."
			});
		}
	}
	$.ajax({
		"type": 'POST',
		"url": '/green/Farbe/PostGetMessages',
		"data": {"eventdata": JSON.stringify( senddata )},
		"success": function( eventdata ){
			eventdata = $.parseJSON( eventdata );
			for( var i in eventdata ){
				var event = eventdata[i];
				// SendGlobalChatText イベントのデータのみ処理する
				if( event.eventid == "SendGlobalChatText".hashCode() ){
					UpdateDisplayComment( event.data );
				}
				
				// SendPlayerPosition イベントを処理する
				if( event.eventid == 'SendPlayerPosition'.hashCode() ){
					//UpdatePlayerPosition( event.data );
				}

				// SendStuffComment イベントを処理する
				if( event.eventid == 'SendStuffComment'.hashCode() ){
					// StuffComment 配列にデータを挿入
					var data = event.data;
					StuffComment = [];
					StuffComment.push({
						"stuff_id": -1,
						"comment": data.comment,
						"timer": 0
					});
				}

				// SendPlayerPosition2 イベントを処理する
				if( event.eventid == 'SendPlayerPosition2'.hashCode() ){
					UpdatePlayerPosition( event.data );
				}
			}
		}
	});
	
}

var OtherPlayers = [];		// 自分も含めたプレイヤーのデータ
var OtherPlayersPos = [];	// 古いデータ(更新検知用)
/*
	"player_id": int,
	"nickname": str,
	"px": int,
	"py": int,
	"pz": int,
	"model": Object
*/

function PostGetPlayersPosition(){
	$.ajax({
		type:"POST",
		url:"/green/Farbe/PostGetPlayersPosition",
		data:{	"player_id": nickname_id,
				"px": MovetoMesh.position.x,
				"py": MovetoMesh.position.y,
				"pz": MovetoMesh.position.z
		},
		success: function( json ){
			var obj = $.parseJSON( json );
		}
	});
}

function enter(){
	if( window.event.keyCode == 13 ){
		PostGetMessages( ['PostGetMes'] );
		//PostGlobalChatDataAjax( $("#global_chat_text").val() );
	}
}


// three.js
// =================================================
var renderer, scene, camera;
var controls, clock;
var projector;
var mousex, mousey;
var TargetList = [];
var WindowData = [];
/*
	var WindowData = [{
		"px":int, "py":int,
		"width":int, "height":int,
		"title":str,
		"str":str,
		"moving":bool,
		"buttons" = [{
			"px":int, "py":int,
			"width":int, "height":int,
			"str":str,
			"func":function(){}
		}]
	}];
*/

var PlayerMesh;
var MovetoMesh;
var CpuMesh;

// Screen size.
var SCREEN_WIDTH = 100;		// 640
var SCREEN_HEIGHT = 100;	// 480


window.onmousemove = function(ev){
	if( ev.target == document.getElementById('text_canvas') ){
		em.addEventData(
			new OnmouseMoveEventData( 'OnmouseMoveEvent', {"ev":ev} )
		);
	}

	em.tick();
}

window.onmouseup = function(ev){
	if( ev.target == document.getElementById('text_canvas') ){
		em.addEventData(
			new OnmouseUpEventData( 'OnmouseUpEvent', {"ev":ev} )
		);
	}

	em.tick();
}

window.onmousedown = function(ev){
	// <canvas id="text_canvas"> がクリックされたら
	//if( ev.target == renderer.domElement ){
	if( ev.target == document.getElementById('text_canvas') ){

		// イベントマネージャでクリックイベントを処理する
		em.addEventData(
			new TestEventData( 'MouseClickEvent',
				{ "px": ev.clientX, "py": ev.clientY, "ev": ev }
			)
		);

		em.addEventData(
			new OnmouseDownEventData( 'OnmouseDownEvent', {"ev":ev} )
		);

		// イベントマネージャで処理
		em.tick();
	}
}

// ウィンドウを閉じた場合の処理
window.onbeforeunload = function(){

	PostGetMessages( ['Logout'] );

};

// Collada データを読み込む
// なんかバグがあるようです
function LoadCollada( daeLocation, pos, scale, rot ){
	var manager = new THREE.LoadingManager();
	manager.onProgress = function( item, loaded, total ){
		console.log( item, loaded, total )
	};

	var loader = new THREE.ColladaLoader( manager );
	loader.options.convertUpAxis = true;

	var dae;
	loader.load( daeLocation, function( collada ){
		dae = collada.scene;
		dae.position.set( pos.x, pos.y, pos.z );
		dae.scale.set( scale.x, scale.y, scale.z );
		dae.rotation.set( rot.x, rot.y, rot.z );
		scene.add( dae );
	}, function( progress ){}
	);

	return( dae );
}

// 角が丸い四角形の描画
function roundedRect( ctx, x, y, width, height, radius ){ 
    ctx.beginPath();
    ctx.moveTo(x+radius, y);
    ctx.lineTo(x+width-radius, y);
    ctx.quadraticCurveTo(x+width, y, x+width, y+radius);
    ctx.lineTo(x+width, y+height-radius);
    ctx.quadraticCurveTo(x+width, y+height, x+width-radius, y+height);
    ctx.lineTo(x+radius, y+height);
    ctx.quadraticCurveTo(x, y+height, x, y+height-radius);
    ctx.lineTo(x, y+radius);
    ctx.quadraticCurveTo(x, y, x+radius, y);
    ctx.fill();
}

// 描画関数
// あんまり処理詰めすぎると重くなります
function render(){
	//var delta = clock.getDelta();
	//controls.update( delta );
	

	// 追尾処理
	var const_mulval = 0.01;
	var delta = new THREE.Vector3(
					( MovetoMesh.position.x - PlayerMesh.position.x ) * const_mulval,
					( MovetoMesh.position.y - PlayerMesh.position.y ) * const_mulval,
					( MovetoMesh.position.z - PlayerMesh.position.z ) * const_mulval
				);
	PlayerMesh.position.x += delta.x;
	PlayerMesh.position.y += delta.y;
	PlayerMesh.position.z += delta.z;

	// 他のプレイヤーの移動追尾処理
	for( var i in OtherPlayers ){
		for( var j in OtherPlayersPos ){
			if( OtherPlayersPos[j]["player_id"] === OtherPlayers[i]["player_id"] ){
				delta = new THREE.Vector3(
						( OtherPlayers[i]["px"] - OtherPlayersPos[j]["model"].position.x ) * const_mulval,
						( OtherPlayers[i]["py"] - OtherPlayersPos[j]["model"].position.y ) * const_mulval,
						( OtherPlayers[i]["pz"] - OtherPlayersPos[j]["model"].position.z ) * const_mulval
					);

				//console.log( "x" + OtherPlayers[i]["px"] );

				OtherPlayersPos[j]["model"].position.x += delta.x;
				OtherPlayersPos[j]["model"].position.y += delta.y;
				OtherPlayersPos[j]["model"].position.z += delta.z;						
			}
		}
	}

	// カメラの移動処理
	var cdx = 100;
	var cdy = 100;
	var cdz = 100;

	var campos = new THREE.Vector3(
			PlayerMesh.position.x + cdx,
			PlayerMesh.position.y + cdy,
			PlayerMesh.position.z + cdz
			);
	camera.position.x = campos.x;
	camera.position.y = campos.y;
	camera.position.z = campos.z;

	// テキスト描画
	
	// text_canvasのクリア
	var canvas = document.getElementById("text_canvas");
	var ctx = canvas.getContext("2d");
	ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );
	
	for( var i in OtherPlayersPos ){
		//if( OtherPlayersPos[i]["player_id"] == -1 ) continue;
		var screen_pos = new THREE.Vector3(
				OtherPlayersPos[i]["model"].position.x,
				OtherPlayersPos[i]["model"].position.y,
				OtherPlayersPos[i]["model"].position.z
				);
		screen_pos.project( camera );

		//console.log( "sx:"+screen_pos.x +" sy:"+screen_pos.y );

		screen_pos.x = ( screen_pos.x + 1 ) / 2 * SCREEN_WIDTH;
		screen_pos.y = -( screen_pos.y - 1 ) / 2 * SCREEN_HEIGHT;

		screen_pos.x += -20;
		screen_pos.y += 40;

		var canvas = document.getElementById("text_canvas");
		var ctx = canvas.getContext("2d");
		//var ctx = $('#text_canvas')[0].getContext('2d');
		//var ctx = $('#text_canvas').get(0).getContext("2d");
		//ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );
		ctx.font = "14px Arial";
		ctx.fillStyle = "#000000";
		ctx.fillText( OtherPlayersPos[i]["nickname"], screen_pos.x+2, screen_pos.y+2 );
		ctx.fillStyle = "#FFFFFF";
		ctx.fillText( OtherPlayersPos[i]["nickname"], screen_pos.x, screen_pos.y );

		// コメントを描画する
		for( var j in DisplayComment ){
			if( DisplayComment[j]["player_id"] == OtherPlayersPos[i]["player_id"] ){
				if( DisplayComment[j]["timer"] < 500 ){
					var fixpx = screen_pos.x -
						ctx.measureText( DisplayComment[j]["comment"] ).width / 2 + 30;

					ctx.fillStyle = '#ADD8E6';	// Light bule.
					roundedRect(
						ctx,
						fixpx,			// px
						screen_pos.y-70-16,	// py
						ctx.measureText(
							DisplayComment[j]["comment"]
						).width + 5,		// width
						16 + 5,			// height
						10			// radius
					);

					ctx.fillStyle = "#000000";
					ctx.fillText(
						DisplayComment[j]["comment"],
						fixpx+2,
						screen_pos.y-70+2
					);
					ctx.fillStyle = "#FFFFFF";
					ctx.fillText(
						DisplayComment[j]["comment"],
						fixpx,
						screen_pos.y-70
					);
					DisplayComment[j]["timer"] ++;
				}
			}
		}
	}

	// 文字列 - ネットケアスタッフ
	var ctx = $('#text_canvas')[0].getContext('2d');
	var stuffpos = new THREE.Vector3(
				CpuMesh.position.x,
				CpuMesh.position.y,
				CpuMesh.position.z
			);
	stuffpos.project( camera );
	stuffpos.x = ( stuffpos.x + 1 ) / 2 * SCREEN_WIDTH;
	stuffpos.y = -( stuffpos.y - 1 ) / 2 * SCREEN_HEIGHT; 
	var cpx = stuffpos.x;
	var cpy = stuffpos.y;

	cpx += -20;
	cpy += 40;

	ctx.font = "14px Arial";
	ctx.fillStyle = "#000000";
	ctx.fillText( 'ネットケアスタッフ', cpx+2, cpy+2 );
	ctx.fillStyle = "#FFFFFF";
	ctx.fillText( 'ネットケアスタッフ', cpx, cpy );
	
	// デイケアスタッフのコメントを描画
	for( var i in StuffComment ){
		// 一人目のスタッフのコメントを描画する
		if( StuffComment[i]["timer"] < 500 && StuffComment[i]["stuff_id"] == -1 ){
			var fixpx = stuffpos.x -
				ctx.measureText( StuffComment[i]["comment"] ).width / 2;

			ctx.fillStyle = "#FA8072";
			roundedRect(
				ctx,
				fixpx,			// px
				stuffpos.y-30-16,	// py
				ctx.measureText( StuffComment[i]["comment"] ).width + 5, // width
				16 + 5,		// height
				10		// radius
			);
			
			ctx.fillStyle = "#000000";
			ctx.fillText(
				StuffComment[i]["comment"],
				fixpx+2,
				stuffpos.y-30+2
			);
				
			ctx.fillStyle = "#FFFFFF";
			ctx.fillText(
				StuffComment[i]["comment"],
				fixpx,
				stuffpos.y-30
			);

			StuffComment[i]["timer"] ++;
		}
	}
	
	// Rendering Windows.
	for( var i in WindowData ){
		// Window area.
		ctx.font = "14px Arial";
		ctx.fillStyle = "#FAEBD7";
		roundedRect(
			ctx, WindowData[i].px, WindowData[i].py,
			WindowData[i].width, WindowData[i].height,
			10 // radius
		);

		// Draw line.
		ctx.fillStyle = '#000000';
		ctx.beginPath();
		ctx.moveTo( WindowData[i].px, WindowData[i].py + 20 );
		ctx.lineTo( WindowData[i].px + WindowData[i].width, WindowData[i].py + 20 );
		ctx.closePath();
		ctx.stroke();

		// Window title.
		ctx.fillStyle = '#000000';
		ctx.fillText(
				WindowData[i].title,
				WindowData[i].px + 3,
				WindowData[i].py + 10 + 3
			);

		// Window text.
		var size = 16;
		var column = [''];
		var line = 0;
		for( var j=0; j<(WindowData[i].str).length; j++ ){
			var char = WindowData[i].str.charAt(j);
			if( char == '\n' ||
				ctx.measureText( column[line] + char ).width >
				WindowData[i].width
			){
				line ++;
				column[line] = '';
			}
			column[line] += char;
		}
		for( var j=0; j<column.length; j++ ){
			ctx.fillStyle = '#000000';
			ctx.fillText(
					column[j],
					WindowData[i].px,
					WindowData[i].py + 40 + size * j
				);
		}

		// Buttons.
		for( var j=0; j<(WindowData[i].buttons.length); j++ ){
			var px = WindowData[i].px;
			var py = WindowData[i].py;
			var width = WindowData[i].width;
			var height = WindowData[i].height;
			var str = WindowData[i].str;
			var moving = WindowData[i].moving;
			var button = WindowData[i].buttons[j];

			ctx.fillStyle = '#F4A460';
			roundedRect(
				ctx, px + button.px, py + button.py,
				button.width, button.height,
				10 // radius
			);

			ctx.fillStyle = '#000000';
			ctx.fillText(	button.str,
					px + button.px,
					py + button.py + 20 
				);
		}

		// Close button.
		ctx.fillStyle = '#FF0000';
		roundedRect(
			ctx, WindowData[i].px + WindowData[i].width - 20, WindowData[i].py,
			20, 20,
			10 // radius
		);
	}

	// グローバルチャットテキストを描画
	for( var i in DisplayCommentOld ){
		var comment = DisplayCommentOld[i];
		ctx.fillStyle = '#000000';
		ctx.fillText(
			comment.nickname + ' : ' + comment.comment,
			10+2, (SCREEN_HEIGHT-16*10) + 16 * i +2
		);
		ctx.fillStyle = '#FFFFFF';
		ctx.fillText(
			comment.nickname + ' : ' + comment.comment,
			10, (SCREEN_HEIGHT-16*10) + 16 * i
		);
	}
	

	// プロセスマネージャを実行
	pm.updateProcesses();
				
	requestAnimationFrame( render );
	renderer.render( scene, camera );
}

// pos : THREE.Vector3
// return MeshObject
function CreatePorin( pos ){

	var texture1 = new THREE.ImageUtils.loadTexture( '/green/model/porin1.png' );
	var porin = new THREE.Mesh(
			new THREE.PlaneGeometry( 50, 50, 1, 1 ),
			new THREE.MeshPhongMaterial({
				map: texture1
			})
		);
	porin.position.x = pos.x;
	porin.position.y = pos.y;
	porin.position.z = pos.z;
	scene.add( porin );

	return porin;
}
	
$(document).ready(function(){
	// Get screen size.
	// (!)id='text_canvas'の大きさを取得します
	SCREEN_WIDTH = $('#text_canvas').width();
	SCREEN_HEIGHT = $('#text_canvas').height();
	//SCREEN_WIDTH = 640;
	//SCREEN_HEIGHT = 480;

	// three.js
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
	renderer.setClearColor( 0x000000, 1.0 );
	document.getElementById('canvas_screen_area').appendChild( renderer.domElement );
	
	scene = new THREE.Scene();
	
	var fov = 65;
	var aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
	var near = 1;
	var far = 1000;
	camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	camera.position.set( 100, 100, 100 );
	camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );

	var light = new THREE.AmbientLight( 0x888888 );
	scene.add( light );

	var light = new THREE.DirectionalLight( 0xFFFFFF );
	//light.position.set( 0, 1, 0 );
	light.position.set( 1, 1, 1 );
	scene.add( light );

	var xmesh;
	for( var i=0; i<50; i++ ){
		material = new THREE.MeshBasicMaterial({ color: '#FF0000' });
		geometry = new THREE.CubeGeometry( 5, 5, 5 );
		xmesh = new THREE.Mesh( geometry, material );
		xmesh.position.x = i * 10;
		scene.add( xmesh );
	}

	/*
	material = new THREE.MeshBasicMaterial({ color: '#FF00FF' });
	geometry = new THREE.CubeGeometry( 10, 10, 10 );
	PlayerMesh = new THREE.Mesh( geometry, material );
	PlayerMesh.position = new THREE.Vector3( 0, 0, 0 );
	scene.add( PlayerMesh );

	material = new THREE.MeshBasicMaterial({ color: '#0000FF' });
	geometry = new THREE.CubeGeometry( 5, 5, 5 );
	MovetoMesh = new THREE.Mesh( geometry, material );
	MovetoMesh.position = new THREE.Vector3( 0, 0, 0 );
	scene.add( MovetoMesh );
	*/

	// Create porin.
	PlayerMesh = CreatePorin( new THREE.Vector3( 0, 10, 0 ) );
	scene.remove( PlayerMesh );

	//MovetoMesh = CreatePorin( new THREE.Vector3( 0, 10, 0 ) );
	material = new THREE.MeshBasicMaterial({ color: '#0000FF' });
	geometry = new THREE.CubeGeometry( 5, 5, 5 );
	MovetoMesh = new THREE.Mesh( geometry, material );
	scene.add( MovetoMesh );

	// Create CPU Porin.
	CpuMesh = CreatePorin( new THREE.Vector3( -113, 67, 76 ) );
	CpuMesh.rotation.set( 0, Math.PI/4, 0 );

	// Fog.
	scene.fog = new THREE.Fog( 0xFFFFFF, 100, 1000 );
	

	//clock = new THREE.Clock();
	//controls = new THREE.FirstPersonControls( camera );

	/*
	LoadCollada( '/green/model/ground2.dae',
					new THREE.Vector3( 0, 0, 0 ),
					//new THREE.Vector3( 100, 100, 100 )
					new THREE.Vector3( 30, 30, 30 )
	);
	*/
	var map = LoadCollada(
			//'/green/model/daycare_room1.dae',
			'/green/model/netcare_room1.dae',
			new THREE.Vector3( 0, 0, 0 ),
			new THREE.Vector3( 30, 30, 30 ),
			new THREE.Vector3( 0, -Math.PI/2, 0 )
			//new THREE.Vector3( 1, 1, 1 )
	);
	//map.rotation.set( 0, 0, 0 );
	//map.rotation.set( 0, 0, 0 );

	//PostGetPlayersPosition();
	//setInterval( function(){ PostGetPlayersPosition(); }, 1000 );

	/*
	// Insert window data.
	WindowData.push({
		"px": 100, "py": 100, 
		"width": 200, "height": 100,
		"title": "test_window"
	});
	*/
	
	render();

	//GetGlobalChatDataAjax();
	//PostGlobalChatDataAjax( "ログインしました" );

	//setInterval( "GetGlobalChatDataAjax();", 1000 );
	//setInterval( function(){ GetGlobalChatDataAjax(); }, 1000 );

	// 最初にMovePositionイベントをサーバーに送信しておかないと動作しない
	PostGetMessages( ['Login', 'MovePos'] );

	setInterval(
		 function(){
			PostGetMessages( [
				'GetMes',
				//'PostGetPos',
				'GetStuffComment',
				//'MovePos',
				'GetPos',
				'Link'
			] );
		}, 1000
	);
});	



// Processes
//=================================================
var pm = new ProcessManager();	// プロセスマネージャ

// 初期化プロセスクラス
var InitProcess = function( type ){
	Process.call( this, type );	// 親クラスのコンストラクタを呼ぶ
};

// Process::onInitialize をオーバーライド
InitProcess.prototype.onInitialize = function(){
	Process.prototype.onInitialize.call( this );	// 親クラスのメソッドを呼ぶ
};

// Events
//=================================================
var em = new EventManager();	// イベントマネージャ

// EventListeners
//=================================================
// TestEventListenerクラス定義
//-------------------------------
var TestEventListener = function(){}	// コンストラクタ
// イベントリスナーの名前を返すメソッド
TestEventListener.prototype.getName = function(){ return( 'TestEventListener' ); };
// イベントリスナーのイベント処理（オーバーライド）
TestEventListener.prototype.handleEvent = function( eventdata ){

	console.log( 'TestEventListener が MouseClickEvent を処理しています' );
	console.log( 'MouseClickEvent[px:'+ eventdata.getPx()+' py:'+eventdata.getPy()+']' );

	var px = eventdata.getPx();
	var py = eventdata.getPy();

	for( var i in WindowData ){
		var wpx = WindowData[i].px;
		var wpy = WindowData[i].py;
		var width = WindowData[i].width;
		var height = WindowData[i].height;

		// ウィンドウの閉じるボタンを押した場合
		if(	(wpx+width-20) < px && (wpx+width) > px &&
			(wpy) < py && (wpy+20) > py
			//wpx < px && (wpx+width) > px &&
			//wpy < py && (wpy+height) > py
		){
			WindowData.splice( i, 1 );		
			return;
		}

		// ウィンドウタイトルをクリックした場合
		if(	(wpx) < px && (wpx+width) > px &&
			(wpy) < py && (wpy+10) > py
		){
			var data = {"index": i};
			em.addEventData(
				new WindowTitleClickedEventData( 'WindowTitleClicked', data )
			);
			return;
		}

		// ウィンドウのボタン押下検知
		for( var j=0; j<(WindowData[i].buttons.length); ++j ){
			var button = WindowData[i].buttons[j];
			if(	wpx + button.px < px && wpx + button.px + button.width > px &&
				wpy + button.py < py && wpy + button.py + button.height > py
			){
				var button_func = button.func;
				button_func();

				return;
			}
		}

		// ウィンドウのどこかをクリックした場合
		if(	(wpx) < px && (wpx+width) > px &&
			(wpy) < py && (wpy+height) > py
		){
			var data = {"index": i};
			em.addEventData(
				new WindowClickedEventData( 'WindowClicked', data )
			);
			return;
		}

	}


	// プレイヤーオブジェクトの移動処理
	var ev = eventdata.data.ev;

	// canvas上での座標を計算
	var rect = ev.target.getBoundingClientRect();
	mousex = ev.clientX - rect.left;
	mousey = ev.clientY - rect.top;
	//console.log( "mousex:" + mousex + " mousey:" + mousey );

	// 3D空間用に座標を計算
	mousex = ( mousex / SCREEN_WIDTH ) * 2 - 1;
	mousey = -( mousey / SCREEN_HEIGHT ) * 2 + 1;

	// マウスベクトル
	var mouse_vector = new THREE.Vector3( mousex, mousey,1 );

	// スクリーン座標系から、グローバル座標系に変換
	projector = new THREE.Projector();
	//projector.unprojectVector( mouse_vector, camera );
	mouse_vector.unproject( camera );
	
	// 始点、向きベクトルを渡してレイを作成
	var ray = new THREE.Raycaster(
					camera.position,
					mouse_vector.sub( camera.position ).normalize()
				);
	
	// 交差判定
	var obj = ray.intersectObjects( scene.children, true );

	// スタッフをクリックしたかどうか
	var click_stuff = false;
	if( obj.length > 0 ){
		for( var i in obj ){
			if( obj[i].object.id == CpuMesh.id ) click_stuff = true;
		}
	}
	// スタッフをクリックしたら行う処理
	if( click_stuff == true ){
		// 「ﾚｸﾘｴｰｼｮﾝを行う」ボタンが押された時実行する関数
		var start_onigokko = function(){	// おにごっこを始めるボタン
	
		};
		var stopallgame = function(){	// 全てのゲームを終了するボタン

		};
		var recreation = function(){
			WindowData = [];	// ウィンドウデータをクリア
			var data = {
				"px":100, "py":100,
				"width":200, "height":300,
				"title":"スタッフと会話中",
				"str":"ﾚｸﾘｴｰｼｮﾝを行いますか？",
				"moving":false,
				"buttons":[{
					"px":30, "py":50,
					"width":150, "height":30,
					"str":"おにごっこを始める",
					"func":start_onigokko
					},{
					"px":30, "py":50+30+10,
					"width":150, "height":30,
					"str":"全てのｹﾞｰﾑを終了する",
					"func":stopallgame
				}]
					
			};
			em.addEventData( new CreateWindowEventData( 'CreateWindow', data ) );
		};
		// 「このﾈｯﾄｹｱについて」ボタンが押された時実行する関数
		var fordaycare = function(){
			WindowData = [];	// ウィンドウデータをクリア
			var data = {
				"px":100, "py":100,
				"width":200, "height":300,
				"title":"このﾈｯﾄｹｱについて",
				"str":"このﾈｯﾄｹｱは、ﾃﾞｲｹｱに通えない人のために、作られました\n\nﾃﾞｲｹｱをﾓﾃﾞﾙにしています",
				"moving":false,
				"buttons":[]
			};
			em.addEventData( new CreateWindowEventData( 'CreateWindow', data ) );
		};
		var data = {
			"px": 100, "py": 100,
			"width": 200, "height": 300,
			"title": "ネットケアへようこそ",
			"str": "なんでしょうか？",
			"moving": false,
			"buttons": [{	
				"px": 30, "py": 50,
				"width": 150, "height": 30,
				"str": "ﾚｸﾘｴｰｼｮﾝを行う",
				"func": recreation
				},{
				"px": 30, "py": 50+30+10,
				"width": 150, "height": 30,
				"str": "このﾈｯﾄｹｱについて",
				"func": fordaycare
			}]
		};
					
		em.addEventData( new CreateWindowEventData( 'CreateWindow', data ) );
		return;
	}

	

	// 交差時の処理
	if( obj.length > 0 ){
		MovetoMesh.position.x = obj[0].point.x;
		MovetoMesh.position.y = obj[0].point.y + 30;
		MovetoMesh.position.z = obj[0].point.z;
	}
	
	// サーバーに移動先の位置を伝える
	PostGetMessages( ['MovePos'] );		// point1

	return( true );	// イベントを処理したらtrueを返す
};
inherits( TestEventListener, EventListener );	// 継承関係を記述

// イベントマネージャにイベントリスナーを追加
em.addEventListener( 'MouseClickEvent', new TestEventListener() );

// WindowTitleClickedEventListenerクラス定義
//-------------------------------
var WindowTitleClickedEventListener = function(){};
WindowTitleClickedEventListener.prototype.getName = function(){
	return( 'WindowTitleClickedEventListener' );
};
WindowTitleClickedEventListener.prototype.handleEvent = function( eventdata ){
	console.log( 'WindowTitleClickedEventListener が WindowTitleClickedEventData を処理しています' );

	// プロセスマネージャにウィンドウを移動させるプロセスが無いか検索
	// プロセスが無い時だけ移動プロセスを作る
	if( pm.isProcessActive( 'MoveWindowProcess' ) == false ){
	}

	// プロセスで対応しようと思ったが
	// WindowDataに移動中のフラグを持たせれば
	// イベントマネージャだけで移動処理ができるはず
	
	// ということでフラグがfalseならtrueにする
	var index = eventdata.data.index;
	if( WindowData[index].moving == false ){
		WindowData[index].moving = true;
	}else{
		WindowData[index].moving = false;
	}
};
inherits( WindowTitleClickedEventListener, EventListener );
em.addEventListener( 'WindowTitleClicked', new WindowTitleClickedEventListener() );

// OnmouseMoveEventListenerクラス定義
//-------------------------------
var OnmouseMoveEventListener = function(){};
OnmouseMoveEventListener.prototype.getName = function(){
	return( 'OnmouseMoveEventListener' );
};
OnmouseMoveEventListener.prototype.handleEvent = function( eventdata ){
	//console.log( 'OnmouseMoveEventListener で OnmouseMoveEventData を処理しています' );

	// ウィンドウの移動処理
	for( var i in WindowData ){
		if( WindowData[i].moving == true ){
			WindowData[i].px = eventdata.data.ev.clientX - 10;
			WindowData[i].py = eventdata.data.ev.clientY - 5;
			break;	// ひとつのウィンドウのみ移動する
		}
	}
};
inherits( OnmouseMoveEventListener, EventListener );
em.addEventListener( 'OnmouseMoveEvent', new OnmouseMoveEventListener() );

// CreateWindowEventListener
//-------------------------------
var CreateWindowEventListener = function(){};
CreateWindowEventListener.prototype.getName = function(){
	return( 'CreateWindowEventListener' );
};
CreateWindowEventListener.prototype.handleEvent = function( eventdata ){
	var px = eventdata.data.px;
	var py = eventdata.data.py;
	var width = eventdata.data.width;
	var height = eventdata.data.height;
	var title = eventdata.data.title;
	var str = eventdata.data.str;
	var moving = eventdata.data.moving;
	var buttons = eventdata.data.buttons;
	
	// 新規ウィンドウ
	WindowData.push({
		"px": px, "py": py,
		"width": width, "height": height,
		"title": title,
		"str": str,
		"moving": moving,
		"buttons": buttons
	});
};
inherits( CreateWindowEventListener, EventListener );
em.addEventListener( 'CreateWindow', new CreateWindowEventListener() );

// イベントデータクラス定義
//======================================================

// TestEventDataクラス定義
//-------------------------------
var TestEventData = function( eventname, data ){
	EventData.call( this, eventname );	// 親クラスのコンストラクタを呼ぶ
	TestEventData.prototype.data = data;	// dataメンバ変数を追加
};
TestEventData.prototype.getPx = function(){ return( this.data.px ); };
TestEventData.prototype.getPy = function(){ return( this.data.py ); };
inherits( TestEventData, EventData );	// 継承関係を記述

// OnmouseMoveEventDataクラス定義
//-------------------------------
var OnmouseMoveEventData = function( eventname, data ){
	EventData.call( this, eventname );
	OnmouseMoveEventData.prototype.data = data;
};
inherits( OnmouseMoveEventData, EventData );

// OnmouseDownEventDataクラス定義
//-------------------------------
var OnmouseDownEventData = function( eventname, data ){
	EventData.call( this, eventname );
	OnmouseDownEventData.prototype.data = data;
};
inherits( OnmouseDownEventData, EventData );

// OnmouseUpEventDataクラス定義
//-------------------------------
var OnmouseUpEventData = function( eventname, data ){
	EventData.call( this, eventname );
	OnmouseUpEventData.prototype.data = data;
};
inherits( OnmouseUpEventData, EventData );

// WindowClickedEventDataクラス定義
//-------------------------------
var WindowClickedEventData = function( eventname, data ){
	EventData.call( this, eventname );
	WindowClickedEventData.prototype.data = data;
};
inherits( WindowClickedEventData, EventData );

// WindowTitleClickedEventDataクラス定義
//-------------------------------
var WindowTitleClickedEventData = function( eventname, data ){
	EventData.call( this, eventname );
	WindowTitleClickedEventData.prototype.data = data;
};
inherits( WindowTitleClickedEventData, EventData );

// WindowMoveEventDataクラス定義
//-------------------------------
var WindowMoveEventData = function( eventname, data ){
	EventData.call( this, eventname );
	WindowMoveEventData.prototype.data = data;
};
inherits( WindowMoveEventData, EventData );

// CreateWindowEventDataクラス定義
//-------------------------------
var CreateWindowEventData = function( eventname, data ){
	EventData.call( this, eventname );
	CreateWindowEventData.prototype.data = data;
};
inherits( CreateWindowEventData, EventData );

// GetStuffCommentEventData クラス定義
//-------------------------------
var GetStuffCommentEventData = function( eventname, data ){
	EventData.call( this, eventname );
	GetStuffCommentEventData.prototype.data = data;
};

// プロセスクラス定義
//=================================================================

// MoveWindowProcess
//-------------------------------
var MoveWindowProcess = function( type ){
	Process.call( this, type );
};
inherits( MoveWindowProcess, Process );

</script>
</head>
<body>


<div id="canvas_screen_area">
<canvas id="text_canvas" width="640" height="480" style="position:absolute; top:0px; left:0px;">
</div>
<div id="global_chat_area"></div>
<input type="text" size="80" id="global_chat_text" onKeyPress="enter();">


</body>
</html>
