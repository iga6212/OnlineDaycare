<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width; initial-scale=1.0">
	<title>Farbe-login</title>
	<style type="text/css">
		
		@media only screen and (min-width: 700px) and (max-width: 2000px){
			html{
				/*
				background-image: url( "/green/img/rendered1.png" );
				background-position: center center;
				background-repeat: no-repeat;
				background-attachment: fixed;	
				background-size: cover;
				background-color: #464646;
				*/
				min-height: 100%;
				background: url( "/green/img/rendered1.png" ) no-repeat center;
				background-size: cover;
			}
		}

		@media only screen and (min-width: 100px) and (max-width: 699px){
			html{
				min-height: 100%;
				background: url( "/green/img/rendered1.png" ) no-repeat center;
				background-size: cover;
			}
			/*
			body::before{
				background: url( "/green/img/rendered1.png" ) no-repeat left top;
				background-size: 100% auto;
				display: block;
				position: fixed;
				top 0;
				left 0;
				width: 100%;
				height: 100%;
				padding-bottom: 108px;
				content: "";
				z-index: -1;
			}
			*/
		}

		.form{
			background-color: #CCFFCC;
			padding: 10px;
			position: absolute;
			top: 25%;
			left: 40%;
			border-radius: 10px;
			/* text-shadow: 2px 2px 1px #999999; */
			box-shadow: 0px 0px 6px 3px #444444;
		}

		.fontstyle1{
			font-family: Consolas;
		}

		.inputbox1{
			width: 150px;
		}

	</style>
</head>
<body>

<div class="form fontstyle1">
<form action="/green/Farbe/login" method="post">
<p>Farbe-Loginpage</p>
<p>ID:<input type="text" name="data[User][username]" value="" class="inputbox1"></p>
<p>PS:<input type="password" name="data[User][password]" value="" class="inputbox1"></p>
<p><input type="submit" value="LOGIN"></p>
</form>
</div>

</body>
</html>
