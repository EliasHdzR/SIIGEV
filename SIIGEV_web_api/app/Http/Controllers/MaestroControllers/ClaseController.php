<?php

namespace App\Http\Controllers\MaestroControllers;

use App\Http\Controllers\Controller;
use App\Models\Carrera;
use App\Models\Clase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;

class ClaseController extends Controller
{
    public function getClases(Request $request): JsonResponse
    {
        $userData = $request->userData;
        $clases = Clase::where("maestro_id", "=", $userData["id"])
            ->with("maestro")
            ->orderBy("nombre", "asc")
            ->get();
        return response()->json($clases);
    }

    public function getCarreras(): JsonResponse
    {
        $carreras = Carrera::orderBy("nombre", "asc")->get();
        return response()->json($carreras);
    }

    public function store(Request $request): JsonResponse
    {
        $userData = $request->userData;
        DB::beginTransaction();

        try {
            $nuevaClase = [
                "carrera_id" => $request["carrera_id"],
                "maestro_id" => $userData["id"],
                "nombre" => $request["nombre"],
                "descripcion" => $request["descripcion"],
                "codigo" => $request["codigo"],
                "cuatrimestre" => $request["cuatrimestre"],
            ];

            // se itera sobre las propiedades de nuevaClase y si alguna de ellas no tiene valor se lanza una excepcion
            // la excepcion se lanza con el nombre de la propiedad que no tiene valor para poder identificarla
            foreach ($nuevaClase as $propiedad => $valor) {
                if (!trim($valor)) throw new \Exception("El campo $propiedad es obligatorio");
            }

            // se verifica que la carrera existe
            $carrera = Carrera::find($nuevaClase["carrera_id"]);
            if (!$carrera) throw new \Exception("La carrera no existe");

            // verificar el cuatrimestre
            if (!in_array($nuevaClase["cuatrimestre"], [1, 2, 3, 4, 5, 6, 7, 8])) {
                throw new \Exception("El cuatrimestre no es válido");
            }

            Clase::create($nuevaClase);
            DB::commit();
            return response()->json(["message" => "Clase creada correctamente"], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(["message" => $e->getMessage()], 500);
        }
    }
}
