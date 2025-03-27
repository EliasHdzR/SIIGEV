<?php

use App\Http\Middleware\UserIsAuthenticated;
use App\Http\Middleware\UserIsMaestro;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MaestroControllers\ClaseController as MaestroClaseController;

// RUTAS DE AUTENTICACIÓN Y GENERALES
Route::post('/account/login', [AuthController::class, 'login']);
Route::post('/account/refresh-token', [AuthController::class, 'refreshToken']);

// RUTAS DEL MAESTRO
Route::prefix('/maestro')->middleware([UserIsAuthenticated::class, UserIsMaestro::class])->group(function () {
    Route::get('/clases', [MaestroClaseController::class, 'getClases']);
});


// RUTAS DEL ALUMNO