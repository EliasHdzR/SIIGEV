<?php

use App\Http\Middleware\UserIsAuthenticated;
use App\Http\Middleware\UserIsMaestro;
use App\Http\Middleware\UserIsAlumno;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MaestroControllers\ClaseController as MaestroClaseController;
use App\Http\Controllers\AlumnoControllers\ClaseController as AlumnoClaseController;
use App\Http\Controllers\MaestroControllers\AvisoController as MaestroAvisoController;
use App\Http\Controllers\ArchivosController;

// RUTAS DE AUTENTICACIÓN Y GENERALES
Route::post('/account/login', [AuthController::class, 'login']);
Route::post('/account/refresh-token', [AuthController::class, 'refreshToken']);

Route::get('/account/info', function (Request $request) {
    $userData = $request->userData;
    return response()->json($userData);
})->middleware(UserIsAuthenticated::class);

Route::get('/download/{archivo_id}', [ArchivosController::class, 'download'])->middleware(UserIsAuthenticated::class);


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
        Route::get('/{clase_id}/avisos', [MaestroClaseController::class, 'getAvisos']);
    });

    Route::prefix('/avisos')->group(function () {
        Route::post('/store', [MaestroAvisoController::class, 'store']);
    });
});


// RUTAS DEL ALUMNO
Route::prefix('alumno')->middleware([UserIsAuthenticated::class, UserIsAlumno::class])->group(function (){
    Route::get('/clases', [AlumnoClaseController::class, 'getClases']);

    Route::prefix('/clases/{clase_id}')->group(function () {
        Route::get('/', [AlumnoClaseController::class, 'getClaseDetalles']);
        Route::get('/avisos', [AlumnoClaseController::class, 'getAvisos']);
    });
});