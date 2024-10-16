<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>PDLS-Login</title>
	<style type="text/css">
			
		
		
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
		<p>Personal Data Browser</p>
		<p>ログインページ</p>
	
		<p>ID</p>
		<p class="ID"><input type="text" name="User.username" /></p>
		<p>Password</p>
		<p class="pass"><input type="password" name="User.password" /></p>
		<p class="submit"><input type="submit" value="Login" /></p>
	</form>
</div>
<?php 
	echo $this->Form->create( 'User' );
	echo $this->Form->input( 'User.username' );
	echo $this->Form->input( 'User.password' );
	echo $this->Form->end( 'Login' );
?>


</body>
</html>
