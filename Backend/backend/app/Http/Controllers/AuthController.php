<?php

namespace App\Http\Controllers;

use App\Models\Hotel;
use App\Models\Plan;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use PHPMailer\PHPMailer\PHPMailer;
use Stripe\PaymentIntent;
use Stripe\Stripe;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;




class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:6',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'El usuario no existe'], 404);
        }

        if (!Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Credenciales incorrectas'], 401);
        }

        Auth::login($user);

        $token = $user->createToken('HotelAppToken')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user,
            'user_type' => $user->user_type,
        ]);
    }

    public function register(Request $request)
    {

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'planId' => 'required',
            'paymentIntentId' => 'required',
        ]);

        Stripe::setApiKey(config('services.stripe.secret'));


        $intent = PaymentIntent::retrieve($validated['paymentIntentId']);

            if ($intent->status !== 'succeeded') {
                return response()->json(['error' => 'El pago no se completó correctamente'], 400);
            }


        $hotel = Hotel::create([
            'name' => $request->name,
        ]);
        $hotel_id = $hotel->id;


        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'user_type' => 'hotel_admin',
            'hotel_id' => $hotel_id,
            'plan_id' => $validated['planId'],
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Usuario registrado correctamente',
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json(['message' => 'Sesión cerrada correctamente']);
    }

    public function downloadInvoice(Request $request)
    {
        $data = $request->only(['name', 'email', 'planId']);
        $plan = Plan::find($data['planId']);
        $pdf = Pdf::loadView('invoices.pdf', ['userData' => $data, 'plan' => $plan]);

        $this->sendInvoice($data, $plan, $pdf);
        return $pdf->stream('factura.pdf');



   }

    public function sendInvoice($data, $plan, $pdf)
    {
        $facturasPath = storage_path('app/facturas');
        if (!File::exists($facturasPath)) {
            File::makeDirectory($facturasPath, 0755, true);
        }

        $fileName = 'factura_' . uniqid() . '.pdf';
        $pdfPath = $facturasPath . '/' . $fileName;
        file_put_contents($pdfPath, $pdf->output());

        $emailStatus = 'success';
        $emailMessage = 'Correo enviado correctamente.';

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
            $mail->addAddress($data['email'], $data['name']);
            $mail->isHTML(true);
            $mail->CharSet = 'UTF-8';
            $mail->Subject = '¡Bienvenidos a Housekeeper!';
            $mail->Body = '
    <div style="font-family: Arial, sans-serif; color: #ddd; background-color: #121212; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 10px; border: 1px solid #333;">
    <h2 style="color: #00bcd4;">¡Hola ' . htmlspecialchars($data['name']) . '!</h2>
    <p>Gracias por suscribirte a <strong>Housekeeper</strong>. Nos alegra tenerte con nosotros.</p>

    <p>A continuación, encontrarás tu factura adjunta en este correo.</p>

    <div style="background-color: #1e1e1e; border-left: 4px solid #00bcd4; padding: 10px; margin: 20px 0;">
        <p style="margin: 0;"><strong>Plan seleccionado:</strong> ' . htmlspecialchars($plan->name) . '</p>
        <p style="margin: 0;"><strong>Precio:</strong> €' . number_format($plan->price, 2) . '</p>
    </div>

    <p>Si tienes cualquier duda o problema, no dudes en responder a este correo o contactar con nuestro soporte.</p>

    <hr style="margin: 30px 0; border-color: #333;">

    <footer style="font-size: 12px; color: #666; text-align: center;">
        <p>Housekeeper © 2025</p>
        <p>Este es un mensaje automático, por favor no respondas directamente a este correo.</p>
        <p><a href="https://housekeeper.com" style="color: #00bcd4; text-decoration: none;">Visítanos</a></p>
    </footer>
</div>';
            $mail->addAttachment($pdfPath);

            $mail->send();
        } catch (Exception $e) {
            $emailStatus = 'error';
            $emailMessage = 'Error al enviar el correo: ' . $e->getMessage();
        }

        // 4. Eliminar el archivo temporal
        if (file_exists($pdfPath)) {
            unlink($pdfPath);
        }

        // 5. Devolver JSON con PDF en base64 y estado del email
        return [
            'emailStatus' => $emailStatus,
            'emailMessage' => $emailMessage
        ];
    }



}
