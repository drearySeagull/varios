<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');
// Motrar todos los errores de PHP
error_reporting(E_ALL);
// Motrar todos los errores de PHP
error_reporting(-1);
// Motrar todos los errores de PHP
ini_set('error_reporting', E_ALL);
require("bd.php");

if(isset($_GET["url"])){
	$datos = $_GET["url"];
	$datos = base64_decode($datos);
	$datos = explode("+", $datos);
	$correo = $datos[0];
	$id = $datos[1];

	if($dbc = conexionBd()){
		$sql = "SELECT confirmado FROM usuarios WHERE id_usuario = '".$id."' AND correo LIKE '".$correo."'";
		$resultado = mysqli_query($dbc, $sql);
		if($resultado){
			if(mysqli_num_rows($resultado) > 0){
				if($fila = mysqli_fetch_assoc($resultado)){
					if($fila["confirmado"] == 1){
						echo "Esta cuenta ya ha sido confirmada";
					}else{
						$sql = "UPDATE usuarios SET confirmado = 1 WHERE id_usuario = '".$id."' AND correo LIKE '".$correo."'";
						$resultado = mysqli_query($dbc, $sql);
						if(mysqli_affected_rows($dbc) > 0){
							echo "Cuenta confirmada correctamente";
						}else{
							echo "Algo no salio bien, recargue la pagina.";
						}
					}
				}
			}else{
				echo "Algo no salio bien, pinche de nuevo en el enlace enviado.";
			}
		}else{
			echo "Algo no salio bien, recargue la pagina.";
		}
	}else{
		echo "Algo no salio bien, recargue la pagina.";
	}
}else{
	echo "Algo no salio bien, recargue la pagina.";
}
?>