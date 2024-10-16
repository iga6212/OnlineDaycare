<?php
	// 睡眠時間配列
	// array( 'date' => '2013-02-11', 'hour' => 7 )
	$SleepData = array();

	// 全てのトークンをループ
	for( $i=0; count($TokenArray)>$i; ++$i ){

		$tai = $TokenArray[$i];

		// $i+0 就寝トークン
		// $i+1 眠前薬トークン
		// $i+2 起床トークン
		// まずは就寝トークンを見つける
		if( $tai['jsonobj']->mailtype == 'goodnight' ){
			// catch がセットされているか
			if( isset( $tai['jsonobj']->catch ) ){
				// catch に値が代入されているか
				if( $tai['jsonobj']->catch != '' ){
					// 現在のインデックスから起床トークンを検索
					for( $j=$i+1; count($TokenArray)>$j; ++$j ){
						$taj = $TokenArray[$j];
						// 起床トークンか
						if( $taj['jsonobj']->mailtype == 'morning' ){
							// catch がセットされているか
							if( isset( $taj['jsonobj']->catch ) ){
								// catch に値が代入されているか
								if( $taj['jsonobj']->catch != '' ){
									// 就寝トークンの時刻オブジェクト
									$goodnight_date = DateTime::createFromFormat( 'Y-m-d H:i:s', $tai['jsonobj']->catch );
									// 起床トークンの時刻オブジェクト
									$morning_date = DateTime::createFromFormat( 'Y-m-d H:i:s', $taj['jsonobj']->catch );	
									// 差を自動計算（超助かる）
									$sleeptime = $goodnight_date->diff( $morning_date );
									// 計算したデータを配列に代入
									array_push( $SleepData, array(
										'date' => $morning_date->format( 'Y-m-d' ),
										'hour' => $sleeptime->format( '%H' )
									));

									break;
								}
							}
						}
					}
				}
			}
		}

	} // for( $i=0; count($TokenArray)>$i; ++$i )


	//debug( $SleepData );
	//debug( $GoodnightArray );

	// 睡眠時間を算出する
	// パターン
	// 今日から翌日 (起床時刻+24)－就寝時刻
	// 今日から今日（翌日から翌日）起床時刻－就寝時刻
	//
	// 就寝トークンが10日だとしたら
	// 就寝トークンより大きい値の起床トークン(10日<)を見つければよい
	// 1日をまたぐ場合は、データが存在しないかcatchしていないとみなす

	// グラフ用にデータを整形
	$data1 = array();
	// for( $i=1; 24>=$i; ++$i ){
	// 	array_push( $data1, array( $i => 0 ) );	
	// }

	for( $i=0; count($SleepData)>$i; ++$i ){
		if( isset( $data1[$SleepData[$i]['hour']] ) == false ){
			$data1[$SleepData[$i]['hour']] = 0;
		}
		$data1[$SleepData[$i]['hour']] ++;
	}
	//debug( $data1 );
?>
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>総合レポートページ</title>
<script src="/green/js/jquery-3.1.0.js"></script>
<script src="/green/js/jqplot109/jquery.jqplot.js"></script>
<script src="/green/js/jqplot109/plugins/jqplot.pieRenderer.js"></script>
<script src="/green/js/jqplot109/plugins/jqplot.barRenderer.js"></script>
<script src="/green/js/jqplot109/plugins/jqplot.categoryAxisRenderer.js"></script>
<script src="/green/js/jqplot109/plugins/jqplot.dateAxisRenderer.js"></script>
<script src="/green/js/jqplot109/plugins/jqplot.pointLabels.js"></script>
<link rel="stylesheet" type="text/css" href="/green/js/jqplot109/jquery.jqplot.css">
<link rel="stylesheet" type="text/css" href="/green/css/report.css">
<script>

