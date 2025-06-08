<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <title>Factura</title>
    <style>
        @page {
            margin: 30px;
        }
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 30px;
            color: #212529;
            position: relative;
        }

        .watermark {
            position: absolute;
            top: 35%;
            left: 20%;
            width: 60%;
            opacity: 0.05;
            z-index: -1;
        }

        h1 {
            font-weight: 700;
            font-size: 24px;
            margin-bottom: 20px;
            color: #009ebc;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        th, td {
            padding: 12px 15px;
            border: 1px solid #dee2e6;
            text-align: left;
        }

        th {
            background-color: #e9ecef;
            font-weight: 600;
        }

        .total {
            font-weight: 700;
            font-size: 18px;
            text-align: right;
            padding-right: 15px;
        }

        .footer {
            font-size: 12px;
            color: #6c757d;
            text-align: center;
            margin-top: 40px;
            border-top: 1px solid #dee2e6;
            padding-top: 10px;
        }
    </style>
</head>
<body>

<img src="{{ public_path('images/logo.png') }}" class="watermark" alt="Logo Marca de Agua">

<h1>Subscripción Housekeeper</h1>

<p><strong>Nombre:</strong> {{ $userData['name'] }}</p>
<p><strong>Email:</strong> {{ $userData['email'] }}</p>

<table>
    <thead>
    <tr>
        <th>Concepto</th>
        <th>Precio</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>Plan: {{ $plan->name }}</td>
        <td>{{ number_format((float) $plan->price, 2) }} €</td>
    </tr>
    </tbody>
</table>

<p class="total">Total: {{ number_format((float) $plan->price, 2) }} €</p>

<div class="footer">
    Gracias por confiar en Housekeeper.<br>
    Todos los derechos reservados © {{ date('Y') }}
</div>

</body>
</html>
