
/*
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
*/

/*
 * 関数型プログラミングっぽく設計し直す予定
 * ただオブジェクト指向も使うつもり
 *
 * // _.compose 関数の使い方
 * // データフロープログラミング
 * var ADD = _.compose(
 * 	{ 'key1': 123 },
 * 	function( v ){ v.key1 += 10; return( v ); },
 * 	function( v ){ v.key1 += 20; return( v ); }
 * );
 * console.log( ADD() );	// y( x( { 'key1': 123 } ) );
 *
 */

// 関数等の並び
//
// fixNormal( vector )
// FixNormals( mesh )
// TestFunc011()
//
// var MapData
// var MapInOutData
// var Map0Sphere0
// var Map1Sphere0
// var Map2Sphere0
// var UserData
// var MouseDragData
// var TouchScreenRightData
// var TouchScreenLeftData
// var charactermesh
// var cameramesh
// var CamCalcData
// var BlendMeshData
// var composer
// var ShadowComposer
// var ShadowCamera
// var sound1
// var sound2
// var ShaderMaterial
// var ColladaShaderMaterial
// var ShadowMapShader
// var ShadowOnShader
// var LeafShader
// var WaterShader1
// var BlockShader1
// ChangeShaderMaterialData
// var nickname_id
// var LoginData
// var DisplayCommentOld
// var DisplayComment
// var StuffComment
// GetDateTime()
// UpdateDisplayComment( obj )
// GetGlobalChatDataAjax()
// UpdatePlayerPosition( obj )
// PostGetMessages( str )
// var OtherPlayers
// var OtherPlayersPos
// PostGetPlayersPosition()
// enter( pressEvent )
// var renderer, scene, camera
// var controls, clock
// var projector
// var mousex, mousey
// var TargetList
// var WindowData
// var PlayerMesh
// var MovetoMesh
// var CpuMesh
// var BlendMesh
// var TreeBlendMesh
// var GroundMesh
// var BlendMeshAnimateProcess
// var SCREEN_WIDTH
// var SCREEN_HEIGHT
//
//
//

