<?php

namespace App\Http\Controllers\MaestroControllers;

use App\Http\Controllers\ArchivosController;
use App\Http\Controllers\Controller;
use App\Models\Material;
use App\Models\Tema;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MaterialController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $userData = $request->userData;
        $tema_id = $request->tema_id;
        $titulo = $request->titulo;
        $descripcion = $request->descripcion;
        $archivos = $request->archivos;

        DB::beginTransaction();
        try {
            $tema = Tema::find($tema_id);
            if (!$tema) throw new Exception("El tema no existe:" . $tema_id);
            if ($tema->clase->maestro_id != $userData["id"]) throw new Exception("No autorizado");

            $material = Material::create([
                "tema_id" => $tema_id,
                "titulo" => $titulo,
                "descripcion" => $descripcion
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

                    $material->tipo = "materiales";
                    $archivo->extension = $archivo->getClientOriginalExtension();
                    $archivoRegistro = ArchivosController::store($archivo, $material);
                }
            }

            DB::commit();
            return response()->json(["material" => $material, "archivo" => $archivoRegistro], 201);
        } catch (Exception $e){
            DB::rollBack();
            return response()->json(["message" => $e->getMessage()], 500);
        }
    }

    public function get(Request $request, int $material_id): JsonResponse
    {
        $userData = $request->userData;

        try {
            $material = Material::find($material_id);
            if (!$material) throw new Exception("El material no existe");
            if ($material->tema->clase->maestro_id != $userData["id"]) throw new Exception("No autorizado");

            $material->tipo = "materiales";
            $material->archivos = ArchivosController::get($material);

            return response()->json(["material" => $material]);
        } catch (Exception $e){
            return response()->json(["message" => $e->getMessage()], 500);
        }
    }
}
