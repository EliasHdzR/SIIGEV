<?php

namespace App\Http\Controllers\AlumnoControllers;

use App\Http\Controllers\Controller;
use App\Models\Alumno;
use App\Models\Clase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ClaseController extends Controller
{
    public function getClases(Request $request)
    {
        $userData = $request->userData;
        $alumno = Alumno::find($userData["id"]);
        $clases = $alumno->clases()
            ->with('maestro:id,nombre')
            ->orderBy("nombre", "asc")
            ->get();
        return response()->json($clases);
    }
    
    public function getClaseDetalles(Request $request, $clase_id)
    {
        $userData = $request->userData;
        $alumno = Alumno::find($userData["id"]);

        // Verificar si la clase existe
        $clase = Clase::find($clase_id);
        if (!$clase) {
            return response()->json(['error' => 'Clase no encontrada'], 404);
        }

        // Verificar si el alumno tiene acceso a la clase
        if (!$alumno->clases()->where('clase_id', $clase_id)->exists()) {
            return response()->json(['error' => 'No tienes acceso a esta clase'], 403);
        }

        // Devolver los detalles de la clase
        return response()->json([
            'id' => $clase->id,
            'nombre' => $clase->nombre,
            'descripcion' => $clase->descripcion,
            'cuatrimestre' => $clase->cuatrimestre,
            'maestro' => $clase->maestro ? $clase->maestro->nombre : null, // Incluye el nombre del maestro si está disponible
        ]);
    }

    public function getAvisos(Request $request, $clase_id)
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

        $avisos = $clase->avisos()->get();
        
        return response()->json($avisos);
    }


}