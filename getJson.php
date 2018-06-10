<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
require("conection.php");

if(isset($_GET["app"])){
	if(isset($_GET["tarea"])){
		if($_GET['tarea']=='app'){
			descargaApp();	
		}
		else if($_GET["tarea"] == "plantilla"){
			devuelvePlantilla();
		}
		else if($_GET["tarea"]== "categoria"){
			devImgCat();
		}
		
	}

	if(isset($_GET["pagina"])){

		if($_GET['pagina']=='inicio'){
			inicio();
		}
		if($_GET['pagina']=='contacto'){
			contacto();
		}
		if($_GET['pagina']=='acerca'){
			acerca();
		}
		if($_GET['pagina']=='galeria'){
			galeria();
		}
		if($_GET['pagina'] == 'equipo'){
			equipo();
		}
		if($_GET['pagina'] == 'localizacion'){
			localizacion();
		}
		if($_GET['pagina']=='politica'){
			politica();
		}
		if($_GET['pagina']=='textohtml'){
			customLabel();
		}
		if($_GET['pagina']=='enlaces'){
			enlaces();
		}
		/*if($_GET['pagina']=='otro'){
			otros();	 Aqui ir poniendo las distintas paginas que se pueden crear. Tambien se tienen que añadir a la base de datos
		}*/
	}
}

function devImgCat(){
	if($dbc = conexionbd()){
		$query = "SELECT fondo FROM plantilla WHERE id_app = ".$_GET["app"];
		mysqli_set_charset($dbc, "utf8");
		$resultado = mysqli_query($dbc, $query);
		if($resultado){
	   		if (mysqli_num_rows($resultado) != 0){
	   			$fila = mysqli_fetch_assoc($resultado);
	   			if(!empty($fila["fondo"]))
		   			$datos[] = array("fondo" => $fila["fondo"]);
	   			
	   			echo json_encode($datos);
		   	}
		   	else{
		   		$datos[] = array("respuesta" => "errorFilas");
		   		echo json_encode($datos);
		   	}
	   }
	   else{
	   		$datos[] = array("respuesta" => "errorBD");
		   	echo json_encode($datos);
	   }
	}
}

function descargaApp(){
	if($dbc = conexionbd()){
		$escritura = false;
		
	    //Consulta a la base de datos para coger los datos de la app que ha creado el usuario, esta sentencia hay que depurarla
	    //cambiar la sentencia where porque puede tener varias apps y el usuario no es valido. solo la 1 vez
	    $query = "SELECT id_app FROM app WHERE id_usuario = (SELECT id_usuario FROM usuario WHERE nombre LIKE 'usuario')";
	    $resultado = mysqli_query($dbc, $query);

	   if($resultado){
	   		if (mysqli_num_rows($resultado) != 0){ 
		   		$datos = mysqli_fetch_assoc($resultado);
		   		$app = $datos["id_app"];
		   	}
	   }
	   else{
	   		echo "fallo";
	   }

        //creamos el archivo y le metemos los datos
	    $texto = "idApli.txt";
	    $archivo = "apk/". $texto;
	    @unlink($archivo);
	    if($archivo = fopen($archivo, "a")){
	        if(fwrite($archivo, $app)){
	            $escritura = true;
	        }
	        else{
	            echo "Ha habido un problema al escribir en el archivo";
	        }
	    }
	    fclose($archivo);
		if($escritura){
			if(rename("apk/".$texto, "apk/AppCreator/assets/".$texto)){
				echo " <br> se movio a assets<br>   ";
			}else{
				echo "<br> NO movido <br>";
			}
			if(file_exists("apk/AppCreator/assets/".$texto)){
				comprimirApk();
                //comprimirGema();

			}
			else{
				echo "pues n comprime";
			}
			@unlink("apk/AppCreator/assets/".$texto);
		}
	}
}
 
/* primero creamos la función que hace la magia
 * esta funcion recorre carpetas y subcarpetas
 * añadiendo todo archivo que encuentre a su paso
 * recibe el directorio y el zip a utilizar 
 */
