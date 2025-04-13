<?php

use App\Http\Middleware\UserIsAuthenticated;
use App\Http\Middleware\UserIsMaestro;
use App\Http\Middleware\UserIsAlumno;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MaestroControllers\ClaseController as MaestroClaseController;
use App\Http\Controllers\AlumnoControllers\ClaseController as AlumnoClaseController;
use App\Http\Controllers\AlumnoControllers\TareaController as AlumnoTareaController;
use App\Http\Controllers\MaestroControllers\AvisoController as MaestroAvisoController;
use App\Http\Controllers\MaestroControllers\TemaController as MaestroTemaController;
use App\Http\Controllers\MaestroControllers\MaterialController as MaestroMaterialController;
use App\Http\Controllers\MaestroControllers\TareaController as MaestroTareaController;
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
        Route::get('/{clase_id}/tablon', [MaestroClaseController::class, 'getTablon']);
    });

    Route::prefix('/avisos')->group(function () {
        Route::post('/store', [MaestroAvisoController::class, 'store']);
    });

    Route::prefix('/temas')->group(function () {
        Route::get('/{clase_id}', [MaestroTemaController::class, 'get']);
        Route::get('/{clase_id}/listado', [MaestroTemaController::class, 'getListadoTemas']);
        Route::post('/', [MaestroTemaController::class, 'store']);
    });

    Route::prefix('/materiales')->group(function () {
        Route::post('/', [MaestroMaterialController::class, 'store']);
        Route::get('/{material_id}', [MaestroMaterialController::class, 'get']);
    });

    Route::prefix('/tareas')->group(function () {
        Route::post('/', [MaestroTareaController::class, 'store']);
        Route::get('/{tarea_id}', [MaestroTareaController::class, 'get']);
    });
});


// RUTAS DEL ALUMNO
Route::prefix('alumno')->middleware([UserIsAuthenticated::class, UserIsAlumno::class])->group(function (){
    Route::get('/clases', [AlumnoClaseController::class, 'getClases']);

    Route::prefix('/clases/{clase_id}')->group(function () {
        Route::get('/', [AlumnoClaseController::class, 'getClaseDetalles']);
        Route::get('/tablon', [AlumnoClaseController::class, 'getTablon']);
        Route::get('/contenido', [AlumnoClaseController::class, 'getContenido']);
        
        Route::get('/tareas/{tarea_id}', [AlumnoTareaController::class, 'getTarea']);
        Route::post('/tareas/{tarea_id}/subir-archivos', [AlumnoTareaController::class, 'subirArchivos']);
        Route::post('/tareas/{tarea_id}/completar', [AlumnoTareaController::class, 'marcarComoCompletado']);
        Route::post('tareas/{tarea_id}/cancelar', [AlumnoTareaController::class, 'cancelarEntrega']);
        Route::get('tareas/{tarea_id}/estado', [AlumnoTareaController::class, 'getEstadoEntrega']);
        Route::get('/tareas/{tarea_id}/entregas', [AlumnoTareaController::class, 'getArchivosEntrega']);
        Route::delete('/tareas/{tarea_id}/entregas/{entrega_id}', [AlumnoTareaController::class, 'eliminarArchivoEntrega']);
        Route::get('/tareas/{tarea_id}/calificacion', [AlumnoTareaController::class, 'getCalificacionTarea']);
   
        Route::get('/materiales/{material_id}', [AlumnoClaseController::class, 'getMaterial']);
    });
});