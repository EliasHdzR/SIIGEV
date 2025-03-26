<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

// RUTAS DE AUTENTICACIÓN Y GENERALES
Route::post('/account/login', [AuthController::class, 'login']);

// RUTAS DEL MAESTRO


// RUTAS DEL ALUMNO