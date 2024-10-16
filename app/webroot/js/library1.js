/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Mathオブジェクトを拡張 
 */
var Math = Math || {};
 
 
/**
 * 与えられた値の小数点以下の桁数を返す 
 * multiply, subtractで使用
 * 
 * 例)
 *   10.12  => 2  
 *   99.999 => 3
 *   33.100 => 1
 */
Math._getDecimalLength = function(value) {
    var list = (value + '').split('.'), result = 0;
    if (list[1] !== undefined && list[1].length > 0) {
        result = list[1].length;
    }
    return result;
};
 
 
/**
 * 乗算処理
 *
 * value1, value2から小数点を取り除き、整数値のみで乗算を行う。 
 * その後、小数点の桁数Nの数だけ10^Nで除算する
 */
Math.multiply = function(value1, value2) {
    var intValue1 = +(value1 + '').replace('.', ''),
        intValue2 = +(value2 + '').replace('.', ''),
        decimalLength = Math._getDecimalLength(value1) + Math._getDecimalLength(value2),
        result;
 
    result = (intValue1 * intValue2) / Math.pow(10, decimalLength);
 
    return result;
};
 
 
/**
 * 減算処理
 *
 * value1,value2を整数値に変換して減算
 * その後、小数点の桁数分だけ小数点位置を戻す
 */
Math.subtract = function(value1, value2) {
    var max = Math.max(Math._getDecimalLength(value1), Math._getDecimalLength(value2)),
        k = Math.pow(10, max);
    return (Math.multiply(value1, k) - Math.multiply(value2, k)) / k;
};

// -----------------------------------------------------------------------------

/**
 * Pair 型を定義する 
 * ２つのオブジェクトを保持するもの
 * @param {Object} first １つめの値
 * @param {Object} second ２つめの値
 * @example var pair = new Pair( hash, Listener );
 */
function Pair( first, second ){

	/**
	 * 一つ目の値
	 */
	this.first = first;

	/**
	 * 二つ目の値
	 */
	this.second = second;

	/**
	 * ほかのペアと比較する
	 * @param {type} p 比較対象
	 * @returns {Boolean} 同じPairならtrueが返る
	 */
	this.equals = function(p){
		return( this.first == p.first && this.second == p.second );
	};
}

/**
 * 文字列からハッシュ値を計算する 
 * @returns {Number} HashCode
 */
String.prototype.hashCode = function(){
	/* だめぽ
	var hash = 0;
	if( this.length == 0 ) return hash;
	for( i = 0; i < this.length; ++ i ){
		char = this.charCodeAt(i);
		hash = ( (hash << 5) - hash ) + char;
		hash = hash & hash; // Convert to 32bit integer.
	}
	return hash;
	*/
	/* 計算誤差でだめぽ
	var hash = 0;
	if( this.length == 0 ) return hash;
	for( i=0; i<this.length; ++ i ){
		//hash = hash * 37 + this.charCodeAt(i);
		hash = Math.multiply( hash, 37 ) + this.charCodeAt(i);
	}
	return( Math.abs(hash) );
	*/
	// MD5使ってしまえ
	//return( CybozuLabs.MD5.calc( this ) );
	
	// murmurhash3
	// 32bit 環境でも大丈夫なんだけど php 側が対応していないので使えない
	//return( murmurHash3.x86.hash32( this ) );
	
	// アスキーコードの合計を返すだけのハッシュ関数
	var asciisum = 0;
	for( var i=0; i<this.length; ++i ){
		asciisum += this.charCodeAt( i );
	}
	return asciisum;
};

/**
 * 継承用関数
 * 親クラスのメソッドを呼び出すときは call を使う
 * BaseClass.prototype.method.call();
 * @param {Class} childCtor 基底クラス
 * @param {Class} parentCtor 派生クラス
 */
var inherits = function( childCtor, parentCtor ){
	// 子クラスの prototype のプロトタイプとして
	// 親クラスの prototype を指定することで継承が実現される
	Object.setPrototypeOf( childCtor.prototype, parentCtor.prototype );
};

// -----------------------------------------------------------------------------

/**
 * プロセスクラスのコンストラクタ
 * @class プロセスクラス
 * @param {Number} type
 * @returns {Process}
 */
var Process = function( type ){
	/**
	 * プロセスの型
	 * @return {Number} プロセスの型
	 */
	this.type = type;

	/**
	 * マネージャにプロセスの停止か削除を指示
	 * @return {Boolean} ブール値
	 */
	this.kill = false;

	/**
	 * プロセスが有効かどうか
	 * @return {Boolean} ブール値
	 */
	this.active = true;

	/**
	 * 停止中かどうか
	 * @return {Boolean} ブール値
	 */
	this.paused = false;

	/**
	 * 最初の更新を行ったか
	 * @return {Boolean} ブール値
	 */
	this.initialUpdate = false;

	/**
	 * 依存プロセス
	 * @return {Process} プロセスクラス
	 */
	this.next = null;

	/**
	 * プロセスフラグ
	 * @type Number
	 */
	this.processFlag = 0;
};

