<?php

////////////////////////////////////////////////////////////////
//
// Chloe System pre-alpha version.
//
// If you want to be happy. be.
// 幸せになりたいのなら、なりなさい。＠トルストイ
//
////////////////////////////////////////////////////////////////

//App::uses( 'murmurhash3', 'Vendor' );
App::import( 'Vendor', 'murmurhash3' );			// murmurhash3_int
App::import( 'Vendor', 'underscore' );			// underscore.php
App::uses( 'CakeEmail', 'Network/Email' );		// CakeEmail

//-------------------------------------------------------------
// PostGetMessages アクションにおける
// Chain of Responsibility Pattern
//
// EventHandler 基底クラス
//-------------------------------------------------------------
class EventHandler{
	public $next = null;
	public static $app;		// $this
	public static $returndata;	// 返すメッセージ配列
	public static $eventdata;	// イベントデータ配列

	public function __construct(){
		// 何もしないコンストラクタ	
		// オーバーロードできないので、別関数で代入する
		// (?)なんか動的に引数を制御できるっぽい？

		// if( func_num_args() == 2 ){
		// 	self::$app = func_get_arg( 0 );
		// 	self::$returndata = &func_get_arg( 1 );
		// }
		// ⇒値コピーのみなので駄目だった
	}

	public function setStaticData( $app, &$returndata, &$eventdata ){
		self::$app = $app;
		self::$returndata = &$returndata;
		self::$eventdata = &$eventdata;
	}

	public function setNext( $next ){
		$this->next = $next;
		return( $next );
	}

	public function request( $event ){
		if( $this->next !== null ){
			$this->next->request( $event );
		}
	}
}

// イベントを処理する具象クラス
// PostCommentHanlder クラス
// -------------------------------------------------------------
//
class PostCommentHandler extends EventHandler{

	public function request( $event ){
		if( $event->eventid === parent::$app->GetHash( 'PostComment' ) ){
			// array_push( parent::$returndata, array(
			// 	"datetime" => date('Y-m-d H:i:s'),
			// 	"userid" => -11,
			// 	"eventid" => parent::$app->GetHash('CommentCatched'),
			// 	"data" => '[' . $event->data . '] CommentCatched!'
			// ));

			// array_push を使わないコード
			parent::$returndata[] = array(
				"datetime" => date('Y-m-d H:i:s'),
				"userid" => -11,
				"eventid" => parent::$app->GetHash('CommentCatched'),
				"data" => '[' . $event->data . '] CommentCatched!'
			);
		}else if( $this->next !== null ){
			$this->next->request( $event );
		}
	}
}

// イベントを処理する具象クラス
//  ProfileRenderEventHandler クラス
// -------------------------------------------------------------
//
class ProfileRenderEventHandler extends EventHandler{

	public function request( $event ){

		if( $event->eventid === parent::$app->GetHash( 'RenderProfileEvent' ) ){

			$result = parent::$app->User->find( 'all',
				array( 'conditions' => array(
					'User.id' => $event->userid
				))
			);

			$view = new View( parent::$app, false );
			$view->viewPath = 'Farbe';
			$view->layout = false;
			$view->set( 'logindata', $result['0']['User'] );
			
			parent::$returndata[] = array(
				'datetime' => date( 'Y-m-d H:i:s' ),
				'userid' => -11,
				'eventid' => parent::$app->GetHash( 'RenderedProfilePage' ),
				'data' => $view->render( 'view_profile' )
			);

			//$this->app->log( 'called function.', LOG_DEBUG );

		} // if( $event->eventid == $this->GetHash )
		else if( $this->next !== null ){
			$this->next->request( $event );
		}
	}
}

// イベントを処理する具象クラス
// PostManyDataEventHandler クラス
// ------------------------------------------------------------------
//
class PostManyDataEventHandler extends EventHandler{

	public function request( $event ){

		// 複数データを処理する
		if( $event->eventid === parent::$app->GetHash( "PostManyData" ) ){
			$manydata = '';
			for( $j=0; $j<count($event->data); ++$j ){
				$manydata .= $event->data[$j];
			}
			parent::$returndata[] = array(
				"datetime" => date('Y-m-d H:i:s'),
				"userid" => -11,
				"eventid" => parent::$app->GetHash( "ProcessManyData" ),
				"data" => '[' . $manydata . '] ProcessManyData!'
			);
		}
		else if( $this->next !== null ){
			$this->next->request( $event );
		}
	}
}

// 複数オブジェクトを処理する具象クラス
// PostManyObjectEventHanlder クラス
// ------------------------------------------------------------------
//
class PostManyObjectEventHanlder extends EventHandler{

	public function request( $event ){
		// 複数オブジェクトを処理する
		if( $event->eventid === parent::$app->GetHash( "PostManyObject" ) ){
			$manydata = '';
			foreach( $event->data as $d ){
				$manydata .= "px:" . $d->px;
				$manydata .= "py:" . $d->py;
			}
			parent::$returndata[] = array(
				"datetime" => date('Y-m-d H:i:s'),
				"userid" => -11,
				"eventid" => parent::$app->GetHash( "ProcessManyObject" ),
				"data" => '[' . $manydata . '] ProcessManyObject!'						
			);
		}
		else if( $this->next !== null ){
			$this->next->request( $event );
		}
	}
}

// ネットケア内グローバルチャットの処理を行う具象クラス
// PostGetGlobalChatTextEventHandler クラス
// ------------------------------------------------------------------
//
class PostGetGlobalChatTextEventHandler extends EventHandler{

	public function request( $event ){
		// PostGetGlobalChatText イベントを処理する
		// $dbg['event_id'] = $this->GetHash( 'PostGetGlobalChatText' );
		// $dbg['event_data'] = $event;
		// $this->log( $dbg, LOG_DEBUG );
		if( $event->eventid === parent::$app->GetHash( 'PostGetGlobalChatText' ) ){

			//$this->log( 'PostGetGlobalChatTextEvent!!!', LOG_DEBUG );

			// テキストデータがあればをDBに入れる		
			/*
			$nickname_id = $event->data->nickname_id;
			$text = $event->data->text;
			if( strlen( $text ) > 0 ){
				$savedata = array( 'GlobalChat' => array(
							'nickname_id' => $nickname_id,
							'text' => $text
				));
				$this->GlobalChat->create();
				$this->GlobalChat->save( $savedata );
			}
			*/
			// 挿入ポイント１
			// テキストデータがあれば、イベントプールに入れる
			$userid = parent::$app->Auth->user()['id'];
			$text = $event->data->text;
			if( strlen( $text ) > 0 ){
				$savedata = array( 'EventData' => array(
						'datetime' => date( 'Y-m-d H:i:s' ),
						'user_id' => $userid,
						'event_id' => parent::$app->GetHash( 'PostGlobalChatEvent' ),
						'json_data' => json_encode( $event->data )
					)
				);	
				parent::$app->EventData->create();
				parent::$app->EventData->save( $savedata );
			}

			// 挿入ポイント２
			// イベントデータを検索して、発言イベントを抽出する
			$result = parent::$app->EventData->find(
					'all',
					array(
						'conditions' => array(
							'EventData.event_id' => parent::$app->GetHash( 'PostGlobalChatEvent' ),
						),
						'order' => 'EventData.id DESC',
						'limit' => 10
					)
			);	
			$mes = array();
			foreach( $result as $key => $value ){
				$jsonobj = json_decode( $value['EventData']['json_data'] );
				$text = $jsonobj->text;
				array_unshift( $mes,
					array(
						'message_id' => $value['EventData']['id'],
						'nickname_id' => $value['EventData']['user_id'],
						//'nickname' => $value['User']['username'],
						'nickname' => $value['User']['nickname'],
						'text' => $text
					)
				);
			}

			/*
			// DB内のテキストデータを取り出して変数に入れる
			$result = $this->GlobalChat->find(
					'all',
					array(
						'order' => array( 'GlobalChat.id DESC' ),
						'limit' => 10
					)
			);
			$mes = array();
			foreach( $result as $key => $value ){
				array_unshift( $mes,
					array( 'message_id' => $value['GlobalChat']['id'],
						'nickname_id' => $value['GlobalChat']['nickname_id'],
						'nickname' => $value['Nickname']['nickname'],
						'text' => $value['GlobalChat']['text']
					)
				);
			}
			*/

			// データ出力用のイベントデータを生成
			parent::$returndata[] = array(
				'datetime' => date('Y-m-d H:i:s'),
				"userid" => -11,
				"eventid" => parent::$app->GetHash('SendGlobalChatText'),
				"data" => $mes
			);
		}
		else if( $this->next !== null ){
			$this->next->request( $event );
		}
	}
}
	
// 現在は使われていない PostGetPlayerPosition イベントを処理するクラス
// PostGetPlayerPositionEventHandler クラス
// ------------------------------------------------------------------
//
class PostGetPlayerPositionEventHandler extends EventHandler{

	public function request( $event ){
		// プレイヤーの位置更新と一覧出力イベント
		if( $event->eventid === parent::$app->GetHash( 'PostGetPlayerPosition' ) ){
			$player_id = $event->data->player_id;
			$px = $event->data->px;
			$py = $event->data->py;
			$pz = $event->data->pz;	

			// １分経過したレコードを削除する
			// (更新がないプレイヤーのログアウト処理)
			$old_time = date('Y-m-d H:i:s', strtotime( '-1 minute' ) );
			parent::$app->PlayersPosition->deleteAll(
					array(
						'modified <=' => $old_time
					)
			);	

			// データが更新可能かどうか player_id から dataid を検索
			$result = parent::$app->PlayersPosition->find(
							'all',
							array(
								'conditions' => array(
									'player_id' => $player_id
								)
							)
						);
			// データがあった場合
			if( count( $result ) > 0 ){
				
				// Post されたデータを保存するために整形
				$savedata = array( 'PlayersPosition' => array(
									'id' => $result[0]['PlayersPosition']['id'],
									'player_id' => $player_id,
									'px' => $px,
									'py' => $py,
									'pz' => $pz
									)
								);

				// 位置データを更新する
				$result = parent::$app->PlayersPosition->save( $savedata );
			}
			// データが無かった場合
			else{
				// Post されたデータを保存するために整形
				$savedata = array( 'PlayersPosition' => array(
									'player_id' => $player_id,
									'px' => $px,
									'py' => $py,
									'pz' => $pz
									)
								);
				// データを新規保存
				parent::$app->PlayersPosition->create();
				parent::$app->PlayersPosition->save( $savedata );
				
			}
			
			// Ajaxで全プレイヤーのデータを返す
			$result = parent::$app->PlayersPosition->find(
							'all',
							array(
								'order' => array( 'PlayersPosition.id DESC' )
							)
						);
			// JSON用にデータを整形
			$senddata = array();
			foreach( $result as $value ){
				// $value['PlayersPosition']['player_id']
				// $value['PlayersPosition']['px']
				// $value['Nickname']['nickname']			
				
				$senddata[] = array(
					"player_id" => $value['PlayersPosition']['player_id'],
					"nickname" =>  $value['Nickname']['nickname'],
					"px" => $value['PlayersPosition']['px'],
					"py" => $value['PlayersPosition']['py'],
					"pz" => $value['PlayersPosition']['pz']
				);
			} // else

			// イベントデータをpush
			parent::$returndata[] = array(
				'datetime' => date('Y-m-d H:i:s'),
				'userid' => -11,
				'eventid' => parent::$app->GetHash( 'SendPlayerPosition' ),
				'data' => $senddata
			);
		} // if( event->eventid == murmurHash3( 'PostGetPlayerPosition' ) )
		else if( $this->next !== null ){
			$this->next->request( $event );
		}
	}
}