$(document).ready( function(){

	var plot1 = $.jqplot(
		'SleepGraph1',
		[
			[
<?php
	foreach( $data1 as $key => $value ){
		echo( '[' . $key . ',' . $value . '],' );
	}

	// データが無いとき
	if( count( $data1 ) == 0 ){
		echo( '[0,0]' );
	}
?>
			]
		],
		{
			gridPadding: {top: 0, bottom: 38, left: 0, right: 0 },
			seriesDefaults: {
				renderer: $.jqplot.PieRenderer,
				trendline: { show: false },
				rendererOptions: {
					padding: 8,
					dataLabels: 'percent',
					showDataLabels: true
				}
			},
			legend: {
				show: true,
				placement: 'inside',
				rendereroptions: {
					numberrows: 1
				},
				location: 'ne',
				margintop: '15px'
			}
		}
	);

	var plot2 = $.jqplot(
		'SleepGraph2',
		[
			[
<?php
	$ReverseSleepData = array_reverse( $SleepData );
	foreach( $ReverseSleepData as $sd ){
		echo( '[' . $sd['hour'] . ',"' . $sd['date'] . '"],' );
	}		

	// データが無いとき
	if( count( $ReverseSleepData ) == 0 ){
		echo( '[0,0-0-0]' );
	}
?>
			]
		],
		{
			seriesDefaults: {
				renderer: $.jqplot.BarRenderer,
				pointLabels: {
					show: true,
					location: 'w'
				},
				rendererOptions: {
					barDirection: 'horizontal'
				}
			},
			axes: {
				xaxis: {
				},
				yaxis: {
					renderer: $.jqplot.CategoryAxisRenderer	
				}
			}
		}
	);

	var plot3 = $.jqplot(
		'SleepGraph3',
		[
			[
<?php
	$GoodnightData1 = array();
	foreach( $GoodnightArray as $ga ){
		if( isset( $ga['jsonobj']->catch ) ){
			if( $ga['jsonobj']->catch != '' ){
				$datetime = DateTime::createFromFormat( 'Y-m-d H:i:s', $ga['jsonobj']->catch );
				if( isset( $GoodnightData1[$datetime->format('H')] ) == false ){
					$GoodnightData1[$datetime->format('H')] = 0;
				}
				$GoodnightData1[$datetime->format('H')] ++;
			}
		}
	}

	foreach( $GoodnightData1 as $key => $value ){
		echo( '[' . $key . ',' . $value . '],' );
	}

	// データが無いとき
	if( count( $GoodnightData1 ) == 0 ){
		echo( '[0,0]' );
	}
?>
			]
		],
		{
			gridPadding: {top: 0, bottom: 38, left: 0, right: 0 },
			seriesDefaults: {
				renderer: $.jqplot.PieRenderer,
				trendline: { show: false },
				rendererOptions: {
					padding: 8,
					dataLabels: 'percent',
					showDataLabels: true
				}
			},
			legend: {
				show: true,
				placement: 'inside',
				rendereroptions: {
					numberrows: 1
				},
				location: 'ne',
				margintop: '15px'
			}
		}
	);

	var plot4 = $.jqplot(
		'WakeupGraph1',
		[
			[
<?php
	$WakeupData1 = array();
	foreach( $MorningArray as $ma ){
		if( isset( $ma['jsonobj']->catch ) ){
			if( $ma['jsonobj']->catch != '' ){
				$datetime = DateTime::createFromFormat( 'Y-m-d H:i:s', $ma['jsonobj']->catch );
				if( isset( $WakeupData1[$datetime->format('H')] ) == false ){
					$WakeupData1[$datetime->format('H')] = 0;
				}
				$WakeupData1[$datetime->format('H')] ++;
			}
		}
	}

	foreach( $WakeupData1 as $key => $value ){
		echo( '[' . $key . ',' . $value . '],' );
	}

	// データが無い時
	if( count( $WakeupData1 ) == 0 ){
		echo( '[0,0]' );
	}
?>
			]
		],
		{
			gridPadding: {top: 0, bottom: 38, left: 0, right: 0 },
			seriesDefaults: {
				renderer: $.jqplot.PieRenderer,
				trendline: { show: false },
				rendererOptions: {
					padding: 8,
					dataLabels: 'percent',
					showDataLabels: true
				}
			},
			legend: {
				show: true,
				placement: 'inside',
				rendereroptions: {
					numberrows: 1
				},
				location: 'ne',
				margintop: '15px'
			}
		}
	);

	var plot5 = $.jqplot(
		'AllGraph1',
		[
			[
<?php
	foreach( $MorningArray as $ma ){
		if( isset( $ma['jsonobj']->catch ) ){
			if( $ma['jsonobj']->catch != '' ){
				$datetime = DateTime::createFromFormat( 'Y-m-d H:i:s', $ma['jsonobj']->catch );
				$beforetime = DateTime::createFromFormat( 'Y-m-d H:i:s', $ma['jsonobj']->beforetime );
				echo( '[' . $datetime->format( 'H' ) . ',"' . $datetime->format( 'Y-m-d' ) . '"],' );
			}
		}
	}

	// データが無い時
	if( count( $MorningArray ) == 0 ){
		echo( '[0,0-0-0]' );
	}
?>
			],[
<?php
	foreach( $GoodnightArray as $ga ){
		if( isset( $ga['jsonobj']->catch ) ){
			if( $ga['jsonobj']->catch != '' ){
				$datetime = DateTime::createFromFormat( 'Y-m-d H:i:s', $ga['jsonobj']->catch );
				$beforetime = DateTime::createFromFormat( 'Y-m-d H:i:s', $ga['jsonobj']->beforetime );
				echo( '[' . $datetime->format( 'H' ) . ',"' . $datetime->format( 'Y-m-d' ) . '"],' );
			}
		}
	}

	// データが無い時
	if( count( $GoodnightArray ) == 0 ){
		echo( '[0,0-0-0]' );
	}
?>
			],[
<?php
	foreach( $MorningDrugArray as $mda ){
		if( isset( $mda['jsonobj']->catch ) ){
			if( $mda['jsonobj']->catch != '' ){
				$datetime = DateTime::createFromFormat( 'Y-m-d H:i:s', $mda['jsonobj']->catch );
				$beforetime = DateTime::createFromFormat( 'Y-m-d H:i:s', $mda['jsonobj']->beforetime );
				echo( '[' . $datetime->format( 'H' ) . ',"' . $datetime->format( 'Y-m-d' ) . '"],' );
			}
		}
	}
	// データが無い時
	if( count( $MorningArray ) == 0 ){
		echo( '[0,0-0-0]' );
	}
?>
			],[
<?php
	foreach( $AfternoonDrugArray as $ada ){
		if( isset( $ada['jsonobj']->catch ) ){
			if( $ada['jsonobj']->catch != '' ){
				$datetime = DateTime::createFromFormat( 'Y-m-d H:i:s', $ada['jsonobj']->catch );
				$beforetime = DateTime::createFromFormat( 'Y-m-d H:i:s', $ada['jsonobj']->beforetime );
				echo( '[' . $datetime->format( 'H' ) . ',"' . $datetime->format( 'Y-m-d' ) . '"],' );
			}
		}
	}
	// データが無い時
	if( count( $AfternoonDrugArray ) == 0 ){
		echo( '[0,0-0-0]' );
	}
?>
			],[
<?php
	foreach( $EveningDrugArray as $eda ){
		if( isset( $eda['jsonobj']->catch ) ){
			if( $eda['jsonobj']->catch != '' ){
				$datetime = DateTime::createFromFormat( 'Y-m-d H:i:s', $eda['jsonobj']->catch );
				$beforetime = DateTime::createFromFormat( 'Y-m-d H:i:s', $eda['jsonobj']->beforetime );
				echo( '[' . $datetime->format( 'H' ) . ',"' . $datetime->format( 'Y-m-d' ) . '"],' );
			}
		}
	}
	// データが無い時
	if( count( $EveningDrugArray ) == 0 ){
		echo( '[0,0-0-0]' );
	}
?>
			],[
<?php
	foreach( $GoodnightDrugArray as $gda ){
		if( isset( $gda['jsonobj']->catch ) ){
			if( $gda['jsonobj']->catch != '' ){
				$datetime = DateTime::createFromFormat( 'Y-m-d H:i:s', $gda['jsonobj']->catch );
				$beforetime = DateTime::createFromFormat( 'Y-m-d H:i:s', $gda['jsonobj']->beforetime );
				echo( '[' . $datetime->format( 'H' ) . ',"' . $datetime->format( 'Y-m-d' ) . '"],' );
			}
		}
	}
	// データが無い時
	if( count( $GoodnightDrugArray ) == 0 ){
		echo( '[0,0-0-0]' );
	}
?>
			]
		],
		{
			axes: {
				xaxis: {
					max: 24,
					min: 0,
					label: '時'
					//renderer: $.jqplot.CategoryAxisRenderer	
				},
				yaxis: {
					//renderer: $.jqplot.CategoryAxisRenderer	
					renderer: $.jqplot.DateAxisRenderer,
					tickOptions:{ formatString: '%Y-%m-%d' },
					label: '日付'
				}
			},
			series: [
				{	// 起床時刻
					showLine: false,
					markerOptions: { size: 14, style: 'filledSquare' }
				},
				{	// 就寝時刻
					showLine: false,
					markerOptions: { size: 14, style: 'filledSquare' }
				},
				{	// 朝服薬時刻
					showLine: false,
					markerOptions: { size: 7, style: 'filledSquare' }
				},
				{	// 昼服薬時刻
					showLine: false,
					markerOptions: { size: 14, style: 'filledSquare' }
				},
				{	// 夕服薬時刻
					showLine: false,
					markerOptions: { size: 14, style: 'filledSquare' }
				},
				{	// 眠前服薬時刻
					showLine: false,
					markerOptions: { size: 7, style: 'filledSquare' }
				}
			],
			legend: {
				show: true,
				placement: 'outside',
				labels: [ '起床時刻', '就寝時刻', '朝服薬時刻', '昼服薬時刻', '夕服薬時刻', '眠前服薬時刻' ]
			},
		}
	);

	var plot6 = $.jqplot(
		'PotionGraph1',
		[
			[
<?php
	$PotionData1 = array();
	foreach( $DrinkPotionArray as $dpa ){
		$datetime = DateTime::createFromFormat( 'Y-m-d H:i:s', $dpa['datetime'] );
		if( isset( $PotionData1[$dpa['jsonobj']] ) == false ){
			$PotionData1[$dpa['jsonobj']] = 0;
		}
		$PotionData1[$dpa['jsonobj']] ++;
	}

	foreach( $PotionData1 as $key => $value ){
		echo( '["' . $key . '",' . $value . '],' );
	}

	// データが無い時
	if( count( $PotionData1 ) == 0 ){
		echo( '[0,0]' );
	}
?>
			]
		],
		{
			gridPadding: {top: 0, bottom: 38, left: 0, right: 0 },
			seriesDefaults: {
				renderer: $.jqplot.PieRenderer,
				trendline: { show: false },
				rendererOptions: {
					padding: 8,
					dataLabels: 'percent',
					showDataLabels: true
				}
			},
			legend: {
				show: true,
				placement: 'inside',
				rendereroptions: {
					numberrows: 1
				},
				location: 'ne',
				margintop: '15px'
			}
		}
	);

	var plot7 = $.jqplot(
		'PotionGraph2',
		[
			[
<?php
	$data1 = array();
	for( $i=0; count($HavePotionData)>$i; $i+=2 ){
		array_push( $data1, array(
			'key' => $HavePotionData[$i],
			'value' => $HavePotionData[$i+1]
		));
	}

	// ソート
	array_multisort( array_column( $data1, 'value' ), SORT_ASC, $data1 );

	foreach( $data1 as $d1 ){
		echo( '[' . $d1['value'] . ',"' . $d1['key'] . '"],' );
	}

	// データが無い場合
	if( count( $data1 ) == 0 ){
		echo( '[0,0]' );
	}
?>
			]
		],
		{
			seriesDefaults: {
				renderer: $.jqplot.BarRenderer,
				pointLabels: {
					show: true,
					location: 'w'
				},
				rendererOptions: {
					barDirection: 'horizontal'
				}
			},
			axes: {
				xaxis: {
				},
				yaxis: {
					renderer: $.jqplot.CategoryAxisRenderer	
				}
			}
		}
	);

	var plot8 = $.jqplot(
		'AllPotionGraph1',
		[
			[
<?php
	foreach( $DrinkPotionArray as $dpa ){
		$datetime = DateTime::createFromFormat( 'Y-m-d H:i:s', $dpa['datetime'] );
		echo( '[' . $datetime->format( 'H' ) . ',"' . $datetime->format( 'Y-m-d' ) . '","' . $dpa['jsonobj'] . '"],' ); 
	}
?>
			]
		],
		{
			seriesDefaults: {
				pointLabels: {
					show: true,
					location: 'e',
					formatString: '%s',
					edgeTolerance: -200
				},
				rendererOptions: {
				}
			},
			axes: {
				xaxis: {
					max: 24,
					min: 0,
					label: '時'
					//renderer: $.jqplot.CategoryAxisRenderer	
				},
				yaxis: {
					//renderer: $.jqplot.CategoryAxisRenderer	
					renderer: $.jqplot.DateAxisRenderer,
					tickOptions:{ formatString: '%Y-%m-%d' },
					label: '日付'
				}
			},
			series: [
				{	// 起床時刻
					showLine: false,
					markerOptions: { size: 14, style: 'filledSquare' }
				},
<?php
	for( $i=0; $i<50; $i++ ){
		echo( '{' );
		echo( 'showLine: false,' );
		echo( 'markerOptions: { size: 14, style: "filledSquare" }' );
		echo( '},' );
	}
?>
			],
			legend: {
				show: false,
				placement: 'outside',
				labels: [ '' ]
			},
		}
	);
});	// document.ready()