/**
 * プロセスが生きているかどうか 
 * @returns {Boolean} ブール値
 */
Process.prototype.isDead = function(){
	return this.kill;
};

/**
 * プロセス型を返す関数 
 * @returns {Number} プロセスの型
 */
Process.prototype.getType = function(){
	return this.type;
};

/**
 * プロセス型を設定する関数 
 * @param {Number} type
 */
Process.prototype.setType = function( type ){
	this.type = type;
};

/**
 * プロセスが有効かどうか調べる 
 * @returns {Boolean} ブール値
 */
Process.prototype.isActive = function(){
	return this.active;
};

/**
 * プロセスの状態を設定する
 * @param {Boolean} state
 */
Process.prototype.setActive = function( state ){
	this.active = state;
};

// bool IsAttached() const;
// void SetAttached( const bool wantAttached);

/**
 * 停止中かどうか調べる 
 * @returns {Boolean} ブール値
 */
Process.prototype.isPaused = function(){
	return this.paused;
};

/**
 * 次に処理するプロセスを設定する 
 * @param {Process} process
 * @returns {Process} next
 * @exsample Process1.setNext(Process2).setNext(Process3);
 */
Process.prototype.setNext = function( process ){
	this.next = process;
	return process;
};

/**
 * 次のプロセスを返す 
 * @returns {Process} 次のプロセス
 */
Process.prototype.getNext = function(){
	return this.next;
};

/**
 * 初期化ずみかどうか調べる 
 * @returns {Boolean} ブール値
 */
Process.prototype.isInitialized = function(){
	return this.initialUpdate;
};

/**
 * 実行したい処理
 * オーバーライドして使う
 */
Process.prototype.onUpdate = function(){
	// 初期化されていないのであれば
	if( this.initialUpdate === false ){
		// onInitializeを実行
		this.onInitialize();
		this.initialUpdate = true;
	}
};

/**
 * 初期化コード
 * オーバーライドして使う
 * Process.onUpdate の前に一度だけ呼ばれる
 */
Process.prototype.onInitialize = function(){
	// 未実装
};

/**
 * プロセス終了時に呼ぶコード
 * オーバーライドして使う
 */
Process.prototype.killProcess = function(){
	this.kill = true;
};

/**
 * ポーズ状態のトグル関数
 */
Process.prototype.togglePause = function(){
	this.paused = ! this.paused;
};

// -----------------------------------------------------------------------------

/**
 * プロセスマネージャクラス
 */
var ProcessManager = function(){

	/**
	 * プロセスリスト
	 */
	this.processList = new Array();	
};

/**
 * マネージャにプロセスを追加する
 * @param {Process} process
 * @returns {undefined}
 */
ProcessManager.prototype.attach = function( process ){
	// this.processListにprocessを追加する
	this.processList.push( process );
};

/**
 * マネージャがプロセスを保持しているかどうか調べる
 * @returns {Boolean} 持っているならtrue
 */
ProcessManager.prototype.hasProcess = function(){
	if( this.processList.length > 0 ){
		return true;
	}else{
		return false;
	}
};

/**
 * 型を指定してプロセスが有効かどうか調べる
 * @param {Number} type プロセスの型
 * @returns {Boolean} trueなら有効である
 */
ProcessManager.prototype.isProcessActive = function( type ){
	var ret = false;
	// プロセス型をひとつずつ検索
	for( i = 0; i < this.processList.length; ++ i ){
		// 型がひとつでも一致していたら検索終了
		if( this.processList[i].getType() === type ){
			ret = true;
			break;
		}
	}

	return ret;
};

/**
 * マネージャにあるプロセスを全て実行する
 * @returns {undefined}
 */
ProcessManager.prototype.updateProcesses = function(){
	for( i = 0; i < this.processList.length; ++ i ){
		var process = this.processList[i];

		// プロセスがしんでいれば
		if( process.isDead() === true ){
			var childProcess = process.getNext();

			// 取得した子プロセスが null でないなら
			if( childProcess !== null ){
				process.setNext( null );
				// マネージャに子プロセスを追加
				this.attach( childProcess );
			}
			// しんだプロセスを取り除く
			this.detach( process );
		}
		// プロセス有効かつポーズ状態でないなら
		else if( process.isActive() && ! process.isPaused() ){
			this.processList[i].onUpdate();
		}
	}
};