// スタッフのコメントをランダムに返す具象クラス
// GetStuffCommentEventHandler クラス
// ------------------------------------------------------------------
//
class GetStuffCommentEventHandler extends EventHandler{

	public function request( $event ){

		// スタッフのランダムコメントデータを送信するイベント処理
		if( $event->eventid === parent::$app->GetHash( 'GetStuffComment' ) ){
			// コメントデータ
			$comments = array(
				'今日も元気！明日も元気',
				'ファイト一発！エビリファイ！',
				'私はときどき喋るんですよ？',
				'用事があるときは私をクリックしてください'
			);

			// 乱数生成
			$plusvar = 20;
			$randvar = rand( 0, count( $comments ) + $plusvar );	// 0から10までの乱数を生成

			// 範囲内の時のみ処理する
			if( $randvar < count( $comments ) ){

				// 返答用メッセージ
				parent::$returndata[] = array(
					"datetime" => date('Y-m-d H:i:s'),
					"userid" => -11,
					"eventid" => parent::$app->GetHash( 'SendStuffComment' ),
					"data" => array( 'comment' => $comments[$randvar] )
				);

			}

		} // if( event->eventid == $this->GetHash( 'GetStuffComment' ) )
		else if( $this->next !== null ){
			$this->next->request( $event );
		}
	}
}

// ネットケアへのログインイベントを処理する具象クラス
// LoginEventHandler クラス
// ------------------------------------------------------------------
//
class LoginEventHandler extends EventHandler{

	public function request( $event ){
		// ログインイベント（記録のみ
		if( $event->eventid === parent::$app->GetHash( 'LoginEvent' ) ){
			$savedata = array( 'EventData' => array(
					'datetime' => date( 'Y-m-d H:i:s' ),
					'user_id' => $event->userid,
					'event_id' => $event->eventid,
					'json_data' => json_encode( $event->data )
			));

			//debug( $event );

			parent::$app->EventData->create();
			parent::$app->EventData->save( $savedata );

		} // if( $event->eventid == $this->GetHash( 'loginEvent' ) )	
		else if( $this->next !== null ){
			$this->next->request( $event );
		}
	}
}


// ネットケアからのログアウトイベントを処理する具象クラス
// LogoutEventHandler クラス
// ------------------------------------------------------------------
//
class LogoutEventHandler extends EventHandler{

	public function request( $event ){

		// ログアウトイベント（記録のみ）
		if( $event->eventid === parent::$app->GetHash( 'LogoutEvent' ) ){
			$savedata = array( 'EventData' => array(
					'datetime' => date( 'Y-m-d H:i:s' ),
					'user_id' => $event->userid,
					'event_id' => $event->eventid,
					'json_data' => json_encode( $event->data )
			));

			parent::$app->EventData->create();
			parent::$app->EventData->save( $savedata );

		} // if( $event->eventid == $this->GetHash( 'LogoutEvent' ) )
		else if( $this->next !== null ){
			$this->next->request( $event );
		}
	}
}


// ネットケア内での位置移動イベントを処理する具象クラス
// MovePositionEventHandler クラス
// ------------------------------------------------------------------
//
class MovePositionEventHandler extends EventHandler{

	public function request( $event ){

		// 位置移動イベント（記録のみ）
		if( $event->eventid === parent::$app->GetHash( 'MovePosition' ) ){
			$savedata = array( 'EventData' => array(
					'datetime' => date( 'Y-m-d H:i:s' ),
					'user_id' => $event->userid,
					'event_id' => $event->eventid,
					'json_data' => json_encode( $event->data )
			));

			parent::$app->EventData->create();
			parent::$app->EventData->save( $savedata );

		} // if( $event->eventid == $this->GetHash( 'MovePositionEvent' ) ) 
		else if( $this->next !== null ){
			$this->next->request( $event );
		}
	}
}


// ネットケア内でキャラクターの位置取得を行う具象クラス
// GetPositionEventHandler クラス
// ------------------------------------------------------------------
//
class GetPositionEventHandler extends EventHandler{

	public function request( $event ){

		// 処理が超重い位置取得イベント
		if( $event->eventid === parent::$app->GetHash( 'GetPosition' ) ){
			// 位置取得イベントの記録
			$savedata = array( 'EventData' => array(
					'datetime' => date( 'Y-m-d H:i:s' ),
					'user_id' => $event->userid,
					'event_id' => $event->eventid,
					'json_data' => json_encode( $event->data )
			));

			parent::$app->EventData->create();
			parent::$app->EventData->save( $savedata );

			
			// EventData一覧から、最新の位置情報を取り出す処理

			// 10秒経過以内のLinkEventを全て抽出
			$neartime = date( 'Y-m-d H:i:s', strtotime( '-10 second' ) );
			$LinkEventListResult = parent::$app->EventData->find(
				'all',
				array(
					'conditions' => array(
						'EventData.event_id' => parent::$app->GetHash( 'LinkEvent' ),
						'EventData.datetime >' => $neartime
					),
				)
			);

			// LinkEvent配列のデータ重複排除
			// 新しく配列を作りデータを追加していく	
			$filtered = array();
			foreach( $LinkEventListResult as $value ){

				$exist = false;
				foreach( $filtered as $value2 ){
					if( $value['EventData']['user_id'] ==
						$value2['EventData']['user_id']
					){
						$exist = true;
					}	
				}
				
				if( $exist == false ){
					//array_push( $filtered, $value );
					$filtered[] = $value;
				}
			}

			// のこったLinkEventデータのuser_id が現在接続している人
			// user_id から MovePosition データを検索(複数人数分行う)
			// 最新idのMovePositionデータが最新の位置情報となる
			$senddata = array();	// 返すデータ配列
			$result = array();
			$return_flag = false;	// true なら $returndata に値をプッシュする
			foreach( $filtered as $value ){
				$result = parent::$app->EventData->find(
					'all',
					array( 'conditions' => array(
						'EventData.user_id' => $value['EventData']['user_id'],
						'EventData.event_id' => parent::$app->GetHash( 'MovePosition' )
						),
					'order' => 'EventData.id DESC',
					'limit' => 1		// 負荷軽減のため１件取得するのみ
					)
				);

				// 位置データが見つかったら処理する
				if( count( $result ) > 0 ){
					$return_flag = true;

					// $result 配列の最初のデータが最新の位置データ
					$obj = json_decode( $result['0']['EventData']['json_data'] );
					// array_push( $senddata, array(
					// 	"player_id" => $result['0']['EventData']['user_id'],
					// 	//"nickname" => $result['0']['Nickname']['nickname'],
					// 	//"nickname" => $result['0']['User']['username'],
					// 	"nickname" => $result['0']['User']['nickname'],		// ニックネーム
					// 	"px" => $obj->px,	// 現在位置
					// 	"py" => $obj->py,
					// 	"pz" => $obj->pz,
					// 	"rx" => $obj->rx,	// 現在の角度
					// 	"ry" => $obj->ry,
					// 	"rz" => $obj->rz,
					// 	"mapno" => $obj->mapno	// 現在居るマップ番号
					// ));

					// array_push を使わないコード
					$senddata[] = array(
						"player_id" => $result['0']['EventData']['user_id'],
						//"nickname" => $result['0']['Nickname']['nickname'],
						//"nickname" => $result['0']['User']['username'],
						"nickname" => $result['0']['User']['nickname'],		// ニックネーム
						"px" => $obj->px,	// 現在位置
						"py" => $obj->py,
						"pz" => $obj->pz,
						"rx" => $obj->rx,	// 現在の角度
						"ry" => $obj->ry,
						"rz" => $obj->rz,
						"mapno" => $obj->mapno	// 現在居るマップ番号
					);
				} // if( count( $result ) > 0 )
			} // foreach( $filtered as $value )

			// 位置データが1以上存在するなら
			// 抽出したデータを返す
			if( $return_flag === true ){
				parent::$returndata[] = array(
					'datetime' => date('Y-m-d H:i:s'),
					"userid" => -11,
					"eventid" => parent::$app->GetHash('SendPlayerPosition2'),
					"data" => $senddata
				);
			} // if( $return_flag == true )
		} // if( $event->eventid == parent::$app->GetHash( 'GetPosition' ) )
		else if( $this->next !== null ){
			$this->next->request( $event );
		}
	}
}


// ネットケアの接続中を知らせる処理を行う具象クラス
// LinkEventHandler クラス
// ------------------------------------------------------------------
//
class LinkEventHandler extends EventHandler{

	public function request( $event ){

		// 接続中を知らせるイベント
		if( $event->eventid === parent::$app->GetHash( 'LinkEvent' ) ){
			// リンクイベントの記録
			$savedata = array( 'EventData' => array(
					'datetime' => date( 'Y-m-d H:i:s' ),
					'user_id' => $event->userid,
					'event_id' => $event->eventid,
					'json_data' => json_encode( $event->data )
			));

			parent::$app->EventData->create();
			parent::$app->EventData->save( $savedata );

		} // if( $event->eventid == $this->GetHash( 'LinkEvent' ) )
		else if( $this->next !== null ){
			$this->next->request( $event );
		}
	}
}


// メール通知設定ページの表示処理を担当する具象クラス
// RenderMailNoticeSettingEventHandler クラス
// ------------------------------------------------------------------
//
class RenderMailNoticeSettingEventHandler extends EventHandler{

