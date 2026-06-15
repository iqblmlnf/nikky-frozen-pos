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


Route::post('/login', [AuthController::class, 'login']);
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
Route::post('/stock-transfer', [TransferStockController::class, 'store']);
Route::get('/stock-transfer-history', [TransferStockController::class, 'history']);