// 変数名の衝突防止のクロージャ
(function(){

// Normal fix for three.js expoter.
// 使ったらオブジェクトの位置がやばくなった
// 複数メッシュのjsonファイルを読み込むと位置がおかしく
// なるらしい
// (⇒)json expoter は複数メッシュに対応してません
function fixNormal( vector ){
	var t = vector.y;
	vector.y = -vector.z;
	vector.z = t;
};
function FixNormals( mesh ){
	$.each( mesh.faces, function( i, face ){
		$.each( face.vertexNormals, function( i, vertex ){
			fixNormal( vertex );
			vertex.fixed = true;
		});
	});

	mesh.normalsNeedUpdate = true;
	mesh.verticesNeedUpdate = true;
};
function TestFunc011(){
	var i = 0;
	var j = 1;
	var k = 2;
};
// 各3Dデータ形式によってはバグがあるので、使い分ける
// collada形式(.dae) 静的オブジェクト
// JSON形式(.json) 動的オブジェクト

// Aboutスプライトオブジェクト
var AboutSprite = null;
// Educationスプライトオブジェクト
var EducationSprite = null;
// Skillスプライトオブジェクト
var SkillSprite = null;

// スプライト生成関数
function CreateSprite( vec3pos, ptexture ){
	var pGeometry;
	var pMatrial;

	pMaterial = new THREE.SpriteMaterial({
		color: 0xFFFFFF,
		map: ptexture,
		//size: 100.0,
		blending: THREE.NormalBlending,
		transparent: true,
		depthTest: false
	});

	//var particle = new THREE.Points( pGeometry, pMatrial );
	//var particle = new THREE.PointCloud( pGeometry, pMatrial );
	var particle = new THREE.Sprite( pMaterial );
	particle.position.set( vec3pos.x, vec3pos.y, vec3pos.z );
	var size = 300.0;
	particle.scale.set( size, size, size );
	scene.add( particle );

	return particle;
};

// マップデータ格納用
var MapData = [{
	'mapname': 'CentralRoom',		// 識別用名称
	'mapnumber': 0,				// マップ番号
	'viewfilename': '/green/model/netcare_room1.dae',	// ファイルネーム(静的オブジェクトなのでCOLLADA形式)
	'groundfilename': null,			// 当たり判定用ファイルネーム
	'viewinstance': null,			// 表示用メッシュデータ(インスタンス)
	'groundinstance': null,			// 当たり判定用メッシュデータ(インスタンス)
	'positionX': 0.0,			// 表示位置
	'positionY': 0.0,
	'positionZ': 0.0,
	'scaleX': 30.0,				// スケール値
	'scaleY': 30.0,
	'scaleZ': 30.0,	
	'rotateX': 0.0,				// 回転(ラジアン)
	'rotateY': -Math.PI/2.0,
	'rotateZ': 0.0,
	'extobjs': [
		// {				// 追加オブジェクト
		// 'objectname': 'tree01',		// 識別用名称
		// 'filename': '/green/model/tree1boned1.json',	// ファイル名(動的オブジェクトなのでJSON形式)
		// 'objinstance': null,		// 生成されたインスタンス
		// 'positionX': 0.0,		// 表示位置
		// 'positionY': 0.0,
		// 'positionZ': 0.0,
		// 'scaleX': 10.0,			// スケール値
		// 'scaleY': 10.0,
		// 'scaleZ': 10.0,	
		// 'rotateX': 0.0,			// 回転(ラジアン)
		// 'rotateY': 0.0,
		// 'rotateZ': 0.0,
		// 'defaultAnimName': 'move1',	// 標準で再生されるアニメーション名
		// 'processName': 'TreeProcess01',	// アニメーション等の処理を行っているプロセス名
		// 'processInstance': null		// プロセス本体のインスタンス
		// }
	],
	'extfunc': function(){			// 追加処理関数オブジェクト（ロード時に実行）
		// マップロード時に実行したい処理を書く
		
		// マップ０番ルート0番の扉オブジェクトを置く
		material = new THREE.MeshBasicMaterial({ color: '#0000FF' });
		geometry = new THREE.SphereGeometry( 50 );
		mesh = new THREE.Mesh( geometry, material );
		mesh.position.set(
			Map0Sphere0.positionX,
			Map0Sphere0.positionY,
			Map0Sphere0.positionZ
		);
		scene.add( mesh );

		// マップ０のネットケアスタッフ生成
		CpuMesh = CreatePorin( new THREE.Vector3( -113, 67, 76 ) );
		CpuMesh.rotation.set( 0.0, Math.PI/4.0, 0.0 );

		// 迷路オブジェクトの読み込み
		var jsonloader = new THREE.JSONLoader();
		jsonloader.load(
			'/green/model/maze1.json',
			function( geometry, materials ){
				MazeMesh = new THREE.Mesh( geometry, materials );

				MazeMesh.position.set( 130.0, 30.0, 30.0 );
				MazeMesh.scale.set( 5.0, 5.0, 5.0 );
				// シーンに追加
				scene.add( MazeMesh );
			}
		);
	}
},{
	'mapname': 'WaterRoom1',		// 識別用名称
	'mapnumber': 1,				// マップ番号
	'viewfilename': '/green/model/map1.dae',	// ファイルネーム(静的オブジェクトなのでCOLLADA形式)
	'groundfilename': null,			// 当たり判定用ファイルネーム
	'viewinstance': null,			// 表示用メッシュデータ(インスタンス)
	'groundinstance': null,			// 当たり判定用メッシュデータ(インスタンス)
	'positionX': 0.0,			// 表示位置
	'positionY': 0.0,
	'positionZ': 0.0,
	'scaleX': 50.0,				// スケール値
	'scaleY': 50.0,
	'scaleZ': 50.0,	
	'rotateX': 0.0,				// 回転(ラジアン)
	'rotateY': 0.0,
	'rotateZ': 0.0,
	'extobjs': [{				// 追加オブジェクト
		'objectname': 'tree01',		// 識別用名称
		'filename': '/green/model/tree1boned1.json',	// ファイル名(動的オブジェクトなのでJSON形式)
		'objinstance': null,		// 生成されたインスタンス
		'positionX': 0.0,		// 表示位置
		'positionY': 0.0,
		'positionZ': 0.0,
		'scaleX': 10.0,			// スケール値
		'scaleY': 10.0,
		'scaleZ': 10.0,	
		'rotateX': 0.0,			// 回転(ラジアン)
		'rotateY': 0.0,
		'rotateZ': 0.0,
		'defaultAnimName': 'move1',	// 標準で再生されるアニメーション名
		'processName': 'TreeProcess01',	// アニメーション等の処理を行っているプロセス名
		'processInstance': null		// プロセス本体のインスタンス
	}],
	'extfunc': function(){			// 追加処理関数オブジェクト（ロード時に実行）
		// マップロード時に実行したい処理を書く
		
		// マップ1番ルート0番の扉オブジェクトを置く
		material = new THREE.MeshBasicMaterial({ color: '#0000FF' });
		geometry = new THREE.SphereGeometry( 50 );
		mesh = new THREE.Mesh( geometry, material );
		mesh.position.set(
			Map1Sphere0.positionX,
			Map1Sphere0.positionY,
			Map1Sphere0.positionZ
		);
		scene.add( mesh );

		// About オブジェクトの読み込み
		// var jsonloader = new THREE.JSONLoader();
		// jsonloader.load(
		// 	'/green/model/About1.json',
		// 	function( geometry, materials ){
		// 		var AboutMaterial = new THREE.MeshBasicMaterial({ color: '#6666CC' });
		// 		var AboutMesh = new THREE.Mesh( geometry, AboutMaterial );
		//
		// 		AboutMesh.position.set( 100, 0, 0 );
		// 		AboutMesh.scale.set( 20, 20, 20 );
		//
		// 		scene.add( AboutMesh );
		// 	}
		// );

		// Educationオブジェクトの読み込み
		// var jsonloader = new THREE.JSONLoader();
		// jsonloader.load(
		// 	'/green/model/Education1.json',
		// 	function( geometry, materials ){
		// 		var EducationMaterial = new THREE.MeshBasicMaterial({ color: '#6666CC' });
		// 		var EducationModel = new THREE.Mesh( geometry, EducationMaterial );
		//
		// 		EducationModel.position.set( 0, 0, 100 );
		// 		EducationModel.scale.set( 60, 60, 60 );
		//
		// 		scene.add( EducationModel );
		// 	}
		// );

		// Skill オブジェクトの読み込み
		// var jsonloader = new THREE.JSONLoader();
		// jsonloader.load(
		// 	'/green/model/Skill1.json',
		// 	function( geometry, materials ){
		// 		var SkillMaterial = new THREE.MeshBasicMaterial({ color: '#6666CC' });
		// 		var SkillModel = new THREE.Mesh( geometry, SkillMaterial );
		//
		// 		SkillModel.position.set( -100, 0, 0 );
		// 		SkillModel.scale.set( 60, 60, 60 );
		//
		// 		scene.add( SkillModel );
		// 	}
		// );
		

		// AboutSpriteの読み込み
		// var tex = THREE.ImageUtils.loadTexture( '/green/img/AboutSprite1.png' );
		// AboutSprite = CreateSprite( new THREE.Vector3( 80, 0, 0 ), tex );

		// EducationSpriteの読み込み
		// var tex = THREE.ImageUtils.loadTexture( '/green/img/EducationSprite1.png' );
		// EducationSprite = CreateSprite( new THREE.Vector3( 0, 0, 80 ), tex );

		// SkillSpriteの読み込み
		// var tex = THREE.ImageUtils.loadTexture( '/green/img/SkillSprite1.png' );
		// SkillSprite = CreateSprite( new THREE.Vector3( -80, 0, 0 ), tex );
	}
},{
	'mapname': 'LightRoom1',		// 識別用名称
	'mapnumber': 2,				// マップ番号
	'viewfilename': '/green/model/map2.dae',	// ファイルネーム(静的オブジェクトなのでCOLLADA形式)
	'groundfilename': null,			// 当たり判定用ファイルネーム
	'viewinstance': null,			// 表示用メッシュデータ(インスタンス)
	'groundinstance': null,			// 当たり判定用メッシュデータ(インスタンス)
	'positionX': 0.0,			// 表示位置
	'positionY': 0.0,
	'positionZ': 0.0,
	'scaleX': 40.0,				// スケール値
	'scaleY': 40.0,
	'scaleZ': 40.0,	
	'rotateX': 0.0,				// 回転(ラジアン)
	'rotateY': 0.0,
	'rotateZ': 0.0,
	'extobjs':[{
		'objectname': 'tree01',		// 識別用名称
		'filename': '/green/model/tree1boned1.json',	// ファイル名(動的オブジェクトなのでJSON形式)
		'objinstance': null,		// 生成されたインスタンス
		'positionX': 0.0,		// 表示位置
		'positionY': 0.0,
		'positionZ': 0.0,
		'scaleX': 10.0,			// スケール値
		'scaleY': 10.0,
		'scaleZ': 10.0,	
		'rotateX': 0.0,			// 回転(ラジアン)
		'rotateY': 0.0,
		'rotateZ': 0.0,
		'defaultAnimName': 'move1',	// 標準で再生されるアニメーション名
		'processName': 'TreeProcess01',	// アニメーション等の処理を行っているプロセス名
		'processInstance': null		// プロセス本体のインスタンス
	}],
	'extfunc': function(){
		// その他に実行したい処理

		// マップ2番ルート0番の扉オブジェクトを置く
		material = new THREE.MeshBasicMaterial({ color: '#0000FF' });
		geometry = new THREE.SphereGeometry( 50 );
		mesh = new THREE.Mesh( geometry, material );
		mesh.position.set(
			Map2Sphere0.positionX,
			Map2Sphere0.positionY,
			Map2Sphere0.positionZ
		);
		scene.add( mesh );
	}
}];

// マップ出口入口データ
// 子プロセスを連結させて切り替える方法もある
// (!)子プロセスを連結させて切り替える方法をとったので、使っていない変数
var MapInOutData = [{
	'outmapno': 0,				// 出たマップ番号
	'inmapno': 1,				// 入るマップ番号
	'useroot': 0,				// 使った入り口と出口の番号
	'setpositionX': 0.0,			// マップが切り替わった後セットする座標
	'setpositionY': 0.0,
	'setpositionZ': 0.0,
	'setrotateX': 0.0,			// マップが切り替わった後セットする回転の度合い(ラジアン)
	'setrotateY': 0.0,
	'setrotateZ': 0.0
}];

// マップ０番ルート０番の扉
var Map0Sphere0 = {
	'radius': 100,
	'positionX': 300,
	'positionY': 0,
	'positionZ': 300,
	'modelInstance': null
};
// マップ１番ルート０番の扉
var Map1Sphere0 = {
	'radius': 100,
	'positionX': 300,
	'positionY': 0,
	'positionZ': 300,
	'modelInstance': null
};
// マップ２番ルート０番の扉
var Map2Sphere0 = {
	'radius': 100,
	'positionX': 300,
	'positionY': 0,
	'positionZ': 300,
	'modelInstance': null
};

// ネットケア利用者のデータ
var UserData = {
	'userid': null,				// FarbeのユーザーID
	'mapno': 0,				// 現在いるマップの番号
	'positionX': 0.0,			// 現在位置
	'positionY': 0.0,
	'positionZ': 0.0,
	'rotateX': 0.0,				// 回転(ラジアン)
	'rotateY': 0.0,
	'rotateZ': 0.0,
	'initservpos': false			// サーバー上の位置データを使って初期化したか
};

// マウス操作用
var MouseDragData = { 'sx': 0, 'sy': 0, 'flag': false, 'ev': {}, 'sev': {} };

// マルチタッチスクリーン操作テスト用変数
var TouchScreenRightData = { 'sx': 0, 'sy': 0, 'flag': false, 'ev':{} };
var TouchScreenLeftData = { 'sx': 0, 'sy': 0, 'flag': false, 'ev':{}  };
// 位置取得用メッシュ
var charactermesh;
var cameramesh;
// Object3Dクラスの子関係では、行列の乗算順序の関係で
// うまくカメラ位置が計算できないので、自分でやります
var CamCalcData = {
	'TransY': 150.0,
	'TransZ': 150.0,
	'TransVector': new THREE.Vector3(),
	'RotVector': new THREE.Vector3(),
	'TransMatrix': new THREE.Matrix4(),
	'RotMatrixX': new THREE.Matrix4(),
	'RotMatrixY': new THREE.Matrix4(),
	'CamTarget': new THREE.Vector3(),
	'BeforeCamTarget': new THREE.Vector3(),		// 最後に地面と接触した時の座標
	'CamPos': new THREE.Vector3(),
	'BeforeCamPos': new THREE.Vector3()		// 最後に地面と接触した時の座標
};
// アニメーションメッシュのデータ
var BlendMeshData = {
	'rotationY': 0.0
};
// ポストエフェクト用
var composer;
var ShadowComposer;	// シャドウマップ生成用(使っていません)
var ShadowCamera;	// (使っていません)

// サウンド用グローバル変数
var sound1;	// 鳥のさえずり
var sound2;	// 水の音

// マテリアルオブジェクトを作る
var ShaderMaterial = new THREE.ShaderMaterial({
	transparent: true,
	//blending: THREE.AdditiveBlending,	// 加算合成
	blending: THREE.NormalBlending,
	vertexShader: [
		//'precision highp float;',
		THREE.ShaderChunk[ 'common' ],
		THREE.ShaderChunk[ 'skinning_pars_vertex' ],
		'varying vec2 vUv;',
		'varying vec4 vPosition;',
		'varying vec3 vColor;',
		'void main() {',
		'vUv = uv;',
		'vColor = color;',
		'vec4 worldPosition = modelMatrix * vec4( position, 1.0 );',
		THREE.ShaderChunk[ 'skinbase_vertex' ],
		THREE.ShaderChunk[ 'begin_vertex' ],
		THREE.ShaderChunk[ 'skinning_vertex' ],
		THREE.ShaderChunk[ 'project_vertex' ],
		'vPosition = gl_Position;',
		//'gl_Position = projectionMatrix * mvPosition;',
		//'gl_Position = vPosition;',
		'}'
	].join( '\n' ),
	//vertexShader: THREE.ShaderChunk[ 'meshphong_vert' ],
	//vertexShader: [
		//'#define USE_MAP',
		//THREE.ShaderChunk[ 'meshbasic_vert' ],
	//].join( '\n' ),
	/*
	fragmentShader: [
		THREE.ShaderChunk[ 'common'],
		THREE.ShaderChunk[ 'color_pars_fragment' ],
		'uniform vec3 uColor;',
		'void main() {',
		THREE.ShaderChunk[ 'color_fragment' ],
		'gl_FragColor = vec4( uColor, 1.0 );',
		'}'
	].join( '\n' ),
	*/
	fragmentShader: [
		//'#define USE_MAP',
		//'#define PHONG',
		//'uniform vec3 diffuse;',
		//'uniform vec3 emissive;',
		//'uniform vec3 specular;',
		//'uniform highp float shininess;',
		//'uniform highp float specularStrength;',
		//'uniform float opacity;',
		//'#include <common>',
		//'#include <packing>',
		//'#include <color_pars_fragment>',
		//'#include <uv_pars_fragment>',
		//'#include <uv2_pars_fragment>',
		'#include <map_pars_fragment>',
		//'#include <fog_pars_fragment>',
		//'#include <bsdfs>',
		//'#include <lights_pars>',
		//'#include <lights_phong_pars_fragment>',
		//'varying vec2 vUv;',
		'varying vec2 vUv;',
		'uniform sampler2D texture;',
		'void main(){',
		//'vec4 diffuseColor = vec4( diffuse, opacity );',
		//'ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );',
		//'vec3 totalEmissiveRadiance = emissive;',
		//'#include <map_fragment>',
		//'#include <color_fragment>',
		//'#include <alphatest_fragment>',
		//'#include <normal_flip>',
		//'#include <normal_fragment>',
		//'#include <lights_phong_fragment>',
		//'#include <lights_template>',
		//'vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;',
		//'gl_FragColor = vec4( outgoingLight, diffuseColor.a );',
		//'gl_FragColor = vec4( diffuseColor.xyz, 1.0 );',
		//'gl_FragColor = vec4( 0.0, 1.0, 0.0, 1.0 );',
		//'gl_FragColor = texture2D( texture, gl_PointCoord );',
		//'if( texture2D( texture, vUv ).a < 0.5 ) discard;',
		'gl_FragColor = texture2D( map, vUv ).rgba;',
		//'gl_FragColor = vec4( 0.0, 1.0, 0.0, 0.5 );',
		// いろいろ試してみたが、MeshPhongMaterialでないので
		// 自前でパラメータを用意しなければだめぽい
		'}'
	].join( '\n' ),
	uniforms: THREE.UniformsUtils.merge( [	
		THREE.ShaderLib.phong.uniforms, // MeshPhongMaterial を上書きするので必要
		{
			//map: { type: 't', value: null },
			//clippingPlanes: { type: 'f', value: 0.0 },
			//fogColor: { type:'c', value: new THREE.Color( 0x000000 ) }
			uColor: { type: 'c', value: new THREE.Color( 0x00FF00 ) },
			texture: {
				type: 't',
				value: THREE.ImageUtils.loadTexture( '/green/model/kumakiti-texture1.png' )
			}
		}
	])
});
	
// ColladaLoader用ShaderMaterial
var ColladaShaderMaterial = new THREE.ShaderMaterial({
	transparent: true,
	blending: THREE.NormalBlending,
	vertexShader: ShaderMaterial.vertexShader,
	fragmentShader: [
		'#include <map_pars_fragment>',
		'varying vec2 vUv;',
		'void main(){',
		'gl_FragColor = texture2D( map, vUv );',
		//'gl_FragColor = vec4( 0.0, 1.0, 0.0, 0.5 );',
		'}'
	].join( '\n' ),
	uniforms: THREE.UniformsUtils.merge( [	
		THREE.ShaderLib.phong.uniforms, // MeshPhongMaterial を上書きするので必要
		{
			//map: { type: 't', value: null },
			//clippingPlanes: { type: 'f', value: 0.0 },
			//fogColor: { type:'c', value: new THREE.Color( 0x000000 ) }
		}
	])
});	
// ShadowMap生成用シェーダ
var ShadowMapShader = new THREE.ShaderMaterial({
	uniforms: THREE.UniformsUtils.merge( [	
		THREE.ShaderLib.phong.uniforms, // MeshPhongMaterial を上書きするので必要
		{
			//map: { type: 't', value: null },
			//clippingPlanes: { type: 'f', value: 0.0 },
			//fogColor: { type:'c', value: new THREE.Color( 0x000000 ) }
		}
	]),
	//skinning: true,
	vertexShader: ShaderMaterial.vertexShader,
	fragmentShader: [
		//'precision highp float;',
		//'varying vec4 vPosition;',
		'void main(){',
		'float depth = gl_FragCoord.z;',
		'gl_FragColor = vec4( vec3( depth ), 1.0 );',
		'}'
	].join( '\n' )
});
// シャドウありシェーダー
var ShadowOnShader = new THREE.ShaderMaterial({
	uniforms: THREE.UniformsUtils.merge( [	
		THREE.ShaderLib.phong.uniforms, // MeshPhongMaterial を上書きするので必要
		{
			//map: { type: 't', value: null },
			//clippingPlanes: { type: 'f', value: 0.0 },
			//fogColor: { type:'c', value: new THREE.Color( 0x000000 ) }
		}
	]),
	vertexShader: ShaderMaterial.vertexShader,
	fragmentShader: [
		'varying vec2 vUv;',
		'uniform sampler2D map;',
		'void main(){',
		'vec4 texelColor = texture2D( map, vUv );',
		'gl_FragColor = texelColor;',
		'}'
	].join( '\n' )
});
// 木の葉っぱシェーダー
var LeafShader = new THREE.ShaderMaterial({
	transparent: true,
	//vertexColors: THREE.VertexColors,
	uniforms: THREE.UniformsUtils.merge( [	
		THREE.ShaderLib.phong.uniforms, // MeshPhongMaterial を上書きするので必要
		{
			//map: { type: 't', value: null },
			//clippingPlanes: { type: 'f', value: 0.0 },
			//fogColor: { type:'c', value: new THREE.Color( 0x000000 ) }
			texture: {
				type: 't',
				value: THREE.ImageUtils.loadTexture( '/green/model/tree-leaf3.png' )
			}
		}
	]),
	vertexShader: ShaderMaterial.vertexShader,
	fragmentShader: [
		/////////////////////////
		// GLSLのコード
		//
		/////////////////////////
		'varying vec2 vUv;',
		'varying vec4 vPosition;',
		'uniform sampler2D map;',
		'uniform sampler2D texture;',
		'void main(){',
		//'vec4 texelColor = texture2D( map, vUv );',
		'vec4 texelColor = texture2D( texture, vUv );',
		'if( texelColor.a < 0.5 ) discard;',

		// 緑の葉っぱ用のコード
		//'if( texelColor.r < 0.6 && texelColor.g > 0.6 && texelColor.b < 0.6 ){',

		// 桜の花びら用のコード
		'if( texelColor.r > 0.7 && texelColor.g < 0.53 && texelColor.b > 0.7 ){',

		'if( mod( vPosition.y, 0.7 ) >= 0.1 )',
		'texelColor.rgb = vec3( 1.0 );',
		'}',
		'gl_FragColor = texelColor;',
		'}'
	].join( '\n' )
});
LeafShader.uniforms.texture.value.needsUpdate = true;	// これがないと読み込んだテクスチャーが表示されない

var WaterShader1 = new THREE.ShaderMaterial({
	transparent: true,
	uniforms: THREE.UniformsUtils.merge( [	
		THREE.ShaderLib.phong.uniforms, // MeshPhongMaterial を上書きするので必要
		{
			//map: { type: 't', value: null },
			//clippingPlanes: { type: 'f', value: 0.0 },
			//fogColor: { type:'c', value: new THREE.Color( 0x000000 ) }
			tex1: {
				type: 't',
				value: THREE.ImageUtils.loadTexture( '/green/model/water1.png' )
			},
			color1: {
				type: 'v4',
				value: new THREE.Vector4( 0, 1, 0, 1 )
			},
			uvy: {
				type: 'f',
				value: 0.0
			}
		}
	]),
	vertexShader: ShaderMaterial.vertexShader,
	fragmentShader: [
		'varying vec2 vUv;',
		'varying vec4 vPosition;',
		'uniform vec4 color1;',
		'uniform sampler2D map;',
		'uniform sampler2D tex1;',
		'uniform float uvy;',
		'void main(){',
		'vec2 vUv = vec2( vUv.x, vUv.y + uvy );',
		'vec4 texelColor = texture2D( map, vUv );',
		'if( texelColor.a < 0.5 ) discard;',
		'gl_FragColor = texelColor;',
		'}'
	].join( '\n' )
});

var BlockShader1 = new THREE.ShaderMaterial({
	transparent: true,
	uniforms: THREE.UniformsUtils.merge([
		THREE.ShaderLib.phong.uniforms,		// Phong の Uniform
		{
			// 独自の Uniform 変数定義
		}
	]),
	vertexShader: ShaderMaterial.vertexShader,
	fragmentShader: [
		'varying vec2 vUv;',
		'varying vec4 vPosition;',
		'varying vec3 vColor;',
		'uniform sampler2D map;',
		'void main(){',
		'vec4 texelColor = texture2D( map, vUv );',
		//'texelColor = vec4( texelColor.r * vColor.r, texelColor.g * vColor.g, texelColor.b * vColor.b, texelColor.a );',
		// 'texelColor.r = ( vColor.r < 0.5 ? (2.0 * vColor.r * texelColor.r) : (1.0 - 2.0 * (1.0 - texelColor.r) * (1.0 - vColor.r)));',
		// 'texelColor.g = ( vColor.g < 0.5 ? (2.0 * vColor.g * texelColor.g) : (1.0 - 2.0 * (1.0 - texelColor.g) * (1.0 - vColor.g)));',
		// 'texelColor.b = ( vColor.b < 0.5 ? (2.0 * vColor.b * texelColor.b) : (1.0 - 2.0 * (1.0 - texelColor.b) * (1.0 - vColor.b)));',
		// 下の計算式がすごくいい感じ
		// 'texelColor.r = ( vColor.r < 0.5 ? (2.0 * vColor.r * texelColor.r) : (texelColor.r + vColor.r) - 0.5 );',
		// 'texelColor.g = ( vColor.g < 0.5 ? (2.0 * vColor.g * texelColor.g) : (texelColor.g + vColor.g) - 0.5 );',
		// 'texelColor.b = ( vColor.b < 0.5 ? (2.0 * vColor.b * texelColor.b) : (texelColor.b + vColor.b) - 0.5 );',
		'texelColor.rgb = texelColor.rgb + vColor.rgb - vec3( 0.5 );',
		'if( texelColor.a < 0.5 ) discard;',
		'gl_FragColor = texelColor;',
		'}'
	].join( '\n' )
});

// マテリアルすり替えデータ更新
ChangeShaderMaterialData = [{
	'MaterialName': 'ShaderMaterial1',		// すり替え対象のマテリアル名
	'MaterialObject': ShaderMaterial		// マテリアルオブジェクト
},{
	'MaterialName': 'Chair1Mat1',
	'MaterialObject': ColladaShaderMaterial
},{
	// 木の葉っぱシェーダー@TreeBlendMesh
	'MaterialName': 'TreeMaterial1',
	'MaterialObject': LeafShader
},{
	'MaterialName': 'WaterMaterial1',
	'MaterialObject': WaterShader1	
},{
	'MaterialName': 'BlockMaterial1',
	'MaterialObject': BlockShader1
}];


// GlobalChatScript
//=================================================
//var nickname_id = <?php echo $nickname_id; ?>;
var nickname_id = 1;	// debug.
var LoginData = {};

jQuery.ajaxSetup({ cache: false });

var DisplayCommentOld = [];	// 取得したグローバルチャットデータ
var DisplayComment = [];	// 新規コメントが格納されている配列
				// 表示される文字列データと考える
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
	// 配列の長さが10未満なら全部入れる
	if( DisplayCommentOld.length === 0 ){
		for( var i in obj ){
			DisplayCommentOld.push({
				"player_id": parseInt( obj[i].nickname_id ),
				"nickname": obj[i].nickname,
				"comment": obj[i].text,
				"timer": 0,
				"mes_id": parseInt( obj[i].message_id )
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
				if( DisplayCommentOld[j].mes_id === parseInt( obj[i].message_id ) ){
					newflag = false;
				}
			}

			// newflag が true なら obj[i] が新しいデータ
			if( newflag === true ){

				//debugger;

				// DisplayComment 配列内に obj[i].nickname_id がないか検索
				var existflag = false;
				for( var p in DisplayComment ){
					if( DisplayComment[p]["player_id"] === obj[i].nickname_id ){
						// 同じIDのデータを上書き
						DisplayComment[p] = {
								"player_id": parseInt( obj[i].nickname_id ),
								"nickname": obj[i].nickname,
								"comment": obj[i].text,
								"timer": 0,
								"mes_id": parseInt( obj[i].message_id )
							};
						existflag = true;	// DisplayComment内に 同じデータがあった
						break;	// p のループを抜ける
					}
				}
				// DisplayComment 配列内に obj[i].nickname_id が存在しない
				if( existflag === false ){
					// DisplayComment 配列に新規データをpush
					DisplayComment.push({
						"player_id": parseInt( obj[i].nickname_id ),
						"nickname": obj[i].nickname,
						"comment": obj[i].text,
						"timer": 0,
						"mes_id": parseInt( obj[i].message_id )
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
						"mes_id": parseInt( obj[k].message_id )
					});
				} // for( var k in obj )
			} // if( newflag == true )
		} // for( var i in obj )
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

	// この配列を空にする
	OtherPlayers = [];

	for( var i in obj ){

		var player_id = parseInt( obj[i].player_id );
		var nickname = obj[i].nickname;
		var px = parseFloat( obj[i].px );
		var py = parseFloat( obj[i].py );
		var pz = parseFloat( obj[i].pz );
		// 回転データを試しに追加
		var rx = parseFloat( obj[i].rx );
		var ry = parseFloat( obj[i].ry );
		var rz = parseFloat( obj[i].rz );
		// マップ番号
		var mapno = parseInt( obj[i].mapno );


		OtherPlayers.push({
			"player_id": player_id,
			"nickname": nickname,
			"px": px,
			"py": py,
			"pz": pz,
			'rx': rx,
			'ry': ry,
			'rz': rz,
			'mapno': mapno
		});

		var flag = false;
		for( var j in OtherPlayersPos ){
			if( OtherPlayersPos[j].player_id === player_id ){
				flag = true;
			}
		}
		// OtherPlayersPos に player_id のオブジェクトが無い場合
		if( flag === false ){
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

			// コメントアウト箇所
			//model = CreatePorin( new THREE.Vector3( px, py, pz ) );
			// モデルのロードが非同期読み込みなので
			// 存在しているインスタンスをクローン作戦
			// => copy メソッドが存在しないエラー
			// あきらめてロードします

			// IDが自分のものだった場合、初期位置・角度を設定する
			// 前回、遊んでいた時の座標が適用されます
			// ログアウトすると位置が初期化される、なぜ
			if( player_id === LoginData.id && UserData.initservpos === false ){
				CamCalcData.CamTarget.set( px, py, pz );
				BlendMeshData.rotationY = ry;
				UserData.initservpos = true;
			}

			// IDが自分の場合はオブジェクトを追加しないのと
			// 他のマップIDの場合追加しない
			if( player_id !== LoginData.id &&
				mapno === UserData.mapno 
			){
				//console.log( 'player_id: ' + player_id );
				//console.log( 'LoginData.id: ' + LoginData.id );
				//console.log( 'CreateBlendMesh!!!' );
				// => 複数ログインすると１秒ごとに呼ばれるということは

				var model = new THREE.BlendCharacter();
				// アニメーション用プロセスを生成
				var animproc = new MeshAnimateProcessOnce( 'animproc', model );

				// プロセスマネージャに追加
				pm.attach( animproc );
				// モデルのロード
				model.load( '/green/model/kumakiti1.json', function(){

					model.position.set( px, py, pz );
					model.rotation.set( rx, ry, rz );
					model.scale.set( 10.0, 10.0, 10.0 );	// 忘れずに
					model.play( 'walk1', 1.0 );		// 歩きモーション

					// 忘れずにシーンへ追加
					scene.add( model );
				});

				// この処理を非同期にするとバグる
				var newplayerdata = {
					"player_id": player_id,
					"nickname": nickname,
					"px": px,
					"py": py,
					"pz": pz,
					'rx': rx,
					'ry': ry,
					'rz': rz,
					"model": model,
					'process': animproc,
					'mapno': mapno
				};
				OtherPlayersPos.push( newplayerdata );
				//console.log( 'OtherPlayersPos.pushed: ' + player_id );
				//console.log( OtherPlayersPos );	// 上でpushしてるのに常時空、なぜ？
				//console.log( OtherPlayers );
				//console.log( pm );			// プロセスに異常はみられない

			} // if( player_id != LoginData.id )
		}
	}

	// OtherPlayersPos から更新の無いデータを削除
	for( var i in OtherPlayersPos ){
		var eraseflag = true;
		//for( var j in obj ){	// ここら辺でバグコードが入っていた
		for( var j in OtherPlayers ){
			if(	//OtherPlayersPos[i]["player_id"] === obj[j].player_id		// バグコード
				OtherPlayersPos[i].player_id === OtherPlayers[j].player_id
			){
				eraseflag = false;
			}
		}
		if( eraseflag === true ){
			// IDが自分の場合はシーンから削除しない
			if( OtherPlayersPos[i]['player_id'] != LoginData.id ){
				// アニメーションプロセスを切る
				OtherPlayersPos[i]['process'].killProcess();
				// シーンからオブジェクトを削除する
				scene.remove( OtherPlayersPos[i]["model"] );
				// 配列から取り除く
				OtherPlayersPos.splice( i, 1 );

				//console.log( 'erase proc true!!!' );	// なぜか１秒ごとに呼び出されている、ここが原因か
			}
		}

	} // for( var i in OtherPlayersPos )

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
	
	/*** debug
	var senddata = [];
	for( var i in str ){
		// PostGetGlobalChatText Event
		if( str[i] === 'GetMes' ){
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

		if( str[i] === 'PostGetMes' ){
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

		if( str[i] === 'PostGetPos' ){
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
		if( str[i] === 'GetStuffComment' ){
			senddata.push({
				"datetime": GetDateTime(),
				"userid":	nickname_id,
				"eventid":	'GetStuffComment'.hashCode(),
				"data": "no data."
			});
		}

		// ログインイベントを送信
		if( str[i] === 'Login' ){
			senddata.push({
				"datetime": GetDateTime(),
				"userid":	nickname_id,
				"eventid":	'LoginEvent'.hashCode(),
				"data": "no data."
			});
		}

		// ログアウトイベントを送信
		if( str[i] === 'Logout' ){
			senddata.push({
				"datetime": GetDateTime(),
				"userid":	nickname_id,
				"eventid":	'LogoutEvent'.hashCode(),
				"data": "no data."
			});
		}

		// 位置移動イベントを送信
		if( str[i] === 'MovePos' ){
			senddata.push({
				"datetime": GetDateTime(),
				"userid":	nickname_id,
				"eventid":	'MovePosition'.hashCode(),
				"data": {
					// "px": MovetoMesh.position.x,
					// "py": MovetoMesh.position.y,
					// "pz": MovetoMesh.position.z,
					// (!) 移動方法を変えるので別のデータを入れる
					'px': UserData.positionX,
					'py': UserData.positionY,
					'pz': UserData.positionZ,
					// 回転情報を追加する
					'rx': UserData.rotateX,
					'ry': UserData.rotateY,
					'rz': UserData.rotateZ,
					// 現在居るマップ番号を送信
					'mapno': UserData.mapno
				}
			});
		}

		// 位置取得イベントを送信
		if( str[i] === 'GetPos' ){
			senddata.push({
				"datetime": GetDateTime(),
				"userid":	nickname_id,
				"eventid":	'GetPosition'.hashCode(),
				"data": "no data."
			});
		}

		// 接続中を知らせるイベント
		if( str[i] === 'Link' ){
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
				if( event.eventid === "SendGlobalChatText".hashCode() ){
					UpdateDisplayComment( event.data );
				}
				
				// SendPlayerPosition イベントを処理する
				if( event.eventid === 'SendPlayerPosition'.hashCode() ){
					//UpdatePlayerPosition( event.data );
				}

				// SendStuffComment イベントを処理する
				if( event.eventid === 'SendStuffComment'.hashCode() ){
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
				if( event.eventid === 'SendPlayerPosition2'.hashCode() ){
					UpdatePlayerPosition( event.data );
				}
			}
		}
	});
	
	***/
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
	"process": Object
	"mapno": int
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

function enter( pressEvent ){
	//if( window.event.keyCode == 13 ){
	var keycode = pressEvent.which || pressEvent.keyCode;
	if( keycode === 13 ){
		PostGetMessages( ['PostGetMes'] );
		//PostGlobalChatDataAjax( $("#global_chat_text").val() );
	}

	keyinput = keycode;	
};
document.onkeydown = enter;

function inputkeyup( upEvent ){
	keyinput = -1;
};
document.onkeyup = inputkeyup;


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
var BlendMesh;		// テスト用
var TreeBlendMesh;	// テスト用
var GroundMesh;
var MazeMesh;		// 迷路ゲーム起動用

var BlendMeshAnimateProcess = null;	// BlendMeshのアニメーションプロセス

// Screen size.
// 可変しても大丈夫らしい
var SCREEN_WIDTH = 100;		// 640
var SCREEN_HEIGHT = 100;	// 480

// VRアイコンイメージ
var vriconimage;
// VR表示が必要かどうか
var onvr = false;
var composer;		// エフェクトコンポーザ
var renderpass;		// スクリーンレンダーパス
var stereocamera;	// ステレオカメラ
var controlsL;		// VRのカメラコントロール
var controlsR;
var fixvrcameravec3 = new THREE.Vector3();	// コントローラーでVRカメラを操作するためのやつ

// 3D迷路関連
var titlecamerarotate = 0.0;	// タイトル画面のマップ回転用変数
var GamepadIDString = 'HORI PAD 3 TURBO (Vendor: 0f0d Product: 0009)';
var GamepadIDString2 = 'Gamesir-G3s';
var taimatumodel = null;	// たいまつのモデル

// 3D迷路用のマップデータ
var mazemap1 = [
	[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
	[ 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1 ],
	[ 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1 ],
	[ 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1 ],
	[ 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1 ],
	[ 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1 ],
	[ 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1 ],
	[ 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1 ],
	[ 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1 ],
	[ 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1 ],
	[ 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1 ],
	[ 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1 ],
	[ 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1 ],
	[ 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1 ],
	[ 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1 ],
	[ 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1 ],
	[ 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1 ],
	[ 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1 ],
	[ 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1 ],
	[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ]
];
// Ammo.js 物理空間変数
var dynamicsWorld;	// 物理ワールド
var dynamicsSphere;	// プレイヤー球体
var spheretrans = new Ammo.btTransform();	// 位置取得用
var keyinput = -1;	// キーボードの押下検知用
// 3D迷路のカメラ角度制御用
var mazecamerarot = new THREE.Vector3( 0.0, -3.14/2.0, 0.0 );
var mazetitleimage1;
// 時間制限用変数
var mazetime_minute;
var mazetime_second;
// 迷路用BGM
var maze_bgm1;
// 迷路用パーティクルオブジェクト(たいまつの炎)
var maze_taimatu_particles = [];
// パーティクルテクスチャ
var maze_taimatu_particles_texture = null;
// たいまつの点光源
var maze_taimatu_light = null;

// (!)こんなところにさくらパーティクル処理関数が書かれています

// さくらの花びらのテクスチャ変数
var sakura_texture = null;
// さくらパーティクル変数配列
var sakura_particles = [];
// さくらパーティクル生成関数
function CreateSakuraParticle( vec3pos, ptexture ){
	var pGeometry;
	var pMatrial;

	pMaterial = new THREE.SpriteMaterial({
		color: 0xFFFFFF,
		map: ptexture,
		//size: 100.0,
		blending: THREE.AdditiveBlending,
		transparent: true,
		depthTest: false
	});

	var particle = new THREE.Sprite( pMaterial );
	particle.position.set( vec3pos.x, vec3pos.y, vec3pos.z );

	var size = 2.0;
	particle.scale.set( size, size, size );
	sakura_particles.push( particle );
	scene.add( particle );
};

// パーティクル生成関数
function CreateMazeParticle( vec3pos, ptexture ){
	var pGeometry;
	var pMatrial;

	//pGeometry = new THREE.Geometry();
	//pGeometry.vertices.push( vec3pos );

	//pMaterial = new THREE.PointsMaterial({
	//pMaterial = new THREE.ParticleBasicMaterial({
	//pMaterial = new THREE.PointCloudMaterial({
	pMaterial = new THREE.SpriteMaterial({
		color: 0xFFFFFF,
		map: ptexture,
		//size: 100.0,
		blending: THREE.AdditiveBlending,
		transparent: true,
		depthTest: false
	});

	//var particle = new THREE.Points( pGeometry, pMatrial );
	//var particle = new THREE.PointCloud( pGeometry, pMatrial );
	var particle = new THREE.Sprite( pMaterial );
	particle.position.set( vec3pos.x, vec3pos.y, vec3pos.z );
	var size = 10.0;
	particle.scale.set( size, size, size );
	maze_taimatu_particles.push( particle );
	scene.add( particle );
};


// マウスカーソルのドラッグ時の処理
function MouseDragProcess(){
	
	// ゲームパッドの情報取得
	var gamepadlist = navigator.getGamepads();
	var gamepad = null;
	for( var i=0; i<4; ++i ){
		gamepad = gamepadlist[i];
		if( gamepad === null ) continue;

		if( gamepad.id !== undefined ){
			if( gamepad.id.indexOf( 'Gamesir-G3s' ) >= 0 ) break;
			if( gamepad.id.indexOf( 'Xbox' ) >= 0 ) break;
			if( gamepad.id.indexOf( 'HORI' ) >= 0 ) break;
		}
	}

	// イベントデータが代入されていなかったら処理しない
	//if( MouseDragData.ev === null && gamepad === null ) return;
	//if( MouseDragData.ev === null ) return;

	// IEでも対応できるようキーコードを取得
	//var keycode = MouseDragData.ev.which || MouseDragData.ev.keyCode;
	var keycode = MouseDragData.sev.which || MouseDragData.sev.keyCode;


	// 左ボタンドラッグ（キャラクタ移動）処理
	if( gamepad !== null )	// ゲームパッドが接続されている時の処理
	if(
		( MouseDragData.sx !== 0 || MouseDragData.sy !== 0 ) && keycode === 1 ||
		Math.abs( gamepad.axes[0] ) >= 0.1 || Math.abs( gamepad.axes[1] ) >= 0.1
	){
		var ray = new THREE.Raycaster(
			new THREE.Vector3(
				CamCalcData.CamTarget.x,
				CamCalcData.CamTarget.y + 100.0,
				CamCalcData.CamTarget.z
			),	
			new THREE.Vector3(
				0.0,
				-1.0,
				0.0
			) // 正規化済み
		);
		// 交差する点を計算
		if( GroundMesh === undefined ) return;	// 不要かも？
		var crossobj = ray.intersectObjects( GroundMesh.children, true );
		var crosspy = 0.0;
		var freezeflag = false;
		if( crossobj.length > 0 ){
			crosspy = crossobj[0].point.y;

			// レイを飛ばしてオブジェクトに衝突しているときの座標を格納
			CamCalcData.BeforeCamTarget.set(
				CamCalcData.CamTarget.x,
				CamCalcData.CamTarget.y,
				CamCalcData.CamTarget.z
			);
			CamCalcData.BeforeCamPos.set(
				CamCalcData.CamPos.x,
				CamCalcData.CamPos.y,
				CamCalcData.CamPos.z
			);
		}
		// 当たり判定用制御コード
		else{
			freezeflag = true;	
		}

		// コントローラでの移動処理
		var sdy = 0.0;
		var sdx = 0.0;
		var gdx = 0.0;
		var gdy = 0.0;


		// 初期はgamepadlistは、nullなので取得できない（ハマッタ）
		if( gamepad !== null ){
			var axes = gamepad.axes;
			var gdx = axes[0];
			var gdy = axes[1];
			if( Math.abs( gdx ) <= 0.1 ) gdx = 0.00001;
			if( Math.abs( gdy ) <= 0.1 ) gdy = 0.00001;
			gdx *= 2.0;
			gdy *= 2.0;

			console.log( 'gdx: ' + gdx + ' gdy: ' + gdy );

			sdx += gdx;
			sdy += gdy;
			// if( Math.abs( sdx ) <= 0.3 && Math.abs( sdy ) <= 0.3 ){
			// 	sdx = 0.0;
			// 	sdy = 0.0;
			// }
		}
		if( MouseDragData.ev !== null ){
			var scale = 0.01;

			sdx = MouseDragData.ev.pageX - MouseDragData.sx;
			sdy = MouseDragData.ev.pageY - MouseDragData.sy;
			//if( sdx === 0.0 && sdy === 0.0 ) return;

			sdx *= scale;
			sdy *= scale;
		}

		//if( sdx === 0.0 && sdy === 0.0 ) return;


		var TranslateVector = new THREE.Vector3( sdx, 0.0, sdy );
		// 現在のカメラ角度(Y軸)で座標変換を行う行列を作る
		var RotMat = new THREE.Matrix4();
		RotMat.makeRotationFromEuler(
			new THREE.Euler( 0.0, CamCalcData.RotVector.y, 0.0, 'XYZ' )
		);
		// キャラクタ移動量をカメラの角度で座標変換
		TranslateVector.applyMatrix4( RotMat );
		// 注視先に加算する
		CamCalcData.CamTarget.x += TranslateVector.x;
		CamCalcData.CamTarget.y = crosspy;
		CamCalcData.CamTarget.z += TranslateVector.z;
		// カメラの位置にも加算する
		CamCalcData.CamPos.x += TranslateVector.x;
		CamCalcData.CamPos.z += TranslateVector.z;

		// キャラクタが地面から外れたら
		// オブジェクトが衝突していた時の座標にする
		if( freezeflag === true ){
			CamCalcData.CamTarget.set(
				CamCalcData.BeforeCamTarget.x,
				CamCalcData.BeforeCamTarget.y,
				CamCalcData.BeforeCamTarget.z
			);
			CamCalcData.CamPos.set(
				CamCalcData.BeforeCamPos.x,
				CamCalcData.BeforeCamPos.y,
				CamCalcData.BeforeCamPos.z
			);
		}

		// キャラクター移動時の回転処理
		var TanVec = new THREE.Vector3(
			TranslateVector.x,
			0.0,
			TranslateVector.z
		);
		TanVec.normalize();

		// キャラクタのメッシュに角度を適用
		BlendMeshData.rotationY = Math.atan2( TanVec.x, TanVec.z );

		// キャラクタをアニメーションさせる
		if( BlendMesh.mixer )
		BlendMesh.update( 1.0 / 60.0 );
	} // if( MouseDragData.sx != 0 || MouseDragData.sy != 0 && MouseDragData.ev.which == 1 )
	if( gamepad === null )	// ゲームパッドが接続されていない時の処理
	if(
		( MouseDragData.sx !== 0 || MouseDragData.sy !== 0 ) && keycode === 1
	){
		var ray = new THREE.Raycaster(
			new THREE.Vector3(
				CamCalcData.CamTarget.x,
				CamCalcData.CamTarget.y + 100.0,
				CamCalcData.CamTarget.z
			),	
			new THREE.Vector3(
				0.0,
				-1.0,
				0.0
			) // 正規化済み
		);
		// 交差する点を計算
		if( GroundMesh === undefined ) return;	// 不要かも？
		var crossobj = ray.intersectObjects( GroundMesh.children, true );
		var crosspy = 0.0;
		var freezeflag = false;
		if( crossobj.length > 0 ){
			crosspy = crossobj[0].point.y;

			// レイを飛ばしてオブジェクトに衝突しているときの座標を格納
			CamCalcData.BeforeCamTarget.set(
				CamCalcData.CamTarget.x,
				CamCalcData.CamTarget.y,
				CamCalcData.CamTarget.z
			);
			CamCalcData.BeforeCamPos.set(
				CamCalcData.CamPos.x,
				CamCalcData.CamPos.y,
				CamCalcData.CamPos.z
			);
		}
		// 当たり判定用制御コード
		else{
			freezeflag = true;	
		}

		// コントローラでの移動処理
		var sdy = 0.0;
		var sdx = 0.0;
		var gdx = 0.0;
		var gdy = 0.0;


		if( MouseDragData.ev !== null ){
			var scale = 0.01;

			sdx = MouseDragData.ev.pageX - MouseDragData.sx;
			sdy = MouseDragData.ev.pageY - MouseDragData.sy;
			//if( sdx === 0.0 && sdy === 0.0 ) return;

			sdx *= scale;
			sdy *= scale;
		}

		if( sdx === 0.0 && sdy === 0.0 ) return;


		var TranslateVector = new THREE.Vector3( sdx, 0.0, sdy );
		// 現在のカメラ角度(Y軸)で座標変換を行う行列を作る
		var RotMat = new THREE.Matrix4();
		RotMat.makeRotationFromEuler(
			new THREE.Euler( 0.0, CamCalcData.RotVector.y, 0.0, 'XYZ' )
		);
		// キャラクタ移動量をカメラの角度で座標変換
		TranslateVector.applyMatrix4( RotMat );
		// 注視先に加算する
		CamCalcData.CamTarget.x += TranslateVector.x;
		CamCalcData.CamTarget.y = crosspy;
		CamCalcData.CamTarget.z += TranslateVector.z;
		// カメラの位置にも加算する
		CamCalcData.CamPos.x += TranslateVector.x;
		CamCalcData.CamPos.z += TranslateVector.z;

		// キャラクタが地面から外れたら
		// オブジェクトが衝突していた時の座標にする
		if( freezeflag === true ){
			CamCalcData.CamTarget.set(
				CamCalcData.BeforeCamTarget.x,
				CamCalcData.BeforeCamTarget.y,
				CamCalcData.BeforeCamTarget.z
			);
			CamCalcData.CamPos.set(
				CamCalcData.BeforeCamPos.x,
				CamCalcData.BeforeCamPos.y,
				CamCalcData.BeforeCamPos.z
			);
		}

		// キャラクター移動時の回転処理
		var TanVec = new THREE.Vector3(
			TranslateVector.x,
			0.0,
			TranslateVector.z
		);
		TanVec.normalize();

		// キャラクタのメッシュに角度を適用
		BlendMeshData.rotationY = Math.atan2( TanVec.x, TanVec.z );

		// キャラクタをアニメーションさせる
		if( BlendMesh.mixer )
		BlendMesh.update( 1.0 / 60.0 );
	} // if( MouseDragData.sx != 0 || MouseDragData.sy != 0 && MouseDragData.ev.which == 1 )

	// 右ボタンドラッグ時の処理
	if( gamepad !== null )	// ゲームパッドが接続されている時の処理
	if(
		( MouseDragData.sx != 0 || MouseDragData.sy != 0 ) && keycode === 3 ||
		Math.abs( gamepad.axes[2] ) >= 0.1 || Math.abs( gamepad.axes[3] ) >= 0.1
	){
		var scale = 0.001;	// 接続されていない時の10倍じゃないと遅い
		var rot = CamCalcData.RotVector;

		var gdx = 0.0;
		var gdy = 0.0;
		var sdx = 0.0;
		var sdy = 0.0;

		if( gamepad !== null ){
			var axes = gamepad.axes;
			var gdx = axes[2];
			var gdy = axes[3];
			if( Math.abs( gdx ) <= 0.1 ) gdx = 0.0;
			if( Math.abs( gdy ) <= 0.1 ) gdy = 0.0;
			gdx *= -10.0;
			gdy *= -10.0;

			sdx += gdx;
			sdy += gdy;
			// if( Math.abs( sdx ) <= 0.3 && Math.abs( sdy ) <= 0.3 ){
			// 	sdx = 0.0;
			// 	sdy = 0.0;
			// }
		}
		if( MouseDragData.ev !== null ){
			sdx = MouseDragData.ev.pageX - MouseDragData.sx;
			sdy = MouseDragData.ev.pageY - MouseDragData.sy;
			//if( sdx === 0.0 && sdy === 0.0 ) return;
		}

		//if( sdx === 0.0 && sdy === 0.0 ) return;

		var adx = rot.x + ( sdy * scale * -1.0 );
		if( adx > 3.14 ) adx = -3.14;
		if( adx < -3.14 ) adx = 3.14;
		var ady = rot.y + ( sdx * scale * -1.0 );
		if( ady > 3.14 ) ady = -3.14;
		if( ady < -3.14 ) ady = 3.14;

		CamCalcData.RotVector.set( adx, ady, 0.0 );

		// 移動行列を作ります
		CamCalcData.TransMatrix.makeTranslation(
			0.0, CamCalcData.TransY, CamCalcData.TransZ
		);
		// 回転行列を作ります(X軸)
		CamCalcData.RotMatrixX.makeRotationFromEuler(
			new THREE.Euler(
				CamCalcData.RotVector.x,
				0.0,
				0.0,
				'XYZ'
			)
		);
		// 回転行列を作ります(Y軸)
		CamCalcData.RotMatrixY.makeRotationFromEuler(
			new THREE.Euler(
				0.0,
				CamCalcData.RotVector.y,
				0.0
			)
		);
		// 変換用の座標を作ります
		var addvec = new THREE.Vector3( 0.0, 0.0, 0.0 );
		// まずは移動させます
		addvec.applyMatrix4( CamCalcData.TransMatrix );
		// 次にX軸回転させます
		addvec.applyMatrix4( CamCalcData.RotMatrixX );
		// 次にY軸回転させます
		addvec.applyMatrix4( CamCalcData.RotMatrixY );
		// CamPosがカメラの座標
		CamCalcData.CamPos.x = CamCalcData.CamTarget.x + addvec.x;
		CamCalcData.CamPos.y = CamCalcData.CamTarget.y + addvec.y;
		CamCalcData.CamPos.z = CamCalcData.CamTarget.z + addvec.z;

	} //if( MouseDragData.sx != 0 || MouseDragData.sy != 0 && MouseDragData.ev.which === 3 )
	if( gamepad === null )	// ゲームパッドが接続されていないときの処理
	if(
		( MouseDragData.sx != 0 || MouseDragData.sy != 0 ) && keycode === 3
	){
		var scale = 0.0001;
		var rot = CamCalcData.RotVector;

		var gdx = 0.0;
		var gdy = 0.0;
		var sdx = 0.0;
		var sdy = 0.0;

		if( MouseDragData.ev !== null ){
			sdx = MouseDragData.ev.pageX - MouseDragData.sx;
			sdy = MouseDragData.ev.pageY - MouseDragData.sy;
			//if( sdx === 0.0 && sdy === 0.0 ) return;
		}

		if( sdx === 0.0 && sdy === 0.0 ) return;

		var adx = rot.x + ( sdy * scale * -1.0 );
		if( adx > 3.14 ) adx = -3.14;
		if( adx < -3.14 ) adx = 3.14;
		var ady = rot.y + ( sdx * scale * -1.0 );
		if( ady > 3.14 ) ady = -3.14;
		if( ady < -3.14 ) ady = 3.14;

		CamCalcData.RotVector.set( adx, ady, 0.0 );

		// 移動行列を作ります
		CamCalcData.TransMatrix.makeTranslation(
			0.0, CamCalcData.TransY, CamCalcData.TransZ
		);
		// 回転行列を作ります(X軸)
		CamCalcData.RotMatrixX.makeRotationFromEuler(
			new THREE.Euler(
				CamCalcData.RotVector.x,
				0.0,
				0.0,
				'XYZ'
			)
		);
		// 回転行列を作ります(Y軸)
		CamCalcData.RotMatrixY.makeRotationFromEuler(
			new THREE.Euler(
				0.0,
				CamCalcData.RotVector.y,
				0.0
			)
		);
		// 変換用の座標を作ります
		var addvec = new THREE.Vector3( 0.0, 0.0, 0.0 );
		// まずは移動させます
		addvec.applyMatrix4( CamCalcData.TransMatrix );
		// 次にX軸回転させます
		addvec.applyMatrix4( CamCalcData.RotMatrixX );
		// 次にY軸回転させます
		addvec.applyMatrix4( CamCalcData.RotMatrixY );
		// CamPosがカメラの座標
		CamCalcData.CamPos.x = CamCalcData.CamTarget.x + addvec.x;
		CamCalcData.CamPos.y = CamCalcData.CamTarget.y + addvec.y;
		CamCalcData.CamPos.z = CamCalcData.CamTarget.z + addvec.z;

	} //if( MouseDragData.sx != 0 || MouseDragData.sy != 0 && MouseDragData.ev.which === 3 )

};

// 左画面をタッチ中の処理
function TouchLeftMoveProcess( ev ){

	// イベントデータが代入されていなかったら処理しない
	if( ev.targetTouches === undefined ) return;

	// 複数のタッチの場合ループ
	for( var i in ev.targetTouches ){

		// 右画面からの移動なら処理しない
		if( TouchScreenLeftData.sx >= (SCREEN_WIDTH/2) &&
			ev.targetTouches[i].pageX < (SCREEN_WIDTH/2)
		){
			break;
		}

		// 左画面のキャラクタ移動処理
		// タッチ開始位置が0でなければ処理する
		if( ev.targetTouches[i].pageX < (SCREEN_WIDTH/2) &&
			TouchScreenLeftData.sx != 0 &&
			TouchScreenLeftData.sy != 0
		){
			// レイを飛ばしてカメラの位置を計算する
			var ray = new THREE.Raycaster(
				new THREE.Vector3(
					CamCalcData.CamTarget.x,
					CamCalcData.CamTarget.y + 100.0,
					CamCalcData.CamTarget.z
				),
				new THREE.Vector3(
					0.0,
					-1.0,
					0.0
				) // 正規化済み
			);	
			// 交差する点を計算
			//var crossobj = ray.intersectObjects( scene.children, true );
			var crossobj = ray.intersectObjects( GroundMesh.children, true );
			//var crosspy = crossobj[0].point.y;
			var crosspy = 0.0;
			if( crossobj.length > 0 ){
				// 一番低い座標を入れる
				//for( var j in crossobj ){
					//if( crosspy > crossobj[j].point.y ){
						//crosspy = crossobj[j].point.y;	
						crosspy = crossobj[0].point.y;
					//}
				//}
			} // if( crossobj.length > 0 )
			

			var scale = 0.1;
			var sdx = ev.targetTouches[i].pageX - TouchScreenLeftData.sx;
			var sdy = ev.targetTouches[i].pageY - TouchScreenLeftData.sy;
			sdx *= scale;
			sdy *= scale;
			// 移動量が0のときは処理しない
			if( sdx === 0.0 || sdy === 0.0 ) return;
			var TranslateVector = new THREE.Vector3( sdx, 0.0, sdy );
			// 現在のカメラ角度(Y軸)で座標変換を行う行列を作る
			var RotMat = new THREE.Matrix4();
			RotMat.makeRotationFromEuler(
				new THREE.Euler( 0.0, CamCalcData.RotVector.y, 0.0, 'XYZ' )
			);
			// キャラクタ移動量をカメラの角度で座標変換
			TranslateVector.applyMatrix4( RotMat );	
			// 注視先に加算する
			CamCalcData.CamTarget.x += TranslateVector.x;
			CamCalcData.CamTarget.y = crosspy;
			CamCalcData.CamTarget.z += TranslateVector.z;
			// カメラの位置にも加算する
			CamCalcData.CamPos.x += TranslateVector.x;
			//CamCalcData.CamPos.y += TranslateVector.y;
			CamCalcData.CamPos.z += TranslateVector.z;

			var TanVec = new THREE.Vector3(
				TranslateVector.x,
				0.0,
				TranslateVector.z
			);
			TanVec.normalize();
			//BlendMeshData.rotationY = Math.atan( TanVec.x / TanVec.z );
			BlendMeshData.rotationY = Math.atan2( TanVec.x, TanVec.z );

			// キャラクタをアニメーションさせる
			if( BlendMesh && BlendMesh.mixer )
			BlendMesh.update( 1.0 / 60.0 );

		} // if( TouchScreenLeftData.sx != 0 || TouchScreenLeftData.sy != 0 )
	} // for( var i in ev.targetTouches )
};

// 右画面をタッチ中の処理
function TouchRightMoveProcess( ev ){

	// イベントデータが代入されていなかったら処理しない
	if( ev.targetTouches === undefined ) return;

	// 複数のタッチの場合ループ
	for( var i in ev.targetTouches ){

		// 左画面からの移動なら処理しない
		if( TouchScreenRightData.sx < (SCREEN_WIDTH/2) && 
			ev.targetTouches[i].pageX >= (SCREEN_WIDTH/2)
		){
			break;
		}


		// 右画面のカメラ回転処理
		// タッチ開始位置が0でなければ処理する
		if( ev.targetTouches[i].pageX >= (SCREEN_WIDTH/2) &&
			TouchScreenRightData.sx != 0 &&
			TouchScreenRightData.sy != 0
		){
			// 右画面のカメラ回転処理
			var scale = 0.001;
			var rot = CamCalcData.RotVector;
			var sdx = ev.targetTouches[i].pageX - TouchScreenRightData.sx;
			var sdy = ev.targetTouches[i].pageY - TouchScreenRightData.sy;
			// 移動量が0のときは処理しない
			if( sdx === 0.0 || sdy === 0.0 ) return;
			//TouchScreenRightData.sx = ev.targetTouches[i].pageX;
			//TouchScreenRightData.sy = ev.targetTouches[i].pageY;

			var adx = rot.x + ( sdy * scale * -1.0 );
			if( adx > 3.14 ) adx = -3.14;
			if( adx < -3.14 ) adx = 3.14;

			var ady = rot.y + ( sdx * scale * -1.0 );
			if( ady > 3.14 ) ady = -3.14;
			if( ady < -3.14 ) ady = 3.14;

			CamCalcData.RotVector.set( adx, ady, 0.0 );


			// 移動行列を作ります
			CamCalcData.TransMatrix.makeTranslation(
				0.0, CamCalcData.TransY, CamCalcData.TransZ
			);
			// 回転行列を作ります(X軸)
			CamCalcData.RotMatrixX.makeRotationFromEuler(
				new THREE.Euler(
					CamCalcData.RotVector.x,
					0.0,
					0.0,
					'XYZ'
				)
			);
			// 回転行列を作ります(Y軸)
			CamCalcData.RotMatrixY.makeRotationFromEuler(
				new THREE.Euler(
					0.0,
					CamCalcData.RotVector.y,
					0.0
				)
			);
			// 変換用の座標を作ります
			var addvec = new THREE.Vector3( 0.0, 0.0, 0.0 );
			// まずは移動させます
			addvec.applyMatrix4( CamCalcData.TransMatrix );
			// 次にX軸回転させます
			addvec.applyMatrix4( CamCalcData.RotMatrixX );
			// 次にY軸回転させます
			addvec.applyMatrix4( CamCalcData.RotMatrixY );
			// CamPosがカメラの座標
			CamCalcData.CamPos.x = CamCalcData.CamTarget.x + addvec.x;
			CamCalcData.CamPos.y = CamCalcData.CamTarget.y + addvec.y;
			CamCalcData.CamPos.z = CamCalcData.CamTarget.z + addvec.z;

			} // if( TouchScreenRightData.sx != 0 || TouchScreenRightData.sy != 0 )
	} // for( var i in ev.targetTouches )
};

$('#text_canvas').on('contextmenu', function(e){ return false; });

$('#text_canvas').bind({

	// マウスボタンの押下開始
	'mousedown' : function( ev ){
		ev.preventDefault();

		// #text_canvas 上のイベントのみ処理
		if( ev.target === document.getElementById('text_canvas') ){
			// 変数にデータを入れる
			MouseDragData.sx = ev.pageX;
			MouseDragData.sy = ev.pageY;

			MouseDragData.sev = ev;

			//console.log( 'keyCode:' + ev.which );
		}
	},

	// マウスカーソルの移動
	'mousemove' : function( ev ){
		ev.preventDefault();

		// #text_canvas 上のイベントのみ処理
		if( ev.target === document.getElementById('text_canvas') ){
			// sx,sy が0でない場合ドラッグされているので代入
			if( MouseDragData.sx != 0 || MouseDragData.sy != 0 ){
				MouseDragData.ev = ev;
			}
			else{
				MouseDragData.ev = null;
			}

			// ウィンドウのドラッグのためのコード
			em.addEventData(
				new OnmouseMoveEventData( 'OnmouseMoveEvent', {"ev":ev} )
			);

			// イベントを処理する
			em.tick();
		}
	},

	// マウスボタンの押下終了
	'mouseup' : function( ev ){
		ev.preventDefault();
	
		// #text_canvas 上のイベントのみ処理
		if( ev.target === document.getElementById('text_canvas') ){
			// クリックイベントだった場合
			// イベントマネージャにイベントデータを送る
			if( MouseDragData.sx === ev.pageX &&
				MouseDragData.sy === ev.pageY
			){
				em.addEventData(
					new TestEventData( 'MouseClickEvent',
						{
							'px': ev.pageX,
							'py': ev.pageY,
							'ev': ev
						}
					)
				);

				// イベントマネージャで処理する
				em.tick();
			}

			// ドラッグが終了したので０を入れる
			MouseDragData.sx = 0;
			MouseDragData.sy = 0;

			//console.log( 'keyCode:' + ev.which );
		}
	},

	// タッチの開始
	'touchstart': function( ev ){
		// ページが動いたり、反応を止める
		ev.preventDefault();

		//debugger;
		// タッチが複数の場合ループ
		for( var i in ev.targetTouches ){
			// 画面を縦に２分割し、左右に分ける
			if( ev.targetTouches[i].pageX < (SCREEN_WIDTH/2) &&
				TouchScreenLeftData.sx === 0 &&
				TouchScreenLeftData.sy === 0
				//TouchScreenRightData.sx == 0 &&
				//TouchScreenRightData.sy == 0
			){
				// 左画面の場合
				// タッチした座標を入れる
				TouchScreenLeftData.sx = ev.targetTouches[i].pageX;
				TouchScreenLeftData.sy = ev.targetTouches[i].pageY;
				//TouchScreenLeftData.ev = ev;
			}
			if( ev.targetTouches[i].pageX >= (SCREEN_WIDTH/2) &&
				//TouchScreenLeftData.sx == 0 &&
				//TouchScreenLeftData.sy == 0 &&
				TouchScreenRightData.sx === 0 &&
				TouchScreenRightData.sy === 0
			){
				// 右画面の場合
				// タッチした座標を入れる
				TouchScreenRightData.sx = ev.targetTouches[i].pageX;
				TouchScreenRightData.sy = ev.targetTouches[i].pageY;
				//TouchScreenRightData.ev = ev;
			}
		}

	
	},

	// タッチしながら移動
	'touchmove': function( ev ){

		ev.preventDefault();	// スクロールさせない
		
		TouchScreenLeftData.ev = ev;
		TouchScreenRightData.ev = ev;

	},

	// タッチの終了
	'touchend': function( ev ){

		// 複数タッチ終了ならループ
		for( var i in ev.changedTouches ){

			// タッチ開始位置と終了位置が同じなら
			// クリックイベントと同じ扱いにする
			if( ( TouchScreenLeftData.sx === ev.changedTouches[i].pageX &&
				TouchScreenLeftData.sy === ev.changedTouches[i].pageY ) ||
				( TouchScreenRightData.sx === ev.changedTouches[i].pageX &&
				TouchScreenRightData.sy === ev.changedTouches[i].pageY )
			){
				// クリックイベントデータを追加
				em.addEventData(
					new TestEventData( 'MouseClickEvent',
						{ "px": ev.changedTouches[i].pageX,
							"py": ev.changedTouches[i].pageY,
							"ev": ev.changedTouches[i]
						}
					)
				);

				// イベントマネージャで処理
				em.tick();
			}

			// タッチが終了したら、開始位置を0にする
			if( ev.changedTouches[i].pageX < (SCREEN_WIDTH/2) &&
				TouchScreenLeftData.sx != 0 &&
				TouchScreenLeftData.sy != 0
			 ){
				TouchScreenLeftData.sx = 0;
				TouchScreenLeftData.sy = 0;
				TouchScreenLeftData.flag = false;
				TouchScreenLeftData.ev = {};
			}

			if( ev.changedTouches[i].pageX >= (SCREEN_WIDTH/2) &&
				TouchScreenRightData.sx != 0 &&
				TouchScreenRightData.sy != 0
			 ){
				TouchScreenRightData.sx = 0;
				TouchScreenRightData.sy = 0;
				TouchScreenRightData.flag = false;
				TouchScreenRightData.ev = {};
			}
		} // for( var i in ev.changedTouches )

	}
});

/*
window.onmousemove = function(ev){
	if( ev.target == document.getElementById('text_canvas') ){
		em.addEventData(
			new OnmouseMoveEventData( 'OnmouseMoveEvent', {"ev":ev} )
		);
	}

	em.tick();
};

window.onmouseup = function(ev){
	if( ev.target == document.getElementById('text_canvas') ){
		em.addEventData(
			new OnmouseUpEventData( 'OnmouseUpEvent', {"ev":ev} )
		);
	}

	em.tick();
};

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
};

// マルチタッチ用イベントハンドラを設定します
// タッチ開始
window.document.addEventListener( 'touchstart', function( ev ){

	TouchScreenRightData.sx = ev.touches[0].clientX;
	TouchScreenRightData.sy = ev.touches[0].clientY;

	debugger;

}, true );
// 移動した
window.document.addEventListener( 'touchmove', function( ev ){
	debugger;

	var scale = 1.0;
	var rot = charactermesh.rotation;
	var sdx = ev.touches[0].clientX - TouchScreenRightData.sx;
	var sdy = ev.touches[0].clientY - TouchScreenRightData.sy;

	charactermesh.rotation.set(
		rot.x + ( sdx * scale * 3.14 / 10 ),
		rot.y + ( sdy * scale * 3.14 / 10 ),
		rot.z
	);

}, true );
// 指を離した
window.document.addEventListener( 'touchend', function( ev ){

	TouchScreenRightData.sx = 0;
	TouchScreenRightData.sy = 0;

}, true );	
*/

// ウィンドウを閉じた場合の処理
window.onbeforeunload = function(){

	PostGetMessages( ['Logout'] );

};

// Collada データを読み込む
// なんかバグがあるようです
function LoadCollada( daeLocation, pos, scale, rot, func ){
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

		// 開発用
		dae.traverse( function( child ){
			//child.castShadow = true;
			if( child instanceof THREE.Mesh ){
				//child.receiveShadow = true;	
			}
		});
		GroundMesh = dae;

		// Debug
		//GroundMesh.receiveShadow = true;
		//GroundMesh.castShadow = true;

		func( dae );
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
	var delta = clock.getDelta();
	//controls.update( delta );

	// 行列のアップデート
	scene.updateMatrixWorld();

	// マウス操作の処理関数
	//MouseDragProcess();
	// プロセスマネージャに移動しました

	// 左画面のタッチ中の処理
	//TouchLeftMoveProcess( TouchScreenLeftData.ev );	
	// プロセスマネージャに移動しました
	// 右画面のタッチ中の処理
	//TouchRightMoveProcess( TouchScreenRightData.ev );
	// プロセスマネージャに移動しました
	
	// くまきちのアニメーション処理
	if( BlendMesh && BlendMesh.mixer ){	// VR時にも処理を行っている(ここで位置書き換え)
		// 今までここでBlendMeshのアニメーション更新処理をしていたが
		// 移動時にのみアニメーションさせるので他所へ処理を移動した
		//BlendMesh.update( delta );
		//BlendMesh.rotation.set( 0.0, BlendMesh.rotation.y + 0.01, 0.0 );
		BlendMesh.rotation.set(
			0.0,
			//CamCalcData.RotVector.y + 3.14,
			BlendMeshData.rotationY,
			0.0
		);
		BlendMesh.position.set(
			CamCalcData.CamTarget.x,
			CamCalcData.CamTarget.y,
			CamCalcData.CamTarget.z
		);
		// 送信データ変数にキャラクターのデータを代入
		// 位置データ
		UserData.positionX = BlendMesh.position.x;
		UserData.positionY = BlendMesh.position.y;
		UserData.positionZ = BlendMesh.position.z;
		// 回転データ
		UserData.rotateX = BlendMesh.rotation.x;
		UserData.rotateY = BlendMesh.rotation.y;
		UserData.rotateZ = BlendMesh.rotation.z;

		//console.log( 'ry: ' + UserData.rotateY );
	}
	// 木のアニメーション処理
	// if( TreeBlendMesh.mixer != undefined ){
	// 	TreeBlendMesh.update( delta );
	// }

	// 追尾処理
	var const_mulval = 0.1;
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
			if( OtherPlayersPos[j]["player_id"] === OtherPlayers[i]["player_id"] &&
				OtherPlayersPos[j].model.mixer != undefined			
			){
				delta = new THREE.Vector3(
						( OtherPlayers[i]["px"] - OtherPlayersPos[j]["model"].position.x ) * const_mulval,
						( OtherPlayers[i]["py"] - OtherPlayersPos[j]["model"].position.y ) * const_mulval,
						( OtherPlayers[i]["pz"] - OtherPlayersPos[j]["model"].position.z ) * const_mulval
					);

				//console.log( "x" + OtherPlayers[i]["px"] );

				OtherPlayersPos[j]["model"].position.x += delta.x;
				OtherPlayersPos[j]["model"].position.y += delta.y;
				OtherPlayersPos[j]["model"].position.z += delta.z;						
				// 角度データを入れる
				OtherPlayersPos[j]['model'].rotation.x = OtherPlayers[i]['rx'];
				OtherPlayersPos[j]['model'].rotation.y = OtherPlayers[i]['ry'];
				OtherPlayersPos[j]['model'].rotation.z = OtherPlayers[i]['rz'];
			}
		} // for( var j in OtherPlayersPos )
	} // for( var i in OtherPlayers )
/*
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
*/
	// 水シェーダーのUV加算処理
	// ここに記述するのはどうかと思う
	WaterShader1.uniforms.uvy.value += 0.01;
	
	// 子オブジェクトのワールド座標を求める時は以下の様にする
	//var newpos = new THREE.Vector3();
	//newpos.setFromMatrixPosition( cameramesh.matrixWorld );

	// AboutSprite の透明度計算
	// ここに記述するのはどうかと思う
	// if( AboutSprite !== null ){
	// 	var dist = Math.pow(
	// 			(CamCalcData.CamTarget.x - 100.0) * (CamCalcData.CamTarget.x - 100.0) +
	// 			(CamCalcData.CamTarget.y - 0.0 ) * (CamCalcData.CamTarget.y - 0.0 ) +
	// 			(CamCalcData.CamTarget.z - 0.0 ) * (CamCalcData.CamTarget.z - 0.0 ),
	// 			0.5
	// 	);
	//
	// 	if( dist <= 50.0 ){
	// 		AboutSprite.visible = true;
	// 	}else{
	// 		AboutSprite.visible = false;
	// 	}
	// }
	
	// EducationSprite の透明度計算
	// ここに記述するのはどうかと思う
	// if( EducationSprite !== null ){
	// 	var dist = Math.pow(
	// 			(CamCalcData.CamTarget.x - 0.0) * (CamCalcData.CamTarget.x - 0.0) +
	// 			(CamCalcData.CamTarget.y - 0.0 ) * (CamCalcData.CamTarget.y - 0.0 ) +
	// 			(CamCalcData.CamTarget.z - 100.0 ) * (CamCalcData.CamTarget.z - 100.0 ),
	// 			0.5
	// 	);
	//
	// 	if( dist <= 50.0 ){
	// 		EducationSprite.visible = true;
	// 	}else{
	// 		EducationSprite.visible = false;
	// 	}
	// }
	
	// SkillSprite の透明度計算
	// ここに記述するのはどうかと思う
	// if( SkillSprite !== null ){
	// 	var dist = Math.pow(
	// 			(CamCalcData.CamTarget.x - -100.0) * (CamCalcData.CamTarget.x - -100.0) +
	// 			(CamCalcData.CamTarget.y - 0.0 ) * (CamCalcData.CamTarget.y - 0.0 ) +
	// 			(CamCalcData.CamTarget.z - 0.0 ) * (CamCalcData.CamTarget.z - 0.0 ),
	// 			0.5
	// 	);
	//
	// 	if( dist <= 50.0 ){
	// 		SkillSprite.visible = true;
	// 	}else{
	// 		SkillSprite.visible = false;
	// 	}
	// }

	
	// マップが切り替わったオブジェクトを削除
	for( var i in OtherPlayers ){
		if( OtherPlayers[i].mapno != UserData.mapno ){
			for( var j in OtherPlayersPos ){
				if( OtherPlayers[i].player_id === OtherPlayersPos[j].player_id ){
					// アニメーションプロセスを切る
					OtherPlayersPos[j]['process'].killProcess();
					// シーンからオブジェクトを削除する
					scene.remove( OtherPlayersPos[j]["model"] );
					// 配列から取り除く
					OtherPlayersPos.splice( j, 1 );
				}
			} // for( var j in OtherPlayersPos )
		}
	} // for( var i in OtherPlayersPos )

	// さくらのパーティクルの移動処理
	// (!)あとできちっとプロセス化してください
	for( var i in sakura_particles ){
		if( sakura_particles[i].position.y < 0 ){
			sakura_particles[i].position.x = Math.random() * 100 - 10;
			sakura_particles[i].position.y = Math.random() * 100;
			sakura_particles[i].position.z = Math.random() * 100 - 10;
		}
		else{
			sakura_particles[i].position.x += 0.5;
			sakura_particles[i].position.y += -0.5
			sakura_particles[i].position.z += 0.5;
		}
	}

	// プロセスマネージャを実行
	pm.updateProcesses();

				
	requestAnimationFrame( render );
	renderer.clear();
	//renderer.render( scene, camera );

	// シャドウマップを描画
	//ShadowComposer.render();

	// ブルームとスクリーンへコピー
	if( onvr === false ){
		composer.render();
	}
	else if( onvr === true ){
		// stereocamera.left.position.set(
		// 	CamCalcData.CamPos.x,
		// 	CamCalcData.CamPos.y,
		// 	CamCalcData.CamPos.z
		// );
		// stereocamera.left.lookAt(
		// 	CamCalcData.CamTarget
		// );
		//
		// stereocamera.right.position.set(
		// 	CamCalcData.CamPos.x,
		// 	CamCalcData.CamPos.y,
		// 	CamCalcData.CamPos.z
		// );
		// stereocamera.right.lookAt(
		// 	CamCalcData.CamTarget
		// );

		// ゲームパッド情報を取得する
		var gamepadlist = navigator.getGamepads();
		//gamepad = gamepadlist[0];	// 0番を無理やり取得
		var gamepad = null;
		for( var i=0; i<4; ++i ){
			gamepad = gamepadlist[i];
			if( gamepad.id === GamepadIDString2 ){
				break;
			}
		}

		if( gamepad === null || gamepad === undefined ) return;

		axes = gamepad.axes;		// 軸情報を無理やり取得
		axesvx = axes[0];
		axesvy = axes[1];
		movevector = new THREE.Vector3( axesvx, 0.0, axesvy );
		// 現在のカメラ角度(Y軸)で座標変換を行う行列を作る
		var RotMat = new THREE.Matrix4();
		RotMat.makeRotationFromEuler(
			new THREE.Euler( 0.0, stereocamera.left.rotation.y, 0.0, 'XYZ' )
		);
		// キャラクタ移動量を座標変換
		movevector.applyMatrix4( RotMat );
		// カメラ位置に加算(LとRダブル)
		stereocamera.left.position.x += movevector.x;
		stereocamera.left.position.z += movevector.z;
		stereocamera.right.position.x += movevector.x;
		stereocamera.right.position.z += movevector.z;

		// コントローラー軸２番目の処理
		// controlsL.fixedUpdate でパラメータとして入れる
		axesvx2 = axes[2];
		axesvy2 = axes[3];
		fixvrcameravec3.x += axesvx2 * -0.01;
		fixvrcameravec3.y += axesvy2 * -0.01;

		// くまきちを強制的に呼ぶ
		if( BlendMesh && BlendMesh.mixer ){
			//BlendMesh.position = stereocamera.left.position;
			// BlendMesh.position.set(
			// 	stereocamera.left.position.x,
			// 	0.0,
			// 	stereocamera.left.position.z
			// );
			CamCalcData.CamTarget.x = stereocamera.left.position.x;
			CamCalcData.CamTarget.z = stereocamera.left.position.z;
		}

		// カメラ角度の更新
		// if( controlsL ) controlsL.update();
		// if( controlsR ) controlsR.update();	
		if( controlsL ) controlsL.fixedUpdate( fixvrcameravec3 );
		if( controlsR ) controlsR.fixedUpdate( fixvrcameravec3 );	

		// 左右の画像のレンダリング
		renderer.setViewport( 0, 0, SCREEN_WIDTH / 2, SCREEN_HEIGHT );
		renderpass.camera = stereocamera.left;
		composer.render();

		renderer.setViewport( SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2, SCREEN_HEIGHT );
		renderpass.camera = stereocamera.right;
		composer.render();
	}


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

// 初期化処理全般
// ドキュメントがロードされた後に実行する処理
$(document).ready(function(){
	/*** debug
	// ログイン情報を取得します
	$.ajax({
		type: 'GET',
		url: '/green/Farbe/check_login',
		async: 'false',
		success: function( logindata ){
			LoginData = $.parseJSON( logindata );		
			LoginData.id = parseInt( LoginData.id );	// Intに変換
			nickname_id = LoginData.id;
			//debugger;
		},
		error: function(){ alart( 'ajax-error' ); }
	});
	***/

	// フルスクリーンにする
	container = document.getElementById('canvas_screen_area');
	//container = document.getElementById('text_canvas');
	function fullscreen(){
		//container.requestFullscreen();
		container.webkitRequestFullscreen();
		SCREEN_WIDTH = $('#text_canvas').width();
		SCREEN_HEIGHT = $('#text_canvas').height();
	};
	// フルスクリーン命令がiOS未対応なので
	// Farbeではフルスクリーンに対応しない方向性でいこうと思います
	// でもVRあるしどうしようと迷っている訳
	//container.addEventListener( 'click', fullscreen, false );	
	//container.addEventListener( 'touchmove', fullscreen, {passive: false} );

	// 初回ロード時に#text_canvasのサイズをウィンドウサイズにする
	//var wpx = $(window).width();
	var wpx = window.innerWidth;
	//var wpy = $(window).height() - 50;	// モバイルFireFox補正(アドレスバー)
	//var wpy = $(window).height();		// FireFox補正をしない
	var wpy = window.innerHeight;
	$('#text_canvas').attr({'width': wpx, 'height': wpy});
	$('#main_canvas').attr({'width': wpx, 'height': wpy});

	// アドレスバーを隠すみたいなスクリプト
	window.addEventListener( 'load', function(){
		setTimeout( function(){
			window.scrollTo( 0, 0 );
		}, 0 );
	});

	// 初回ロード時に#text_canvasのサイズをウィンドウサイズにする
	//var wpx = $(window).width();
	//var wpy = $(window).height();
	//$('#text_canvas').width( wpx ).height( wpy );

	//$('#text_canvas').css({ 'position': 'fixed' });


	// Get screen size.
	// (!)id='text_canvas'の大きさを取得します
	SCREEN_WIDTH = $('#text_canvas').width();
	SCREEN_HEIGHT = $('#text_canvas').height();
	//SCREEN_WIDTH = 640;
	//SCREEN_HEIGHT = 480;


	// three.js
	renderer = new THREE.WebGLRenderer({ 'canvas': $('#main_canvas')[0], antialias: false });
	//renderer = new THREE.WebGLRenderer();
	renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
	renderer.setClearColor( 0x000000, 1.0 );
	//renderer.shadowMap.enabled = true;
	//renderer.shadowMap.type = THREE.PCFShadowMap;
	//renderer.shadowMap.type = THREE.BasicShadowMap;
	renderer.autoClear = false;
	//document.getElementById('canvas_screen_area').appendChild( renderer.domElement );
	
	// スクロール位置を0にする(chrome) <=やったけどだめぽ
	$('body').scrollTop( 0 ).scrollLeft( 0 );
	// スクロール位置を0にする(firefox) <=やったけどだめぽ
	$('html').scrollTop( 0 ).scrollLeft( 0 );

	// テキスト入力ボックスの移動
	$('#global_chat_area').css({'top': SCREEN_HEIGHT-30, 'left': 0});

	// シーンを生成する
	scene = new THREE.Scene();
	
	///////////////////////////
	// カメラ生成
	///////////////////////////
	var fov = 65.0;
	var aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
	var near = 1;
	var far = 5000;
	camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	//camera.position.set( 100, 100, 100 );
	//camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );

	//var light = new THREE.AmbientLight( 0x888888 );
	//var ambient = new THREE.AmbientLight( 0x666666 );
	//scene.add( ambient );

	//var light = new THREE.DirectionalLight( 0xFFFFFF );
	//light.position.set( 0, -1, 0 );
	//light.position.set( -1, 1, -1 );
	//light.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 50, 1, 1, 2500 ) );
	//light.shadow.bias = 0.000001;
	//light.shadow.mapSize.width = 2048;
	//light.shadow.mapSize.height = 2048;
	//light.castShadow = true;
	//light.position.set( 1, 1, 1 );
	//light.position.set( 1.0, 1.0, 1.0 );
	//scene.add( light );
	
	// ライトの位置を設定後に、シャドウマップ生成用カメラを作る
	//ShadowCamera = new THREE.PerspectiveCamera( 50, 1, 1, 2500 );
	//ShadowCamera.position.set(
		//light.position.x,
		//light.position.y,
		//light.position.z
	//);
	// 平行光源なので原点からの方向（注視先）にあわせる
	//ShadowCamera.lookAt( new THREE.Vector3( 0.0, 0.0, 0.0 ) );


	// デバッグ用基準軸メッシュ
	/*
	var xmesh, ymesh, zmesh;
	for( var i=0; i<50; i++ ){
		// X Axis
		material = new THREE.MeshBasicMaterial({ color: '#FF0000' });
		geometry = new THREE.CubeGeometry( 5, 5, 5 );
		xmesh = new THREE.Mesh( geometry, material );
		xmesh.position.x = i * 10;
		scene.add( xmesh );

		// Y Axis
		material = new THREE.MeshBasicMaterial({ color: '#00FF00' });
		geometry = new THREE.CubeGeometry( 5, 5, 5 );
		ymesh = new THREE.Mesh( geometry, material );
		ymesh.position.y = i * 10;
		//ymesh.castShadow = true;
		scene.add( ymesh );

		// Z Axis
		material = new THREE.MeshBasicMaterial({ color: '#0000FF' });
		geometry = new THREE.CubeGeometry( 5, 5, 5 );
		zmesh = new THREE.Mesh( geometry, material );
		zmesh.position.z = i * 10;
		scene.add( zmesh );
	}
	*/

	// カメラ回転用メッシュ
	// キャラクタ位置用
	//material = new THREE.MeshBasicMaterial({ color: '#FF0000' });
	//geometry = new THREE.CubeGeometry( 50, 50, 50 );
	//charactermesh = new THREE.Mesh( geometry, material );
	//charactermesh.position.set( 0, 0, 0 );
	//scene.add( charactermesh );
	
	// 背後にいるカメラ用
	//material = new THREE.MeshBasicMaterial({ color: '#FF0000' });
	//geometry = new THREE.CubeGeometry( 5, 5, 5 );
	//cameramesh = new THREE.Mesh( geometry, material );
	//var CameraYDist = 100;
	//var CameraZDist = 100;
	//cameramesh.position.set( 0, CameraYDist, CameraZDist );
	// キャラクターの子要素にカメラをセット(メッシュだけ）
	//charactermesh.add( cameramesh );
	//scene.add( charactermesh );
	
	

	
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
	

	// Create porin.
	//PlayerMesh = CreatePorin( new THREE.Vector3( 0, 10, 0 ) );
	//scene.remove( PlayerMesh );

	//MovetoMesh = CreatePorin( new THREE.Vector3( 0, 10, 0 ) );
	//material = new THREE.MeshBasicMaterial({ color: '#0000FF' });
	//geometry = new THREE.CubeGeometry( 5, 5, 5 );
	//MovetoMesh = new THREE.Mesh( geometry, material );
	//scene.add( MovetoMesh );

	// Create CPU Porin.
	//CpuMesh = CreatePorin( new THREE.Vector3( -113, 67, 76 ) );
	//CpuMesh.rotation.set( 0, Math.PI/4, 0 );

	// Fog.
	scene.fog = new THREE.Fog( 0xFFFFFF, 100, 1000 );
	

	clock = new THREE.Clock();
	//controls = new THREE.FirstPersonControls( camera );

	/*
	LoadCollada( '/green/model/ground2.dae',
					new THREE.Vector3( 0, 0, 0 ),
					//new THREE.Vector3( 100, 100, 100 )
					new THREE.Vector3( 30, 30, 30 )
	);
	*/

	/*
	var loader = new THREE.ObjectLoader();
	loader.load( '/green/model/netcare_room1.json', function( loadedscene ){
		//debugger;
		//var mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
		//mesh.scale.set( 10, 10, 10 );

		loadedscene.rotation.set( 0.0, 3.14 / 2 * 1 , 0.0 );
		loadedscene.scale.set( 30, 30, 30 );
		scene.add( loadedscene );
	});
	*/

	// くまきちスキンメッシュ
	// BlendMesh = {};
	// BlendMesh = new THREE.BlendCharacter();
	// BlendMesh.load( '/green/model/kumakiti1.json', function(){
	// 	BlendMesh.scale.set( 10, 10, 10 );
	// 	//BlendMesh.scale.set( 10, 10, 10 );
	// 	//BlendMesh.castShadow = true;
	// 	BlendMesh.traverse( function( child ){
	// 		if( child instanceof THREE.Mesh ){
	// 			//child.castShadow = true;
	// 			//child.receiveShadow = true;
	// 		}
	// 	});
	// 	scene.add( BlendMesh );
	// 	//BlendMesh.applyWeight( 'Idle1', 1 );
	// 	//BlendMesh.play( 'Idle1', 1 );
	// 	BlendMesh.play( 'walk1', 1.0 );
	// });

	// // 木スキンメッシュ
	// TreeBlendMesh = new THREE.BlendCharacter();
	// TreeBlendMesh.load( '/green/model/tree1boned1.json', function(){
	// 	// マルチマテリアルが動かない様子
	// 	// 手動でマテリアルを割り当てる羽目に
	// 	TreeBlendMesh.scale.set( 10.0, 10.0, 10.0 );
	// 	scene.add( TreeBlendMesh );
	// 	TreeBlendMesh.play( 'move1', 1.0 );
	// });
	//
	// LoadCollada(
	// 		//'/green/model/daycare_room1.dae',
	// 		'/green/model/netcare_room1.dae',
	// 		new THREE.Vector3( 0, 0, 0 ),
	// 		new THREE.Vector3( 30, 30, 30 ),
	// 		new THREE.Vector3( 0, -Math.PI/2, 0 )
	// 		//new THREE.Vector3( 1, 1, 1 )
	// );
	
	// 「ネットケア」へようそこウィンドウを表示
	function closewindow(){ WindowData = []; };
	WindowData = [];
	var data = {
		'px': 100, 'py': 100,
		'width': 250, 'height': 300,
		'title': 'ネットケアへようこそ',
		'str': 'ちょっとした会話の場です。\nゆっくりしていってください。\n\nマウスの場合\n左ドラッグ：キャラクタ移動\n右ドラッグ：カメラ回転\n\nタッチパネルの場合\n画面左スライド：キャラクタ移動\n画面右スライド：カメラ回転\n\n 画面下の入力ボックスで会話できます。',
		'moving': false,
		'buttons': [{
			'px': 30, 'py': 250,
			'width': 150, 'height': 30,
			'str': '閉じる',
			'func': closewindow
		}]
	};
	// イベントマネージャへ追加
	em.addEventData( new CreateWindowEventData( 'CreateWindow', data ) );
	// すぐに処理を行う
	em.tick();
	
	// 上記のロードコードのかわりにロードプロセスを設定
	var loadproc = new MapLoadProcess( 'mapload' );
	pm.attach( loadproc );

	// VRアイコンのロード
	vriconimage = new Image();
	vriconimage.src = '/green/img/vricon1.png';

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

	// 自作シャドウは様々な理由があって重たくなったので無しに
	// PC用とモバイル用にグラフィックス設定を分けるべき
	
	// シャドウマップ生成コンポーザー
	//ShadowComposer = new THREE.EffectComposer( renderer );
	// ライトからの風景を描画するパスを追加
	//var ShadowMapPass = new THREE.RenderPass( scene, ShadowCamera );
	//var ShadowMapPass = new THREE.RenderPass( scene, camera );
	// シーンのオーバーライドマテリアルを代入
	//ShadowMapPass.overrideMaterial = ShadowMapShader;
	//ShadowMapPass.overrideMaterial = ShadowOnShader;
	//ShadowMapPass.overrideMaterial = new THREE.MeshDepthMaterial();
	//ShadowComposer.addPass( ShadowMapPass );
	// スクリーン描画用コピーシェーダーをかます
	//var toScreen = new THREE.ShaderPass( THREE.CopyShader );
	//toScreen.renderToScreen = true;
	//ShadowComposer.addPass( toScreen );

	// ポストプロセスの設定
	composer = new THREE.EffectComposer( renderer );
	// 通常のレンダリングパスを追加
	var DefaultPass = new THREE.RenderPass( scene, camera );
	//DefaultPass.overrideMaterial = ShadowOnShader;
	composer.addPass( DefaultPass );
	// ドットスクリーンシェーダーパス
	//var effect = new THREE.ShaderPass( THREE.DotScreenShader );
	//effect.uniforms['scale'].value = 4;
	//composer.addPass( effect );
	// ブルームエフェクト
	//composer.addPass( new THREE.BloomPass( 0.7, 25, 2.0, 512 ) );
	
	// SSAOシェーダーパス
	// スキニングに対応していないのと重過ぎるので却下
	
	// var ssaoPass = new THREE.SSAOPass( scene, camera );
	// ssaoPass.renderToScreen = false;
	// composer.addPass( ssaoPass );


	// アンリアルブルームエフェクト？
	var effect = new THREE.UnrealBloomPass(
		new THREE.Vector2( SCREEN_WIDTH, SCREEN_HEIGHT ), 1.5, 0.4, 0.85
	);
	composer.addPass( effect );
	// スクリーンへコピー
	var toScreen = new THREE.ShaderPass( THREE.CopyShader );
	toScreen.renderToScreen = true;
	composer.addPass( toScreen );

	//-----------------------------------------------------
	// マウスのドラッグ検知処理とか
	// (!)関数からのプロセスへの移動です
	var mousedrugproc = new MouseDragProc( 'mousedragproc' );
	pm.attach( mousedrugproc );	// プロセスへアタッチ

	// タッチスクリーン左画面の処理
	// (!)関数からプロセスへの移動です
	var touchleftproc = new TouchLeftMoveProc( 'touchleftmoveproc' );
	pm.attach( touchleftproc );	// プロセスへアタッチ

	// タッチスクリーン右画面の処理
	// (!)関数からプロセスへの移動です
	var touchrightproc = new TouchRightMoveProc( 'touchrightmoveproc' );
	pm.attach( touchrightproc );	// プロセスへアタッチ

	//-----------------------------------------------------
	// 2Dキャンバスレンダリングプロセス
	var canvasrenderproc = new CanvasRenderingProcess( 'canvasrenderingproc' );
	pm.attach( canvasrenderproc );


	///////////////////////////
	// レンダリング関数
	///////////////////////////
	render();

	//GetGlobalChatDataAjax();
	//PostGlobalChatDataAjax( "ログインしました" );

	//setInterval( "GetGlobalChatDataAjax();", 1000 );
	//setInterval( function(){ GetGlobalChatDataAjax(); }, 1000 );

	// 最初にMovePositionイベントをサーバーに送信しておかないと動作しない
	PostGetMessages( ['Login', 'MovePos'] );

	/*** debug
	setInterval(
		 function(){
			PostGetMessages( [
				'GetMes',
				//'PostGetPos',
				'GetStuffComment',
				'MovePos',
				'GetPos',
				'Link'
			] );
		}, 1000
	);
	***/
});	




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

	//debugger;
	console.log( 'TestEventListener が MouseClickEvent を処理しています' );
	console.log( 'MouseClickEvent[px:'+ eventdata.getPx()+' py:'+eventdata.getPy()+']' );

	// クリックした座標を補正する
	var ev = eventdata.data.ev;
	var rect = ev.target.getBoundingClientRect();

	var px = eventdata.getPx() - rect.left;
	var py = eventdata.getPy() - rect.top;

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

	// VRアイコンをクリックしたときの処理
	if( (SCREEN_WIDTH - 64) < px && SCREEN_WIDTH > px &&
		(SCREEN_HEIGHT - 64) < py && SCREEN_HEIGHT > py
	){
		if( onvr === false ){
			onvr = true;

			// ステレオカメラのインスタンスを作成
			stereocamera = new THREE.StereoCamera();
			// ポストプロセスの設定
			composer = new THREE.EffectComposer( renderer );
			// 通常のレンダリングパスを追加
			renderpass = new THREE.RenderPass( scene, stereocamera.left );
			//DefaultPass.overrideMaterial = ShadowOnShader;
			composer.addPass( renderpass );
			// ドットスクリーンシェーダーパス
			//var effect = new THREE.ShaderPass( THREE.DotScreenShader );
			//effect.uniforms['scale'].value = 4;
			//composer.addPass( effect );
			// ブルームエフェクト
			//composer.addPass( new THREE.BloomPass( 0.7, 25, 2.0, 512 ) );
			// アンリアルブルームエフェクト？
			var effect = new THREE.UnrealBloomPass(
				new THREE.Vector2( SCREEN_WIDTH, SCREEN_HEIGHT ), 1.5, 0.4, 0.85
			);
			composer.addPass( effect );
			// スクリーンへコピー
			var toScreen = new THREE.ShaderPass( THREE.CopyShader );
			toScreen.renderToScreen = true;
			composer.addPass( toScreen );

			// ステレオカメラの位置情報を強制的に指定
			stereocamera.left.position.set( 0, 100, 100 );
			stereocamera.right.position.set( 0, 100, 100 );
			// カメラの角度コントロール
			function setOrientationControls( e ){
				if( !e.alpha ) return;
				if( !controlsL ) controlsL = new THREE.DeviceOrientationControls( stereocamera.left, true );
				controlsL.connect();
				//controlsL.update();
				if( !controlsR ) controlsR = new THREE.DeviceOrientationControls( stereocamera.right, true );
				controlsR.connect();
				//controlsR.update();
				window.removeEventListener( 'deviceorientation', setOrientationControls, true );
			};
			window.addEventListener( 'deviceorientation', setOrientationControls, true );
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
	//projector = new THREE.Projector();
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
			if( obj[i].object.id === CpuMesh.id ) click_stuff = true;
		}
	}
	// スタッフをクリックしたら行う処理
	if( click_stuff === true ){
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

		// JQuery-UI-DialogTEST
		// #hideen-area に、#dialogを追加する
		/*** debug...
		$('#hidden-area').append( [
				'<div id="dialog" title="Test Dialog!">',
				'<div id="tabs">',
				'<ul>',
					'<li><a href="#tabs-1">First</a></li>',
					'<li><a href="#tabs-2">Second</a></li>',
					'<li><a href="#tabs-3">Third</a></li>',
				'</ul>',
					'<div id="tabs-1">tabs-1 text.</div>',
					'<div id="tabs-2">tabs-2 text.</div>',
					'<div id="tabs-3">',
						'<form style="margin-top: 1em;">',
							'<div id="radioset">',
								'<input type="radio" id="radio1" name="radio"><label for="radio1">Choice 1</label>',
								'<input type="radio" id="radio2" name="radio" checked="checked"><label for="radio2">Choice 2</label>',
								'<input type="radio" id="radio3" name="radio"><label for="radio3">Choice 3</label>',
							'</div>',
						'</form>',
					'</div>',
				'</div>',
				'</div>'
			].join('\n')
		);
		***/
		$('#tabs').tabs();
		$('#radioset').buttonset();
		$('#radioset').buttonset();
		$('#dialog').dialog({
			autoOpen: false,
			width: 400,
			buttons: [
				{
					text: 'OK',
					click: function(){
						$( this ).dialog( 'close' );
						$( '#dialog' ).remove();
					}
				},
				{
					text: 'Tab2Update',
					click: function(){
						//$( this ).dialog( 'close' );
						var socket = io( 'http://localhost:3000' );
						socket.emit(
							'receive from cakephp',
							'http://127.0.0.1:80/green/farbe/ajaxtest'
						);
						socket.on( 'receive from node.js', function( msg ){
							var obj = $.parseJSON( msg );
							console.log( obj );
							$('#tabs-2').html( obj );
						});
					}
				}
			]
		});
		// 設定したダイアログをオープンする
		$('#dialog').dialog( 'open' );

		return;
	}

	// 迷路オブジェクトをクリックしていないかチェック
	var click_mazeobj = false;
	if( obj.length > 0 ){
		for( var i in obj ){
			if( obj[i].object.id === MazeMesh.id ) click_mazeobj = true;
		}
	}
	// 迷路オブジェクトをクリックしたら行う処理
	if( click_mazeobj === true ){
		// ウィンドウデータをクリア
		WindowData = [];
		// ウィンドウデータを作る
		var data = {
			"px":100, "py":100,
			"width":200, "height":300,
			"title":"3D迷路確認ダイアログ",
			"str":"3D迷路で遊びますか？",
			"moving":false,
			"buttons":[{
				"px":30, "py":50,
				"width":150, "height":30,
				"str":"はい",
				"func": function(){
				
					// MazeMapLoadProcess を追加
					//pm.attach( new MazeMapLoadProcess( 'mazemaploadproc' ) );
					// 迷路ゲームのタイトル画面プロセスを追加
					pm.attach( new MazeMapTitleProcess( 'MazeMapTitle' ) );
					// ウィンドウデータをクリア
					WindowData = [];
				}
			},{
				"px":30, "py":50+30+10,
				"width":150, "height":30,
				"str":"いいえ",
				"func": function(){
					// ウィンドウデータをクリア
					WindowData = [];
				}
			}]
		};
		// ウィンドウ作成イベントを送信
		em.addEventData( new CreateWindowEventData( 'CreateWindow', data ) );

	}

	

	// 交差時の処理
	// (!) 移動方法を変えるのでコメントアウト
	// if( obj.length > 0 ){
	// 	MovetoMesh.position.x = obj[0].point.x;
	// 	MovetoMesh.position.y = obj[0].point.y + 30;
	// 	MovetoMesh.position.z = obj[0].point.z;
	// }
	
	// サーバーに移動先の位置を伝える
	// (!) 移動方法を変えるのでコメントアウト
	//PostGetMessages( ['MovePos'] );		// point1

	// オブジェクトディープコピーテストコード
	//var tempscene = scene.clone();
	//var tempscene = _.cloneDeep( scene );
	//var tempscene = clone( scene );	// ディープコピーできた
	// tempscene.remove(
	// 	tempscene.children[0]
	// );
	// scene = null;
	// scene = tempscene;
	// composer.passes[0].scene = tempscene;
	
	// 関数型プログラミングのテスト
	// _.compose = _.flow
	var allfunc = _.flow(
			function( v ){ v.key1 += 1; return( v ); },
			function( v ){ v.key2 += 10; return( v ); }
			);
	console.log( allfunc( { 'key1': 123, 'key2': 256 } ) );	// ちゃんと動いたすごい
	// => { key1: 124, key2: 266 }

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
	if( pm.isProcessActive( 'MoveWindowProcess' ) === false ){	// type は 何型なのか？
	}

	// プロセスで対応しようと思ったが
	// WindowDataに移動中のフラグを持たせれば
	// イベントマネージャだけで移動処理ができるはず
	
	// ということでフラグがfalseならtrueにする
	var index = eventdata.data.index;
	if( WindowData[index].moving === false ){
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
		if( WindowData[i].moving === true ){
			// クリック座標の位置補正
			var ev = eventdata.data.ev;
			var rect = ev.target.getBoundingClientRect();

			WindowData[i].px = eventdata.data.ev.clientX - rect.left - 10;
			WindowData[i].py = eventdata.data.ev.clientY - rect.top - 5;
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
	//TestEventData.prototype.data = data;	// dataメンバ変数を追加
	this.data = data;
};
TestEventData.prototype.getPx = function(){ return( this.data.px ); };
TestEventData.prototype.getPy = function(){ return( this.data.py ); };
inherits( TestEventData, EventData );	// 継承関係を記述

// OnmouseMoveEventDataクラス定義
//-------------------------------
var OnmouseMoveEventData = function( eventname, data ){
	EventData.call( this, eventname );
	//OnmouseMoveEventData.prototype.data = data;
	this.data = data;
};
inherits( OnmouseMoveEventData, EventData );

// OnmouseDownEventDataクラス定義
//-------------------------------
var OnmouseDownEventData = function( eventname, data ){
	EventData.call( this, eventname );
	//OnmouseDownEventData.prototype.data = data;
	this.data = data;
};
inherits( OnmouseDownEventData, EventData );

// OnmouseUpEventDataクラス定義
//-------------------------------
var OnmouseUpEventData = function( eventname, data ){
	EventData.call( this, eventname );
	//OnmouseUpEventData.prototype.data = data;
	this.data = data;
};
inherits( OnmouseUpEventData, EventData );

// WindowClickedEventDataクラス定義
//-------------------------------
var WindowClickedEventData = function( eventname, data ){
	EventData.call( this, eventname );
	//WindowClickedEventData.prototype.data = data;
	this.data = data;
};
inherits( WindowClickedEventData, EventData );

// WindowTitleClickedEventDataクラス定義
//-------------------------------
var WindowTitleClickedEventData = function( eventname, data ){
	EventData.call( this, eventname );
	//WindowTitleClickedEventData.prototype.data = data;
	this.data = data;
};
inherits( WindowTitleClickedEventData, EventData );

// WindowMoveEventDataクラス定義
//-------------------------------
var WindowMoveEventData = function( eventname, data ){
	EventData.call( this, eventname );
	//WindowMoveEventData.prototype.data = data;
	this.data = data;
};
inherits( WindowMoveEventData, EventData );

// CreateWindowEventDataクラス定義
//-------------------------------
var CreateWindowEventData = function( eventname, data ){
	EventData.call( this, eventname );
	//CreateWindowEventData.prototype.data = data;
	this.data = data;
};
inherits( CreateWindowEventData, EventData );

// GetStuffCommentEventData クラス定義
//-------------------------------
var GetStuffCommentEventData = function( eventname, data ){
	EventData.call( this, eventname );
	//GetStuffCommentEventData.prototype.data = data;
	this.data = data;
};

// プロセスクラス定義
//=================================================================
var pm = new ProcessManager();	// プロセスマネージャ

// 初期化プロセスクラス
var InitProcess = function( type ){
	Process.call( this, type );	// 親クラスのコンストラクタを呼ぶ
};

// Process::onInitialize をオーバーライド
InitProcess.prototype.onInitialize = function(){
	Process.prototype.onInitialize.call( this );	// 親クラスのメソッドを呼ぶ
};

// MoveWindowProcess
//-------------------------------
var MoveWindowProcess = function( type ){	// プロセスの初期化
	Process.call( this, type );
};

MoveWindowProcess.prototype.onInitialize = function(){
	Process.prototype.onInitialize.call( this );	// 親クラスのメソッドを呼ぶ
};
inherits( MoveWindowProcess, Process );		// 継承関係を記述する

// OtherPlayerAnimateProcess
// --------------------------------
var OtherPlayerAnimateProcess = function( type, clock, mesh ){	// プロセスの初期化
	Process.call( this, type );

	this.clock = clock;	// アニメーション用の時計
	this.mesh = mesh;	// アニメーションメッシュ

	this.oldPosition = new THREE.Vector3();	// 移動したかどうかの比較用
};

OtherPlayerAnimateProcess.prototype.onInitialize = function(){
	Process.prototype.onInitialize.call( this );	// 親クラスのメソッドを呼ぶ
};

// 実行したい処理
OtherPlayerAnimateProcess.prototype.onUpdate = function(){
	Process.prototype.onUpdate.call( this );

	//var delta = this.clock.getDelta();
	var delta = 1.0 / 60.0;		// clock.getDelta() が正しく機能しないので無理やり計算
	if( this.mesh.mixer != undefined ){

		// アニメーション処理
		this.mesh.update( delta );
	}
};
// 継承関係を記述
inherits( OtherPlayerAnimateProcess, Process );

// MeshAnimateProcessOnce
// 移動中だけアニメーションするプロセス
// --------------------------------
var MeshAnimateProcessOnce = function( type, mesh ){	// プロセスの初期化
	Process.call( this, type );

	this.mesh = mesh;				// アニメーションメッシュ
	this.oldPosition = new THREE.Vector3();		// 移動したかどうかの比較用
};

// 初期化処理
MeshAnimateProcessOnce.prototype.onInitialize = function(){
	Process.prototype.onInitialize.call( this );
};

// 実行したい処理
MeshAnimateProcessOnce.prototype.onUpdate = function(){
	Process.prototype.onUpdate.call( this );

	var delta = 1.0 / 60.0;
	if( this.mesh.mixer != undefined ){
		// Y軸だけ確認処理を飛ばしてるので注意
		if(	Math.abs( this.mesh.position.x - this.oldPosition.x ) > 0.1 ||
			//Math.abs( this.mesh.position.y - this.oldPosition.y ) > 0.1 ||
			Math.abs( this.mesh.position.z - this.oldPosition.z ) > 0.1
		){
			this.mesh.update( delta );
		}

		this.oldPosition = new THREE.Vector3(
			this.mesh.position.x,
			this.mesh.position.y,
			this.mesh.position.z
		);
	}
};

// 継承関係を記述
inherits( MeshAnimateProcessOnce, Process );

// MapLoadProcess
// マップをロードするプロセス
// ロードした後、移動検知プロセスを生成し消滅します
// ---------------------------------------------------------------------------
var MapLoadProcess = function( type ){
	Process.call( this, type );
};

// 初期化メソッド
MapLoadProcess.prototype.onInitialize = function(){
	Process.prototype.onInitialize.call( this );

	// 始めにプレイヤーの位置を取得する(マップ番号とか)
	PostGetMessages( ['GetPos'] );

	// 以下の処理はPostGetMessagesが非同期処理なので
	// 実行されませんどうしよう
	// サーバーサイドコードでLinkEventが10秒以内の人のみなので
	// 位置データが返ってきません仕様です
	// 現在いるマップ番号を取り出し
	// for( var i in OtherPlayers ){
	// 	if( OtherPlayers[i].player_id == LoginData.id ){
	// 		// ユーザーデータにマップ番号を代入
	// 		UserData.mapno = OtherPlayers[i].mapno;			
	// 		// その他のデータも代入
	// 		UserData.positionX = OtherPlayers[i].px;
	// 		UserData.positionY = OtherPlayers[i].py;
	// 		UserData.positionZ = OtherPlayers[i].pz;
	// 		UserData.rotateX = OtherPlayers[i].rx;
	// 		UserData.rotateY = OtherPlayers[i].ry;
	// 		UserData.rotateZ = OtherPlayers[i].rz;
	// 		// ユーザーIDを代入
	// 		UserData.userid = LoginData.id;
	//
	// 		// 試しにここでプレイヤーの座標を代入
	// 		BlendMesh.position.set(
	// 			UserData.positionX,
	// 			UserData.positionY,
	// 			UserData.positionZ
	// 		);
	// 		BlendMesh.rotation.set(
	// 			UserData.rotateX,
	// 			UserData.rotateY,
	// 			UserData.rotateZ
	// 		);
	// 		break;
	// 	}
	// } // for( var i in OtherPlayers )
	// 実行されないコードここまで
	

	// シーン内のオブジェクトを全て削除
	while( scene.children.length > 0 ){
		scene.remove( scene.children[0] );
	}	

	// 追加オブジェクトのアニメーションプロセスを全て破棄
	for( var i in MapData ){
		for( var j in MapData[i].extobj ){
			if( MapData[i].extobj[j].processInstance != null ){
				MapData[i].extobj[j].processInstance.killProcess();
				MapData[i].extobj[j].processInstance = null;
			}
		}
	}

	// ライトを追加
	var ambient = new THREE.AmbientLight( 0x333333 );
	scene.add( ambient );
	// 何故かここでコメントアウトしてコードをコピーしたら実行エラーが出た
	//var direct = new THREE.DirectionalLight( 0x777777 );
	var direct = new THREE.DirectionalLight( 0xFFFFFF );
	direct.position.set( 1.0, 1.0, 1.0 );
	scene.add( direct );

	// フォグを追加
	scene.fog = new THREE.Fog( 0xFFFFFF, 100.0, 1000.0 );	

	// カメラの位置を修正
	CamCalcData.CamPos.y = CamCalcData.TransY;
	CamCalcData.CamPos.z = CamCalcData.TransZ;
	

	// 取得したマップ番号からマップをロードする
	for( var i in MapData ){
		if( UserData.mapno === MapData[i].mapnumber ){

			function setfunc( dae ){
				MapData.viewinstance = dae;
				MapData.groundinstance = dae;

				GroundMesh = dae;
			};

			// viewfilename をファイルパスとし dae をロード
			// (!)シーン自動追加されます
			LoadCollada(
				MapData[i].viewfilename,
				new THREE.Vector3(	// position
					MapData[i].positionX,
					MapData[i].positionY,
					MapData[i].positionZ
				),
				new THREE.Vector3(	// scale
					MapData[i].scaleX,
					MapData[i].scaleY,
					MapData[i].scaleZ
				),
				new THREE.Vector3(	// rotation
					MapData[i].rotateX,
					MapData[i].rotateY,
					MapData[i].rotateZ
				),
				setfunc
			);

			// 追加オブジェクトのロード
			for( var j in MapData[i].extobjs ){

				// BlendCharacter インスタンスを生成
				var animmesh = new THREE.BlendCharacter();
				MapData[i].extobjs[j].objinstance = animmesh;
				// ロード処理を行う
				animmesh.load(
					MapData[i].extobjs[j].filename,
					function(){
						animmesh.position.set(	// position
							MapData[i].extobjs[j].positionX,
							MapData[i].extobjs[j].positionY,
							MapData[i].extobjs[j].positionZ
						);

						animmesh.scale.set( // scale
							MapData[i].extobjs[j].scaleX,
							MapData[i].extobjs[j].scaleY,
							MapData[i].extobjs[j].scaleZ
						);

						animmesh.rotation.set( // rotate
							MapData[i].extobjs[j].rotateX,
							MapData[i].extobjs[j].rotateY,
							MapData[i].extobjs[j].rotateZ
						);

						// シーンにオブジェクトを追加
						scene.add( animmesh );

						// デフォルトのアニメーションを設定
						animmesh.play(
							MapData[i].extobjs[j].defaultAnimName,
							1.0
						);

						// アニメーションプロセスを生成
						var animproc = new OtherPlayerAnimateProcess(
							'mapanimproc',
							clock,
							animmesh
						);
						// MapDataにプロセスのインスタンスを設定
						MapData[i].extobjs[j].processInstance = animproc;
						// プロセスマネージャに追加
						pm.attach( animproc );

					}
				);

			} // for( var j in MapData[i].extobjs )

			// extfunc を実行する
			MapData[i].extfunc();

			break;	// マップ本体のロードは一回のみ
		} // if( UserData.mapno == MapData[i].mapnumber )

	} // for( var i in MapData )

	// サウンドをロード
	var listener = new THREE.AudioListener();
	var audioloader = new THREE.AudioLoader();
	if( sound1 && sound1.buffer != null ) sound1.stop();
	sound1 = new THREE.Audio( listener );
	audioloader.load( '/green/sound/kotori2.mp3', function( buf ){
		sound1.setBuffer( buf );
		//sound1.setRefDistance( 0 );
		sound1.setLoop( true );
		sound1.play();
	});
	// マップ番号が１(水がある場所)なら読み込む
	if( UserData.mapno === 1 ){
		if( sound2 && sound2.buffer != null ) sound2.stop();
		sound2 = new THREE.Audio( listener );
		audioloader.load( '/green/sound/water1.mp3', function( buf ){
			sound2.setBuffer( buf );
			sound2.setLoop( true );
			sound2.setVolume( 0.5 );
			sound2.play();
		});
	}
	// mapno == 1 以外ならサウンド２を止める
	else{
		if( sound2 && sound2.buffer != null ) sound2.stop();
	}
	
	// くまきちスキンメッシュ
	BlendMesh = null;
	BlendMesh = new THREE.BlendCharacter();
	BlendMesh.load( '/green/model/kumakiti1.json', function(){
		BlendMesh.scale.set( 10, 10, 10 );
		//BlendMesh.scale.set( 10, 10, 10 );
		//BlendMesh.castShadow = true;
		BlendMesh.traverse( function( child ){
			if( child instanceof THREE.Mesh ){
				//child.castShadow = true;
				//child.receiveShadow = true;
			}
		});
		scene.add( BlendMesh );
		//BlendMesh.applyWeight( 'Idle1', 1 );
		//BlendMesh.play( 'Idle1', 1 );
		BlendMesh.play( 'walk1', 1.0 );
	});

	// BlendMeshのアニメーションプロセスを止める
	if( BlendMeshAnimateProcess ) BlendMeshAnimateProcess.killProcess();
	// BlendMeshのアニメーションプロセスを生成
	var animproc = new MeshAnimateProcessOnce( 'animproc', BlendMesh );
	BlendMeshAnimateProcess = animproc;	// 忘れずに入れておく
	pm.attach( animproc );

	// 他のプレイヤー情報を空にする
	OtherPlayers = [];
	OtherPlayersPos = [];

	////////////////////////////////////
	// さくらのパーティクル読み込み
	////////////////////////////////////
	sakura_texture = THREE.ImageUtils.loadTexture( '/green/img/sakura1.png' );
	// さくらのパーティクルを作成
	sakura_particles = [];
	// マップ番号０番では、パーティクルを表示しない
	if( UserData.mapno !== 0 ){
		for( var sakurai=0; sakurai<500; ++sakurai ){
			CreateSakuraParticle(
				new THREE.Vector3(
					Math.random() * 100 - 10,
					Math.random() * 100,
					Math.random() * 100 - 10
				),
				sakura_texture
			);
		}
	}

	// このプロセスは1回呼ばれたら役目を終えます
	this.killProcess();

	console.log( 'MapLoadProcess ...' );

	// 扉の監視プロセスを動かす
	mapmove = new MapMoveWatchProcess( 'mapmove' );
	//pm.attach( mapmove );	
	this.setNext( mapmove );

};

// 実行したい処理
MapLoadProcess.prototype.onUpdate = function(){
	Process.prototype.onUpdate.call( this );


};
// 継承関係を記述
inherits( MapLoadProcess, Process );

// 迷路ゲームのタイトル画面用プロセス
// ----------------------------------------------------------------------------
// MazeMapTitleProcess プロセスクラスのコンストラクタ
var MazeMapTitleProcess = function( type ){
	Process.call( this, type );
	
};

// MazeMapTitleProcess プロセスクラスの初期化メソッド
MazeMapTitleProcess.prototype.onInitialize = function(){
	Process.prototype.onInitialize.call( this );

	// タイトルロゴ画像をロード
	mazetitleimage1 = new Image();
	mazetitleimage1.src = '/green/img/MazeTitle1.png';
	
	// シーン内のオブジェクトを全て削除
	while( scene.children.length > 0 ){
		scene.remove( scene.children[0] );
	}	

	// 追加オブジェクトのアニメーションプロセスを全て破棄
	for( var i in MapData ){
		for( var j in MapData[i].extobj ){
			if( MapData[i].extobj[j].processInstance != null ){
				MapData[i].extobj[j].processInstance.killProcess();
				MapData[i].extobj[j].processInstance = null;
			}
		}
	}

	// 標準マップのサウンドを停止
	if( sound1 && sound1.buffer !== null ) sound1.stop();
	if( sound2 && sound2.buffer !== null ) sound2.stop();

	// マウスのドラッグ処理用のプロセスを破棄
	pm.killProcessFromType( 'mousedragproc' );
	// タッチスクリーン用プロセスを破棄
	pm.killProcessFromType( 'touchleftmoveproc' );
	pm.killProcessFromType( 'touchrightmoveproc' );
	// 扉の監視プロセスを破棄
	pm.killProcessFromType( 'mapmove' );
	
	// 標準のキャンバス描画プロセスを破棄
	pm.killProcessFromType( 'canvasrenderingproc' );
	// text_canvasのクリア
	var canvas = document.getElementById("text_canvas");
	var ctx = canvas.getContext("2d");
	ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );

	// シーン構築
	
	// 平行光源を追加
	var directionallight = new THREE.DirectionalLight( 0xFFFFFF );
	directionallight.position.set( 10.0, 10.0, 10.0 );
	// Debug
	//directionallight.castShadow = true;
	scene.add( directionallight );
	// 環境光を追加
	var light = new THREE.AmbientLight( 0x777777 );
	scene.add( light );
	// フォグ設定
	scene.fog = new THREE.Fog( 0xFFFFFF, 500.0, 1500.0 );
	
	// ボックスをマップデータに従って生成
	var size = 60;
	for( var i in mazemap1 ){
		var linedata = mazemap1[i];
		for( var j in linedata ){
			if( linedata[j] === 1 ){
				// 壁を生成
				var box = new THREE.Mesh(
					new THREE.BoxGeometry( size, size, size ),
					new THREE.MeshLambertMaterial({
						color: 0x777777,
						ambient: 0x777777,
						map: THREE.ImageUtils.loadTexture(
							'/green/model/block1.png'
						)
					})
				);
				// 原点を中心にマップを配置する
				box.position.set(
					(i*size)-(mazemap1.length*size/2.0),
					0.0,
					(j*size)-(linedata.length*size/2.0)
				);
				scene.add( box );
			}
		}
	}

	// 地面を生成
	var groundbox = new THREE.Mesh(
		new THREE.BoxGeometry(
			size*mazemap1.length,
			size,
			size*mazemap1[0].length
		),
		new THREE.MeshLambertMaterial({ color: 0x77FF77 })
	);
	groundbox.position.set(
		0, -size, 0
	);
	scene.add( groundbox );
};

// MazeMapTitleProcess プロセスクラスの処理メソッド
MazeMapTitleProcess.prototype.onUpdate = function(){
	Process.prototype.onUpdate.call( this );

	// キャンバスの描画（別プロセスにするべきか？）
	var canvas = document.getElementById('text_canvas');
	var ctx = canvas.getContext('2d');
	ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );

	// VRでないなら
	if( onvr === false ){
		// タイトル画像の描画
		ctx.drawImage(
			mazetitleimage1,
			0,
			0,
			SCREEN_WIDTH,
			SCREEN_HEIGHT
		);
	}
	else if( onvr === true ){
		// 左目用
		ctx.drawImage(
			mazetitleimage1,
			0,
			0,
			SCREEN_WIDTH / 2,
			SCREEN_HEIGHT
		);
		// 右目用
		ctx.drawImage(
			mazetitleimage1,
			SCREEN_WIDTH / 2,
			0,
			SCREEN_WIDTH / 2,
			SCREEN_HEIGHT
		);
	}



	// ゲームパッドの状態を取得する
	gamepadlist = navigator.getGamepads();	// なんかグローバル変数使わないとXbox取れない、なんで？
	for( var i=0; i<4; ++i ){
		gamepad = gamepadlist[i];
		if( gamepad === null ) continue;

		if( gamepad.id !== undefined ){
			if( gamepad.id.indexOf( 'Gamesir-G3s' ) >= 0 ) break;
			if( gamepad.id.indexOf( 'Xbox' ) >= 0 ) break;
			//if( gamepad.id.indexOf( 'HORI' ) >= 0 ) break;
		}

		if( gamepad.id === GamepadIDString ){
			break;
		}
		if( gamepad.id === GamepadIDString2 ){
			break;
		}
	}

	// 初期はgamepadlistは、nullなので取得できない（ハマった）
	if( gamepad === null || gamepad === undefined ) return;

	var buttons = gamepad.buttons;
	console.log( buttons );
	// ○ボタンが押されていたら画面を変える
	if(
		buttons[2].pressed === true ||
		buttons[3].pressed === true
	){
		var mazenextprocess = new MazeMapLoadProcess( 'MazeMapLoad' );
		// 次のプロセスに設定
		this.setNext( mazenextprocess );
		// このプロセスを破棄する
		this.killProcess();
	}
	
	// カメラを回転させる
	titlecamerarotate += 0.01;
	if( titlecamerarotate > 3.14*2.0 ) titlecamerarotate = 0.0;
	var sinv = Math.sin( titlecamerarotate );
	var cosv = Math.cos( titlecamerarotate );
	var cameradistance = 500.0;
	camera.position.set(
		sinv*cameradistance,
		cameradistance,
		cosv*cameradistance
	);
	camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );
};

// MazeMapTitleProcess プロセスクラスの継承関係を記述
inherits( MazeMapTitleProcess, Process );

// 迷路データの読み込みプロセスクラス定義
// MazeMapLoadProcess プロセスクラスのコンストラクタ
// ----------------------------------------------------------------------------
var MazeMapLoadProcess = function( type ){
	Process.call( this, type );
	
};

// MazeMapLoadProcess プロセスクラスの初期化メソッド
MazeMapLoadProcess.prototype.onInitialize = function(){
	Process.prototype.onInitialize.call( this );

	// シーン内のオブジェクトを全て削除
	while( scene.children.length > 0 ){
		scene.remove( scene.children[0] );
	}	

	

	// 追加オブジェクトのアニメーションプロセスを全て破棄
	for( var i in MapData ){
		for( var j in MapData[i].extobj ){
			if( MapData[i].extobj[j].processInstance != null ){
				MapData[i].extobj[j].processInstance.killProcess();
				MapData[i].extobj[j].processInstance = null;
			}
		}
	}

	// 標準マップのサウンドを停止
	if( sound1 && sound1.buffer !== null ) sound1.stop();
	if( sound2 && sound2.buffer !== null ) sound2.stop();

	// マウスのドラッグ処理用のプロセスを破棄
	pm.killProcessFromType( 'mousedragproc' );
	// タッチスクリーン用プロセスを破棄
	pm.killProcessFromType( 'touchleftmoveproc' );
	pm.killProcessFromType( 'touchrightmoveproc' );
	// 扉の監視プロセスを破棄
	pm.killProcessFromType( 'mapmove' );
	
	// 標準のキャンバス描画プロセスを破棄
	pm.killProcessFromType( 'canvasrenderingproc' );
	// text_canvasのクリア
	var canvas = document.getElementById("text_canvas");
	var ctx = canvas.getContext("2d");
	ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );

	// BGMを早めにロードしておく
	var listener = new THREE.AudioListener();
	var audioloader = new THREE.AudioLoader();
	maze_bgm1 = new THREE.Audio( listener );
	if( maze_bgm1 && maze_bgm1.buffer != null ) maze_bgm1.stop();
	//audioloader.load( '/green/sound/wakuwakutankentai.mp3', function( buf ){
	//audioloader.load( '/green/sound/wakuwakutankentai.ogg', function( buf ){
	audioloader.load( '/green/sound/takibi1.mp3', function( buf ){
		maze_bgm1.setBuffer( buf );
		maze_bgm1.setLoop( true );
		maze_bgm1.play();
	});

	// シーン構築
	
	// 平行光源を追加
	//var directionallight = new THREE.DirectionalLight( 0xFFFFFF );
	//directionallight.position.set( 10.0, 10.0, 10.0 );
	//scene.add( directionallight );
	// 環境光を追加
	//var light = new THREE.AmbientLight( 0x777777 );
	// かなり暗めにする
	var light = new THREE.AmbientLight( 0x222222 );
	scene.add( light );

	// たいまつ用点光源を生成
	maze_taimatu_light = new THREE.PointLight( 0xFF9C00, 5.0, 100.0 );
	scene.add( maze_taimatu_light );

	// 物理エンジン初期化テスト
	var collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
	var dispatcher = new Ammo.btCollisionDispatcher( collisionConfiguration );
	var overlappingPairCache = new Ammo.btDbvtBroadphase();
	var solver = new Ammo.btSequentialImpulseConstraintSolver();
	dynamicsWorld = new Ammo.btDiscreteDynamicsWorld(
		dispatcher,
		overlappingPairCache,
		solver,
		collisionConfiguration
	);

	// 重力の設定
	dynamicsWorld.setGravity( new Ammo.btVector3( 0, 0, 0 ) );	// 無重力に設定

	// ボックスをマップデータに従って生成
	var size = 60;
	for( var i in mazemap1 ){
		var linedata = mazemap1[i];
		for( var j in linedata ){
			if( linedata[j] === 1 ){
				// 壁を生成
				var box = new THREE.Mesh(
					new THREE.BoxGeometry( size, size, size ),
					new THREE.MeshLambertMaterial({
						color: 0x777777,
						ambient: 0x777777,
						map: THREE.ImageUtils.loadTexture(
							'/green/model/block1.png'
						)
					})
				);
				box.position.set( i*size, 0.0, j*size );
				scene.add( box );

				// 物理エンジンにボックスを追加
				var form = new Ammo.btTransform();
				form.setIdentity();
				form.setOrigin( new Ammo.btVector3( i*size, 0.0, j*size ) );
				var rigidbody = new Ammo.btRigidBody(
					new Ammo.btRigidBodyConstructionInfo(
						0,	// 質量ゼロで固定する
						new Ammo.btDefaultMotionState( form ),
						new Ammo.btBoxShape(
							new Ammo.btVector3( size/2, size/2, size/2 )
						),
						// 慣性モーメントは０で固定
						new Ammo.btVector3( 0, 0, 0 )
					)
				);
				dynamicsWorld.addRigidBody( rigidbody );
				
			}	
		}
	}
	

	// 地面を生成
	var groundbox = new THREE.Mesh(
		new THREE.BoxGeometry(
			size*mazemap1.length,
			size,
			size*mazemap1[0].length
		),
		new THREE.MeshLambertMaterial({ color: 0x77FF77 })
	);
	groundbox.position.set(
		size*mazemap1.length/2.0,
		-size,
		size*mazemap1[0].length/2.0
	);
	scene.add( groundbox );

	// シーンをクリアするコードを実行してもカメラは削除されないらしい
	camera.position.set(
		//size*mazemap1.length/2.0 + 400.0,
		//300.0,
		//size*mazemap1[0].length/2.0 + 400.0
		size,
		0.0,
		size
	);
	camera.lookAt( new THREE.Vector3(
		//size*mazemap1.length/2.0,
		//0.0,
		//size*mazemap1[0].length/2.0
		size*2.0,
		0.0,
		size*3.0
	) );
	//scene.add( camera );
	
	// プレイヤーとなる剛体球体を設定
	var form = new Ammo.btTransform();
	form.setIdentity();
	form.setOrigin( new Ammo.btVector3(
		camera.position.x,
		camera.position.y,
		camera.position.z
	) );
	dynamicsSphere = new Ammo.btRigidBody(
		new Ammo.btRigidBodyConstructionInfo(
			1.0,	// 質量
			new Ammo.btDefaultMotionState( form ),
			new Ammo.btSphereShape( 3.0 ),		// 半径を指定
			// 慣性モーメントは０で固定
			new Ammo.btVector3( 0, 0, 0 )
		)
	);
	dynamicsWorld.addRigidBody( dynamicsSphere );

	// 残り時間をリセットする
	mazetime_minute = 1;
	mazetime_second = 30;

	// たいまつモデルをロードする
	var jsonloader = new THREE.JSONLoader();
	jsonloader.load(
		'/green/model/Taimatu1.json',
		function( geometry, materials ){
			taimatumodel = new THREE.Mesh( geometry, materials );
			taimatumodel.scale.set( 10.0, 10.0, 10.0 );
			scene.add( taimatumodel );	// シーンに追加
		}
	);


	// たいまつパーティクル用の画像を読み込む
	if( maze_taimatu_particles_texture === null )
		maze_taimatu_particles_texture =
			THREE.ImageUtils.loadTexture( '/green/img/fire1.png' );

};

// MazeMapLoadProcess プロセスクラスの処理メソッド
MazeMapLoadProcess.prototype.onUpdate = function(){
	Process.prototype.onUpdate.call( this );

	// 残り時間から秒数を引く
	mazetime_second -= 1.0/60.0;
	if( mazetime_second <= 0 ){
		mazetime_second = 60.0;
		mazetime_minute -= 1;
		if( mazetime_minute <= -1 ){
			// 時間切れの場合の処理をここに書く

			// BGMを止める
			if( maze_bgm1 && maze_bgm1.buffer != null ) maze_bgm1.stop();

			// ゲームオーバー画面のプロセスに切り替える
			//this.setNext( new MazeMapTitleProcess( 'MazeMapTitle' ) );
			this.setNext( new GameOverSceneProcess( 'GameOverSceneProcess' ) );
			this.killProcess();
		}
	}
	
	// キャンバスの描画（別プロセスにするべきか？）
	var canvas = document.getElementById('text_canvas');
	var ctx = canvas.getContext('2d');
	// キャンバスのクリア
	ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );
	// 残り時間の文字列を作る
	var timestr = mazetime_minute + ':' + mazetime_second;
	// 残り時間を描画する
	ctx.font = '36px Arial';
	ctx.fillStyle = '#FFFFFF';
	ctx.fillText( timestr, SCREEN_WIDTH-100, 30 );


	// 物理エンジンの計算処理
	dynamicsWorld.stepSimulation( 60.0 / 1000.0 );

	// ゲームパッド情報を取得する
	gamepadlist = navigator.getGamepads();	// なんかグローバル変数使わないとXbox取れない、なんで？
	for( var i=0; i<4; ++i ){
		gamepad = gamepadlist[i];
		if( gamepad === null ) continue;

		if( gamepad.id !== undefined ){
			if( gamepad.id.indexOf( 'Gamesir-G3s' ) >= 0 ) break;
			if( gamepad.id.indexOf( 'Xbox' ) >= 0 ) break;
			//if( gamepad.id.indexOf( 'HORI' ) >= 0 ) break;
		}

		if( gamepad.id === GamepadIDString ){
			break;
		}
		if( gamepad.id === GamepadIDString2 ){
			break;
		}
	}

	if( gamepad === null || gamepad === undefined ) return;

	var axes = gamepad.axes;	// 軸情報を無理やり取得
	var axesvx = axes[0];
	var axesvy = axes[1];
	var movevector = new THREE.Vector3( axesvx*100.0, 0.0, axesvy*100.0 );
	// カメラのワールドの角度を取得する
	//var worldcamerarot = new THREE.Vector3();
	//camera.getWorldDirection( worldcamerarot );
	// 現在のカメラ角度(Y軸)で座標変換を行う行列を作る
	var RotMat = new THREE.Matrix4();
	RotMat.makeRotationFromEuler(
		new THREE.Euler( 0.0, mazecamerarot.y, 0.0, 'XYZ' )
		//new THREE.Euler( 0.0, worldcamerarot.y-3.14, 0.0, 'XYZ' )
		//new THREE.Euler( 0.0, camera.rotation.y-3.14, 0.0, 'XYZ' )
	);
	// キャラクタ移動量を座標変換
	movevector.applyMatrix4( RotMat );

	//console.log( gamepad );
	//console.log( gamepad.axes[0] );
	//console.log( movevector );

	//if( movevector.x < 1.0 ) movevector.x = 0.0;
	//if( movevector.z < 1.0 ) movevector.z = 0.0;
	// プレイヤー剛体球体の移動処理
	dynamicsSphere.setLinearVelocity(
		new Ammo.btVector3( 0.0, 0.0, 0.0 )
	);
	dynamicsSphere.setLinearVelocity(
		new Ammo.btVector3( movevector.x, 0.0, movevector.z )
	);

	// コントローラー右スティックでカメラを回転させる
	var axesvx2 = axes[2];
	var axesvy2 = axes[3];

	// Y軸回転
	mazecamerarot.y -= axesvx2 * 0.05;
	if( mazecamerarot.y > 3.14 ) mazecamerarot.y = -3.14;
	if( mazecamerarot.y < -3.14 ) mazecamerarot.y = 3.14;

	// vr状態ならカメラ角度を更新
	if( onvr === true ){
		mazecamerarot.y = stereocamera.left.rotation.y;
	}

	// 角度を強制的に設定
	camera.rotation.set(
		mazecamerarot.x,
		mazecamerarot.y,
		mazecamerarot.z
	);

	//if( keyinput === -1 ){
		//dynamicsSphere.setLinearVelocity(
		//	new Ammo.btVector3( 0, 0, 0 )
		//);
	//}
	if( keyinput === 87 ){	// W key
		dynamicsSphere.setLinearVelocity(
			new Ammo.btVector3( 0, 0, 50 )
		);
	}
	if( keyinput === 65 ){	// A key
		dynamicsSphere.setLinearVelocity(
			new Ammo.btVector3( 50, 0, 0 )
		);
	}
	if( keyinput === 83 ){	// S key
		dynamicsSphere.setLinearVelocity(
			new Ammo.btVector3( 0, 0, -50 )
		);
	}
	if( keyinput === 68 ){	// D key
		dynamicsSphere.setLinearVelocity(
			new Ammo.btVector3( -50, 0, 0 )
		);
	}
	//console.log( 'keyinput:' + keyinput );
	
	// プレイヤー剛体球体を強制的にアクティブにする
	dynamicsSphere.setActivationState( 1 );	// 1 - active
	dynamicsSphere.activate();

	// プレイヤー剛体球体の位置情報を取得する
	dynamicsSphere.getMotionState().getWorldTransform( spheretrans );
	
	// プレイヤー剛体球体から位置を取得してカメラに設定
	if( onvr === false ){
		camera.position.set(
			spheretrans.getOrigin().x(),
			spheretrans.getOrigin().y(),
			spheretrans.getOrigin().z()
		);
	}
	else if( onvr === true ){
		// 以下のコードは、視差を考慮していないので注意
		// 左目と右目で違う映像を出力するべき
		stereocamera.left.position.set(
			spheretrans.getOrigin().x(),
			spheretrans.getOrigin().y(),
			spheretrans.getOrigin().z()
		);
		stereocamera.right.position.set(
			spheretrans.getOrigin().x(),
			spheretrans.getOrigin().y(),
			spheretrans.getOrigin().z()
		);
	}

	// たいまつの位置を計算する
	var taimatupos = new THREE.Vector3( 10.0, -10.0, -30.0 );
	// 回転行列を適用
	taimatupos.applyMatrix4( RotMat );
	// たいまつモデルの位置を設定
	if( taimatumodel !== null ){
		taimatumodel.position.set(
			spheretrans.getOrigin().x() + taimatupos.x,
			spheretrans.getOrigin().y() + taimatupos.y,
			spheretrans.getOrigin().z() + taimatupos.z
		);
		// 角度を指定する
		var taimaturot = new THREE.Vector3( -3.14/4.0, 0.0, 0.0 );
		taimaturot.applyMatrix4( RotMat );
		taimatumodel.rotation.set(
			taimaturot.x,
			taimaturot.y,
			taimaturot.z
		);
	}

	// 炎のパーティクルを生成追加
	if( maze_taimatu_particles_texture !== null ){
		var taimatufirepos = new THREE.Vector3(
			10.0 - 10.0 + Math.random() * 10.0,
			-10.0 + 10.0 + Math.random() * 10.0,
			-30.0 - 20.0 + Math.random() * 10.0
		);
		taimatufirepos.applyMatrix4( RotMat );
		CreateMazeParticle(
			new THREE.Vector3(
				spheretrans.getOrigin().x() + taimatufirepos.x,
				spheretrans.getOrigin().y() + taimatufirepos.y,
				spheretrans.getOrigin().z() + taimatufirepos.z
			),
			maze_taimatu_particles_texture
		);

		// 点光源の位置を設定
		maze_taimatu_light.position.set(
			spheretrans.getOrigin().x() + taimatufirepos.x,
			spheretrans.getOrigin().y() + taimatufirepos.y,
			spheretrans.getOrigin().z() + taimatufirepos.z
		);
	}
	/*
	// パーティクルを上昇させる
	for( var i in maze_taimatu_particles ){
		if( maze_taimatu_particles[i].position.y > 50.0 ){
			scene.remove(
				maze_taimatu_particles[i]
			);
			maze_taimatu_particles.splice( i, 1 );
		}

		maze_taimatu_particles[i].position.y += 0.5;
	}
	*/
	// パーティクルを上昇させる処理をunderscore.jsで書く
	// パーティクルってかスプライトなんだけど
	_.each( maze_taimatu_particles, function( ptc, index ){
		if( ptc !== undefined ){	// 配列からオブジェクトを削除するのでチェック
			if( ptc.position.y > 50.0 ){
				// 副作用あり
				scene.remove( ptc );
				maze_taimatu_particles.splice( index, 1 );
			}
			else{
				ptc.position.y += 0.5;
			}
		}
	});
		
	//console.log( 'cx:' + camera.position.x + ' cy:'	+ camera.position.y + ' cz:' + camera.position.z  );

	// プレイヤーとゴールの当たり判定を行う
	// if(	(
	// 	Math.pow( camera.position.x - 1000.0, 2 ) +
	// 	Math.pow( camera.position.y - 50.0, 2 ) +
	// 	Math.pow( camera.position.z - 1000.0, 2 )
	// 	) <= Math.pow( 100.0, 2 )
	// ){
	
	// プレイヤー剛体球体の位置情報を取得する
	dynamicsSphere.getMotionState().getWorldTransform( spheretrans );
	if(	(
		Math.pow( spheretrans.getOrigin().x() - 1000.0, 2 ) +
		Math.pow( spheretrans.getOrigin().y() - 50.0, 2 ) +
		Math.pow( spheretrans.getOrigin().z() - 1000.0, 2 )
		) <= Math.pow( 100.0, 2 )
	){
		// ゴールした時の処理
		
		// BGMを停止する
		if( maze_bgm1 && maze_bgm1.buffer !== null ) maze_bgm1.stop();

		// ゴール画面を表示する
		this.killProcess();
		this.setNext( new GoalScreenProcess( 'GoalScreenProcess' ) );
	}
};