function agregar_zip($dir, $zip) {
	//echo $dir. "<br>";
	
  //verificamos si $dir es un directorio
  if (is_dir($dir)) {
    //abrimos el directorio y lo asignamos a $da
    if ($da = opendir($dir)) {
      //leemos del directorio hasta que termine
      while (($archivo = readdir($da)) !== false) {
        /*Si es un directorio imprimimos la ruta
         * y llamamos recursivamente esta función
         * para que verifique dentro del nuevo directorio
         * por mas directorios o archivos
         */
        if (is_dir($dir . $archivo) && $archivo != "." && $archivo != "..") {
          //echo "<strong>Creando directorio: $dir$archivo</strong><br/>";
          	agregar_zip($dir.$archivo . "/", $zip);
 
          /*si encuentra un archivo imprimimos la ruta donde se encuentra
           * y agregamos el archivo al zip junto con su ruta 
           */
        } elseif (is_file($dir . $archivo) && $archivo != "." && $archivo != "..") {
        	//echo "Agregando archivo: $dir$archivo <br/>";
			$ruta=$dir . $archivo;        	
			$array = explode("AppCreator/", $ruta);
			$ruta= $array[1];			
	        $zip->addFile($dir . $archivo,$ruta);
        }
      }
      //cerramos el directorio abierto en el momento
      closedir($da);
    }
  }
}

function comprimirApk(){
	//fin de la función
	//creamos una instancia de ZipArchive
	$zip = new ZipArchive();
	 
	/*directorio a comprimir
	 * la barra inclinada al final es importante
	 * la ruta debe ser relativa no absoluta
	 */
	chdir("apk");
	$dir = 'AppCreator/';
	 
	//ruta donde guardar los archivos zip, ya debe existir
	$rutaFinal = "../apkcliente";
	 
	if(!file_exists($rutaFinal)){
	  mkdir($rutaFinal);
	}
	
	$archivoZip = "AppCreator.apk";
	
	if($zip->open($archivoZip, ZIPARCHIVE::CREATE) === true) {
	 	agregar_zip($dir, $zip);
		$zip->close();
	 
	  //Muevo el archivo a una ruta
	  //donde no se mezcle los zip con los demas archivos
	  rename($archivoZip, "$rutaFinal/$archivoZip");
	 
	  //Hasta aqui el archivo zip ya esta creado
	  //Verifico si el archivo ha sido creado
	  if (file_exists($rutaFinal. "/" . $archivoZip)){
	    echo "Proceso Finalizado!! <br/><br/>
	                Descargar: <a href='apkcreator/$rutaFinal/$archivoZip'>$archivoZip</a>";
	  }
	  else {
	  		echo "Error, archivo zip no ha sido creado!!";
	  }
	}	
}

function devuelvePlantilla(){
	if($dbc = conexionbd()){
		
	    //Consulta a la base de datos para coger los datos de la app que ha creado el usuario
	    $query = "SELECT * FROM plantilla WHERE id_app = ". $_GET["app"];
	    mysqli_set_charset($dbc, "utf8");
	    $resultado = mysqli_query($dbc, $query);
	    $datos = array();
	   if($resultado){
	   		if (mysqli_num_rows($resultado) != 0){ 
	   			$fila = mysqli_fetch_assoc($resultado);
	   			$datos[] = array('id_plantilla' => $fila["id_plantilla"], 'id_categoria' => $fila["id_categoria"], 'disenio' => $fila["disenio"], 'color1' => $fila["color1"], 'color2' => $fila["color2"], 'contacto' => $fila["contacto"], "acerca" => $fila["acerca"], "fondo" => $fila["fondo"], "logo" => $fila["logo"], "galeria" => $fila["galeria"], "equipo" => $fila["equipo"], "localizacion" => $fila["localizaciones"], "custom" => $fila["custom"], "politica" => $fila["politica"], "enlaces" => $fila["enlaces"]);
	   			
	   			echo json_encode($datos);
		   	}
		   	else{
		   		$datos[] = array("respuesta" => "errorFilas");
		   		echo json_encode($datos);
		   	}
	   }
	   else{
	   		$datos[] = array("respuesta" => "errorBD");
		   	echo json_encode($datos);
	   }
	}
}