</script>
</head>

<body>
<?php
	//debug( $DrinkPotionArray );
	//debug( $PotionData1 );
	//debug( $data1 );
	
	for( $i=0; count($MorningArray)>$i; ++$i ){

		// $morning = array(
		// 	'maindata' => EventData&User&Nickname,
		// 	'jsonobj' => json_data(object)
		// 	)
		$morning = $MorningArray[$i];

		if( isset( $morning['jsonobj']->catch ) ){
			if( $morning['jsonobj']->catch != '' ){
				//echo( $morning['jsonobj']->catch . ' に起床しました。<BR>' );
			}
		}
	}	

	for( $i=0; count($GoodnightArray)>$i; ++$i ){

		$goodnight = $GoodnightArray[$i];

		if( isset( $goodnight['jsonobj']->catch ) ){
			if( $goodnight['jsonobj']->catch != '' ){
				//echo( $goodnight['jsonobj']->catch . ' に就寝しました。<BR>' );
			}
		}

		
		// 意味の無いコードここから
		// catch が存在しているかつ
		if( isset( $goodnight['jsonobj']->catch ) ){
			// catch に代入されている
			if( $goodnight['jsonobj']->catch != '' ){
				// 就寝時刻オブジェクトを生成
				$goodnight_date = DateTime::createFromFormat(
					'Y-m-d H:i:s',
					$goodnight['jsonobj']->catch
				);

				// 1日多い起床
				// 就寝時刻が23時以内
				if( $goodnight_date->format( 'H' ) <= 23 ){	// この条件じゃだめぽ

				}

			}
		}
		// 意味の無いコードここまで
		
	} // for( $i=0; count($GoodnightArray)>$i; ++$i )

	// ユーザーネームを表示
	//debug( $UserData );
	echo( '<div class="report-header1">ニックネーム：' . $UserData['nickname'] . 'さんの総合レポートを表示しています。</div>' );
	echo( '<div class="report-text1">直近14日間のデータが表示されています。</div>' );

	//debug( $BlogData );
	// 最近の日記・Blogを表示する
	echo( '<div class="report-header1">最近の日記・Blog</div>' );
	echo( '<div class="report-text1">' );
	echo( '<table border="1" width="600">' );
	echo( '<tr><th width="200">投稿日時</th><th>内容</th></tr>' );
	foreach( $BlogData as $bd ){
		$beforedate = date( 'Y-m-d', strtotime( '-14 day' ) );
		$targetdate = DateTime::createFromFormat( 'Y-m-d H:i:s', $bd['BlogTable']['modified'] );
		$targetdate = $targetdate->format( 'Y-m-d' );
		if( strtotime( $targetdate ) < strtotime( $beforedate ) ){
			continue;
		}
		echo( '<tr><th>' . $bd['BlogTable']['modified'] . '</th><td>' . $bd['BlogTable']['text'] . '</td></tr>' );
	}
	echo( '</table>' );
	echo( '</div>' );

	// 服薬状態一覧表を作成
	echo( '<div class="report-header1">服薬状態一覧表</div>' );
	echo( '<div class="report-text1">' );
	echo( '<table border="1" width="600">' );
	echo( '<tr><th>日付</th><th width="100">朝</th><th width="100">昼</th><th width="100">夕</th><th width="100">眠前</th></tr>' );

	foreach( $MorningDrugArray as $mda ){
		$nowdate = DateTime::createFromFormat( 'Y-m-d H:i:s', $mda['jsonobj']->beforetime );
		$flag1 = false;
		if( isset( $mda['jsonobj']->catch ) ){
			echo( '<tr>' );
			echo( '<th>' . $nowdate->format( 'Y-m-d' ) . '</th>' );
			if( $mda['jsonobj']->catch != '' ){
				echo( '<th>○</th>' );
				$flag1 = true;
			}
			else{
				echo( '<th>?</th>' );
				$flag1 = true;
			}
		}

		if( $flag1 == true )
		foreach( $AfternoonDrugArray as $ada ){
			$adadate = DateTime::createFromFormat( 'Y-m-d H:i:s', $ada['jsonobj']->beforetime );
			$flag2 = false;
			if( $nowdate->format( 'Y-m-d' ) == $adadate->format( 'Y-m-d' ) ){
				if( $ada['jsonobj']->catch != '' ){
					echo( '<th>○</th>' );
					$flag2 = true;
				}
				else{
					echo( '<th>?</th>' );
					$flag2 = true;
				}
			}

			if( $flag2 == true )
			foreach( $EveningDrugArray as $eda ){
				$edadate = DateTime::createFromFormat( 'Y-m-d H:i:s', $eda['jsonobj']->beforetime );
				$flag3 = false;
				if( $nowdate->format( 'Y-m-d' ) == $edadate->format( 'Y-m-d' ) ){
					if( $eda['jsonobj']->catch != '' ){
						echo( '<th>○</th>' );
						$flag3 = true;
					}
					else{
						echo( '<th>?</th>' );
						$flag3 = true;
					}
				}
			
				if( $flag3 == true )
				foreach( $GoodnightDrugArray as $gda ){
					$gdadate = DateTime::createFromFormat( 'Y-m-d H:i:s', $gda['jsonobj']->beforetime );
					if( $nowdate->format( 'Y-m-d' ) == $gdadate->format( 'Y-m-d' ) ){
						if( $gda['jsonobj']->catch != '' ){
							echo( '<th>○</th>' );
						}
						else{
							echo( '<th>?</th>' );
						}
			
						echo( '</tr>' );
					}
				}
			}
		}
	}

	echo( '</table>' );
	echo( '</div>' );