	public function request( $event ){

		// メール通知設定ページのレンダリングイベント
		if( $event->eventid === parent::$app->GetHash( 'RenderMailNoticeSetting' ) ){

			$view = new View( parent::$app, false );
			$view->viewPath = 'Farbe';
			$view->layout = false;

			parent::$returndata[] = array(
				'datetime' => date( 'Y-m-d H:i:s' ),
				'userid' => -11,
				'eventid' => parent::$app->GetHash( 'RenderedMailNoticeSetting' ),
				'data' => $view->render( 'mail_notice_setting' )
			);

		} // if( $event->eventid == $this->GetHash( 'RenderMailNoticeSetting' ) )
		else if( $this->next !== null ){
			$this->next->request( $event );
		}
	}
}


// メール通知設定データの読み込みイベントを処理する具象クラス
// LoadMailSettingEventHandler クラス
// ------------------------------------------------------------------
//
class LoadMailSettingEventHandler extends EventHandler{

	public function request( $event ){

		// メール通知設定のデータ読み込みイベント
		if( $event->eventid === parent::$app->GetHash( 'LoadMailSetting' ) ){
			$result = parent::$app->EventData->find(
				'all',
				array(
					'conditions' => array(
						'EventData.event_id' => parent::$app->GetHash( 'SaveMailSetting' ),
						'User.id' => $event->userid
					),
					'order' => 'EventData.id DESC'
				)
			);

			// SaveMailSettingイベントが１つ以上あれば処理する
			if( count( $result ) >= 1 ){
				// data部分をjsonデコード
				$mailsetting = json_decode(
					$result['0']['EventData']['json_data']
				);	
			}
			// SaveMailSettingイベントが無い場合標準設定を保存する
			else{ // $result <= 0 のとき

				// 標準設定変数データを作成
				$mailsetting = array(
					'notice_mailaddress' => '',			// 送信先メールアドレス
					'morning_hour' => 7,				// 起床メール送信時刻
					'goodnight_hour' => 22,				// 就寝メール送信時刻
					'morning_drug' => false,			// 朝のおくすりメールの有無
					'morning_drug_mail_hour' => 7,			// 朝のおくすりメールの送信時刻
					'afternoon_drug' => false,			// 昼のおくすりメールの有無
					'afternoon_drug_mail_hour' => 12,		// 昼のおくすりメールの送信時刻
					'evening_drug' => false,			// 夕のおくすりメールの有無
					'evening_drug_mail_hour' => 18,			// 夕のおくすりメールの送信時刻
					'goodnight_drug' => false,			// 眠前のおくすりメールの有無
					'goodnight_drug_mail_hour' => 22		// 眠前のおくすりメールの送信時刻
				);
			}
			
			parent::$returndata[] = array(
				'datetime' => date( 'Y-m-d H:i:s' ),
				'userid' => $event->userid,
				'eventid' => parent::$app->GetHash( 'ReturnLoadMailSetting' ),
				'data' => $mailsetting
			);

		} // if( $event->eventid == $this->GetHash( 'LoadMailSetting' )
		else if( $this->next !== null ){
			$this->next->request( $event );
		}
	}
}

// メール通知設定データの保存イベントを処理する具象クラス
// SaveMailSettingEventHandler クラス
// ------------------------------------------------------------------
//
class SaveMailSettingEventHandler extends EventHandler{

	public function request( $event ){

		// メール通知設定のデータ保存イベント
		if( $event->eventid === parent::$app->GetHash( 'SaveMailSetting' ) ){

			// とりあえずセーブ用データ作ってセーブ
			$savedata = array( 'EventData' => array(
				'datetime' => date( 'Y-m-d H:i:s' ),
				'user_id' => $event->userid,
				'event_id' => parent::$app->GetHash( 'SaveMailSetting' ),
				'json_data' => json_encode( $event->data )
			));

			parent::$app->EventData->create();
			parent::$app->EventData->save( $savedata );

		} // if( $event->eventid == $this->GetHash( 'SaveMailSetting' )
		else if( $this->next !== null ){
			$this->next->request( $event );
		}
	}
}

// 頓服薬の管理画面のレンダリングイベントを処理する具象クラス
// RenderPotionManagementEventHandler クラス
// ------------------------------------------------------------------
//
class RenderPotionManagementEventHandler extends EventHandler{

	public function request( $event ){

		// 頓服薬の管理画面のレンダリングイベント
		if( $event->eventid === parent::$app->GetHash( 'RenderPotionManagement' ) ){

			$view = new View( parent::$app, false );
			$view->viewPath = 'Farbe';
			$view->layout = false;

			parent::$returndata[] = array(
				'datetime' => date( 'Y-m-d H:i:s' ),
				'userid' => -11,
				'eventid' => parent::$app->GetHash( 'RenderedPotionManagement' ),
				'data' => $view->render( 'potion_management' )
			);

		} // if( $event->eventid == $this->GetHash( 'RenderPotionManagement' ) )
		else if( $this->next !== null ){
			$this->next->request( $event );
		}
	}
}

// 頓服薬データの保存イベントを処理する具象クラス
// SavePotionDataEventHandler クラス
// ------------------------------------------------------------------
//
class SavePotionDataEventHandler extends EventHandler{

	public function request( $event ){

		// 頓服薬データの保存イベント処理
		if( $event->eventid === parent::$app->GetHash( 'SavePotionData' ) ){

			// とりあえずセーブ用データ作ってセーブ
			$savedata = array( 'EventData' => array(
				'datetime' => date( 'Y-m-d H:i:s' ),
				'user_id' => $event->userid,
				'event_id' => parent::$app->GetHash( 'SavePotionData' ),
				'json_data' => json_encode( $event->data )
			));

			parent::$app->EventData->create();
			parent::$app->EventData->save( $savedata );

		} // if( $event->eventid == $this->GetHash( 'SavePotionData' ) )
		else if( $this->next !== null ){
			$this->next->request( $event );
		}
	}
}

// 頓服薬データのロードイベントを処理する具象クラス
// LoadPotionDataEventHandler クラス
// ------------------------------------------------------------------
//
class LoadPotionDataEventHandler extends EventHandler{

	public function request( $event ){

		// 頓服薬データのロードイベント処理用
		if( $event->eventid === parent::$app->GetHash( 'LoadPotionData' ) ){
			// DBからロード
			$result = parent::$app->EventData->find(
				'all',
				array(
					'conditions' => array(
						'EventData.event_id' => parent::$app->GetHash( 'SavePotionData' ),
						'EventData.user_id' => $event->userid
					),
					'order' => 'EventData.id DESC'
				)
			);

			// イベントデータを作って返す
			if( count( $result ) >= 1 ){	// データが無い時の対策
				parent::$returndata[] = array(
					'datetime' => date( 'Y-m-d H:i:s' ),
					'userid' => $event->userid,
					'eventid' => parent::$app->GetHash( 'SendPotionData' ),
					'data' => json_decode( $result['0']['EventData']['json_data'] )
				);
			}

		} // if( $event->eventid == $this->GetHash( 'LoadPotionData' ) )
		else if( $this->next !== null ){
			$this->next->request( $event );
		}
	}
}

// 頓服薬を飲んだことを知らせるイベントを処理する具象クラス
// DrinkPotionEventHandler クラス
// ------------------------------------------------------------------
//
class DrinkPotionEventHandler extends EventHandler{

	public function request( $event ){

		// 頓服薬を飲んだことを知らせるイベントデータを処理する
		if( $event->eventid === parent::$app->GetHash( 'DrinkPotion' ) ){
			// とりあえずセーブ用データ作ってセーブ
			$savedata = array( 'EventData' => array(
				'datetime' => date( 'Y-m-d H:i:s' ),
				'user_id' => $event->userid,
				'event_id' => parent::$app->GetHash( 'DrinkPotion' ),
				'json_data' => json_encode( $event->data )
			));

			parent::$app->EventData->create();
			parent::$app->EventData->save( $savedata );

		} // if( $event->eventid == $this->GetHash( 'DrinkPotion' ) )
		else if( $this->next !== null ){
			$this->next->request( $event );
		}
	}
}

// ポストされたイベント数をイベントにして返す処理を行う具象クラス
// PostEventCountEventHandler クラス
// ------------------------------------------------------------------
//
class PostEventCountEventHandler extends EventHandler{

	public function request( $event ){

		// ポストされたイベント数をイベントにして返す
		parent::$returndata[] = array(
			"datetime" => date('Y-m-d H:i:s'),
			"userid" => -11,
			"eventid" => parent::$app->GetHash( 'CatchEventData' ),
			"data" => count(parent::$eventdata) . " datas posted."
		);

		// 次のイベントハンドラの処理を行う
		if( $this->next !== null ){
			$this->next->request( $event );
		}
	}
}



// =============================================================
// Farbe コントローラークラス
// =============================================================
//
class FarbeController extends AppController{
	
	
	public $uses = array(
			'Nickname',
			'GlobalChat',
			'PlayersPosition',
			'EventData',
			'User',		// ログイン用
			'BlogTable',
			'BlogComment',
			'BbsThread',
			'BbsRess',
			'ProcessTable'	// プロセス管理用
	);

	public $components = array(
			'Session',
			'Auth' => array(
				'loginRedirect' => array(
					'controller' => 'Farbe',
					'action' => 'index'
				),
				'logoutRedirect' => array(
					'controller' => 'Farbe',
					'action' => 'index'
				),
				'loginAction' => array(
					'controller' => 'Farbe',
					'action' => 'login'
				)
			)
		);

	function beforeFilter(){
		parent::beforeFilter();
		// Cross Origin Enabled
		$this->response->header( 'Access-Control-Allow-Origin', '*' );
		$this->response->header( 'Access-Control-Allow-Methods', '*' );
		$this->response->header( 'Access-Control-Allow-Headers', 'X-Requested-With' );
		$this->response->header( 'Access-Control-Allow-Headers', 'Content-Type, x-xsrf-token' );
		$this->response->header( 'Access-Control-Max-Age', '172800' );

		$this->Auth->allow(
			'login',
			'logout',
			'index',		// インデックスページ
			'newuser',		// 新規ユーザー作成ページ
			'check_login',		// ログインチェック用
			'showeventdata',	// イベントデータビューア
			'check',		// 記録用アクション
			'processpage',		// メール送信用アクション
			'hashtest',		// ハッシュテストアクション
			'ajaxtest',		// Ajaxテスト用アクション

			// for debug...
			'netcare_page'		// デバッグ用
		);

		$this->Auth->authenticate = array(
			'Form' => array(
				'userModel' => 'User',
				'fields' => array(
					'username' => 'username',
					'password' => 'password'
				)
			)
		);
	}
			
	public function login(){
		$this->autoLayout = false;

		if( $this->request->is('post') ){
			if( $this->Auth->login() ){
				// ログインできた
				$this->redirect( 'index' );	
			}else{
				// ログインできなかった
				$this->redirect( 'login' );
			}
		}else{
			// POST リクエストでない場合は
			// ログイン画面を表示する
			$this->render( 'login' );
		}
	}

