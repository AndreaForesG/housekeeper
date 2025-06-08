<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Hotel;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Illuminate\Support\Facades\Log;

class PlanningController extends Controller
{
    public function sendDailyPlannings()
    {
        $date = now()->toDateString();
        $hotels = Hotel::all();

        foreach ($hotels as $hotel) {
            $rooms = app()->call('App\Http\Controllers\RoomController@getRoomsByHotel', [
                'hotel_id' => $hotel->id,
                'date' => $date,
            ])->getData();

            $pdf = Pdf::loadView('pdfs.planning', [
                'hotel' => $hotel,
                'date' => $date,
                'rooms' => $rooms,
            ]);

            $governants = User::where('hotel_id', $hotel->id)
                ->where('role_id', 3)
                ->get();

            foreach ($governants as $user) {
                try {
                    $mail = new PHPMailer(true);
                    $mail->isSMTP();
                    $mail->Host = 'smtp-relay.brevo.com';
                    $mail->SMTPAuth = true;
                    $mail->Username = config('services.brevo.username');
                    $mail->Password = config('services.brevo.password');
                    $mail->SMTPSecure = 'tls';
                    $mail->Port = 587;
                    $mail->AuthType = 'LOGIN';

                    $mail->setFrom('tuapphousekeeper@gmail.com', 'Housekeeper');
                    $mail->addAddress($user->email, $user->name);
                    $mail->isHTML(true);
                    $mail->CharSet = 'UTF-8';
                    $mail->Subject = "Planning diario - {$hotel->name}";
                    $mail->Body = "Buenos días, adjunto encontrará el planning de habitaciones de hoy.";

                    $mail->addStringAttachment(
                        $pdf->output(),
                        "planning_{$hotel->id}_{$date}.pdf",
                        'base64',
                        'application/pdf'
                    );

                    $mail->send();
                } catch (Exception $e) {
                    Log::error("Error al enviar email a {$user->email}: {$e->getMessage()}");
                }
            }
        }
    }
}