// MazeMapLoadProcess プロセスクラスの継承関係を記述
inherits( MazeMapLoadProcess, Process );

// プレイヤーがゴールした時の画面プロセス
// ----------------------------------------------------------------------------
// GoalScreenProcess プロセスクラスのコンストラクタ
var GoalScreenProcess = function( type ){
	Process.call( this, type );
	
	// Imageクラス
	this.goalImage = null;

	// 待機用カウンタ
	this.counter = 0;

	// サウンド
	this.gameclearsound = null;
};

// GoalScreenProcess プロセスクラスの初期化メソッド
GoalScreenProcess.prototype.onInitialize = function(){
	Process.prototype.onInitialize.call( this );
	
	// 画像を読み込む？
	this.goalImage = new Image();
	this.goalImage.src = '/green/img/GoalImage1.png';

	// ゲームクリア音を読み込む
	var listener = new THREE.AudioListener();
	var audioloader = new THREE.AudioLoader();
	this.gameclearsound = new THREE.Audio( listener );
	var snd = this.gameclearsound;
	audioloader.load( '/green/sound/GoalSound1.mp3', function( buf ){
		snd.setBuffer( buf );
		snd.play();
		// ループはしない、一回だけ再生
	});
	

};

// GoalScreenProcess プロセスクラスの処理メソッド
GoalScreenProcess.prototype.onUpdate = function(){
	Process.prototype.onUpdate.call( this );
	
	// ゴール画面用画像を表示する
	var canvas = document.getElementById('text_canvas');
	var ctx = canvas.getContext('2d');
	ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );
	if( onvr === false ){
		ctx.drawImage(
			this.goalImage,
			0,
			0,
			SCREEN_WIDTH,
			SCREEN_HEIGHT
		);
	}
	else if( onvr === true ){
		// 左目用
		ctx.drawImage(
			this.goalImage,
			0,
			0,
			SCREEN_WIDTH / 2,
			SCREEN_HEIGHT
		);
		// 右目用
		ctx.drawImage(
			this.goalImage,
			SCREEN_WIDTH / 2,
			0,
			SCREEN_WIDTH / 2,
			SCREEN_HEIGHT
		);
	}

	// カウンタが1000未満ならカウント
	if( this.counter < 1000 ) this.counter++;
	else{
		// タイトルプロセスへ切り替え
		this.killProcess();
		this.setNext( new MazeMapTitleProcess( 'MazeMapTitleProcess' ) );
	}
};

