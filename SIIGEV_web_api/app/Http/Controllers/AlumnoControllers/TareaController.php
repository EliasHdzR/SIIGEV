<?php

namespace App\Http\Controllers\AlumnoControllers;

use App\Http\Controllers\ArchivosController;
use App\Http\Controllers\Controller;
use App\Models\Alumno;
use App\Models\Clase;
use App\Models\Tarea;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TareaController extends Controller
{
    /**
     * Recupera una tarea específica por su ID
     *
     * @param Request $request
     * @param int $clase_id
     * @param int $tarea_id
     * @return JsonResponse
     */
    public function getTarea(Request $request, $clase_id, $tarea_id): JsonResponse
    {
        $userData = $request->userData;
        $alumno = Alumno::find($userData["id"]);
        $clase = Clase::find($clase_id);

        if (!$clase) {
            return response()->json(['error' => 'Clase no encontrada'], 404);
        }

        if (!$alumno->clases()->where('clase_id', $clase_id)->exists()) {
            return response()->json(['error' => 'No tienes acceso a esta clase'], 403);
        }

        $tarea = Tarea::find($tarea_id);

        if (!$tarea) {
            return response()->json(['error' => 'Tarea no encontrada'], 404);
        }

        // Agregar el campo 'tipo' dinámicamente
        $tarea->tipo = "tareas";

        // Recuperar archivos asociados a la tarea
        $tarea->archivos = ArchivosController::get($tarea);

        return response()->json(['tarea' => $tarea]);
    }
}