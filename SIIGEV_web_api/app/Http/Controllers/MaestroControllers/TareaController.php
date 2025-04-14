<?php

namespace App\Http\Controllers\MaestroControllers;

use App\Http\Controllers\ArchivosController;
use App\Http\Controllers\Controller;
use App\Models\Entrega;
use App\Models\Tarea;
use App\Models\Tema;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Js;

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
            $tarea->entregas = $tarea->statsTarea();

            return response()->json(["tarea" => $tarea]);
        } catch (\Exception $e){
            return response()->json(["message" => $e->getMessage()], 500);
        }
    }

    public function getEntregas(Request $request, int $tarea_id): JsonResponse
    {
        $userData = $request->userData;

        try {
            $tarea = Tarea::find($tarea_id);
            if (!$tarea) throw new Exception("La tarea no existe");
            if($tarea->tema->clase->maestro_id != $userData["id"]) throw new Exception("Acceso no autorizado.");

            $tarea->with("entregas")->get();
            $entregas = $tarea->entregas()->with("alumno")->get();
            $entregas = $entregas->where("entregada", "=", true);

            foreach ($entregas as $entrega) {
                $entrega->tipo = "entregas";
                $entrega->archivos = ArchivosController::get($entrega);
            }

            return response()->json(["entregas" => $entregas]);
        } catch (\Exception $e){
            return response()->json(["message" => $e->getMessage()], 500);
        }
    }

    public function calificarEntrega(Request $request): JsonResponse
    {
        $userData = $request->userData;
        $entrega_id = $request->entrega_id;
        $calificacion = $request->calificacion;

        DB::beginTransaction();
        try {
            $entrega = Entrega::find($entrega_id);
            if (!$entrega) throw new Exception("La entrega no existe");
            if($entrega->tarea->tema->clase->maestro_id != $userData["id"]) throw new Exception("Acceso no autorizado.");

            if ($calificacion < 0 || $calificacion > 100) throw new Exception("La calificación debe estar entre 0 y 100");

            $entrega->calificacion = $calificacion;
            $entrega->save();

            DB::commit();
            return response()->json(["message" => "Entrega calificada"]);
        } catch (\Exception $e){
            DB::rollBack();
            return response()->json(["message" => $e->getMessage()], 500);
        }
    }
}