// GoalScreenProcess プロセスクラスの継承関係を記述
inherits( GoalScreenProcess, Process );

// GameOverSceneProcess
// ----------------------------------------------------------------------------
// GameOverSceneProcess プロセスクラスのコンストラクタ
var GameOverSceneProcess = function( type ){
	Process.call( this, type );
	
	// Imageクラス
	this.gameOverImage = null;

	// 待機用カウンタ
	this.counter = 0;

	// サウンド
	this.gameoversound = null;
};

// GameOverSceneProcess プロセスクラスの初期化メソッド
GameOverSceneProcess.prototype.onInitialize = function(){
	Process.prototype.onInitialize.call( this );
	
	// 画像を読み込む？
	this.gameOverImage = new Image();
	this.gameOverImage.src = '/green/img/GameOverImage1.png';

	// ゲームオーバー音を読み込む
	var listener = new THREE.AudioListener();
	var audioloader = new THREE.AudioLoader();
	this.gameoversound = new THREE.Audio( listener );
	var snd = this.gameoversound;
	audioloader.load( '/green/sound/GameOverSound1.mp3', function( buf ){
		snd.setBuffer( buf );
		snd.play();
		// ループはしない、一回だけ再生
	});
	
};

// Screen じゃないよ Scene だよ、間違い注意
// GameOverSceneProcess プロセスクラスの処理メソッド
GameOverSceneProcess.prototype.onUpdate = function(){
	Process.prototype.onUpdate.call( this );
	
	// ゲームオーバー画面用画像を表示する
	var canvas = document.getElementById('text_canvas');
	var ctx = canvas.getContext('2d');
	ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );

	if( onvr === false ){
		ctx.drawImage(
			this.gameOverImage,
			0,
			0,
			SCREEN_WIDTH,
			SCREEN_HEIGHT
		);
	}
	else if( onvr === true ){
		// 左目用
		ctx.drawImage(
			this.gameOverImage,
			0,
			0,
			SCREEN_WIDTH / 2,
			SCREEN_HEIGHT
		);
		// 右目用
		ctx.drawImage(
			this.gameOverImage,
			SCREEN_WIDTH / 2,
			0,
			SCREEN_WIDTH / 2,
			SCREEN_HEIGHT
		);

	}

	// カウンタが1000未満ならカウント
	if( this.counter < 1000 ) this.counter++;
	else{
		// タイトルプロセスへ切り替え
		this.killProcess();
		this.setNext( new MazeMapTitleProcess( 'MazeMapTitleProcess' ) );
	}
};

