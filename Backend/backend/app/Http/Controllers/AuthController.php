<?php

namespace App\Http\Controllers;

use App\Models\Hotel;
use App\Models\Plan;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Stripe\PaymentIntent;
use Stripe\Stripe;
use Barryvdh\DomPDF\Facade\Pdf;



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

         Stripe::setApiKey(env('STRIPE_SECRET'));

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

        return $pdf->stream('factura.pdf');
    }


}