	public function logout(){
		$this->Auth->logout();
		$this->redirect( 'index' );
	}

	public function newuser(){
		if( $this->request->is('post') ){
			debug( $this->request->data );
			$savedata = array(
				'User' => array(
					'username' => $this->request->data['username'],
					'password' => $this->request->data['password'],
					'nickname' => 'debug_test',
					'introduction' => 'debug_test'
				)
			);
			$this->User->create();
			$this->User->save( $savedata );
		}else{
			$this->render( 'newuser' );
		}
	}
	
	public function index(){
		$this->autoLayout = false;
		// ログイン情報をViewに渡す
		$this->set( 'logindata', $this->Auth->user() );

		// 最新のBlogデータをViewに渡す
		/***
		$NewestBlogData = $this->BlogTable->find(
			'all',
			array(
				'order' => 'BlogTable.id DESC',
				'limit' => 3
			)
		);
		$this->set( 'NewestBlogData', $NewestBlogData );			
		***/

		// ネットケアの接続人数を計算する
		// 10秒経過以内のLinkEventを全て抽出
		$neartime = date( 'Y-m-d H:i:s', strtotime( '-10 second' ) );
		$LinkEventListResult = $this->EventData->find(
				'all',
				array(
					'conditions' => array(
						'EventData.event_id' => $this->GetHash( 'LinkEvent' ),
						'EventData.datetime >' => $neartime
					),
				)
			);
		// LinkEvent配列のデータ重複排除
		// 新しく配列を作りデータを追加していく	
		$filtered = array();
		foreach( $LinkEventListResult as $value ){

			$exist = false;
			foreach( $filtered as $value2 ){
				if( $value['EventData']['user_id'] ==
					$value2['EventData']['user_id']
				){
					$exist = true;
				}	
			}
			
			if( $exist == false ){
				array_push( $filtered, $value );
			}
		}
		// filtered 配列の要素数が現在接続している人数
		$LinkNum = count( $filtered );
		// Viewにネットケアの接続人数を渡す	
		$this->set( 'LinkNum', $LinkNum );

		$this->render( 'index' );

		// underscore.php の動作テスト
		//___::each( array( 1, 2, 3 ), function( $value ){
			//$this->log( $value, LOG_DEBUG );
		//});
		// ___::each() は、動作OK

		// underscore.php の関数合成テスト
		// $tmpdata = array( 'key1' => 123, 'key2' => 256 );
		// $tmpfunc = ___::compose(
		// 		function( $v ){ $v['key1'] += 1; return( $v ); },
		// 		function( $v ){ $v['key2'] += 11; return( $v ); }
		// 	);
		// $this->log( $tmpfunc( $tmpdata ), LOG_DEBUG );
		// => ___::compose 関数のテストOK
	}

	// ログイン状態を確認するAjaxアクション
	// JSON形式で$this->Auth->user()の結果を返す
	public function check_login(){
		$this->autoLayout = false;
		$this->autoRender = false;

		if( $this->request->is('ajax') ){
			$status = $this->Auth->user();
			$status = json_encode( $status );
			return( $status );
			//return( 'testdata' );
		}
	}

