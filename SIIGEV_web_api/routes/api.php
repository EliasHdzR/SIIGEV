<?php

use App\Http\Middleware\UserIsAuthenticated;
use App\Http\Middleware\UserIsMaestro;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MaestroControllers\ClaseController as MaestroClaseController;

// RUTAS DE AUTENTICACIÓN Y GENERALES
Route::post('/account/login', [AuthController::class, 'login']);
Route::post('/account/refresh-token', [AuthController::class, 'refreshToken']);

Route::get('/account/info', function (Request $request) {
    $userData = $request->userData;
    return response()->json($userData);
})->middleware(UserIsAuthenticated::class);

Route::get('/carreras', [MaestroClaseController::class, 'getCarreras'])
    ->middleware([UserIsAuthenticated::class]);

// RUTAS DEL MAESTRO
Route::prefix('/maestro')->middleware([UserIsAuthenticated::class, UserIsMaestro::class])->group(function () {

    Route::prefix('/clases')->group(function () {
        Route::get('/', [MaestroClaseController::class, 'getClases']);
        Route::post('/', [MaestroClaseController::class, 'store']);
    });
});


// RUTAS DEL ALUMNO