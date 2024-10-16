<?php 
	echo $this->Html->script( 'murmurHash3.js' );
	echo $this->Html->script( 'utf.js' );
	echo $this->Html->script( 'base64.js' );
	echo $this->Html->script( 'deflate.js' );
	echo $this->Html->script( 'inflate.js' );
	echo $this->Html->script( 'md5.js' );
	echo $this->Html->script( 'library1.js' );
	echo $this->Html->script( 'jquery-3.1.0.js' );
?>

<script>
function GetDateTime(){
	var dateobj = new Date();
	var datetime =
		dateobj.getYear() + "-" + dateobj.getMonth() + "-" +
		dateobj.getDay() + " " + dateobj.getHours() + ":" +
		dateobj.getMinutes() + ":" + dateobj.getSeconds();
	return( datetime );
}

$(document).ready(function(){
	var jsstr = "<?php echo $str; ?>";
	var jshash = jsstr.hashCode();
	jsstr = "js-str:" + jsstr + "<BR>";
	jsstr = jsstr + "jshash:" + jshash + "<BR>";
	$('#textarea').append( jsstr );

	// テストイベントデータ
	var senddata = [];
	senddata.push({
		"datetime": GetDateTime(),
		"userid": -1,
		"eventid": "PostNowTime".hashCode(),
		"data": GetDateTime()
	});
	senddata.push({
		"datetime": GetDateTime(),
		"userid": -1,
		"eventid": "PostComment".hashCode(),
		"data": "Comment test."
	});
	senddata.push({
		"datetime": GetDateTime(),
		"userid": -1,
		"eventid": "PostManyData".hashCode(),
		"data":["str1", "str2"]
	});
	senddata.push({
		"datetime": GetDateTime(),
		"userid": -1,
		"eventid": "PostManyObject".hashCode(),
		"data":[
				{"px":100, "py":200},
				{"px":200, "py":300}
				]
	});
	// Ajax で Post 処理
	$.ajax({
		"type": "POST",
		"url": "/green/HealingForest/PostGetMessages",
		"data":{ "eventdata": JSON.stringify( senddata ) },
		"success": function( eventdata ){
			eventdata = $.parseJSON( eventdata );
			for( var i  in eventdata ){
				$("#textarea").append(
						"datetime:" + eventdata[i].datetime + "<BR>" +
						"userid:" + eventdata[i].userid + "<BR>" +
						"eventid:" + eventdata[i].eventid + "<BR>" +
						"data:" + eventdata[i].data + "<BR>"
				);
			}
		}
	});
		
});
</script>

<div id="textarea">
<?php 
	echo( '$str=' . $str );
	echo( '<BR>' );
	echo( '$hash=' . $hash );
	echo( '<BR>' );
?>
</div>