	// 通知メールの送信処理を行うアクション
	// javascript から定期的に呼ばれなければならない
	public function processpage(){

		// タスク関数(メール送信に時間がかかるのでまとめて実行)
		$TaskFunction = array();
		// タスクデータ($TaskFunctionと並びは同じ)
		$TaskData = array();

		// まずユーザー一覧を取得
		$UserResult = $this->User->find( 'all' );

		// ユーザーの数だけループ
		foreach( $UserResult as $ur ){

			// 次にメール設定を検索
			$MailSettingResult = $this->EventData->find(
				'all',
				array(
					'conditions' => array(
						'EventData.event_id' => $this->GetHash( 'SaveMailSetting' ),
						'User.id' => $ur['User']['id']
					),
					'order' => 'EventData.id DESC'
				)
			);
			// メール設定データをオブジェクト化
			if( count( $MailSettingResult ) > 0 ){
				$mailsetting = json_decode( $MailSettingResult['0']['EventData']['json_data'] );
			}
			else{
				// メール設定が存在しない場合コンテニュー
				continue;
			}

			// トークンイベントを検索
			$TokenResult = $this->EventData->find(
				'all',
				array(
					'conditions' => array(
						'EventData.event_id' => $this->GetHash( 'SendMailTokenEvent' ),
						'User.id' => $ur['User']['id']
					),
					'order' => 'EventData.id DESC'
				)
			);

			// 現在日時を取得
			$now = date( 'Y-m-d H:i:s' );

			// 送信フラグ一覧(trueなら送信した)
			$morning = false;		// おはようメール
			$goodnight = false;		// おやすみメール
			$morning_drug = false;		// 朝おくすりメール
			$afternoon_drug = false;	// 昼おくすりメール
			$evening_drug = false;		// 夕おくすりメール
			$goodnight_drug = false;	// 眠前おくすりメール

			// このフラグがtrueだと送信する
			$SendMorning = false;
			$SendGoodnight = false;
			$SendMorningDrug = false;
			$SendAfternoonDrug = false;
			$SendEveningDurg = false;
			$SendGoodnightDrug = false;

		

			if( count( $TokenResult ) > 0 ){
				// 今送信しようとしているメールを既に送ってないかチェック
				foreach( $TokenResult as $tr ){
					// SendMailTokenEvent の json_data をデコード
					$jsonobj = json_decode( $tr['EventData']['json_data'] );

					$starttime = date( 'Y-m-d ') . '00:00:00';
					$endtime = date( 'Y-m-d ' ) . '23:59:59';
					// おはようメールが送信済みかどうかチェック
					if( $jsonobj->mailtype == 'morning' ){	// mailtypeがmorning
						// 送信した日付が今日中なら
						if( strtotime( $starttime ) <= strtotime( $jsonobj->beforetime ) &&
							strtotime( $endtime ) >= strtotime( $jsonobj->beforetime )
						){
							// この条件に当てはまるなら送信した
							$morning = true;
						}
					}
					// おやすみメールが送信済みかどうかチェック
					if( $jsonobj->mailtype == 'goodnight' ){
						// 送信した日付が今日中なら
						if( strtotime( $starttime ) <= strtotime( $jsonobj->beforetime ) &&
							strtotime( $endtime ) >= strtotime( $jsonobj->beforetime )
						){
							// この条件に当てはまるなら送信した
							$goodnight = true;
						}
					}
					// 朝のおくすりメールが送信済みかどうかチェック
					if( $jsonobj->mailtype == 'morning_drug' ){
						// 送信した日付が今日中なら
						if( strtotime( $starttime ) <= strtotime( $jsonobj->beforetime ) &&
							strtotime( $endtime ) >= strtotime( $jsonobj->beforetime )
						){
							// この条件に当てはまるなら送信した
							$morning_drug = true;
						}
					}
					// 昼のおくすりメールが送信済みかどうかチェック
					if( $jsonobj->mailtype == 'afternoon_drug' ){
						// 送信した日付が今日中なら
						if( strtotime( $starttime ) <= strtotime( $jsonobj->beforetime ) &&
							strtotime( $endtime ) >= strtotime( $jsonobj->beforetime )
						){
							// この条件に当てはまるなら送信した
							$afternoon_drug = true;
						}
					}
					// 夕のおくすりメールが送信済みかどうかチェック
					if( $jsonobj->mailtype == 'evening_drug' ){
						// 送信した日付が今日中なら
						if( strtotime( $starttime ) <= strtotime( $jsonobj->beforetime ) &&
							strtotime( $endtime ) >= strtotime( $jsonobj->beforetime )
						){
							// この条件に当てはまるなら送信した
							$evening_drug = true;
						}
					}
					// 眠前のおくすりメールが送信済みかどうかチェック
					if( $jsonobj->mailtype == 'goodnight_drug' ){
						// 送信した日付が今日中なら
						if( strtotime( $starttime ) <= strtotime( $jsonobj->beforetime ) &&
							strtotime( $endtime ) >= strtotime( $jsonobj->beforetime )
						){
							// この条件に当てはまるなら送信した
							$goodnight_drug = true;
						}
					}
				} // foreach( $TokenResult as $tr )
			} // if( count( $TokenResult ) > 0 )
			//debug( $morning );
			//$this->log( $morning, LOG_DEBUG );
			
			// おはようメールを送信してよいか検討
			if( $mailsetting->morning == true && $morning == false ){
				$beforetime = date( 'Y-m-d ') . $mailsetting->morning_hour . ':00:00';
				$aftertime = date( 'Y-m-d ' ) . $mailsetting->morning_hour . ':00:10';
				if( strtotime( $now ) >= strtotime( $beforetime ) &&
					strtotime( $now ) <= strtotime( $aftertime )
				){
					
					// 10文字のランダムなトークンを生成
					$token = substr( str_shuffle('1234567890abcdefghijkmlnopqrstuvwxyz'),0,10);
					// トークンイベントに保存するjson_dataの中身
					$token_json = array(
						'token' => $token,
						'mailtype' => 'morning',
						'beforetime' => $beforetime,
						'aftertime' => $aftertime,
						'to' => $mailsetting->notice_mailaddress,
						'catch' => ''
					);

					// トークンイベントを作成
					$savedata = array( 'EventData' => array(
						'datetime' => date( 'Y-m-d H:i:s' ),
						'user_id' => $ur['User']['id'],
						'event_id' => $this->GetHash( 'SendMailTokenEvent' ),
						'json_data' => json_encode( $token_json )
					));

					// DBにセーブ
					$this->EventData->create();
					$this->EventData->save( $savedata );

					array_push( $TaskData, array(
						'notice_mailaddress' => $mailsetting->notice_mailaddress,
						'token' => $token
					));

					array_push( $TaskFunction, function( $address, $token ){
						// メール本文作成
						$email = new CakeEmail( 'gmail' );
						$email->from( array( 'Farbe.mail.notice@gmail.com' => 'Farbe おはようメール通知' ) );
						$email->subject( 'Farbe おはようメール通知' );
						$email->to( $address );
						$email->send( 'おはようございます。起床したら次のリンクをタッチ(クリック)してください。 http://farbedev.tk/green/farbe/check/' . $token );
					});


				} // if( strtotime( $now) ....
			} // if( mailsetting->morning == true )

			// おやすみメールを送信してよいか検討
			if( $mailsetting->goodnight == true && $goodnight == false ){
				
				$beforetime = date( 'Y-m-d ') . $mailsetting->goodnight_hour . ':00:00';
				$aftertime = date( 'Y-m-d ' ) . $mailsetting->goodnight_hour . ':00:10';
				if( strtotime( $now ) >= strtotime( $beforetime ) &&
					strtotime( $now ) <= strtotime( $aftertime )
				){
					
					// 10文字のランダムなトークンを生成
					$token = substr( str_shuffle('1234567890abcdefghijkmlnopqrstuvwxyz'),0,10);
					// トークンイベントに保存するjson_dataの中身
					$token_json = array(
						'token' => $token,
						'mailtype' => 'goodnight',
						'beforetime' => $beforetime,
						'aftertime' => $aftertime,
						'to' => $mailsetting->notice_mailaddress,
						'catch' => ''
					);

					// トークンイベントを作成
					$savedata = array( 'EventData' => array(
						'datetime' => date( 'Y-m-d H:i:s' ),
						'user_id' => $ur['User']['id'],
						'event_id' => $this->GetHash( 'SendMailTokenEvent' ),
						'json_data' => json_encode( $token_json )
					));

					// DBにセーブ
					$this->EventData->create();
					$this->EventData->save( $savedata );

					array_push( $TaskData, array(
						'notice_mailaddress' => $mailsetting->notice_mailaddress,
						'token' => $token
					));

					array_push( $TaskFunction, function( $address, $token ){
						// メール本文作成
						$email = new CakeEmail( 'gmail' );
						$email->from( array( 'Farbe.mail.notice@gmail.com' => 'Farbe おやすみメール通知' ) );
						$email->subject( 'Farbe おやすみメール通知' );
						$email->to( $address );
						$email->send( 'そろそろ、おやすみなさい。お布団に入ったら次のリンクをタッチ(クリック)してください。 http://farbedev.tk/green/farbe/check/' . $token );
					});

				} // if( strtotime( $now) ....
			} // if( $mailsetting->goodnight == true && $goodnight == false )

			// 朝のおくすりメールを送信してよいか検討
			if( $mailsetting->morning_drug == true && $morning_drug == false ){

				$beforetime = date( 'Y-m-d ') . $mailsetting->morning_drug_mail_hour . ':00:00';
				$aftertime = date( 'Y-m-d ' ) . $mailsetting->morning_drug_mail_hour . ':00:10';
				if( strtotime( $now ) >= strtotime( $beforetime ) &&
					strtotime( $now ) <= strtotime( $aftertime )
				){
					
					// 10文字のランダムなトークンを生成
					$token = substr( str_shuffle('1234567890abcdefghijkmlnopqrstuvwxyz'),0,10);
					// トークンイベントに保存するjson_dataの中身
					$token_json = array(
						'token' => $token,
						'mailtype' => 'morning_drug',
						'beforetime' => $beforetime,
						'aftertime' => $aftertime,
						'to' => $mailsetting->notice_mailaddress,
						'catch' => ''
					);

					// トークンイベントを作成
					$savedata = array( 'EventData' => array(
						'datetime' => date( 'Y-m-d H:i:s' ),
						'user_id' => $ur['User']['id'],
						'event_id' => $this->GetHash( 'SendMailTokenEvent' ),
						'json_data' => json_encode( $token_json )
					));

					// DBにセーブ
					$this->EventData->create();
					$this->EventData->save( $savedata );

					array_push( $TaskData, array(
						'notice_mailaddress' => $mailsetting->notice_mailaddress,
						'token' => $token
					));

					array_push( $TaskFunction, function( $address, $token ){
						// メール本文作成
						$email = new CakeEmail( 'gmail' );
						$email->from( array( 'Farbe.mail.notice@gmail.com' => 'Farbe 朝のおくすりメール通知' ) );
						$email->subject( 'Farbe 朝のおくすりメール通知' );
						$email->to( $address );
						$email->send( 'おはようございます。朝のおくすり飲んだら次のリンクをタッチ(クリック)してください。 http://farbedev.tk/green/farbe/check/' . $token );
					});

				} // if( strtotime( $now) ....
			} // if( $mailsetting->morning_drug == true && $morning_drug == false )

			// 昼のおくすりメールを送信してよいか検討
			if( $mailsetting->afternoon_drug == true && $afternoon_drug == false ){

				$beforetime = date( 'Y-m-d ') . $mailsetting->afternoon_drug_mail_hour . ':00:00';
				$aftertime = date( 'Y-m-d ' ) . $mailsetting->afternoon_drug_mail_hour . ':00:10';
				if( strtotime( $now ) >= strtotime( $beforetime ) &&
					strtotime( $now ) <= strtotime( $aftertime )
				){
					
					// 10文字のランダムなトークンを生成
					$token = substr( str_shuffle('1234567890abcdefghijkmlnopqrstuvwxyz'),0,10);
					// トークンイベントに保存するjson_dataの中身
					$token_json = array(
						'token' => $token,
						'mailtype' => 'afternoon_drug',
						'beforetime' => $beforetime,
						'aftertime' => $aftertime,
						'to' => $mailsetting->notice_mailaddress,
						'catch' => ''
					);

					// トークンイベントを作成
					$savedata = array( 'EventData' => array(
						'datetime' => date( 'Y-m-d H:i:s' ),
						'user_id' => $ur['User']['id'],
						'event_id' => $this->GetHash( 'SendMailTokenEvent' ),
						'json_data' => json_encode( $token_json )
					));

					// DBにセーブ
					$this->EventData->create();
					$this->EventData->save( $savedata );

					array_push( $TaskData, array(
						'notice_mailaddress' => $mailsetting->notice_mailaddress,
						'token' => $token
					));

					array_push( $TaskFunction, function( $address, $token ){
						// メール本文作成
						$email = new CakeEmail( 'gmail' );
						$email->from( array( 'Farbe.mail.notice@gmail.com' => 'Farbe 昼のおくすりメール通知' ) );
						$email->subject( 'Farbe 昼のおくすりメール通知' );
						$email->to( $address );
						$email->send( 'こんにちわ。昼のおくすり飲んだら次のリンクをタッチ(クリック)してください。 http://farbedev.tk/green/farbe/check/' . $token );
					});

				} // if( strtotime( $now) ....
			} // if( $mailsetting->afternoon_drug == true && $afternoon_drug == false )

			// 夕のおくすりメールを送信してよいか検討
			if( $mailsetting->evening_drug == true && $evening_drug == false ){

				$beforetime = date( 'Y-m-d ') . $mailsetting->evening_drug_mail_hour . ':00:00';
				$aftertime = date( 'Y-m-d ' ) . $mailsetting->evening_drug_mail_hour . ':00:10';
				if( strtotime( $now ) >= strtotime( $beforetime ) &&
					strtotime( $now ) <= strtotime( $aftertime )
				){
					
					// 10文字のランダムなトークンを生成
					$token = substr( str_shuffle('1234567890abcdefghijkmlnopqrstuvwxyz'),0,10);
					// トークンイベントに保存するjson_dataの中身
					$token_json = array(
						'token' => $token,
						'mailtype' => 'evening_drug',
						'beforetime' => $beforetime,
						'aftertime' => $aftertime,
						'to' => $mailsetting->notice_mailaddress,
						'catch' => ''
					);

					// トークンイベントを作成
					$savedata = array( 'EventData' => array(
						'datetime' => date( 'Y-m-d H:i:s' ),
						'user_id' => $ur['User']['id'],
						'event_id' => $this->GetHash( 'SendMailTokenEvent' ),
						'json_data' => json_encode( $token_json )
					));

					// DBにセーブ
					$this->EventData->create();
					$this->EventData->save( $savedata );

					array_push( $TaskData, array(
						'notice_mailaddress' => $mailsetting->notice_mailaddress,
						'token' => $token
					));

					array_push( $TaskFunction, function( $address, $token ){
						// メール本文作成
						$email = new CakeEmail( 'gmail' );
						$email->from( array( 'Farbe.mail.notice@gmail.com' => 'Farbe 夕のおくすりメール通知' ) );
						$email->subject( 'Farbe 夕のおくすりメール通知' );
						$email->to( $address );
						$email->send( 'こんばんわ。夕のおくすり飲んだら次のリンクをタッチ(クリック)してください。 http://farbedev.tk/green/farbe/check/' . $token );
					});

				} // if( strtotime( $now) ....
			} // if( $mailsetting->evening_drug == true && $evening_drug == false )

			// 眠前のおくすりメールを送信してよいか検討
			if( $mailsetting->goodnight_drug == true && $goodnight_drug == false ){

				$beforetime = date( 'Y-m-d ') . $mailsetting->goodnight_drug_mail_hour . ':00:00';
				$aftertime = date( 'Y-m-d ' ) . $mailsetting->goodnight_drug_mail_hour . ':00:10';
				if( strtotime( $now ) >= strtotime( $beforetime ) &&
					strtotime( $now ) <= strtotime( $aftertime )
				){
					
					// 10文字のランダムなトークンを生成
					$token = substr( str_shuffle('1234567890abcdefghijkmlnopqrstuvwxyz'),0,10);
					// トークンイベントに保存するjson_dataの中身
					$token_json = array(
						'token' => $token,
						'mailtype' => 'goodnight_drug',
						'beforetime' => $beforetime,
						'aftertime' => $aftertime,
						'to' => $mailsetting->notice_mailaddress,
						'catch' => ''
					);

					// トークンイベントを作成
					$savedata = array( 'EventData' => array(
						'datetime' => date( 'Y-m-d H:i:s' ),
						'user_id' => $ur['User']['id'],
						'event_id' => $this->GetHash( 'SendMailTokenEvent' ),
						'json_data' => json_encode( $token_json )
					));

					// DBにセーブ
					$this->EventData->create();
					$this->EventData->save( $savedata );

					array_push( $TaskData, array(
						'notice_mailaddress' => $mailsetting->notice_mailaddress,
						'token' => $token
					));

					array_push( $TaskFunction, function( $address, $token ){
						// メール本文作成
						$email = new CakeEmail( 'gmail' );
						$email->from( array( 'Farbe.mail.notice@gmail.com' => 'Farbe 眠前のおくすりメール通知' ) );
						$email->subject( 'Farbe 眠前のおくすりメール通知' );
						$email->to( $address );
						$email->send( 'こんばんわ。眠前のおくすり飲んだら次のリンクをタッチ(クリック)してください。 http://farbedev.tk/green/farbe/check/' . $token );
					});

				} // if( strtotime( $now) ....
			} // if( $mailsetting->goodnight_drug == true && $goodnight_drug == false )
		} // foreach( $UserResult as $ur )

		// タスクを全て実行
		for( $i=0; $i<count($TaskFunction); ++$i ){
			$TaskFunction[$i](
				$TaskData[$i]['notice_mailaddress'],
				$TaskData[$i]['token']
			);
		}

		$this->render( 'processpage' );
	} // public function processpage()

