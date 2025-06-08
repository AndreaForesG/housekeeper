<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Planning de habitaciones</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
        th { background-color: #f4f4f4; }
        .status { font-weight: bold; }
    </style>
</head>
<body>
<h2>Planning de habitaciones - {{ $hotel->name }} - {{ $date }}</h2>

<table>
    <thead>
    <tr>
        <th>Habitación</th>
        <th>Planta</th>
        <th>Asignada a</th>
        <th>Estado</th>
    </tr>
    </thead>
    <tbody>
    @foreach ($rooms as $room)
    <tr>
        <td>{{ $room->number }}</td>
        <td>{{ $room->floor }}</td>
        <td>{{ $room->assigned_to }}</td>
        <td style="background-color: {{ $room->status_color }}">
            {{ $room->status }}
        </td>
    </tr>
    @endforeach
    </tbody>
</table>
</body>
</html>