/**
 * マネージャからプロセスを削除する
 * プライベートメソッド
 * @param {Process} process 削除したいプロセス
 * @returns {undefined}
 */
ProcessManager.prototype.detach = function( process ){
	for( i = 0; i < this.processList.length; ++ i ){
		if( this.processList[i] === process ){
			this.processList.splice( i, 1 );
			break;
		}
	}
};

/**
 * プロセスを外部からkillする
 * @param {int} ProcessNumber
 * @return {bool} killできたらtrueを返す
 */
ProcessManager.prototype.killProcessFromType = function( type ){
	var flag = false;
	for( i=0; i<this.processList.length; ++i ){
		if( this.processList[i].getType() == type ){
			this.processList[i].killProcess();
			break;
		}
	}
	return( flag );
}

// -----------------------------------------------------------------------------

/**
 * イベントデータクラス 
 * @param {String} eventName イベント名
 */
var EventData = function( eventName ){
	
	/**
	 * イベント識別番号
	 * ハッシュ化する
	 */
	this.eventHash = eventName.hashCode();
};

/**
 * イベント識別番号を返す
 * @return {Number} ハッシュ値
 */
EventData.prototype.getEventHash = function(){
	return this.eventHash;
};

// -----------------------------------------------------------------------------

/**
 * イベントリスナークラス
 */
var EventListener = function(){
	// とくになし	
};

/**
 * イベントリスナーの名前を返す
 * オーバーライドして使う
 * @return {String} イベントリスナーの名前
 */
EventListener.prototype.getName = function(){
	return 'EventListener';
};

/**
 * リスナーとしてイベントを受け取る関数
 * @param {EventData} event イベントデータ
 * @return {Boolean} trueならばイベント処理をした
 */
EventListener.prototype.handleEvent = function( event ){

	// 基底クラスなのでtrueを返す(イベント受け取った)
	return true;
};


// -----------------------------------------------------------------------------

/**
 * イベントマネージャクラス
 * イベントデータとリスナーの組み合わせはひとつまで
 */
var EventManager = function(){

	/**
	 * hash値(イベント名)とイベントリスナのPair型変数
	 */	
	this.eventListeners = new Array();

	/**
	 * イベントプール
	 * @type {EventData} イベントデータ型
	 */
	this.eventPool = new Array();

};

/**
 * イベントマネージャへイベントリスナーを追加
 * @param {String} eventName イベント名
 * @param {EventListener} eventListener イベントリスナー
 */
EventManager.prototype.addEventListener = function( eventName, eventListener ){
	this.eventListeners.push(
		// イベント名はハッシュ化してペアにする
		new Pair( eventName.hashCode(), eventListener )	
	);
};

/**
 * イベント名からイベントリスナーを削除
 * @param {String} eventName
 * @return {Boolean} trueなら削除できた
 */
EventManager.prototype.deleteListener = function( eventName ){
	ret = false;
	hash = eventName.hashCode();
	for( i = 0; i < this.eventListeners.length; ++ i ){
		if( this.eventListeners[i].first == hash ){
			this.eventListeners.splice( i, 1 );
			ret = true;
			break;
		}
	}
	return ret;
};

/**
 * イベントデータを渡してすぐ処理を実行
 * @param {EventData} eventData イベントデータ
 */
EventManager.prototype.trigger = function( eventData ){
	for( i = 0; i < this.eventLiteners.length; ++ i ){
		if( this.eventLiteners[i].first == eventData.getEvenetHash() ){
			if( this.eventLiteners[i].second.handleEvent( eventData ) == true ){
				break;
			}
		}
	}	
};

/**
 * イベントプールにイベントデータを追加
 * @param {EventData} eventData
 * @return {undefined} 未定義
 */
EventManager.prototype.addEventData = function( eventData ){
	this.eventPool.push( eventData );
};

/**
 * イベントプールからイベントを取り出して処理する
 */
EventManager.prototype.tick = function(){
	while( true ){
		eventData = this.eventPool.shift();
		if( eventData == null ) break;
		for( i=0; i<this.eventListeners.length; ++i ){
			pair = this.eventListeners[i];
			if( pair.first == eventData.getEventHash() ){
				pair.second.handleEvent( eventData );
				break;
			}
		}
	}
};

/**
 * イベントプールに指定したイベントデータがあるか確認する
 * イベントが存在するならtrueが返る。そうでなければfalseが返る。
 */
EventManager.prototype.checkEventData = function( eventName ){
	var ret = false;	// 存在フラグ

	// イベントデータの数だけループ
	for( i=0; i<this.eventPool.length; ++i ){
		var eventDataTmp = this.eventPool[i];
		if( eventDataTmp.getEventHash() == eventName.hashCode() ){
			ret = true;
			break;
		}
	}

	// 結果を返す
	return( ret );
};

