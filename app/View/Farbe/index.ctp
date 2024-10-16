<html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<!-- <link rel="manifest" href="/green/manifest/netcare-manifest.json"> -->
	<title>Farbe-top</title>
	<script type="text/javascript">
		// PACE.js options
		paceOptions = {
			ajax: true,
			document: true,
			eventLag: true,
			elements: {
				selectors: []
			}
		};
	</script>
	<?php
		///////////////
		// CSS files
		///////////////
		echo $this->Html->css( 'main.css' ); 
		echo $this->Html->css( 'pace-theme.css' );
		echo $this->Html->css( 'jquery-ui.css' );

		///////////////
		// JS files
		///////////////
		echo $this->Html->script( 'jquery-3.1.0.js' ); 
		echo $this->Html->script( 'jquery-ui.js' );
		echo $this->Html->script( 'pace.min.js' );
		//echo $this->Html->script( 'underscore-min.js' );
		//echo $this->Html->script( 'lodash.core.js' );		// _.cloneDeep が無い
		echo $this->Html->script( 'lodash.js' );
		echo $this->Html->script( 'clone.js' );
		echo $this->Html->script( 'socket.io.js' );

		echo $this->Html->script( 'header.js' ); 
		echo $this->Html->script( 'blog_page.js' );
		echo $this->Html->script( 'bbs_page.js' );
		echo $this->Html->script( 'setting_page.js' );
		echo $this->Html->script( 'nextcare_page.js' );

		echo $this->Html->script( 'library1.js' );

		// echo $this->Html->script( 'threejs-dev/build/three.js' );
		// echo $this->Html->script( 'threejs-dev/examples/js/renderers/Projector.js' );	
		// echo $this->Html->script( 'threejs-dev/examples/js/BlendCharacter.js' );
		//
		// echo $this->Html->script( 'threejs-dev/examples/js/loaders/ColladaLoader.js' );
		//
		// echo $this->Html->script( 'threejs-dev/examples/js/shaders/CopyShader.js' );
		// echo $this->Html->script( 'threejs-dev/examples/js/shaders/ConvolutionShader.js' );
		// echo $this->Html->script( 'threejs-dev/examples/js/shaders/LuminosityHighPassShader.js' );
		// echo $this->Html->script( 'threejs-dev/examples/js/postprocessing/EffectComposer.js' );
		// echo $this->Html->script( 'threejs-dev/examples/js/postprocessing/RenderPass.js' );
		// echo $this->Html->script( 'threejs-dev/examples/js/postprocessing/ShaderPass.js' );
		// echo $this->Html->script( 'threejs-dev/examples/js/postprocessing/BloomPass.js' );
		// echo $this->Html->script( 'threejs-dev/examples/js/postprocessing/UnrealBloomPass.js' );
		//
		// echo $this->Html->script( 'threejs-dev/examples/js/controls/DeviceOrientationControls.js' );
		// echo $this->Html->script( 'threejs-dev/examples/js/effects/StereoEffect.js' );
		// echo $this->Html->script( 'threejs-dev/examples/js/cameras/StereoCamera.js' );

		//echo $this->Html->script( 'ammo.js' );
	?>

</head>
<body>


<div id="root-containts">
<?php echo $this->element( 'header' ); ?>

<div id="main-containts" class="basic-font1">
<div id="site-top">
<p>Farbeへようこそ！</p>
<!-- Farbeでは精神障がいをお持ちの方に、楽しいコミュニティを提供することを目指しています。 -->
</div><!-- site-top -->
<div class="blog-news">
<p>最新の日記・Blog記事</p>
<?php
	// ３件分の最新Blog記事から文字を切り取る
	foreach( $NewestBlogData as $BlogData ){
		if( mb_strlen( $BlogData['BlogTable']['text'], 'UTF-8' ) >= 10 ){
			$blogtext = mb_substr( $BlogData['BlogTable']['text'], 0, 10, 'UTF-8' );
		}
		else{
			$blogtext = $BlogData['BlogTable']['text'];
		}
		echo( '<div class="blog_news_line1" onclick="ViewBlog(' . $BlogData['User']['id'] . ')">' .  $blogtext . '・・・' . '</div>' );
	}
?>
</div><!-- blog-news -->

<div class="netcare-info">
<p>ネットケア情報</p>
現在の接続者数：<?php echo( $LinkNum ); ?>
</div><!-- netcare-info -->
</div><!-- main-containts -->

<?php echo $this->element( 'footer' ); ?>
</div><!-- root-containts -->

<div id="hidden-area" style="display: none;">
</div><!-- hidden-area -->

</body>
</html>
