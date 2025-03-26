<?php

namespace App\Http\Controllers\MaestroControllers;

use App\Http\Controllers\Controller;
use App\Models\Clase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ClaseController extends Controller
{
    public function store(Request $request)
    {
        DB::beginTransaction();

        try {
            $nuevaClase = [
                "carrera_id" => $request["carrera_id"],
                "maestro_id" => $request["maestro_id"],
                "nombre" => $request["nombre"],
                "descripcion" => $request["descripcion"],
                "codigo" => $request["codigo"],
                "cuatrimestre" => $request["cuatrimestre"],
            ];

            Clase::create($nuevaClase);
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(["message" => $e->getMessage()], 500);
        }
    }
}
