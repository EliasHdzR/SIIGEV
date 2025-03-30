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
        Route::post('/add-alumno', [MaestroClaseController::class, 'addAlumno']);
        Route::get('/{clase_id}', [MaestroClaseController::class, 'getInfoClase']);
        Route::get('/{clase_id}/get-alumnos', [MaestroClaseController::class, 'getAlumnosRegistrados']);
        Route::get('/{clase_id}/get-alumnos-n', [MaestroClaseController::class, 'getAlumnosNoRegistrados']);

    });
});


// RUTAS DEL ALUMNO