<!DOCTYPE html>
<!-- プロフィール変更フォームからPOSTした後に表示するページ -->
<html>
<head>
	<meta charset="UTF-8">
	<title>Farbe-relogin</title>
	<?php
		echo $this->Html->css( 'main.css' ); 
		echo $this->Html->script( 'jquery-3.1.0.js' ); 

		echo $this->Html->script( 'header.js' ); 
		echo $this->Html->script( 'blog_page.js' );
		echo $this->Html->script( 'bbs_page.js' );
		echo $this->Html->script( 'setting_page.js' );

		echo $this->Html->script( 'murmurHash3.js' );
		echo $this->Html->script( 'utf.js' );
		echo $this->Html->script( 'base64.js' );
		echo $this->Html->script( 'deflate.js' );
		echo $this->Html->script( 'inflate.js' );
		echo $this->Html->script( 'md5.js' );
		echo $this->Html->script( 'library1.js' );
		echo $this->Html->script( 'three.js' );
		echo $this->Html->script( 'ColladaLoader.js' );
		echo $this->Html->script( 'FirstPersonControls.js' );
		echo $this->Html->script( 'Projector.js' );
	?>
	<script>
		alert( '変更を適用するために、再ログインしてください。' );
		location.href = '/green/farbe/logout';
		location.href = '/green/farbe/login';
	</script>
</head>
<body>
<?php echo $this->element( 'header' ); ?>
	
<p>変更を適用するために、再ログインしてください。</p>

<?php echo $this->element( 'footer' ); ?>
</body>
</html>
