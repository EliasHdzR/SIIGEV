<?php

namespace App\Http\Controllers\MaestroControllers;

use App\Http\Controllers\ArchivosController;
use App\Http\Controllers\Controller;
use App\Models\Tarea;
use App\Models\Tema;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Exception;
use Illuminate\Support\Facades\DB;

class TareaController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $userData = $request->userData;
        $tema_id = $request->tema_id;
        $titulo = $request->titulo;
        $instrucciones = $request->instrucciones;
        $fecha_entrega = $request->fecha_entrega;
        $archivos = $request->archivos;

        DB::beginTransaction();
        try {
            $tema = Tema::find($tema_id);
            if (!$tema) throw new Exception("El tema no existe:" . $tema_id);
            if ($tema->clase->maestro_id != $userData["id"]) throw new Exception("No autorizado");

            $tarea = Tarea::create([
                "tema_id" => $tema_id,
                "titulo" => $titulo,
                "instrucciones" => $instrucciones,
                "fecha_entrega" => $fecha_entrega,
            ]);

            $archivoRegistro = null;
            if($archivos && count($archivos) > 0){
                foreach ($archivos as $archivo) {
                    $archivo = (object)$archivo;
                    if (!$archivo->isValid()) throw new Exception("El archivo no es válido");
                    if ($archivo->getSize() > 5000000) throw new Exception("El archivo excede el tamaño máximo permitido");
                    if (!in_array($archivo->getClientOriginalExtension(), ["jpg", "jpeg", "png", "pdf", "txt"])){
                        throw new Exception("El tipo de archivo no es válido: " . $archivo->getClientOriginalExtension());
                    }

                    $tarea->tipo = "tareas";
                    $archivo->extension = $archivo->getClientOriginalExtension();
                    $archivoRegistro = ArchivosController::store($archivo, $tarea);
                }
            }

            DB::commit();
            return response()->json(["tarea" => $tarea, "archivo" => $archivoRegistro], 201);
        } catch (Exception $e){
            DB::rollBack();
            return response()->json(["message" => $e->getMessage()], 500);
        }
    }

    public function get(Request $request, int $tarea_id): JsonResponse {
        $userData = $request->userData;

        try {
            $tarea = Tarea::find($tarea_id);
            if (!$tarea) throw new Exception("La tarea no existe");
            if($tarea->tema->clase->maestro_id != $userData["id"]) throw new Exception("Acceso no autorizado.");

            $tarea->tipo = "tareas";
            $tarea->archivos = ArchivosController::get($tarea);

            return response()->json(["tarea" => $tarea]);
        } catch (\Exception $e){
            return response()->json(["message" => $e->getMessage()], 500);
        }
    }
}
