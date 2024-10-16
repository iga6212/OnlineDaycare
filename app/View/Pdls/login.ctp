<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>PDLS-Login</title>
	<style type="text/css">

		
		body{
			background-image: url("<?php echo $this->Html->url('/img/login_bg.jpg'); ?>");
			background-size: cover;
		}			
		
		
		#form{
			background-color: #CCFFCC;
			padding: 10px;
			position: absolute;
			top: 25%;
			left: 40%;
			border-radius: 10px;
			/* text-shadow: 2px 2px 1px #999999; */
		}
		
		#detail{
			background-color: #CCFFCC;
			padding: 10px;
			position: absolute;
			top: 25%;
			left: 25%;
			border-radius: 10px;
			/* text-shadow: 2px 2px 1px #999999; */
		}
	
	</style>
	<script type="text/javascript">

	</script>
</head>
<body>
<?php 
	//echo( 'This file is login.ctp' );


?>
	
<div id="form">
	<form action="login" method="post">
		<p>Personal Data Viewer</p>
		<p>ログインページ</p>
	
		<p>Username</p>
		<p class="ID"><input type="text" name="data[User][username]" /></p>
		<p>Password</p>
		<p class="pass"><input type="password" name="data[User][password]" /></p>
		<p class="submit"><input type="submit" value="Login" /></p>
	</form>
</div>

</body>
</html>
