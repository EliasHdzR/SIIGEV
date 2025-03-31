<?php

namespace App\Http\Controllers\MaestroControllers;

use App\Http\Controllers\ArchivosController;
use App\Http\Controllers\Controller;
use App\Models\Aviso;
use App\Models\Clase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AvisoController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $userData = $request->userData;
        $clase_id = $request->clase_id;
        $mensaje = $request->mensaje;
        $archivos = $request->archivos;

        DB::beginTransaction();

        try {
            $clase = Clase::find($clase_id);
            if (!$clase) throw new \Exception("La clase no existe:" . $clase_id);
            if ($clase->maestro_id != $userData["id"]) throw new \Exception("No tienes permiso para crear un aviso en esta clase");
            if(!trim($mensaje)) throw new \Exception("El cuerpo del mensaje es obligatorio");

            $aviso = Aviso::create([
                "clase_id" => $clase_id,
                "mensaje" => $mensaje
            ]);

            $archivoRegistro = null;
            if($archivos && count($archivos) > 0){
                foreach ($archivos as $archivo) {
                    $archivo = (object)$archivo;
                    if (!$archivo->isValid()) throw new \Exception("El archivo no es válido");
                    if ($archivo->getSize() > 5000000) throw new \Exception("El archivo excede el tamaño máximo permitido");
                    if (!in_array($archivo->getClientOriginalExtension(), ["jpg", "jpeg", "png", "pdf", "txt"])){
                        throw new \Exception("El tipo de archivo no es válido: " . $archivo->getClientOriginalExtension());
                    }

                    $aviso->tipo = "avisos";
                    $archivo->extension = $archivo->getClientOriginalExtension();
                    $archivoRegistro = ArchivosController::store($archivo, $aviso);
                }
            }

            DB::commit();
            return response()->json(["aviso" => $aviso, "archivo" => $archivoRegistro], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(["message" => $e->getMessage()], 500);
        }
    }
}
