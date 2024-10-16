<!--
<p>ネットケアページ</p>
  
<H1>テスト用3Dチャットスペース</H1>

<P>現在、開発中です。<BR>
ニックネームのみのログインが可能です。<BR>
</P>

<FORM action="/green/HealingForest/logingame" method="post">
	<P>ニックネーム：<INPUT type="text" name="nickname" value="名無しさん" size="15"></P>
	<INPUT type="submit" value="LOGIN">
</FORM>
-->

<!-- <meta name="viewport" content="width=device-width, initial-scale=1.0"> -->

<div id="canvas_screen_area">
<!-- <canvas id="text_canvas" width="640" height="480" style="position:absolute; top:0px; left:0px;"> -->
<canvas id="main_canvas" style="position: absolute;"></canvas>
<canvas id="text_canvas" style="position: absolute;"></canvas>
</div>
<div id="global_chat_area" style="z-index: 2; position: absolute;">
<input type="text" size="30" id="global_chat_text" >
</div>