function inicio(){
	if($dbc = conexionbd()){
		$query = "SELECT logo, nombreCompania, direccion FROM inicio WHERE id_app = " . $_GET["app"];
		mysqli_set_charset($dbc, "utf8");
		$resultado = mysqli_query($dbc, $query);
		if($resultado){
	   		if (mysqli_num_rows($resultado) != 0){ 
	   			while($fila = mysqli_fetch_assoc($resultado)){
	   				$datos[] = array('logo' => $fila["logo"], 'nombreCompania' => $fila["nombreCompania"], 'direccion' => $fila["direccion"]);
	   			}
	   			echo json_encode($datos);
		   	}
		   	else{
		   		$datos[] = array("respuesta" => "errorFilas");
		   		echo json_encode($datos);
		   	}
	   }
	   else{
	   		$datos[] = array("respuesta" => "errorBD");
		   	echo json_encode($datos);
	   }
	}
}

function contacto(){
	if($dbc = conexionbd()){
		$query = "SELECT nombre, tlf, fax, correo, direccion FROM contacto WHERE id_app = " . $_GET["app"];
		mysqli_set_charset($dbc, "utf8");
		$resultado = mysqli_query($dbc, $query);
		if($resultado){
	   		if (mysqli_num_rows($resultado) != 0){
	   			while($fila = mysqli_fetch_assoc($resultado)){
	   				$datos[] = array('nombre' => $fila["nombre"], 'telefono' => $fila["tlf"], 'fax' => $fila["fax"], 'correo' => $fila["correo"], 'direccion' => $fila["direccion"]);
	   			}
	   			echo json_encode($datos);
		   	}
		   	else{
		   		$datos[] = array("respuesta" => "errorFilas");
		   		echo json_encode($datos);
		   	}
	   }
	   else{
	   		$datos[] = array("respuesta" => "errorBD");
		   	echo json_encode($datos);
	   }
	}
}

function acerca(){
	if($dbc = conexionbd()){
		$query = "SELECT descripcion FROM acerca WHERE id_app = " . $_GET["app"];
		mysqli_set_charset($dbc, "utf8");
		$resultado = mysqli_query($dbc, $query);
		if($resultado){
	   		if (mysqli_num_rows($resultado) != 0){ 
	   			while($fila = mysqli_fetch_assoc($resultado)){
	   				$datos[] = array('descripcion' => $fila["descripcion"]);
	   			}
	   			echo json_encode($datos);
		   	}
		   	else{
		   		$datos[] = array("respuesta" => "errorFilas");
		   		echo json_encode($datos);
		   	}
	   }
	   else{
	   		$datos[] = array("respuesta" => "errorBD");
		   	echo json_encode($datos);
	   }
	}
}

function politica(){
	if($dbc = conexionbd()){
		$query = "SELECT descripcion FROM politicaapp WHERE id_app = " . $_GET["app"];
		mysqli_set_charset($dbc, "utf8");
		$resultado = mysqli_query($dbc, $query);
		if($resultado){
	   		if (mysqli_num_rows($resultado) != 0){ 
	   			while($fila = mysqli_fetch_assoc($resultado)){
	   				$datos[] = array('descripcion' => $fila["descripcion"]);
	   			}
	   			echo json_encode($datos);
		   	}
		   	else{
		   		$datos[] = array("respuesta" => "errorFilas");
		   		echo json_encode($datos);
		   	}
	   }
	   else{
	   		$datos[] = array("respuesta" => "errorBD");
		   	echo json_encode($datos);
	   }
	}
}

function galeria(){
	if($dbc = conexionbd()){
		$query = "SELECT imagen FROM galeria WHERE id_app = " . $_GET["app"];
		mysqli_set_charset($dbc, "utf8");
		$resultado = mysqli_query($dbc, $query);
		if($resultado){
			if(mysqli_num_rows($resultado) != 0){
				
				while($fila = mysqli_fetch_assoc($resultado)){
					$datos[] = array("imagen" => $fila["imagen"]);
				}
				echo json_encode($datos);
			}else{
				$datos[] = array("respuesta" => "errorFilas");
		   		echo json_encode($datos);
			}
		}else{
   			$datos[] = array("respuesta" => "errorBD");
	   		echo json_encode($datos);
  		}
	}
}

