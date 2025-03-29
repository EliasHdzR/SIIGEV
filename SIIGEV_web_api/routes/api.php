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

// RUTAS DEL MAESTRO
Route::prefix('/maestro')->middleware([UserIsAuthenticated::class, UserIsMaestro::class])->group(function () {
    Route::get('/carreras', [MaestroClaseController::class, 'getCarreras']);

    Route::prefix('/clases')->group(function () {
        Route::get('/', [MaestroClaseController::class, 'getClases']);
        Route::post('/', [MaestroClaseController::class, 'store']);
        Route::post('/add-alumnos', [MaestroClaseController::class, 'addAlumnos']);
        Route::get('/{clase_id}/get-alumnos', [MaestroClaseController::class, 'getAlumnosEnClase']);
    });
});


// RUTAS DEL ALUMNO