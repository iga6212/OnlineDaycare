
<p>通知メール設定</p>

<p>通知メール送信先：<input type="text" size="26" id="notice_mailaddress"></p>

<p>起床・就寝通知メール設定</p>

<p>おはようメール有効：<input type="checkbox" name="morning" value="morning_mail_enable" id="morning"></p>

<p>
起床時刻(3時～11時)：
<select name="morning_hour" id="morning_hour">
<?php
	for( $i=3; $i <= 11; ++ $i ){
		if( $i == 7 ){
			echo( '<option value="' . $i . '" selected>' . $i . '時</option>' );
		}else{
			echo( '<option value="' . $i . '">' . $i . '時</option>' );
		}
	}
?>
</select>
</p>


<p>おやすみメール有効：<input type="checkbox" name="goodnight" value="goodnight_mail_enable" id="goodnight"></p>

<p>
就寝時刻(18時～23時)：
<select name="goodnight_hour" id="goodnight_hour">
<?php
	for( $i=18; $i <= 23; ++ $i ){
		if( $i == 22 ){
			echo( '<option value="' . $i . '" selected>' . $i . '時</option>' );
		}else{
			echo( '<option value="' . $i . '">' . $i . '時</option>' );
		}
	}
?>
</select>
</p>

<p>おくすり服用通知メール設定</p>

<p>朝食後のおくすりメール有効：<input type="checkbox" name="morning_drug" value="morning_drug_mail_enable" id="morning_drug"></p>

<p>
朝食後のおくすりメール送信時刻(3時～11時)：
<select name="morning_drug_mail_hour" id="morning_drug_mail_hour">
<?php
	for( $i=3; $i <= 11; ++ $i ){
		if( $i == 7 ){
			echo( '<option value="' . $i . '" selected>' . $i . '時</option>' );
		}else{
			echo( '<option value="' . $i . '">' . $i . '時</option>' );
		}
	}
?>
</select>
</p>

<p>昼食後のおくすりメール有効：<input type="checkbox" name="afternoon_drug" value="afternoon_drug_mail_enable" id="afternoon_drug"></p>

<p>
昼食後のおくすりメール送信時刻(12時～15時)：
<select name="afternoon_drug_mail_hour" id="afternoon_drug_mail_hour">
<?php
	for( $i=12; $i <= 15; ++ $i ){
		if( $i == 12 ){
			echo( '<option value="' . $i . '" selected>' . $i . '時</option>' );
		}else{
			echo( '<option value="' . $i . '">' . $i . '時</option>' );
		}
	}
?>
</select>
</p>

<p>夕食後のおくすりメール有効：<input type="checkbox" name="evening_drug" value="evening_drug_mail_enable" id="evening_drug"></p>

<p>
夕食後のおくすりメール送信時刻(16時～22時)：
<select name="evening_drug_mail_hour" id="evening_drug_mail_hour">
<?php
	for( $i=16; $i <= 22; ++ $i ){
		if( $i == 18 ){
			echo( '<option value="' . $i . '" selected>' . $i . '時</option>' );
		}else{
			echo( '<option value="' . $i . '">' . $i . '時</option>' );
		}
	}
?>
</select>
</p>

<p>眠前のおくすりメール有効：<input type="checkbox" name="goodnight_drug" value="goodnight_drug_mail_enable" id="goodnight_drug"></p>

<p>
眠前のおくすりメール送信時刻(21時～23時)：
<select name="goodnight_drug_mail_hour" id="goodnight_drug_mail_hour">
<?php
	for( $i=21; $i <= 23; ++ $i ){
		if( $i == 22 ){
			echo( '<option value="' . $i . '" selected>' . $i . '時</option>' );
		}else{
			echo( '<option value="' . $i . '">' . $i . '時</option>' );
		}
	}
?>
</select>
</p>

<p><input type="button" value="変更を保存" onclick="ChangeMailSetting();"></p>