// GameOverSceneProcess プロセスクラスの継承関係を記述
inherits( GameOverSceneProcess, Process );

// MapMoveWatchProcess
// マップ間の移動を検知して処理を行うプロセス
// 処理した後、ロードプロセスを生成し、消滅します
// ----------------------------------------------------------------------------
var MapMoveWatchProcess = function( type ){
	Process.call( this, type );

};

// 初期化処理
MapMoveWatchProcess.prototype.onInitialize = function(){
	Process.prototype.onInitialize.call( this );

};

// 実行したい処理
MapMoveWatchProcess.prototype.onUpdate = function(){
	Process.prototype.onUpdate.call( this );
	

	// プレイヤー球と扉球の当たり判定を行う
	if(	(	
		Math.pow( CamCalcData.CamTarget.x - Map0Sphere0.positionX, 2 ) +
		Math.pow( CamCalcData.CamTarget.y - Map0Sphere0.positionY, 2 ) +
		Math.pow( CamCalcData.CamTarget.z - Map0Sphere0.positionZ, 2 )
		) <= Math.pow( 50 + Map0Sphere0.radius, 2 )
	){

		console.log( '衝突しています' );

		if( UserData.mapno === 0 ){

			// ユーザーの所属しているマップ番号を変更
			UserData.mapno = 1;

			// このプロセスを切る
			this.killProcess();

			// 再びロードされないよう位置を初期化
			CamCalcData.CamTarget.set( 0, 0, 0 );

			// VRの位置データも初期化
			if( stereocamera ){
				stereocamera.left.position.set( 0.0, 100.0, 0.0 );
				stereocamera.right.position.set( 0.0, 100.0, 0.0 );
			}

			// マップロードプロセスを追加
			mapload = new MapLoadProcess( 'mapload' );
			//pm.attach( mapload );
			this.setNext( mapload );

		}
	}

	// マップ１番ルート０番の当たり判定
	if(	(	
		Math.pow( CamCalcData.CamTarget.x - Map1Sphere0.positionX, 2 ) +
		Math.pow( CamCalcData.CamTarget.y - Map1Sphere0.positionY, 2 ) +
		Math.pow( CamCalcData.CamTarget.z - Map1Sphere0.positionZ, 2 )
		) <= Math.pow( 50 + Map1Sphere0.radius, 2 )
	){
		if( UserData.mapno === 1 ){

			// ユーザーの所属しているマップ番号を変更
			UserData.mapno = 2;

			// このプロセスを切る
			this.killProcess();

			// 再びロードされないよう位置を初期化
			CamCalcData.CamTarget.set( 0, 0, 0 );

			// VRの位置データも初期化
			if( stereocamera ){
				stereocamera.left.position.set( 0.0, 100.0, 0.0 );
				stereocamera.right.position.set( 0.0, 100.0, 0.0 );
			}

			// マップロードプロセスを追加
			mapload = new MapLoadProcess( 'mapload' );
			//pm.attach( mapload );
			this.setNext( mapload );
		}
	}
	
	// マップ２番ルート０番の当たり判定
	if(	(	
		Math.pow( CamCalcData.CamTarget.x - Map2Sphere0.positionX, 2 ) +
		Math.pow( CamCalcData.CamTarget.y - Map2Sphere0.positionY, 2 ) +
		Math.pow( CamCalcData.CamTarget.z - Map2Sphere0.positionZ, 2 )
		) <= Math.pow( 50 + Map1Sphere0.radius, 2 )
	){
		if( UserData.mapno === 2 ){

			// ユーザーの所属しているマップ番号を変更
			UserData.mapno = 0;

			// このプロセスを切る
			this.killProcess();

			// 再びロードされないよう位置を初期化
			CamCalcData.CamTarget.set( 0, 0, 0 );

			// VRの位置データも初期化
			if( stereocamera ){
				stereocamera.left.position.set( 0.0, 100.0, 0.0 );
				stereocamera.right.position.set( 0.0, 100.0, 0.0 );
			}

			// マップロードプロセスを追加
			mapload = new MapLoadProcess( 'mapload' );
			//pm.attach( mapload );
			this.setNext( mapload );
		}
	}
	
	// 扉の監視プロセスでカメラの状態を設定する
	camera.position.set(
		CamCalcData.CamPos.x,
		CamCalcData.CamPos.y,
		CamCalcData.CamPos.z
	);
	camera.lookAt( CamCalcData.CamTarget );

	// JQuery-UI TEST
	// 毎フレームDOM要素を更新してみるテスト
	// if( $('#dialog').length > 0 ){
	// 	$('#dialog').html( 'Random: ' + Math.random() * 10 );
	// }
};
// 継承関係を記述
inherits( MapMoveWatchProcess, Process );

