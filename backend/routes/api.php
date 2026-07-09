<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\ProductStockController;
use App\Http\Controllers\TransferStockController;
use App\Http\Controllers\Api\MidtransController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ShiftController;
use App\Http\Controllers\CategoryController;


Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::get('/dashboard/summary', [DashboardController::class, 'summary']);
Route::get('/products-expiring', [ProductController::class, 'expiring']);
Route::apiResource('products', ProductController::class);
Route::apiResource('users', UserController::class);
Route::apiResource('sales', SaleController::class);
Route::get('/audit-logs', [AuditLogController::class, 'index']);
Route::get('/branches/performance', [BranchController::class, 'performance']);
Route::get('/branches', [BranchController::class, 'index']);
Route::apiResource('branches', BranchController::class);
Route::apiResource('stocks', ProductStockController::class);
Route::post('/stock-transfer', [TransferStockController::class, 'store']);
Route::get('/stock-transfer', [TransferStockController::class, 'index']);
Route::get('/stock-transfer-history', [TransferStockController::class, 'history']);
Route::post('/midtrans/create-transaction', [MidtransController::class, 'createTransaction']);
Route::apiResource('expenses', ExpenseController::class);
Route::apiResource('categories', CategoryController::class);

// Shift & Tutup Buku
Route::get('/shifts/active', [ShiftController::class, 'active']);
Route::post('/shifts/open', [ShiftController::class, 'open']);
Route::post('/shifts/close', [ShiftController::class, 'close']);
Route::get('/daily-settlements/today', [ShiftController::class, 'todaySettlement']);
Route::post('/daily-settlements/close', [ShiftController::class, 'closeDay']);
