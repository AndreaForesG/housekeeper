<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;

class PaymentController extends Controller
{

    public function createIntent(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1',
            'currency' => 'required|string',
            'planId' => 'required|integer'
        ]);

        Stripe::setApiKey(env('STRIPE_SECRET'));

        $intent = PaymentIntent::create([
            'amount' => intval($request->amount),
            'currency' => $request->currency,
            'metadata' => [
                'plan_id' => $request->planId
            ],
        ]);

        return response()->json([
            'clientSecret' => $intent->client_secret
        ]);
    }
}