	// おはようメール・おやすみメール・おくすりメール記録用アクション
	public function check( $token ){
		$this->autoLayout = false;

		// 入力されたトークンを一括検索
		// トークンからユーザーIDを逆引き
		$TokenResult = $this->EventData->find(
			'all',
			array(
				'conditions' => array(
					'EventData.event_id' => $this->GetHash( 'SendMailTokenEvent' )
				),
				'order' => 'EventData.id DESC'
			)
		);

		// トークン一覧から検索する
		foreach( $TokenResult as $tr ){

			// json_data をデコード
			$jsonobj = json_decode( $tr['EventData']['json_data'] );

			// token が一致しないかチェック
			// catch が空の場合のみ処理する
			if( $jsonobj->token == $token && $jsonobj->catch == '' ){

				// 一致したら現在時刻を代入(空の場合のみ)
				$jsonobj->catch = date( 'Y-m-d H:i:s' );

				// イベント更新用データを作る
				$savedata = array( 'EventData' => array(
					'id' => $tr['EventData']['id'],
					'json_data' => json_encode( $jsonobj )
				));

				// DB更新
				$this->EventData->save( $savedata );

				// 1件しか更新しないので抜ける
				break;

			} // if( $jsonobj->token == $token )

		} // foreach( $TokenResult as $tr )


		$this->render( 'check' );
	} // public function check( $token )

	// レポート表示を行うアクション
	public function report(){
		$this->autoLayout = false;

		// トークンイベントを全取得(ユーザー指定)
		$TokenResult = $this->EventData->find(
			'all',
			array(
				'conditions' => array(
					'EventData.event_id' => $this->GetHash( 'SendMailTokenEvent' ),
					'User.id' => $this->Auth->user()['id']
				)
			)
		);


		// 起床時刻を集めたデータ配列
		$MorningArray = array();
		// 就寝時刻を集めたデータ配列
		$GoodnightArray = array();
		// 朝のおくすり服用時間を集めたデータ配列
		$MorningDrugArray = array();
		// 昼のおくすり服用時間を集めたデータ配列
		$AfternoonDrugArray = array();
		// 夕のおくすり服用時間を集めたデータ配列
		$EveningDrugAarray = array();
		// 眠前のおくすり服用時間を集めたデータ配列
		$GoodnightDrugArray = array();
		// 全てのトークンを並べたデータ配列
		$TokenArray = array();

		// トークンの数だけループ(古いトークンから順に)
		for( $i=0; count($TokenResult)>$i; ++$i ){

			// トークンイベントをひとつ取り出し
			$tr = $TokenResult[$i];

			// 14日前のトークンは処理しない
			$beforedate = date( 'Y-m-d', strtotime( '-14 day' ) );
			$targetdate = DateTime::createFromFormat( 'Y-m-d H:i:s', $tr['EventData']['datetime'] );
			$targetdate = $targetdate->format( 'Y-m-d' );
			if( strtotime( $targetdate ) < strtotime( $beforedate ) ){
				continue;
			}

			// json_data をデコード
			$jsonobj = json_decode( $tr['EventData']['json_data'] );

			// mailtype が morning ならおはようメールなので
			if( $jsonobj->mailtype == 'morning' ){

				// $MorningArray に array_push
				array_push( $MorningArray, array(
					'maindata' => $tr,
					'jsonobj' => $jsonobj
				));

			}

			// mailtype が goodnight ならおやすみメールなので
			if( $jsonobj->mailtype == 'goodnight' ){
				
				array_push( $GoodnightArray, array(
					'maindata' => $tr,
					'jsonobj' => $jsonobj
				));

			}

			// mailtype が morning_drug なら朝のくすり服用時間なので
			if( $jsonobj->mailtype == 'morning_drug' ){

				array_push( $MorningDrugArray, array(
					'maindata' => $tr,
					'jsonobj' => $jsonobj
				));

			}

			// mailtype が afternoon_drug なら昼のくすり服用時間なので
			if( $jsonobj->mailtype == 'afternoon_drug' ){

				array_push( $AfternoonDrugArray, array(
					'maindata' => $tr,
					'jsonobj' => $jsonobj
				));

			}

			// mailtype が evening_drug なら夕のくすり服用時間なので
			if( $jsonobj->mailtype == 'evening_drug' ){

				array_push( $EveningDrugAarray, array(
					'maindata' => $tr,
					'jsonobj' => $jsonobj
				));

			}

			// mailtype が goodnight_drug なら眠前のくすりの服用時間なので
			if( $jsonobj->mailtype == 'goodnight_drug' ){

				array_push( $GoodnightDrugArray, array(
					'maindata' => $tr,
					'jsonobj' => $jsonobj
				));
			}

			// そのままpush
			array_push( $TokenArray, array(
				'maindata' => $tr,
				'jsonobj' => $jsonobj
			));

		} // for( $i=0; count($TokenResult)>$i; ++$i )

		// 頓服薬を飲んだイベントを収集
		$result = $this->EventData->find(
			'all',
			array(
				'conditions' => array(
					'EventData.event_id' => $this->GetHash( 'DrinkPotion' ),
					'EventData.user_id' => $this->Auth->user()['id']
				),
				'order' => 'EventData.id DESC'
			)
		);

		// 新たに配列を用意
		$DrinkPotionArray = array();

		// json_data をデコード
		foreach( $result as $r ){
			// 14日前のデータは処理しない
			$beforedate = date( 'Y-m-d', strtotime( '-14 day' ) );
			$targetdate = DateTime::createFromFormat( 'Y-m-d H:i:s', $r['EventData']['datetime'] );
			$targetdate = $targetdate->format( 'Y-m-d' );
			if( strtotime( $targetdate ) < strtotime( $beforedate ) ){
				continue;
			}	

			// 配列にプッシュ
			array_push( $DrinkPotionArray, array(
				'maindata' => $r,
				'jsonobj' => json_decode( $r['EventData']['json_data'] ),
				'datetime' => $r['EventData']['datetime']
			));	
		}

		// 頓服薬の残数のデータを渡す
		$result = $this->EventData->find(
			'all',
			array(
				'conditions' => array(
					'EventData.event_id' => $this->GetHash( 'SavePotionData' ),
					'EventData.user_id' => $this->Auth->user()['id']
				),
				'order' => 'EventData.id DESC'
			)
		);

		// 一つ目のデータが最新のデータ
		$HavePotionData = json_decode( $result['0']['EventData']['json_data'] );

		// 最近のブログのデータを渡す
		$BlogData = $this->BlogTable->find(
			'all',
			array(
				'conditions' => array(
					'BlogTable.user_id' => $this->Auth->user()['id']
				),
				'order' => 'BlogTable.id DESC',
				'recursive' => 2
			)
		);	

		// ログインしているユーザーデータを渡す
		$UserData = $this->Auth->user();

		$this->set( 'MorningArray', $MorningArray );			// 起床時刻の配列
		$this->set( 'GoodnightArray', $GoodnightArray );		// 就寝時刻の配列
		$this->set( 'MorningDrugArray', $MorningDrugArray );		// 朝の薬の服用時刻の配列
		$this->set( 'AfternoonDrugArray', $AfternoonDrugArray );	// 昼の薬の服用時刻の配列
		$this->set( 'EveningDrugArray', $EveningDrugAarray );		// 夕の薬の服用時刻の配列
		$this->set( 'GoodnightDrugArray', $GoodnightDrugArray );	// 眠前の薬の服用時刻の配列
		$this->set( 'TokenArray', $TokenArray );			// 全てのトークンを集めた配列
		$this->set( 'DrinkPotionArray', $DrinkPotionArray );		// 頓服薬を飲んだデータ配列
		$this->set( 'HavePotionData', $HavePotionData );		// 持っている頓服薬のデータ
		$this->set( 'BlogData', $BlogData );				// ブログのデータを渡す
		$this->set( 'UserData', $UserData );				// ユーザーデータを渡す

		$this->render( 'report' );
	} // public function report()

	// プロフィールを表示するアクション
	public function ViewProfile(){
		$this->autoLayout = false;
		$this->autoRender = false;


		if( $this->request->is('ajax') ){
			if( $this->request->is('get') ){

				$this->set( 'logindata', $this->Auth->user() );
				$this->render( 'view_profile' );
			}
			if( $this->request->is('post') ){

				$userid = $this->request->data['userid'];
				$result = $this->User->find(
						'all',
						array( 'conditions' => array(
							'User.id' => $userid
						))
				);

				// Viewを生成して出力を取る方法
				$view = new View( $this, false );
				$view->viewPath = 'Farbe';		// ctpファイルがあるフォルダパス
				$view->layout = false;			// 必須らしい
				$view->set( 'logindata', $result['0']['User'] );	// Viewにパラメータを設定
				$html = $view->render( 'view_profile' );		// 戻り値がレンダリング結果

				return( $html );

				//$this->set( 'logindata', $result['0']['User'] );
				//$this->render( 'view_profile' );			
			}
		}

	}

	// 検索ボタンが押された時のAjax通信用アクション
	public function search_page(){
		$this->autoLayout = false;
		$this->autoRender = false;

		if( $this->request->is('ajax') ){
			if( $this->request->is('get') ){
				$this->render( 'search_page' );
			}
			if( $this->request->is('post') ){
				$this->render( 'search_page' );
			}
		}
	}

	// 日記・Blogボタンが押された時のアクション
	public function blog_page(){
		$this->autoLayout = false;
		$this->autoRender = false;

		if( $this->request->is('ajax') ){
			if( $this->request->is('get') ){
				$userid = $this->Auth->user()['id'];
				$BlogData = $this->BlogTable->find(
					'all',
					array(
						'conditions' => array(
							'BlogTable.user_id' => $userid
						),
						'order' => 'BlogTable.id DESC',
						'recursive' => 2
					)
			 	);
				$this->set( 'BlogData', $BlogData );
				$this->render( 'blog_page' );
			}
		}
	}

	// ブログ記事投稿用アクション
	public function PostBlogData(){
		$this->autoLayout = false;
		$this->autoRender = false;

		if( $this->request->is('ajax') ){
			if( $this->request->is('post') ){
				$savedata = array(
					'BlogTable' => array(
						'user_id' => $this->request->data['id'],
						'text' => nl2br( $this->request->data['text'] )
					)
				);
				$this->BlogTable->create();
				$this->BlogTable->save( $savedata );
			}
		}
	}