// マウスのドラッグ処理を担当するプロセスを定義します
// MouseDragProc クラス定義
//------------------------------------------------------------------------------
// MouseDragProc プロセスクラスのコンストラクタ
var MouseDragProc = function( type ){
	Process.call( this, type );
	
};

// MouseDragProc プロセスクラスの初期化メソッド
MouseDragProc.prototype.onInitialize = function(){
	Process.prototype.onInitialize.call( this );
	
};

// MouseDragProc プロセスクラスの処理メソッド
MouseDragProc.prototype.onUpdate = function(){
	Process.prototype.onUpdate.call( this );
	
	// マウスドラッグプロセス関数を実行
	MouseDragProcess();

};

// MouseDragProc プロセスクラスの継承関係を記述
inherits( MouseDragProc, Process );

// 左画面のタッチ処理を担当するプロセスを定義します
// TouchLeftMoveProc クラス定義
//------------------------------------------------------------------------------
// TouchLeftMoveProc プロセスクラスのコンストラクタ
var TouchLeftMoveProc = function( type ){
	Process.call( this, type );
	
};

// TouchLeftMoveProc プロセスクラスの初期化メソッド
TouchLeftMoveProc.prototype.onInitialize = function(){
	Process.prototype.onInitialize.call( this );
	
};