function equipo(){
	if($dbc = conexionbd()){
		$query = "SELECT imagen, nombre, puesto FROM equipo WHERE id_app = " . $_GET["app"];
		mysqli_set_charset($dbc, "utf8");
		$resultado = mysqli_query($dbc,$query);
		if($resultado){
			if(mysqli_num_rows($resultado) != 0){
				while($fila = mysqli_fetch_assoc($resultado)){
					$datos[] = array("imagen" => $fila["imagen"], "nombre" => $fila["nombre"], "puesto" => $fila["puesto"]);
				}
				echo json_encode($datos);
			}else{
				$datos[] = array("respuesta" => "errorFilas");
		   		echo json_encode($datos);
			}
		}else{
   			$datos[] = array("respuesta" => "errorBD");
	   		echo json_encode($datos);
  		}
	}
}

function getCoordinates($address){
    $address = urlencode($address);
    $url = "http://maps.google.com/maps/api/geocode/json?sensor=false&address=" . $address;
    $response = file_get_contents($url);
    $json = json_decode($response,true);
 
    $lat = $json['results'][0]['geometry']['location']['lat'];
    $lng = $json['results'][0]['geometry']['location']['lng'];
 
    return array($lat, $lng);



}

function localizacion(){
	if($dbc = conexionbd()){
		$query = "SELECT direccion, latitud, longitud FROM localizaciones WHERE id_app = " . $_GET["app"];
		mysqli_set_charset($dbc, "utf8");
		$resultado = mysqli_query($dbc,$query);
		if($resultado){
			if(mysqli_num_rows($resultado) != 0){
				while($fila = mysqli_fetch_assoc($resultado)){
					$datos[] = array("direccion" => $fila["direccion"], "latitud" => $fila["latitud"], "longitud" => $fila["longitud"]);
				}
				echo json_encode($datos);
			}else{
				$datos[] = array("respuesta" => "errorFilas");
		   		echo json_encode($datos);
			}
		}else{
   			$datos[] = array("respuesta" => "errorBD");
	   		echo json_encode($datos);
  		}
	}
}

function customLabel(){
	if($dbc = conexionbd()){
		$query = "SELECT descripcion FROM textohtml WHERE id_app = " . $_GET["app"];
		mysqli_set_charset($dbc, "utf8");
		$resultado = mysqli_query($dbc, $query);
		if($resultado){
	   		if (mysqli_num_rows($resultado) != 0){ 
	   			while($fila = mysqli_fetch_assoc($resultado)){
	   				$datos[] = array('descripcion' => $fila["descripcion"]);
	   			}
	   			echo json_encode($datos);
		   	}
		   	else{
		   		$datos[] = array("respuesta" => "errorFilas");
		   		echo json_encode($datos);
		   	}
	   }
	   else{
	   		$datos[] = array("respuesta" => "errorBD");
		   	echo json_encode($datos);
	   }
	}
}

function enlaces(){
	if($dbc = conexionbd()){
		$query = "SELECT nombreCompania, enlace FROM enlaces WHERE id_app = " . $_GET["app"];
		mysqli_set_charset($dbc, "utf8");
		$resultado = mysqli_query($dbc, $query);
		if($resultado){
	   		if (mysqli_num_rows($resultado) != 0){ 
	   			while($fila = mysqli_fetch_assoc($resultado)){
	   				$datos[] = array('nombreCompania' => $fila["nombreCompania"], 'enlace' => $fila["enlace"]);
	   			}
	   			echo json_encode($datos);
		   	}
		   	else{
		   		$datos[] = array("respuesta" => "errorFilas");
		   		echo json_encode($datos);
		   	}
	   }
	   else{
	   		$datos[] = array("respuesta" => "errorBD");
		   	echo json_encode($datos);
	   }
	}
}


?>