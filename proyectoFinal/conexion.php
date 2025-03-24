<?php
$host = "localhost";
$usuario = "root";
$contrasena = "";
$base_datos = "tienda";
$puerto = 3306;        


$conexion = new mysqli($host, $usuario, $contrasena, $base_datos, $puerto);

if ($conexion->connect_error) {
    die("Error al conectar: " . $conexion->connect_error);
}

$conexion->set_charset("utf8");

?>