// TouchLeftMoveProc プロセスクラスの処理メソッド
TouchLeftMoveProc.prototype.onUpdate = function(){
	Process.prototype.onUpdate.call( this );
	
	// TouchLeftMoveProcess 関数をここで実行する
	TouchLeftMoveProcess( TouchScreenLeftData.ev );
};

// TouchLeftMoveProc プロセスクラスの継承関係を記述
inherits( TouchLeftMoveProc, Process );

// 右画面のタッチ処理を担当するプロセスを定義します
// TouchRightMoveProc クラス定義
//------------------------------------------------------------------------
// TouchRightMoveProc プロセスクラスのコンストラクタ
var TouchRightMoveProc = function( type ){
	Process.call( this, type );
	
};

// TouchRightMoveProc プロセスクラスの初期化メソッド
TouchRightMoveProc.prototype.onInitialize = function(){
	Process.prototype.onInitialize.call( this );
	
};

// TouchRightMoveProc プロセスクラスの処理メソッド
TouchRightMoveProc.prototype.onUpdate = function(){
	Process.prototype.onUpdate.call( this );
	
	// TouchRightMoveProcess 関数を実行
	// イベントデータを渡していることに注意
	TouchRightMoveProcess( TouchScreenRightData.ev );
};

// TouchRightMoveProc プロセスクラスの継承関係を記述
inherits( TouchRightMoveProc, Process );

// キャンバスのレンダリング処理を担当するプロセスを定義します
// CanvasRenderingProcess クラス定義
//--------------------------------------------------------------------------
// CanvasRenderingProcess プロセスクラスのコンストラクタ
var CanvasRenderingProcess = function( type ){
	Process.call( this, type );
	
};

// CanvasRenderingProcess プロセスクラスの初期化メソッド
CanvasRenderingProcess.prototype.onInitialize = function(){
	Process.prototype.onInitialize.call( this );
	
};

