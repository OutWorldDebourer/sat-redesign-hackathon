<?php
// 1. "Base de Datos" simulada con los números generados al azar
$db_placas = [
    "ABC-982" => ["propietario" => "Pedro Alva", "deuda" => 320.50, "infraccion" => "G-57"],
    "FGT-415" => ["propietario" => "Luis Torres", "deuda" => 115.00, "infraccion" => "L-01"]
];

$db_dni = [
    "48592013" => ["nombre" => "Pedro Alva", "tributo" => "Impuesto Vehicular", "monto" => 450.00]
];

$db_tarjeta = [
    "numero" => "4557123488900021",
    "cvv" => "742"
];

$resultado = null;
$tipo_busqueda = "";

// 2. Lógica de búsqueda
if (isset($_POST['buscar'])) {
    $busqueda = strtoupper(trim($_POST['input_busqueda']));
    
    if (isset($db_placas[$busqueda])) {
        $resultado = $db_placas[$busqueda];
        $tipo_busqueda = "PLACA";
    } elseif (isset($db_dni[$busqueda])) {
        $resultado = $db_dni[$busqueda];
        $tipo_busqueda = "DNI";
    } else {
        $error = "No se encontraron registros con ese número.";
    }
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Simulador SAT Lima</title>
    <style>
        body { font-family: sans-serif; background: #f4f7f6; display: flex; justify-content: center; padding: 50px; }
        .card { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); width: 400px; }
        h2 { color: #003399; font-size: 18px; }
        input { width: 94%; padding: 10px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 5px; }
        button { width: 100%; padding: 10px; background: #003399; color: white; border: none; border-radius: 5px; cursor: pointer; }
        .result { margin-top: 20px; padding: 15px; border-left: 5px solid #25D366; background: #f0fff4; }
        .error { margin-top: 20px; color: red; font-weight: bold; }
        .info-tarjeta { font-size: 12px; color: #666; margin-top: 10px; background: #eee; padding: 5px; }
    </style>
</head>
<body>

<div class="card">
    <h2>Consulta de Deuda SAT</h2>
    <form method="POST">
        <input type="text" name="input_busqueda" placeholder="Ingresa Placa o DNI" required>
        <button type="submit" name="buscar">Consultar</button>
    </form>

    <?php if ($resultado): ?>
        <div class="result">
            <strong>Tipo: <?php echo $tipo_busqueda; ?></strong><br>
            Nombre: <?php echo $resultado['propietario'] ?? $resultado['nombre']; ?><br>
            Concepto: <?php echo $resultado['infraccion'] ?? $resultado['tributo']; ?><br>
            <h3 style="color: #d32f2f;">Total: S/ <?php echo number_format($resultado['deuda'] ?? $resultado['monto'], 2); ?></h3>
            <button style="background: #25D366;">Pagar Ahora</button>
        </div>
    <?php endif; ?>

    <?php if (isset($error)): ?>
        <p class="error"><?php echo $error; ?></p>
    <?php endif; ?>

    <div class="info-tarjeta">
        <strong>Datos para el pago (Simulados):</strong><br>
        Tarjeta: <?php echo $db_tarjeta['numero']; ?><br>
        CVV: <?php echo $db_tarjeta['cvv']; ?>
    </div>
</div>

</body>
</html>
