<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Archivo;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ArchivosController extends Controller
{
    public static function store($archivo, $publicacion)
    {
        DB::beginTransaction();

        try {
            $registro = Archivo::create([
                "publicacion_id" => $publicacion->id,
                "publicacion_tipo" => $publicacion->tipo,
                "nombre_original" => $archivo->getClientOriginalName(),
                "nombre_storage" => Str::uuid()->toString(),
                "extension" => $archivo->extension(),
            ]);

            Storage::disk('siigev_storage')->put($registro->nombre_storage, $archivo->getContent());
            DB::commit();
            return response()->json(["registro" => $registro], 201);
        } catch (\Exception $e){
            DB::rollback();
            return response()->json(["message" => $e->getMessage()], 500);
        }
    }

    public static function destroy($nombre_storage): JsonResponse
    {
        DB::beginTransaction();

        try {
            $archivo = Archivo::where("nombre_storage", $nombre_storage)->first();
            if (!$archivo) return response()->json(["message" => "El archivo no existe"], 404);

            Storage::disk('siigev_storage')->delete($archivo->nombre_storage);
            $archivo->delete();
            DB::commit();
            return response()->json(["message" => "Archivo eliminado"]);
        } catch (\Exception $e){
            DB::rollback();
            return response()->json(["message" => $e->getMessage()], 500);
        }
    }

    public static function get($publicacion){
        $registros = Archivo::where("publicacion_id", $publicacion->id)
            ->where("publicacion_tipo", $publicacion->tipo)
            ->get();

        if ($registros->count() === 0) return null;
        return $registros;
    }

    public function download(int $archivo_id){
        $archivo = Archivo::find($archivo_id);
        if (!$archivo) return response()->json(["message" => "El archivo no existe"], 404);

        $path = $archivo->nombre_storage;
        if (!Storage::disk('siigev_storage')->exists($path)) return response()->json(["message" => "El archivo no existe"], 404);

        return Storage::disk('siigev_storage')->download($path, $archivo->nombre_original);
    }
}