?>
<div style="height: 380px; width: 340px; float: left;">
<div class="report-header1">睡眠時間の割合(単位：時間)</div>
<div class="report-text1">
<div id="SleepGraph1" style="height: 300px; width: 300px;"></div>
</div>
</div>

<div style="height: 380px; width: 340px; float: left;">
<div class="report-header1">日別の睡眠時間(単位：時間)</div>
<div class="report-text1">
<div id="SleepGraph2" style="height: 300px; width: 300px;"></div>
</div>
</div>

<div style="clear: left;"></div>

<div style="height: 380px; width: 340px; float: left;">
<div class="report-header1">就寝時刻の割合(単位：時)</div>
<div class="report-text1">
<div id="SleepGraph3" style="height: 300px; width: 300px;"></div>
</div>
</div>

<div style="height: 380px; width: 340px; float: left;">
<div class="report-header1">起床時刻の割合(単位：時)</div>
<div class="report-text1">
<div id="WakeupGraph1" style="height: 300px; width: 300px;"></div>
</div>
</div>

<div style="clear: left;"></div>

<div class="report-header1">就寝、起床、服薬を含めたグラフ</div>
<div class="report-text1">
<div id="AllGraph1" style="height: 300px; width: 600px;"></div>
</div>

<div style="height: 380px; width: 340px; float: left;">
<div class="report-header1">服用している頓服薬の割合</div>
<div class="report-text1">
<div id="PotionGraph1" style="height: 300px; width: 300px;"></div>
</div>
</div>

<div style="height: 380px; width: 340px; float: left;">
<div class="report-header1">頓服薬の残っている数</div>
<div class="report-text1"
<div id="PotionGraph2" style="height: 300px; width: 300px;"></div>
</div>
</div>

<div style="clear: left;"></div>

<div class="report-header1">頓服薬の服用時刻一覧</div>
<div class="report-text1">
<div id="AllPotionGraph1" style="height: 300px; width: 600px;"></div>
</div>

<div class="report-header1">頓服薬の服用時刻一覧</div>
<div class="report-text1">
<?php
	echo( '<table border="1" width="600">' );
	echo( '<tr><th>日時</th><th>頓服名</th></tr>' );
	$DrinkPotionArrayReverse = array_reverse( $DrinkPotionArray );
	foreach( $DrinkPotionArrayReverse as $dpa ){
		echo( '<tr><th>' . $dpa['datetime'] . '</th><th>' . $dpa['jsonobj'] . '</th></tr>' );
	}
	echo( '</table>' );

?>
</div>

</body>
</html>