	// 他の人のBlog記事を見るためのアクション
	public function ViewBlog(){
		$this->autoLayout = false;
		$this->autoRender = false;

		if( $this->request->is('ajax') ){
			if( $this->request->is('post') ){
				$ViewID = $this->request->data['viewid'];
				$BlogData = $this->BlogTable->find(
					'all',
					array(
						'conditions' => array(
							'User.id' => $ViewID
						),
						'order' => 'BlogTable.id DESC',
						'recursive' => 2
					)
				);
				$this->set( 'BlogData', $BlogData );
				$this->render( 'viewblog' );
			}
		}
	}

	// 日記・Blog記事を修正するアクション
	public function ModifyBlog(){
		$this->autoLayout = false;
		$this->autoRender = false;

		
		if( $this->request->is('ajax') ){
			if( $this->request->is('post') ){
				$id = $this->request->data['modify_id'];
				
					
				// POSTされたデータにtextが無い場合は修正ページを表示
				$return = $this->BlogTable->find(
						'all',
						array(
							'conditions' => array(
								'BlogTable.id' => $id
							)
						)
					);
				
				$this->set( 'ModifyBlogData', $return['0'] );	
				$this->render( 'modify_blog' );
					
				
			}
		}
		
	}

	// 日記・Blogの内容を更新するアクション
	function UpdateBlog(){
		$this->autoLayout = false;
		$this->autoRender = false;
		
		if( $this->request->is('ajax') ){
			if( $this->request->is('post') ){
				$id = $this->request->data['modify_id'];
				$text = $this->request->data['text'];

				$savedata = array( 'BlogTable' => array(
						'id' => $id,
						'text' => nl2br( $text )
					));
				$this->BlogTable->save( $savedata );
			}
		}

	}
			

	// 日記・Blog記事を削除するアクション
	public function DeleteBlog(){
		$this->autoLayout = false;
		$this->autoRender = false;

		if( $this->request->is('ajax') ){
			if( $this->request->is('post') ){
				// 削除する記事のIDがPOSTされる
				$id = $this->request->data['delete_id'];

				// 記事をDBから削除する
				//$this->BlogTable->deleteAll(
					//array( 'BlogTable.id' => $id )
				//);
				
				// 日記・Blogに関連しているコメントを削除する
				$result = $this->BlogTable->find(
						'all',
						array( 'conditions' => array( 'BlogTable.id' => $id ) )
					);
				foreach( $result['0']['BlogComment'] as $comment ){
					$this->BlogComment->delete( $comment['id'] );
				}

				$this->BlogTable->delete( $id );
			}
		}
	}

	// 日記・Blog記事へのコメントを受け取るアクション
	public function PostBlogComment(){

		$this->autoLayout = false;
		$this->autoRender = false;

		if( $this->request->is('ajax') ){
			if( $this->request->is('post') ){
				$blogid = $this->request->data['blog_id'];
				$comment = $this->request->data['comment'];
				$userid = $this->Auth->user()['id'];

				$savedata = array( 'BlogComment' => array(
						'blog_id' => $blogid,
						'user_id' => $userid,
						'comment' => $comment
				));

				$this->BlogComment->create();
				$this->BlogComment->save( $savedata );
			}
		}

	}

	// 掲示板ボタンが押された時のアクション
	public function bbs_page(){
		$this->autoLayout = false;
		$this->autoRender = false;

		if( $this->request->is('ajax') ){
			if( $this->request->is('get') ){
				$bbsdata = $this->BbsThread->find( 'all' );
				$this->set( 'bbsdata', $bbsdata );
				$this->render( 'bbs_page' );
			}
		}
	}

	// スレッドを作るアクション
	public function create_thread(){
		$this->autoLayout = false;
		$this->autoRender = false;

		if( $this->request->is('ajax') ){
			// GETリクエストの場合は、表示のみ行う
			if( $this->request->is('get') ){
				$this->render( 'create_thread' );
			}

			// POSTリクエストの場合、スレッドを作る
			if( $this->request->is('post') ){
				$thread_name= $this->request->data['thread_name'];

				// スレッド番号を作られた順で割り振る
				$result = $this->BbsThread->find( 'all' );
				$thread_num = count( $result );

				$savedata = array( 'BbsThread' => array(
						'thread_name' => $thread_name,
						'thread_num' => $thread_num
				));
				$this->BbsThread->create();
				$this->BbsThread->save( $savedata );
			}			
		}
	}

	// スレッドの中身を表示するアクション
	public function ViewThread(){
		$this->autoLayout = false;
		$this->autoRender = false;

		if( $this->request->is('ajax') ){
			if( $this->request->is('post') ){
				$thread_id = $this->request->data['thread_id'];
				$result = $this->BbsThread->find(
						'all',
						array(
							'conditions' => array(
								'BbsThread.id' => $thread_id
							),
							'recursive' => 2
						)
					);
				$this->set( 'threaddata', $result );
				$this->render( 'view_thread' );
			}
		}
	}

	// レスを投稿するアクション
	public function PostRess(){
		$this->autoLayout = false;
		$this->autoRender = false;

		if( $this->request->is('ajax') ){
			if( $this->request->is('post') ){
				$thread_id = $this->request->data['thread_id'];
				$resstext = $this->request->data['resstext'];

				$result = $this->BbsThread->find(
						'all',
						array( 'conditions' => array(
							'BbsThread.id' => $thread_id
						))
					);
				$ressnum = count( $result['0']['BbsRess'] );
				$ressnum ++;	// 最初は０なのでインクリメント

				$savedata = array( 'BbsRess' => array(
						'thread_id' => $thread_id,
						'user_id' => $this->Auth->user()['id'],
						'ress_num' => $ressnum,
						'ress' => $resstext
				));
				$this->BbsRess->create();
				$this->BbsRess->save( $savedata );
			}
		}
	}

	// ネットケアボタンが押された時のアクション
	public function netcare_page(){
		$this->autoLayout = false;
		$this->autoRender = false;

		if( $this->request->is('ajax') ){
			if( $this->request->is('get') ){
				//$this->set( 'userdata', $this->Auth->user() );

				$this->render( 'netcare_page' );
			}
		}
	}


	// ネクストケアボタンが押された時のアクション
	public function nextcare_page(){
		$this->autoLayout = false;
		$this->autoRender = false;

		if( $this->request->is('ajax') ){
			if( $this->request->is('get') ){
				$this->render( 'nextcare_page' );
			}
		}
	}

	// お気に入りボタンが押された時のアクション
	public function favorite_page(){
		$this->autoLayout = false;
		$this->autoRender = false;

		if( $this->request->is('ajax') ){
			if( $this->request->is('get') ){
				$this->render( 'favorite_page' );
			}
		}
	}
	
	// 設定ボタンが押された時のアクション
	public function setting_page(){
		$this->autoLayout = false;
		$this->autoRender = false;

		if( $this->request->is('ajax') ){
			if( $this->request->is('get') ){
				$this->render( 'setting_page' );
			}
		}
	}

	// プロフィール設定ページ用アクション
	public function profile_setting_page(){
		$this->autoLayout = false;
		$this->autoRender = false;

		if( $this->request->is('ajax') ){
			// GETならプロフィール変更ページを表示
			if( $this->request->is('get') ){
				$this->set( 'userdata', $this->Auth->user() );
				$this->render( 'profile_setting_page' );
			}
		}

		// POSTならユーザーデータを更新する	
		if( $this->request->is('post') ){
			$userid = $this->Auth->user()['id'];
			$nickname = $this->request->data['nickname'];
			$introduction = $this->request->data['introduction'];

			// アップロードされた画像のイメージ情報を取得
			$picture = $this->params['form']['picture'];
			$pic_path = '';
			if( strlen( $picture['name'] ) > 0 ){
				// イメージ保存先パス
				$img_save_path = IMAGES.DS.'save_files';
				// ランダムな保存名を生成
				$savename = substr( str_shuffle('1234567890abcdefghijkmlnopqrstuvwxyz'),0,10);
				// 画像ファイルの拡張子を取得
				$ext = pathinfo( $picture['name'], PATHINFO_EXTENSION );
				// イメージの保存処理
				move_uploaded_file(
						$picture['tmp_name'],
						$img_save_path . DS . $savename . '.' . $ext
				);
				
				//debug( $picture );
				$pic_path = '/green/img/save_files/' . $savename . '.' . $ext;
			}

			// Userモデルから更新処理を行う
			$savedata = array( 'User' => array(
					'id' => $userid,
					'nickname' => $nickname,
					'introduction' => $introduction,
					'pic_path' => $pic_path
			));
			$this->User->save( $savedata );
			
			// ログイン情報をViewに渡す
			$this->set( 'logindata', $this->Auth->user() );
			// 再ログインを促すページを表示する
			$this->render( 'relogin' );
		}
	}

	// イベントデータ一覧を表示する（デバッグ用）
	public function showeventdata(){
		$this->autoLayout = false;

		$events = array(
			'NullEvent' => -11,
			'LoginEvent' => $this->GetHash( 'LoginEvent' ),
			'LogoutEvent' => $this->GetHash( 'LogoutEvent' ),
			'MovePosition' => $this->GetHash( 'MovePosition' ),
			'GetPosition' => $this->GetHash( 'GetPosition' ),
			'LinkEvent' => $this->GetHash( 'LinkEvent' )
		);

		$result = $this->EventData->find(
			'all',
			array(
				'order' => array( 'EventData.id DESC' ),
				'limit' => 500
			)
		);

		$this->set( 'events', $events );
		$this->set( 'eventdata', $result );
		$this->render( 'event_data' );

		//debug( $result );
	}
	
	// 同一のニックネームでログインできないよう制御する
	public function logingame(){
		$this->autoLayout = false;

		// ニックネームを取得
		$nickname = $this->request->data['nickname'];
		
		// ニックネームテーブルに同じ名前がないか検索
		$index = 1;
		$search_nickname = $nickname;
		$result = $this->Nickname->find(
				'all',
				array( 'conditions' => array( 'Nickname.nickname' => $search_nickname ) )
			);
		
		// 同じ名前がないので登録
		if( count( $result ) == 0 ){
			$savedata = array(
					'Nickname' => array(
							'nickname' => $nickname
					)
			);
			$this->Nickname->create();
			$this->Nickname->save( $savedata );			
		}
		// 同じ名前があるので番号を付けて検索
		else{		
			while( true ){
				$search_nickname = $nickname . strval( $index );
				$result = $this->Nickname->find(
							'all',
							array(
								'conditions' => array( 'Nickname.nickname' => $search_nickname )
								)
							);
	
			
				// 同じ名前でないので登録
				if( count( $result ) == 0 ){
					$savedata = array(
							'Nickname' => array(
									'nickname' => $search_nickname
							)
					);
					$this->Nickname->create();
					$this->Nickname->save( $savedata );
					break;
				}
				
				++ $index;
			}
		}		

		// Search ID
		$result = $this->Nickname->find(
					'all',
					array( 'conditions' => array( 'Nickname.nickname' => $search_nickname ) )
				);
		
		// セッションにニックネームIDを書き込み
		$this->Session->write( 'nickname_id', $result['0']['Nickname']['id'] );


		$this->redirect( 'screen' );
		
		//debug( $result );
	}
	
