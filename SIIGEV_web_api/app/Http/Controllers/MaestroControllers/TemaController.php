<?php

namespace App\Http\Controllers\MaestroControllers;

use App\Http\Controllers\ArchivosController;
use App\Http\Controllers\Controller;
use App\Models\Clase;
use App\Models\Tema;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TemaController extends Controller
{
    /**
     * Esta funcion obtiene los temas de la clase y todos los materiales y tareas relacionados
     * @param Request $request
     * @param int $clase_id
     * @return JsonResponse
     */
    public function get(Request $request, int $clase_id): JsonResponse {
        $userData = $request->userData;

        try {
            $clase = Clase::find($clase_id);
            if (!$clase) throw new Exception("La clase no existe");
            if($clase->maestro_id != $userData["id"]) throw new Exception("Acceso no autorizado.");

            $temas = Tema::where("clase_id", "=", $clase->id)
                ->orderBy("created_at", "desc")
                ->get();

            foreach ($temas as $tema) {
                $materiales = $tema->materiales()->get();
                $tareas = $tema->tareas()->get();

                foreach ($materiales as $material) {
                    $material->tipo = "materiales";
                    $material->archivos = ArchivosController::get($material);
                }

                foreach ($tareas as $tarea) {
                    $tarea->tipo = "tareas";
                    $tarea->entregas = $tarea->statsTarea();
                }

                $publicaciones = array_merge($materiales->toArray(), $tareas->toArray());
                usort($publicaciones, function($a, $b) {
                    return strtotime($b['created_at']) - strtotime($a['created_at']);
                });
                $tema->publicaciones = $publicaciones;
            }

            return response()->json(["temas" => $temas]);
        } catch (\Exception $e){
            return response()->json(["message" => $e->getMessage()], 500);
        }
    }

    public function store(Request $request): JsonResponse {
        $userData = $request->userData;

        DB::beginTransaction();
        try {
            $clase = Clase::find($request["clase_id"]);
            if (!$clase) throw new Exception("La clase no existe");
            if($clase->maestro_id != $userData["id"]) throw new Exception("Acceso no autorizado.");

            $nuevoTema = [
                "clase_id" => $request["clase_id"],
                "nombre" => $request["nombre"],
                "descripcion" => $request["descripcion"],
            ];

            Tema::create($nuevoTema);
            DB::commit();
            return response()->json(["mensaje" => "Tema creado correctamente"], 201);
        } catch (\Exception $e){
            DB::rollBack();
            return response()->json(["message" => $e->getMessage()], 500);
        }
    }

    /**
     * Esta funcion obtiene los temas de la clase, sin los materiales ni tareas relacionados
     * usada para crear tareas y materiales
     * @param Request $request
     * @param int $clase_id
     * @return JsonResponse
     */
    public function getListadoTemas(Request $request, int $clase_id): JsonResponse
    {
        $temas = Tema::where("clase_id", "=", $clase_id)
            ->orderBy("created_at", "asc")
            ->get(["id", "nombre"]);

        return response()->json(["temas" => $temas]);
    }
}
