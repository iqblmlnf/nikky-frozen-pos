<?php

namespace App\Http\Controllers\Api;

use Midtrans\Snap;
use Midtrans\Config;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class MidtransController extends Controller
{
    public function createTransaction(Request $request)
    {
        try {

            Config::$serverKey = config('midtrans.server_key');
            Config::$isProduction = false;
            Config::$isSanitized = true;
            Config::$is3ds = true;

            $orderId = 'ORDER-' . time();

            $params = [
                'transaction_details' => [
                    'order_id' => $orderId,
                    'gross_amount' => (int) $request->total,
                ],
            ];

            $snapToken = Snap::getSnapToken($params);

            return response()->json([
                'token' => $snapToken,
                'order_id' => $orderId,
            ]);
        } catch (\Exception $e) {

            return response()->json([
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
