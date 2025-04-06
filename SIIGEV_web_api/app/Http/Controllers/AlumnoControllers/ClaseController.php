<?php

namespace App\Http\Controllers\AlumnoControllers;

use App\Http\Controllers\ArchivosController;
use App\Http\Controllers\Controller;
use App\Models\Alumno;
use App\Models\Clase;
use App\Models\Tema;
use App\Models\Material;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ClaseController extends Controller
{
    public function getClases(Request $request): JsonResponse
    {
        $userData = $request->userData;
        $alumno = Alumno::find($userData["id"]);
        $clases = $alumno->clases()
            ->with('maestro:id,nombre')
            ->orderBy("nombre", "asc")
            ->get();
        return response()->json($clases);
    }
    
    public function getClaseDetalles(Request $request, $clase_id): JsonResponse
    {
        $userData = $request->userData;
        $alumno = Alumno::find($userData["id"]);

        // Verificar si la clase existe
        $clase = Clase::find($clase_id);
        if (!$clase) {
            return response()->json(['error' => 'Clase no encontrada'], 500);
        }

        // Verificar si el alumno tiene acceso a la clase
        if (!$alumno->clases()->where('clase_id', $clase_id)->exists()) {
            return response()->json(['error' => 'No tienes acceso a esta clase'], 500);
        }

        // Devolver los detalles de la clase
        return response()->json([
            'id' => $clase->id,
            'nombre' => $clase->nombre,
            'descripcion' => $clase->descripcion,
            'cuatrimestre' => $clase->cuatrimestre,
            'maestro' => $clase->maestro
        ]);
    }

    public function getTablon(Request $request, $clase_id): JsonResponse
    {
        $userData = $request->userData;
        $alumno = Alumno::find($userData["id"]);
        $clase = Clase::find($clase_id);

        // Verificar si la clase existe
        if (!$clase) {
            return response()->json(['error' => 'Clase no encontrada'], 404);
        }

        // Verificar si el alumno tiene acceso a la clase
        if (!$alumno->clases()->where('clase_id', $clase_id)->exists()) {
            return response()->json(['error' => 'No tienes acceso a esta clase'], 403);
        }

        // Recuperar los avisos de la clase
        $avisos = $clase->avisos()->orderBy('created_at', 'desc')->get();
        foreach ($avisos as $aviso) {
            $aviso->tipo = "avisos";
            $aviso->archivos = ArchivosController::get($aviso);
        }

        // Recuperar los temas de la clase
        $temas = $clase->temas()->get();
        $materiales = [];
        $tareas = [];

        foreach ($temas as $tema) {
            // Recuperar materiales del tema
            $temaMateriales = $tema->materiales()->get();
            foreach ($temaMateriales as $material) {
                $material->tipo = "materiales";
                $material->archivos = ArchivosController::get($material);
                $materiales[] = $material;
            }

            // Recuperar tareas del tema
            $temaTareas = $tema->tareas()->get();
            foreach ($temaTareas as $tarea) {
                $tarea->tipo = "tareas";
                $tarea->archivos = ArchivosController::get($tarea);
                $tareas[] = $tarea;
            }
        }

        // Combinar todos los contenidos
        $contenido = array_merge($avisos->toArray(), $materiales, $tareas);

        // Ordenar el contenido por fecha de creación en orden descendente
        usort($contenido, function ($a, $b) {
            return strtotime($b['created_at']) - strtotime($a['created_at']);
        });

        // Devolver el contenido como respuesta JSON
        return response()->json($contenido);
    }

    public function getContenido(Request $request, $clase_id): JsonResponse
    {
        $userData = $request->userData;
        $alumno = Alumno::find($userData["id"]);
        $clase = Clase::find($clase_id);

        // Verificar si la clase existe
        if (!$clase) {
            return response()->json(['error' => 'Clase no encontrada'], 404);
        }

        // Verificar si el alumno tiene acceso a la clase
        if (!$alumno->clases()->where('clase_id', $clase_id)->exists()) {
            return response()->json(['error' => 'No tienes acceso a esta clase'], 403);
        }

        try {
            // Recuperar los temas de la clase
            $temas = Tema::where("clase_id", "=", $clase->id)
                ->orderBy("created_at", "desc")
                ->get();

            foreach ($temas as $tema) {
                // Recuperar materiales y tareas asociados con el tema
                $materiales = $tema->materiales()->get();
                $tareas = $tema->tareas()->get();

                // Procesar materiales
                foreach ($materiales as $material) {
                    $material->tipo = "materiales";
                    $material->archivos = ArchivosController::get($material);
                }

                // Procesar tareas
                foreach ($tareas as $tarea) {
                    $tarea->tipo = "tareas";
                    $tarea->archivos = ArchivosController::get($tarea);
                }

                // Combinar materiales y tareas en publicaciones
                $publicaciones = array_merge($materiales->toArray(), $tareas->toArray());
                usort($publicaciones, function ($a, $b) {
                    return strtotime($b['created_at']) - strtotime($a['created_at']);
                });

                // Agregar publicaciones al tema
                $tema->publicaciones = $publicaciones;
            }

            return response()->json(["temas" => $temas]);
        } catch (\Exception $e) {
            return response()->json(["message" => $e->getMessage()], 500);
        }
    }

    public function getMaterial(Request $request, $clase_id, $material_id): JsonResponse
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
    
        $material = Material::find($material_id);
    
        if (!$material) {
            return response()->json(['error' => 'Material no encontrado'], 404);
        }
    
        // Agregar el campo 'tipo' dinámicamente
        $material->tipo = "materiales";
    
        // Recuperar archivos asociados al material
        $material->archivos = ArchivosController::get($material);
    
        return response()->json(['material' => $material]);
    }
}