<?php

namespace App\Http\Controllers\MaestroControllers;

use App\Http\Controllers\Controller;
use App\Models\Alumno;
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

    public function getInfoClase(Request $request, int $clase_id): JsonResponse
    {
        $userData = $request->userData;

        // se verifica que la clase existe
        $clase = Clase::find($clase_id);
        if (!$clase) return response()->json(["message" => "La clase no existe"], 500);

        // se verifica que el maestro es el dueño de la clase
        if ($clase->maestro_id != $userData["id"]) return response()->json(["message" => "No autorizado"], 500);

        return response()->json($clase);
    }

    public function addAlumno(Request $request): JsonResponse
    {
        $userData = $request->userData;
        DB::beginTransaction();

        try {
            $alumnoMatricula = $request["matricula"];
            $claseId = $request["clase_id"];

            // se verifica que la clase existe
            $clase = Clase::find($claseId);
            if (!$clase) throw new \Exception("La clase no existe");

            // se verifica que el maestro es el dueño de la clase
            if ($clase->maestro_id != $userData["id"]) throw new \Exception("No tienes permiso para agregar alumnos a esta clase");

            // se verifica que el alumno existe
            if (!isset($alumnoMatricula)) throw new \Exception("No se definió la matrícula del alumno");
            $alumno = Alumno::where("matricula", "=", $alumnoMatricula)->first();
            if (!$alumno) throw new \Exception("El alumno no existe");

            $alumno->clases()->attach($claseId, [
                "alumno_matricula" => $alumno["matricula"],
                "clase_id" => $claseId,
            ]);

            DB::commit();
            $alumnosRegistrados = $this->getAlumnosRegistrados($request, $claseId);
            $alumnosNoRegistrados = $this->getAlumnosNoRegistrados($request, $claseId);
            return response()->json(["registrados" => $alumnosRegistrados, "no_registrados" => $alumnosNoRegistrados], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(["message" => $e->getMessage()], 500);
        }
    }

    /**
     * @param Request $request
     * @param int $clase_id el id de la clase
     * @return JsonResponse response con el listado de alumnos registrados en la clase
     */
    public function getAlumnosRegistrados(Request $request, int $clase_id): JsonResponse
    {
        $userData = $request->userData;

        // se verifica que la clase existe
        $clase = Clase::find($clase_id);
        if (!$clase) return response()->json(["message" => "La clase no existe"], 500);

        // se verifica que el maestro es el dueño de la clase
        if ($clase->maestro_id != $userData["id"]) return response()->json(["message" => "No autorizado"], 500);

        $alumnos = Alumno::whereHas("clases", function ($query) use ($clase_id) {
            $query->where("clase_id", "=", $clase_id);
        })->get();

        return response()->json($alumnos);
    }

    /**
     * @param Request $request
     * @param int $clase_id el id de la clase
     * @return JsonResponse el listado de alumnos que AUN NO están registrados en la clase
     */
    public function getAlumnosNoRegistrados(Request $request, int $clase_id): JsonResponse
    {
        $userData = $request->userData;
        $claseId = $clase_id;

        // se verifica que la clase existe
        $clase = Clase::find($clase_id);
        if (!$clase) return response()->json(["message" => "La clase no existe"], 500);

        // se verifica que el maestro es el dueño de la clase
        if ($clase->maestro_id != $userData["id"]) return response()->json(["message" => "No Autorizado"], 500);

        $alumnosNoRegistrados = Alumno::whereDoesntHave("clases", function ($query) use ($claseId) {
            $query->where("clase_id", "=", $claseId);
        })->get();
        return response()->json($alumnosNoRegistrados);
    }
}