	// ゲーム用アクション
	public function screen(){
		$this->autoLayout = false;
		
		// ニックネームIDをセット
		$this->set( 'nickname_id', $this->Session->read( 'nickname_id' ) );
		
		$this->render( 'game' );
	}
	
	// グローバルチャット更新用Ajaxアクション
	public function GetGlobalChatData(){
		$this->autoRender = false;
		
		$result = $this->GlobalChat->find(
						'all',
						array(
								'order' => array( 'GlobalChat.id DESC' ),
								'limit' => 10
						)
				 );
	
		// JSON用に整形
		$senddata = array();
		foreach( $result as $key => $value ){
			// $value['GlobalChat']['nickname_id']
			// $value['GlobalChat']['text']
			// $value['Nickname']['nickname']
			//debug( $value );
			array_unshift( $senddata,
					array(  'message_id' => $value['GlobalChat']['id'],
							'nickname_id' => $value['GlobalChat']['nickname_id'],
							'nickname' => $value['Nickname']['nickname'],
							'text' => $value['GlobalChat']['text']
					)
			);	
		}
		
		//debug( json_encode( $senddata ) );
		return( json_encode( $senddata ) );
		//return( $senddata );
	}
	
	// グローバルチャット発言用Ajaxアクション
	public function PostGlobalChatData(){
		$this->autoRender = false;

		$nickname_id = $this->request->data['nickname_id'];
		$text = $this->request->data['text'];
		
		$savedata = array( 'GlobalChat' => array(
								'nickname_id' => $nickname_id,
								'text' => $text
						));
		$this->GlobalChat->create();
		$this->GlobalChat->save( $savedata );
	}
	
	// プレイヤー位置の取得と出力
	public function PostGetPlayersPosition(){
		$this->autoRender = false;
		
		$player_id = $this->request->data['player_id'];
		$px = $this->request->data['px'];
		$py = $this->request->data['py'];
		$pz = $this->request->data['pz'];
		
		
		/*
		// PostされたPlayerIDのレコードを削除
		$result = $this->PlayersPosition->deleteAll(
						array(
								'PlayersPosition.player_id' => $player_id
						));
		*/

		// １分経過したレコードを削除する
		// (更新がないプレイヤーのログアウト処理)
		$old_time = date('Y-m-d H:i:s', strtotime( '-1 minute' ) );
		$this->PlayersPosition->deleteAll(
				array(
					'modified <=' => $old_time
				)
		);	
						
		// Postされたデータを保存
		//$this->PlayersPosition->create();
		//$this->PlayersPosition->save( $savedata );

		// データが更新可能かどうか player_id から dataid を検索
		$result = $this->PlayersPosition->find(
						'all',
						array(
							'conditions' => array(
								'player_id' => $player_id
							)
						)
					);
		// データがあった場合
		if( count( $result ) > 0 ){
			
			// Post されたデータを保存するために整形
			$savedata = array( 'PlayersPosition' => array(
								'id' => $result[0]['PlayersPosition']['id'],
								'player_id' => $player_id,
								'px' => $px,
								'py' => $py,
								'pz' => $pz
								)
							);

			// 位置データを更新する
			$result = $this->PlayersPosition->save( $savedata );
		}
		// データが無かった場合
		else{
			// Post されたデータを保存するために整形
			$savedata = array( 'PlayersPosition' => array(
								'player_id' => $player_id,
								'px' => $px,
								'py' => $py,
								'pz' => $pz
								)
							);
			// データを新規保存
			$this->PlayersPosition->create();
			$this->PlayersPosition->save( $savedata );
			
		}
		
		// Ajaxで全プレイヤーのデータを返す
		$result = $this->PlayersPosition->find(
						'all',
						array(
							'order' => array( 'PlayersPosition.id DESC' )
							 )
						);
		// JSON用にデータを整形
		$senddata = array();
		foreach( $result as $value ){
			// $value['PlayersPosition']['player_id']
			// $value['PlayersPosition']['px']
			// $value['Nickname']['nickname']			
			
			array_push( $senddata, array(
							"player_id" => $value['PlayersPosition']['player_id'],
							"nickname" =>  $value['Nickname']['nickname'],
							"px" => $value['PlayersPosition']['px'],
							"py" => $value['PlayersPosition']['py'],
							"pz" => $value['PlayersPosition']['pz']
			));
		}

		
		//debug( $result );
		return json_encode( $senddata );
	}
	
	// 文字列からハッシュ値を計算する関数
	public function GetHash( $str ){
		/* だめぽ
		$hash = 0;
		if( strlen( $str ) == 0 ) return( $hash );
		for( $i=0; $i<strlen( $str ); $i++ ){
			$char = $str[$i];
			$hash = ( ($hash << 5) - $hash ) + ord( $char );
			$hash = $hash & $hash;
		}
		return( $hash );
		*/
		/* 計算誤差でだめぽ
		$hash = 0;
		if( strlen( $str ) == 0 ) return( $hash );
		for( $i=0; $i<strlen( $str ); ++$i ){
			$hash = $hash * 37 + ord( $str[$i] );
		}
		return( abs( $hash ) );
		*/
		// MD5つかってしまえ
		//return( md5( $str ) );
	
		// きました murmurHash3
		//return( murmurhash3( $str ) );

		// xampp だと murmurhash3_int が 32bit なのでダメらしい
		//return( $this->GetHash( $str ) );

		$asciisum = 0;	// アスキーコードの合計を返すだけのハッシュ関数
		for( $i=0; $i<strlen( $str ); ++$i ){
			$asciisum += ord( $str[$i] );
		}
		return( $asciisum );
	}
	
	// ハッシュ生成テスト
	public function hashtest( $str ){
		$this->set('str', $str);
		$this->set('hash', $this->GetHash( $str ));
		$this->render( 'hashtest' );
	}
	
	// メッセージ処理アクション
	public function PostGetMessages(){
		$this->autoRender = false;
		// 処理時間を計測する
		$start_time = microtime( true );

		// イベントデータを処理する	
		$eventdata = $this->request->data['eventdata'];	// POSTされたイベントデータ
		$eventdata = json_decode( $eventdata );	// JSONからデコード
		$returndata = array();	// 返すデータ配列

		// サーバー上のプロセス管理
		$processList = $this->ProcessTable->find('all');
		// MainEventProcess を検索
		$ProcessStatus = '';
		for( $i=0; $i<count($processList); ++$i ){
			if( $processList[$i]['ProcessTable']['process_name'] == 'MainEventProcess' ){
				$ProcessStatus = $processList[$i]['ProcessTable']['status'];	
				break;
			}
		}
		// status が on なら処理を行う
		if( $ProcessStatus == 'on' ){	

			// イベントを処理するインスタンスを生成
			$EventHandler = new EventHandler();
			$EventHandler->setStaticData( $this, $returndata, $eventdata );	// 必ず呼び出すこと
			$EventHandler
				->setNext( new PostCommentHandler() )
				->setNext( new PostManyDataEventHandler() )
				->setNext( new PostManyObjectEventHanlder() )
				->setNext( new PostGetGlobalChatTextEventHandler() )
				->setNext( new PostGetPlayerPositionEventHandler() )	// 現在使われていないので
				->setNext( new GetStuffCommentEventHandler() )
				->setNext( new LoginEventHandler() )
				->setNext( new LogoutEventHandler() )
				->setNext( new MovePositionEventHandler() )
				->setNext( new GetPositionEventHandler() )
				->setNext( new LinkEventHandler() )
				->setNext( new RenderMailNoticeSettingEventHandler() )
				->setNext( new LoadMailSettingEventHandler() )
				->setNext( new SaveMailSettingEventHandler() )
				->setNext( new RenderPotionManagementEventHandler() )
				->setNext( new SavePotionDataEventHandler() )
				->setNext( new LoadPotionDataEventHandler() )
				->setNext( new DrinkPotionEventHandler() )
				->setNext( new ProfileRenderEventHandler() )
				->setNext( new PostEventCountEventHandler() );
			
			// イベントデータの数だけループ
			for( $i=0; $i<count($eventdata); ++$i ){
				
				$event = $eventdata[$i];

				// イベントデータを処理する
				// if( $event->eventid == $this->GetHash( "PostComment" ) ){
				// 	array_push( $returndata, array(
				// 		"datetime" => date('Y-m-d H:i:s'),
				// 		"userid" => -11,
				// 		"eventid" => $this->GetHash('CommentCatched'),
				// 		"data" => '[' . $event->data . '] CommentCatched!'
				// 	));
				// }

				/////////////////////////////////////
				// request の呼び出しは１回でOK
				$EventHandler->request( $event );
				/////////////////////////////////////
				
				

			} // for( $i=0; $i<count($eventdata); ++$i  )

		} // if( $ProcessStatus == 'on' ) MainEventProcess

		// PageEventProcessを検索
		$ProcessStatus = '';
		for( $i=0; $i<count($processList); ++$i ){
			if( $processList[$i]['ProcessTable']['process_name'] == 'PageEventProcess' ){
				$ProcessStatus = $processList[$i]['ProcessTable']['status'];
				break;
			}
		}
		// status が on なら処理を行う
		if( $ProcessStatus == 'on' ){	// PageEventProcess

			// イベントデータの数だけループ
			//for( $i=0; $i<count($eventdata); ++$i ){
				
				//$event = $eventdata[$i];	// イベントデータを取り出す


				//////////////////////////////////////
				// プロセス管理は使っていません
				// 今後どうしようか検討すること
				//////////////////////////////////////

			//}

		} // if( $ProcessStatus == 'on' ) // PageEventProcess

		// 処理時間をデバッグ出力
		$end_time = microtime( true );
		//$this->log( $end_time - $start_time, LOG_DEBUG );

		// JSONにエンコードしてメッセージを返す
		return( json_encode( $returndata ) );

	} // public function PostGetMessages()

	// SuperAgent テスト用アクション
	public function ajaxtest(){
		$this->autoRender = false;
		$this->autoLayout = false;

		//$postdata = json_decode( $this->request->data );
		$postdata = $this->request->data['text'];
		$this->log( $this->request->data, LOG_DEBUG );
		$returndata = $postdata . 'pass to ajaxaction.';
		$this->log( $postdata, LOG_DEBUG );
		
		return( json_encode( $returndata ) );
	} // public function ajaxtest()
} // class FarbeController extends AppController

?>
