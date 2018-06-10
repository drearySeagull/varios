<?php
require 'vendor/autoload.php';
require 'AutoLoad.php';
require_once("../connect/consultas.php");
require_once("../otras/quitarCharRaro.php");

date_default_timezone_set('Europe/Madrid');

use \Firebase\JWT\JWT;
 
$rest = new Rest();
$cabeceraAutorizacion = $rest->getHeader('authorization');
$url = $rest->getRoute();
$method = $rest->getMethod();

$trozos = explode(' ', $cabeceraAutorizacion);

$key = 'proyecto';
$r = array('token' => "fallo");
if($method == "post"){
    error_log("llega el post");
}
switch($url){
    case "login":
        if(count($trozos) === 2){
            if($url == "login"  && $trozos[0] === 'Basic'){
                $user = base64_decode($trozos[1]);
                $trozosUser = explode(':', $user);
                if(count($trozosUser) === 2){
                    //if($trozosUser[0] === 'admin' && $trozosUser[1] === '1234') 
                    if(compruebaUser($trozosUser[0], $trozosUser[1])){
                        $hora = new DateTime();
                        $token = array(
                            'hora'    => $hora->getTimestamp() + 600,
                            'usuario' => $trozosUser[0]
                        );
                        $jwt = JWT::encode($token, $key);
                        //1
                        $r = array('token' => $jwt, "login" => true, 'url' => $data);
                    }
                    else{
                        $r = array("token" => "fallo", "login" => false, 'url' => $data);
                    }
                }
            } else  if ($trozos[0] === 'Bearer'){
                try{
                    $decodedToken = JWT::decode($trozos[1], $key, array('HS256'));
                }catch(Exception $e){
                    exit;//en vez de exit otra cosaa
                }
                $hora = new DateTime();
                if($hora->getTimestamp() < $decodedToken->hora){
                    $r = array('token' => 'a tiempo', "login" => true, 'url' => $data, 'url2' => $data2);
                }
                else{
                    $r = array('token' => 'fuera de tiempo',"login" => false, 'url' => $data, 'url2' => $data2);
                }
            }
        }
        
        break;
    case "productos":
        $productos = allProducts();
        $r = array("productos" => $productos, "hola" => "caracola");
        //error_log(var_export($r, true));
        break;
        
    case "productoswp":
        $productos = allProductsWp();
        $r = $productos;
        //echo '<pre>' . var_export($productos, true) . '</pre>';
        break;
        
    case "metelo":
        error_log($method);
        $datosJson = $rest->getJson();
        foreach ($datosJson as $value){
           foreach ($value as $val) {
               foreach($val as $va){
                    $productos[] = $va;
                   //Me da el precio 1, el id 2, y nombre 3
                   foreach($va as $v){
                        $cantidad[] = $v;
                   }
               }
           }
        }
        $nombreUser = explode('"', $productos[count($productos)-2]);
        $a = 0;
        $ultimoId = insertaTicket($productos[count($productos)-4], $nombreUser[1]);
        foreach($cantidad as $cant){
            insertaTicketDetails($ultimoId, $productos[$a+1]/*$idProducto*/, $cant/*$cantidad*/, $productos[$a] /*$precio*/);
            $a = $a + 3;
        }
        break;
    case "tickets":
        $todosTickets = cogerTickets();
        $r = array("tickets" => $todosTickets);
        break;
    
}
echo json_encode($r);
