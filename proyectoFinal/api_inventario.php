<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

$host = "localhost";
$usuario = "root";
$contrasena = "";
$base_datos = "tienda";
$puerto = 3306;

$conexion = new mysqli($host, $usuario, $contrasena, $base_datos, $puerto);

if ($conexion->connect_error) {
    die(json_encode(["error" => "Error al conectar: " . $conexion->connect_error]));
}

$conexion->set_charset("utf8");

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

switch ($method) {
    case 'GET':
        if ($action === 'get_ventas') {
            $sql = "SELECT id, producto_id, nombre, precio FROM ventas";
            $result = $conexion->query($sql);
            $ventas = [];
            while ($row = $result->fetch_assoc()) {
                $ventas[] = $row;
            }
            echo json_encode($ventas);
        } elseif ($action === 'get_ventas_completadas') {
            $sql = "SELECT id, productos, total, fecha_venta, metodo_pago FROM ventas_completadas";
            $result = $conexion->query($sql);
            $ventasCompletadas = [];
            while ($row = $result->fetch_assoc()) {
                $ventasCompletadas[] = $row;
            }
            echo json_encode($ventasCompletadas);
        } elseif ($action === 'get_ventas_diarias') {
            $sql = "SELECT metodo_pago, SUM(total) as total 
                    FROM ventas_completadas 
                    WHERE DATE(fecha_venta) = CURDATE() 
                    GROUP BY metodo_pago";
            $result = $conexion->query($sql);
            $ventasDiarias = ["QR" => 0, "Efectivo" => 0];
            while ($row = $result->fetch_assoc()) {
                $ventasDiarias[$row['metodo_pago']] = floatval($row['total']);
            }
            echo json_encode([
                "total" => $ventasDiarias["QR"] + $ventasDiarias["Efectivo"],
                "QR" => $ventasDiarias["QR"],
                "Efectivo" => $ventasDiarias["Efectivo"]
            ]);
        } elseif ($action === 'get_ventas_semanales') {
            $sql = "SELECT metodo_pago, SUM(total) as total 
                    FROM ventas_completadas 
                    WHERE WEEK(fecha_venta) = WEEK(CURDATE()) AND YEAR(fecha_venta) = YEAR(CURDATE())
                    GROUP BY metodo_pago";
            $result = $conexion->query($sql);
            $ventasSemanales = ["QR" => 0, "Efectivo" => 0];
            while ($row = $result->fetch_assoc()) {
                $ventasSemanales[$row['metodo_pago']] = floatval($row['total']);
            }
            echo json_encode([
                "total" => $ventasSemanales["QR"] + $ventasSemanales["Efectivo"],
                "QR" => $ventasSemanales["QR"],
                "Efectivo" => $ventasSemanales["Efectivo"]
            ]);
        } elseif ($action === 'get_ventas_mensuales') {
            $sql = "SELECT metodo_pago, SUM(total) as total 
                    FROM ventas_completadas 
                    WHERE MONTH(fecha_venta) = MONTH(CURDATE()) AND YEAR(fecha_venta) = YEAR(CURDATE())
                    GROUP BY metodo_pago";
            $result = $conexion->query($sql);
            $ventasMensuales = ["QR" => 0, "Efectivo" => 0];
            while ($row = $result->fetch_assoc()) {
                $ventasMensuales[$row['metodo_pago']] = floatval($row['total']);
            }
            echo json_encode([
                "total" => $ventasMensuales["QR"] + $ventasMensuales["Efectivo"],
                "QR" => $ventasMensuales["QR"],
                "Efectivo" => $ventasMensuales["Efectivo"]
            ]);
        } elseif ($action === 'get_envios') {
            $sql = "SELECT id, cliente, departamento, productos, estado FROM envios";
            $result = $conexion->query($sql);
            $envios = [];
            while ($row = $result->fetch_assoc()) {
                $envios[] = $row;
            }
            echo json_encode($envios);
        } else {
            $sql = "SELECT id, nombre, descripcion, marca, categoria, precio, cantidad FROM inventario";
            $result = $conexion->query($sql);
            $inventario = [];
            while ($row = $result->fetch_assoc()) {
                $inventario[] = $row;
            }
            echo json_encode($inventario);
        }
        break;

    case 'POST':
        if ($action === 'add_to_cart') {
            $data = json_decode(file_get_contents("php://input"), true);
            $producto_id = $data['producto_id'] ?? 0;
            $nombre = $data['nombre'] ?? '';
            $precio = $data['precio'] ?? 0;
            if ($producto_id && $nombre && $precio > 0) {
                $sql = "INSERT INTO ventas (producto_id, nombre, precio, fecha_venta) VALUES (?, ?, ?, NOW())";
                $stmt = $conexion->prepare($sql);
                $stmt->bind_param("isd", $producto_id, $nombre, $precio);
                if ($stmt->execute()) {
                    echo json_encode(["message" => "Producto agregado a ventas"]);
                } else {
                    echo json_encode(["error" => "Error al registrar la venta: " . $conexion->error]);
                }
                $stmt->close();
            } else {
                echo json_encode(["error" => "Datos inválidos"]);
            }
        } elseif ($action === 'complete_venta') {
            $data = json_decode(file_get_contents("php://input"), true);
            $productos = json_encode($data['productos']);
            $total = $data['total'] ?? 0;
            $metodo_pago = $data['metodo_pago'] ?? '';
            if ($productos && $total > 0 && $metodo_pago) {
                $sql = "INSERT INTO ventas_completadas (productos, total, metodo_pago, fecha_venta) VALUES (?, ?, ?, NOW())";
                $stmt = $conexion->prepare($sql);
                $stmt->bind_param("sds", $productos, $total, $metodo_pago);
                if ($stmt->execute()) {
                    echo json_encode(["message" => "Venta completada y registrada"]);
                } else {
                    echo json_encode(["error" => "Error al registrar la venta: " . $conexion->error]);
                }
                $stmt->close();
            } else {
                echo json_encode(["error" => "Datos inválidos"]);
            }
        } elseif ($action === 'registrar_envio') {
            $data = json_decode(file_get_contents("php://input"), true);
            $cliente = $data['cliente'] ?? '';
            $departamento = $data['departamento'] ?? '';
            $productos = json_encode($data['productos'] ?? []);
            $estado = 'sin-enviar';
            if ($cliente && $departamento && $productos) {
                $sql = "INSERT INTO envios (cliente, departamento, productos, estado, fecha_envio) VALUES (?, ?, ?, ?, NOW())";
                $stmt = $conexion->prepare($sql);
                $stmt->bind_param("ssss", $cliente, $departamento, $productos, $estado);
                if ($stmt->execute()) {
                    echo json_encode(["message" => "Envío registrado correctamente"]);
                } else {
                    echo json_encode(["error" => "Error al registrar el envío: " . $conexion->error]);
                }
                $stmt->close();
            } else {
                echo json_encode(["error" => "Datos inválidos"]);
            }
        } elseif ($action === 'update_envio') {
            $data = json_decode(file_get_contents("php://input"), true);
            $id = intval($_GET['id'] ?? 0);
            $estado = $data['estado'] ?? '';
            if ($id && $estado === 'enviado') {
                $sql = "UPDATE envios SET estado = ? WHERE id = ?";
                $stmt = $conexion->prepare($sql);
                $stmt->bind_param("si", $estado, $id);
                if ($stmt->execute()) {
                    echo json_encode(["message" => "Estado actualizado a enviado"]);
                } else {
                    echo json_encode(["error" => "Error al actualizar el estado: " . $conexion->error]);
                }
                $stmt->close();
            } else {
                echo json_encode(["error" => "ID o estado inválido"]);
            }
        }
        break;

    case 'DELETE':
        if ($action === 'delete_venta') {
            $id = intval($_GET['id'] ?? 0);
            if ($id) {
                $sql = "DELETE FROM ventas WHERE id = ?";
                $stmt = $conexion->prepare($sql);
                $stmt->bind_param("i", $id);
                if ($stmt->execute()) {
                    echo json_encode(["message" => "Venta eliminada"]);
                } else {
                    echo json_encode(["error" => "Error al eliminar: " . $conexion->error]);
                }
                $stmt->close();
            } else {
                echo json_encode(["error" => "ID no proporcionado"]);
            }
        } elseif ($action === 'clear_ventas') {
            $sql = "TRUNCATE TABLE ventas";
            if ($conexion->query($sql)) {
                echo json_encode(["message" => "Tabla ventas limpiada"]);
            } else {
                echo json_encode(["error" => "Error al limpiar la tabla: " . $conexion->error]);
            }
        }
        break;

    default:
        echo json_encode(["error" => "Método no soportado"]);
        break;
}

$conexion->close();
?>