// CanvasRenderingProcess プロセスクラスの処理メソッド
CanvasRenderingProcess.prototype.onUpdate = function(){
	Process.prototype.onUpdate.call( this );
	

	// キャンバス内描画処理
	
	// text_canvasのクリア
	var canvas = document.getElementById("text_canvas");
	var ctx = canvas.getContext("2d");
	ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );

	// VRアイコンの描画
	ctx.drawImage(
		//'/green/img/vricon1.png',
		vriconimage,
		SCREEN_WIDTH - 64,
		SCREEN_HEIGHT - 64,
		64,
		64
	);

	// VRがオンなら描画しない
	if( onvr === false ){
		// 自分のニックネームを描画する
		var scrpos = new THREE.Vector3(
			UserData.positionX,
			UserData.positionY,
			UserData.positionZ
		);
		scrpos.project( camera );
		scrpos.x = ( scrpos.x + 1.0 ) / 2.0 * SCREEN_WIDTH;
		scrpos.y = -( scrpos.y - 1.0 ) / 2.0 * SCREEN_HEIGHT;
		scrpos.x += -20;
		scrpos.y += 40;
		ctx.font = "14px Arial";
		ctx.fillStyle = "#000000";
		ctx.fillText( LoginData.nickname, scrpos.x+2, scrpos.y+2 );
		ctx.fillStyle = "#FFFFFF";
		ctx.fillText( LoginData.nickname, scrpos.x, scrpos.y );
		
		// 他のプレイヤーのニックネームを描画する	
		for( var i in OtherPlayersPos ){
			if(	OtherPlayersPos[i].model.mixer === undefined ||
				OtherPlayersPos[i].mapno != UserData.mapno	// マップ番号が違うなら描画しない
			){
				continue;
			}
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
			//console.log( 'sz:' + screen_pos.z );

			// 座標変換した screen_pos.z が 1.0 以上なら描画しない
			if( screen_pos.z > 1.0 ){
				screen_pos.x = SCREEN_WIDTH;
				screen_pos.y = SCREEN_HEIGHT;
			}

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

				// 他のプレイヤーのコメントを描画する
				if( DisplayComment[j]["player_id"] === OtherPlayersPos[i]["player_id"] ){
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
		
		// 自分のコメントを描画する
		// for( var j in DisplayComment ){
		// 	if( DisplayComment[j]['player_id'] === LoginData.id ){
		// 		if( DisplayComment[j]['timer'] < 500 ){
		//
		// 			// scrpos が定義されているので使う
		// 			var fixpx = scrpos.x -
		// 				ctx.measureText( DisplayComment[j]["comment"] ).width / 2 + 30;
		//
		// 			ctx.fillStyle = '#ADD8E6';	// Light bule.
		// 			roundedRect(
		// 				ctx,
		// 				fixpx,			// px
		// 				scrpos.y-70-16,	// py
		// 				ctx.measureText(
		// 					DisplayComment[j]["comment"]
		// 				).width + 5,		// width
		// 				16 + 5,			// height
		// 				10			// radius
		// 			);
		//
		// 			ctx.fillStyle = "#000000";
		// 			ctx.fillText(
		// 				DisplayComment[j]["comment"],
		// 				fixpx+2,
		// 				scrpos.y-70+2
		// 			);
		// 			ctx.fillStyle = "#FFFFFF";
		// 			ctx.fillText(
		// 				DisplayComment[j]["comment"],
		// 				fixpx,
		// 				scrpos.y-70
		// 			);
		// 			DisplayComment[j]["timer"] ++;
		//
		// 			break;
		// 		}
		// 	}
		// }
		var FPobj = new FP();
		var draw_my_comments = FPobj.draw_my_commets();
		var capture = {
			'DisplayComment': DisplayComment,
			'ctx': ctx,
			'LoginData': LoginData,
			'scrpos': scrpos
		};
		draw_my_comments( capture );

		// マップ番号０番のみスタッフのコメントを描画
		// if( UserData.mapno === 0 ){
		//
		// 	// 文字列 - ネットケアスタッフ
		// 	var ctx = $('#text_canvas')[0].getContext('2d');
		// 	var stuffpos = new THREE.Vector3(
		// 				CpuMesh.position.x,
		// 				CpuMesh.position.y,
		// 				CpuMesh.position.z
		// 			);
		// 	stuffpos.project( camera );
		// 	stuffpos.x = ( stuffpos.x + 1 ) / 2 * SCREEN_WIDTH;
		// 	stuffpos.y = -( stuffpos.y - 1 ) / 2 * SCREEN_HEIGHT; 
		// 	if( stuffpos.z > 1.0 ){
		// 		stuffpos.x = SCREEN_WIDTH;
		// 		stuffpos.y = SCREEN_HEIGHT;
		// 	}
		// 	var cpx = stuffpos.x;
		// 	var cpy = stuffpos.y;
		//
		// 	cpx += -20;
		// 	cpy += 40;
		//
		// 	ctx.font = "14px Arial";
		// 	ctx.fillStyle = "#000000";
		// 	ctx.fillText( 'ネットケアスタッフ', cpx+2, cpy+2 );
		// 	ctx.fillStyle = "#FFFFFF";
		// 	ctx.fillText( 'ネットケアスタッフ', cpx, cpy );
		//
		// 	// デイケアスタッフのコメントを描画
		// 	for( var i in StuffComment ){
		// 		// 一人目のスタッフのコメントを描画する
		// 		if( StuffComment[i]["timer"] < 500 && StuffComment[i]["stuff_id"] === -1 ){
		// 			var fixpx = stuffpos.x -
		// 				ctx.measureText( StuffComment[i]["comment"] ).width / 2;
		//
		// 			ctx.fillStyle = "#FA8072";
		// 			roundedRect(
		// 				ctx,
		// 				fixpx,			// px
		// 				stuffpos.y-30-16,	// py
		// 				ctx.measureText( StuffComment[i]["comment"] ).width + 5, // width
		// 				16 + 5,		// height
		// 				10		// radius
		// 			);
		//			
		// 			ctx.fillStyle = "#000000";
		// 			ctx.fillText(
		// 				StuffComment[i]["comment"],
		// 				fixpx+2,
		// 				stuffpos.y-30+2
		// 			);
		//				
		// 			ctx.fillStyle = "#FFFFFF";
		// 			ctx.fillText(
		// 				StuffComment[i]["comment"],
		// 				fixpx,
		// 				stuffpos.y-30
		// 			);
		//
		// 			StuffComment[i]["timer"] ++;
		// 		}
		// 	}
		// }
		var FPobj = new FP();
		var draw_stuff_comments = FPobj.draw_stuff_comments();
		var capture = {
			'UserData': UserData,
			'CpuMesh': CpuMesh,
			'camera': camera,
			'SCREEN_WIDTH': SCREEN_WIDTH,
			'SCREEN_HEIGHT': SCREEN_HEIGHT,
			'StuffComment': StuffComment
		};
		draw_stuff_comments( capture );
		
		// Rendering Windows.
		// for( var i in WindowData ){
		// 	// Window area.
		// 	ctx.font = "14px Arial";
		// 	ctx.fillStyle = "#FAEBD7";
		// 	roundedRect(
		// 		ctx, WindowData[i].px, WindowData[i].py,
		// 		WindowData[i].width, WindowData[i].height,
		// 		10 // radius
		// 	);
		//
		// 	// Draw line.
		// 	ctx.fillStyle = '#000000';
		// 	ctx.beginPath();
		// 	ctx.moveTo( WindowData[i].px, WindowData[i].py + 20 );
		// 	ctx.lineTo( WindowData[i].px + WindowData[i].width, WindowData[i].py + 20 );
		// 	ctx.closePath();
		// 	ctx.stroke();
		//
		// 	// Window title.
		// 	ctx.fillStyle = '#000000';
		// 	ctx.fillText(
		// 			WindowData[i].title,
		// 			WindowData[i].px + 3,
		// 			WindowData[i].py + 10 + 3
		// 		);
		//
		// 	// Window text.
		// 	var size = 16;
		// 	var column = [''];
		// 	var line = 0;
		// 	for( var j=0; j<(WindowData[i].str).length; j++ ){
		// 		var char = WindowData[i].str.charAt(j);
		// 		if( char === '\n' ||
		// 			ctx.measureText( column[line] + char ).width >
		// 			WindowData[i].width
		// 		){
		// 			line ++;
		// 			column[line] = '';
		// 		}
		// 		column[line] += char;
		// 	}
		// 	for( var j=0; j<column.length; j++ ){
		// 		ctx.fillStyle = '#000000';
		// 		ctx.fillText(
		// 				column[j],
		// 				WindowData[i].px,
		// 				WindowData[i].py + 40 + size * j
		// 			);
		// 	}
		//
		// 	// Buttons.
		// 	for( var j=0; j<(WindowData[i].buttons.length); j++ ){
		// 		var px = WindowData[i].px;
		// 		var py = WindowData[i].py;
		// 		var width = WindowData[i].width;
		// 		var height = WindowData[i].height;
		// 		var str = WindowData[i].str;
		// 		var moving = WindowData[i].moving;
		// 		var button = WindowData[i].buttons[j];
		//
		// 		ctx.fillStyle = '#F4A460';
		// 		roundedRect(
		// 			ctx, px + button.px, py + button.py,
		// 			button.width, button.height,
		// 			10 // radius
		// 		);
		//
		// 		ctx.fillStyle = '#000000';
		// 		ctx.fillText(	button.str,
		// 				px + button.px,
		// 				py + button.py + 20 
		// 			);
		// 	}
		//
		// 	// Close button.
		// 	ctx.fillStyle = '#FF0000';
		// 	roundedRect(
		// 		ctx, WindowData[i].px + WindowData[i].width - 20, WindowData[i].py,
		// 		20, 20,
		// 		5 // radius
		// 	);
		// }
		var FPobj = new FP();
		var renderingWindowsFunc = FPobj.drawWindows();
		renderingWindowsFunc({ 'WindowData': WindowData, 'ctx': ctx });

		// グローバルチャットテキストを描画
		// for( var i in DisplayCommentOld ){
		// 	var comment = DisplayCommentOld[i];
		// 	ctx.fillStyle = '#000000';
		// 	ctx.fillText(
		// 		comment.nickname + ' : ' + comment.comment,
		// 		10+2, (SCREEN_HEIGHT-16*10-16) + 16 * i +2
		// 	);
		// 	ctx.fillStyle = '#FFFFFF';
		// 	ctx.fillText(
		// 		comment.nickname + ' : ' + comment.comment,
		// 		10, (SCREEN_HEIGHT-16*10-16) + 16 * i
		// 	);
		// }

		// グローバルチャットテキストを描画
		var FPobj = new FP();
		var draw_globalchat = FPobj.draw_globalchat();
		var capture_objs = {
			'DisplayCommentOld': DisplayCommentOld,
			'ctx': ctx,
			'SCREEN_HEIGHT': SCREEN_HEIGHT
		};
		// 関数を実行
		draw_globalchat( capture_objs );

	} // if( onvr == false )	
	else if( onvr === true ){

		// くまきちメッシュのY軸回転をHMDと同期する
		if( BlendMesh && BlendMesh.mixer ){
			BlendMesh.rotation.y = stereocamera.left.rotation.y;
			// 送信データ変数にキャラクターのデータを代入
			// 位置データ
			UserData.positionX = BlendMesh.position.x;
			UserData.positionY = BlendMesh.position.y;
			UserData.positionZ = BlendMesh.position.z;
			// 回転データ
			UserData.rotateX = BlendMesh.rotation.x;
			UserData.rotateY = BlendMesh.rotation.y + 3.14;
			UserData.rotateZ = BlendMesh.rotation.z;
		}

		// 他人のニックネームを描画する
		for( var i in OtherPlayersPos ){
			if( OtherPlayersPos[i].model.mixer === undefined ) continue;
			//if( OtherPlayersPos[i]["player_id"] == -1 ) continue;
			var screen_pos = new THREE.Vector3(
					OtherPlayersPos[i]["model"].position.x,
					OtherPlayersPos[i]["model"].position.y,
					OtherPlayersPos[i]["model"].position.z
					);
			// 左目カメラを使って座標変換(逆)
			screen_pos.project( stereocamera.left );	

			//console.log( "sx:"+screen_pos.x +" sy:"+screen_pos.y );

			screen_pos.x = ( screen_pos.x + 1 ) / 2 * SCREEN_WIDTH;
			screen_pos.y = -( screen_pos.y - 1 ) / 2 * SCREEN_HEIGHT;
			//console.log( 'sz:' + screen_pos.z );

			// 座標変換した screen_pos.z が 1.0 以上なら描画しない
			if( screen_pos.z > 1.0 ){
				screen_pos.x = SCREEN_WIDTH;
				screen_pos.y = SCREEN_HEIGHT;
			}

			// screen_pos.x += -20;
			// screen_pos.y += 40;
			screen_pos.x += -10;	// VR用に控えめに位置補正
			screen_pos.y += 20;

			// 左目用の位置計算処理(単純に位置を1/2にする)
			var screen_pos_left = new THREE.Vector2( (screen_pos.x / 2.0), screen_pos.y );
			// 右目用の位置計算処理
			var screen_pos_right = new THREE.Vector2(
				(SCREEN_WIDTH / 2.0) + (screen_pos.x / 2.0),
				screen_pos.y
			);

			var canvas = document.getElementById("text_canvas");
			var ctx = canvas.getContext("2d");
			//var ctx = $('#text_canvas')[0].getContext('2d');
			//var ctx = $('#text_canvas').get(0).getContext("2d");
			//ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );
			
			// 左目のニックネームを描画
			if( screen_pos_left.x > 0.0 && screen_pos_left.x < (SCREEN_WIDTH/2.0) ){
				ctx.font = "14px Arial";
				ctx.fillStyle = "#000000";
				ctx.fillText( OtherPlayersPos[i]["nickname"], screen_pos_left.x+2, screen_pos_left.y+2 );
				ctx.fillStyle = "#FFFFFF";
				ctx.fillText( OtherPlayersPos[i]["nickname"], screen_pos_left.x, screen_pos_left.y );
			}

			// 右目のニックネームを描画
			if( screen_pos_right.x > (SCREEN_WIDTH/2.0) && screen_pos_right.x < SCREEN_WIDTH ){
				ctx.font = "14px Arial";
				ctx.fillStyle = "#000000";
				ctx.fillText( OtherPlayersPos[i]["nickname"], screen_pos_right.x+2, screen_pos_right.y+2 );
				ctx.fillStyle = "#FFFFFF";
				ctx.fillText( OtherPlayersPos[i]["nickname"], screen_pos_right.x, screen_pos_right.y );
			}

			// 他のユーザーのコメントを描画する
			for( var j in DisplayComment ){

				// 他のプレイヤーのコメントを描画する
				if( DisplayComment[j]["player_id"] === OtherPlayersPos[i]["player_id"] ){
					if( DisplayComment[j]["timer"] < 500 ){
						var fixpx_left = screen_pos_left.x -
							ctx.measureText( DisplayComment[j]["comment"] ).width / 2 + 30;
						var fixpx_right = screen_pos_right.x -
							ctx.measureText( DisplayComment[j]["comment"] ).width / 2 + 30;

						// 左目用のコメントを描画
						ctx.fillStyle = '#ADD8E6';	// Light bule.
						roundedRect(
							ctx,
							fixpx_left,			// px
							screen_pos_left.y-70-16,	// py
							ctx.measureText(
								DisplayComment[j]["comment"]
							).width + 5,		// width
							16 + 5,			// height
							10			// radius
						);

						ctx.fillStyle = "#000000";
						ctx.fillText(
							DisplayComment[j]["comment"],
							fixpx_left+2,
							screen_pos_left.y-70+2
						);
						ctx.fillStyle = "#FFFFFF";
						ctx.fillText(
							DisplayComment[j]["comment"],
							fixpx_left,
							screen_pos_left.y-70
						);

						// 右目用のコメントを描画
						ctx.fillStyle = '#ADD8E6';	// Light bule.
						roundedRect(
							ctx,
							fixpx_right,			// px
							screen_pos_right.y-70-16,	// py
							ctx.measureText(
								DisplayComment[j]["comment"]
							).width + 5,		// width
							16 + 5,			// height
							10			// radius
						);

						ctx.fillStyle = "#000000";
						ctx.fillText(
							DisplayComment[j]["comment"],
							fixpx_right+2,
							screen_pos_right.y-70+2
						);
						ctx.fillStyle = "#FFFFFF";
						ctx.fillText(
							DisplayComment[j]["comment"],
							fixpx_right,
							screen_pos_right.y-70
						);

						// 表示用カウントをインクリメント
						DisplayComment[j]["timer"] ++;
					}
				}
			}
		} // for( var i in OtherPlayersPos )
	} // else if( onvr == true )

};

// CanvasRenderingProcess プロセスクラスの継承関係を記述
inherits( CanvasRenderingProcess, Process );


//-----------------------------------------------------------------------------
// FP クラス定義
// 関数型プログラミングをサポートする関数を提供します
// なるべく参照透過性を保ちます
//
// (!) clone 関数が重過ぎて毎フレーム呼ぶと危険です
// 参照透過にはならないですが、参照コピーを推奨します
//-----------------------------------------------------------------------------

// FP クラスコンストラクタ
var FP = function(){
};

// コンソール出力メソッド、参照透過性なし
// 関数オブジェクトを返す
FP.prototype.consolelog = function( obj ){
	return( function(){ console.log( obj ); } );
};

// コンソール出力メソッド、参照透過性なし
// 関数オブジェクトを返さない
FP.prototype.direct_consolelog = function( obj ){
	console.log( obj );
};

// グローバルチャットテキストを描画する
// 関数オブジェクトを返す
FP.prototype.draw_globalchat = function(){
	return( function( objs ){
		// {	'DisplayCommentOld':,
		// 	'ctx':,
		// 	'SCREEN_HEIGHT':
		// }
		//var retobj = clone( objs );	// 参照透過性を保つために複製
		var retobj = objs;

		_.each(
			retobj.DisplayCommentOld,
			function( comment, index ){
				retobj.ctx.fillStyle = '#000000';
				retobj.ctx.fillText(
					comment.nickname + ' : ' + comment.comment,
					10+2, (retobj.SCREEN_HEIGHT-16*10-16) + 16 * index +2
				);
				retobj.ctx.fillStyle = '#FFFFFF';
				retobj.ctx.fillText(
					comment.nickname + ' : ' + comment.comment,
					10, (retobj.SCREEN_HEIGHT-16*10-16) + 16 * index
				);
			}	// function( comment, index )
		);	// _.each

		return( retobj );
	} );	// return( function()
};

// 角が丸い四角形の描画
// 関数オブジェクトを返す
FP.prototype.roundedRect = function(){
	return( function( objs ) {
		// { ctx:,
		// x:,
		// y:,
		// width:,
		// height:,
		// radius:

		//var retobj = clone( objs );
		var retobj = objs;	// パフォーマンスが悪いので参照コピー

		var ctx = retobj.ctx;
		var x = retobj.x;
		var y = retobj.y;
		var width = retobj.width;
		var height = retobj.height;
		var radius = retobj.radius;

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

		return( retobj );
	} );
};

// 自分のコメントを描画するメソッド
// 関数オブジェクトを返す
FP.prototype.draw_my_commets = function(){
	return( function( objs ){
		var retobj = objs;

		var DisplayComment = retobj.DisplayComment;
		var ctx = retobj.ctx;
		var LoginData = retobj.LoginData;
		var scrpos = retobj.scrpos;

		var FPobj = new FP();
		var draw_rounded_rect = FPobj.roundedRect();

		for( var j in DisplayComment ){
			if( DisplayComment[j].player_id === LoginData.id ){
				if( DisplayComment[j].timer < 500 ){

					// scrpos が定義されているので使う
					var fixpx = scrpos.x -
						ctx.measureText( DisplayComment[j].comment ).width / 2 + 30;

					ctx.fillStyle = '#ADD8E6';	// Light bule.
					var params = {
						'ctx': ctx,
						'x': fixpx,
						'y': scrpos.y-70-16,
						'width': ctx.measureText( DisplayComment[j].comment ).width + 5,
						'height': 16 + 5,
						'radius': 10
					};
					draw_rounded_rect( params );
					// roundedRect(
					// 	ctx,
					// 	fixpx,			// px
					// 	scrpos.y-70-16,	// py
					// 	ctx.measureText(
					// 		DisplayComment[j].comment
					// 	).width + 5,		// width
					// 	16 + 5,			// height
					// 	10			// radius
					// );

					ctx.fillStyle = "#000000";
					ctx.fillText(
						DisplayComment[j].comment,
						fixpx+2,
						scrpos.y-70+2
					);
					ctx.fillStyle = "#FFFFFF";
					ctx.fillText(
						DisplayComment[j].comment,
						fixpx,
						scrpos.y-70
					);
					DisplayComment[j].timer ++;

					break;
				}
			}
		}

		return( retobj );
	});
};

// ネットケアスタッフのコメント描画メソッド
// 関数オブジェクトを返す
FP.prototype.draw_stuff_comments = function(){
	return( function( objs ){
		// { 'UserData':,
		// 'CpuMesh':,
		// 'camera':,
		// 'SCREEN_WIDTH':,
		// 'SCREEN_HEIGHT':,
		// 'StuffComment':,
		// }

		//var retobj = clone( objs );
		// clone() がパフォーマンス悪いので参照コピー
		var retobj = objs;

		// 変数をコピー
		var UserData = retobj.UserData;
		var CpuMesh = retobj.CpuMesh;
		var camera = retobj.camera;
		var SCREEN_WIDTH = retobj.SCREEN_WIDTH;
		var SCREEN_HEIGHT = retobj.SCREEN_HEIGHT;
		var StuffComment = retobj.StuffComment;

		// マップ番号０番のみスタッフのコメントを描画
		if( UserData.mapno === 0 ){

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
			if( stuffpos.z > 1.0 ){
				stuffpos.x = SCREEN_WIDTH;
				stuffpos.y = SCREEN_HEIGHT;
			}
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
				if( StuffComment[i]["timer"] < 500 && StuffComment[i]["stuff_id"] === -1 ){
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
		}

		return( retobj );
	});
};

// ウィンドウの描画メソッド
// 関数オブジェクトを返す
FP.prototype.drawWindows = function(){
	return( function( objs ){
		// { WindowData:
		// ctx:
		// }
		
		//var retobj = clone( objs );
		var retobj = objs;

		var ctx = retobj.ctx;
		var WindowData = retobj.WindowData;

		// 以下のコードは、関数型スタイルになっていない
		// そのうち書き直す予定

		//var roundedRectFunc = this.roundedRect();	// this error.
		var FPobj = new FP();
		var roundedRectFunc = FPobj.roundedRect();

		for( var i in WindowData ){
			// Window area.
			ctx.font = "14px Arial";
			ctx.fillStyle = "#FAEBD7";
			var objsparam = {
				'ctx': ctx,
				'x': WindowData[i].px,
				'y': WindowData[i].py, 
				'width': WindowData[i].width,
				'height': WindowData[i].height,
				'radius': 10
			};
			roundedRectFunc( objsparam );
			// roundedRect(
			// 	ctx, WindowData[i].px, WindowData[i].py,
			// 	WindowData[i].width, WindowData[i].height,
			// 	10 // radius
			// );

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
				if( char === '\n' ||
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
				var objsparam = {
					'ctx': ctx,
					'x': px + button.px,
					'y': py + button.py,
					'width': button.width,
					'height': button.height,
					'radius': 10
				};
				roundedRectFunc( objsparam );
				// roundedRect(
				// 	ctx, px + button.px, py + button.py,
				// 	button.width, button.height,
				// 	10 // radius
				// );

				ctx.fillStyle = '#000000';
				ctx.fillText(
					button.str,
					px + button.px,
					py + button.py + 20 
				);
			}

			// Close button.
			ctx.fillStyle = '#FF0000';
			var objsparam = {
				'ctx': ctx,
				'x': WindowData[i].px + WindowData[i].width - 20,
				'y': WindowData[i].py,
				'width': 20,
				'height': 20,
				'radius': 5
			};
			roundedRectFunc( objsparam );
			// roundedRect(
			// 	ctx, WindowData[i].px + WindowData[i].width - 20, WindowData[i].py,
			// 	20, 20,
			// 	5 // radius
			// );
		}

	} );
};

// URL TEST
// http://easyramble.com/open-url-with-browser-from-vim.html
// [g][x] で URL をブラウザで開く

// 変数名衝突防止のクロージャ
})();
