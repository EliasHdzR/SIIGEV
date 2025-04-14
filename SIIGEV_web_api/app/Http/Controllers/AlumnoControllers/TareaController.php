<?php

namespace App\Http\Controllers\AlumnoControllers;

use App\Http\Controllers\ArchivosController;
use App\Http\Controllers\Controller;
use App\Models\Alumno;
use App\Models\Archivo;
use App\Models\Clase;
use App\Models\Entrega;
use App\Models\Tarea;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Carbon\Carbon;
use exception;
use Illuminate\Support\Facades\DB;

class TareaController extends Controller
{
    /**
     * Recupera una tarea específica por su ID
     *
     * @param Request $request
     * @param int $clase_id
     * @param int $tarea_id
     * @return JsonResponse
     */
    public function getTarea(Request $request, $clase_id, $tarea_id): JsonResponse
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

        $tarea = Tarea::find($tarea_id);

        if (!$tarea) {
            return response()->json(['error' => 'Tarea no encontrada'], 404);
        }

        // Agregar el campo 'tipo' dinámicamente
        $tarea->tipo = "tareas";

        // Recuperar archivos asociados a la tarea
        $tarea->archivos = ArchivosController::get($tarea);

        return response()->json(['tarea' => $tarea]);
    }

    public function subirArchivos(Request $request, int $clase_id, int $tarea_id): JsonResponse
    {
        $userData = $request->userData;
        $alumno_id = $userData['id'];
        $archivos = $request->archivos;

        DB::beginTransaction();
        try {
            // Verificar si la tarea existe manualmente
            $tarea = Tarea::find($tarea_id);
            if (!$tarea) throw new Exception("La tarea no existe.");

            // Registrar la entrega si no existe
            $entrega = DB::table('entregas')->where([
                ['alumno_matricula', '=', $alumno_id],
                ['tarea_id', '=', $tarea_id],
            ])->first();

            if (!$entrega) {
                $entrega = Entrega::create([
                    'alumno_matricula' => $alumno_id,
                    'tarea_id' => $tarea_id,
                    'entregada' => 0,
                ]);
            }

            $archivosEntrega = [];
            // Procesar y guardar los archivos
            if ($archivos && count($archivos) > 0) {
                foreach ($archivos as $archivo) {
                    $archivo = (object)$archivo;

                    // Validar el archivo
                    if (!$archivo->isValid()) throw new Exception("El archivo no es válido.");
                    if ($archivo->getSize() > 5000000) throw new Exception("El archivo excede el tamaño máximo permitido.");
                    if (!in_array($archivo->getClientOriginalExtension(), ["jpg", "jpeg", "png", "pdf", "txt"])) {
                        throw new Exception("El tipo de archivo no es válido: " . $archivo->getClientOriginalExtension());
                    }

                    // Guardar el archivo en la tabla 'archivos'
                    $entrega->tipo = "entregas";
                    $archivo->extension = $archivo->getClientOriginalExtension();
                    $archivo = ArchivosController::store($archivo, $entrega);
                    $archivosEntrega[] = $archivo;
                }
            }

            DB::commit();
            return response()->json([
                'message' => 'Archivos subidos exitosamente.',
                'entrega' => DB::table('entregas')->where('id', $entrega->id)->first(),
                'archivos' => $archivosEntrega,
            ], 201);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function getArchivosEntrega(Request $request, int $clase_id, int $tarea_id): JsonResponse
    {
        $userData = $request->userData;
        $alumno_id = $userData['id'];

        try {
            // Verificar si la tarea existe
            $tarea = DB::table('tareas')->where('id', $tarea_id)->first();
            if (!$tarea) {
                return response()->json(['message' => 'La tarea no existe.'], 404);
            }

            // Verificar si la entrega existe para el alumno y la tarea
            $entrega = DB::table('entregas')->where([
                ['alumno_matricula', '=', $alumno_id],
                ['tarea_id', '=', $tarea_id],
            ])->first();

            if (!$entrega) {
                return response()->json(['message' => 'No se encontró una entrega para esta tarea.'], 404);
            }

            // Recuperar los archivos asociados a la entrega
            $archivos = DB::table('archivos')
                ->where('publicacion_id', $entrega->id)
                ->where('publicacion_tipo', 'entregas')
                ->get();

            return response()->json([
                'message' => 'Archivos recuperados exitosamente.',
                'archivos' => $archivos,
            ]);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }   

    public function marcarComoCompletado(Request $request, int $clase_id, int $tarea_id): JsonResponse
    {
        $userData = $request->userData;
        $alumno_id = $userData['id'];

        try {
            // Verificar si la entrega existe manualmente
            $entrega = DB::table('entregas')->where([
                ['alumno_matricula', '=', $alumno_id],
                ['tarea_id', '=', $tarea_id],
            ])->first();

            if (!$entrega) {
                return response()->json(['message' => 'No se encontró una entrega para esta tarea.'], 404);
            }

            // Actualizar el estado de la entrega
            DB::table('entregas')->where('id', $entrega->id)->update([
                'entregada' => 1,
                'updated_at' => now(),
            ]);

            return response()->json([
                'message' => 'Tarea marcada como completada.',
                'entrega' => DB::table('entregas')->where('id', $entrega->id)->first(),
            ], 200);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function cancelarEntrega(Request $request, int $clase_id, int $tarea_id): JsonResponse
    {
        $userData = $request->userData;
        $alumno_id = $userData['id'];

        try {
            // Verificar si la entrega existe para el alumno y la tarea
            $entrega = DB::table('entregas')->where([
                ['alumno_matricula', '=', $alumno_id],
                ['tarea_id', '=', $tarea_id],
            ])->first();

            if (!$entrega) {
                return response()->json(['message' => 'No se encontró una entrega para esta tarea.'], 404);
            }

            // Verificar si la tarea ya está marcada como entregada
            if ($entrega->entregada == 0) {
                return response()->json(['message' => 'La entrega ya está cancelada.'], 400);
            }

            // Cambiar el estado de la entrega a "no entregada"
            DB::table('entregas')->where('id', $entrega->id)->update([
                'entregada' => 0,
                'updated_at' => now(),
            ]);

            return response()->json([
                'message' => 'Entrega cancelada exitosamente.',
                'entrega' => DB::table('entregas')->where('id', $entrega->id)->first(),
            ], 200);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function getEstadoEntrega(Request $request, int $clase_id, int $tarea_id): JsonResponse
    {
        $userData = $request->userData;
        $alumno_id = $userData['id'];

        try {
            // Verificar si la tarea existe
            $tarea = DB::table('tareas')->where('id', $tarea_id)->first();
            if (!$tarea) {
                return response()->json(['message' => 'La tarea no existe.'], 404);
            }

            // Verificar si la entrega existe para el alumno y la tarea
            $entrega = DB::table('entregas')->where([
                ['alumno_matricula', '=', $alumno_id],
                ['tarea_id', '=', $tarea_id],
            ])->first();

            if (!$entrega) {
                return response()->json([
                    'message' => 'No se encontró una entrega para esta tarea.',
                    'entregada' => 0 // Estado predeterminado si no hay entrega
                ], 200);
            }

            // Devolver el estado de la entrega
            return response()->json([
                'message' => 'Estado de la entrega recuperado exitosamente.',
                'entrega' => [
                    'id' => $entrega->id,
                    'entregada' => $entrega->entregada,
                    'updated_at' => $entrega->updated_at,
                ]
            ], 200);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function getCalificacionTarea(Request $request, int $clase_id, int $tarea_id): JsonResponse
    {
        $userData = $request->userData;
        $alumno_id = $userData['id'];

        try {
            // Verificar si la tarea existe
            $tarea = DB::table('tareas')->where('id', $tarea_id)->first();
            if (!$tarea) {
                return response()->json(['message' => 'La tarea no existe.'], 404);
            }

            // Verificar si la entrega existe para el alumno y la tarea
            $entrega = DB::table('entregas')->where([
                ['alumno_matricula', '=', $alumno_id],
                ['tarea_id', '=', $tarea_id],
            ])->first();

            if (!$entrega) {
                return response()->json([
                    'message' => 'No se encontró una entrega para esta tarea.',
                    'calificacion' => null // Devolver null si no hay entrega
                ], 200);
            }

            // Obtener la calificación directamente
            $calificacion = $entrega->calificacion;

            return response()->json([
                'message' => 'Calificación recuperada exitosamente.',
                'calificacion' => $calificacion,
            ], 200);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function eliminarArchivoEntrega(Request $request, int $clase_id, int $tarea_id, int $archivo_id): JsonResponse
    {
        $userData = $request->userData;
        $alumno_id = $userData['id'];

        try {
            // Verificar si la tarea existe
            $tarea = DB::table('tareas')->where('id', $tarea_id)->first();
            if (!$tarea) throw new Exception("La tarea no existe.");

            // Verificar si la entrega existe para el alumno y la tarea
            $entrega = DB::table('entregas')->where([
                ['alumno_matricula', '=', $alumno_id],
                ['tarea_id', '=', $tarea_id],
            ])->first();

            if (!$entrega) throw new Exception("La entrega no existe.");

            // Verificar si el archivo pertenece a la entrega
            $archivo = DB::table('archivos')->where([
                ['id', '=', $archivo_id],
                ['publicacion_id', '=', $entrega->id],
                ['publicacion_tipo', '=', 'entregas'],
            ])->first();

            if (!$archivo) throw new Exception("El archivo no pertenece a la entrega.");

            // Eliminar el archivo del almacenamiento
            $response = ArchivosController::destroy($archivo->nombre_storage);
            if ($response->getStatusCode() !== 200) throw new Exception("Error al eliminar el archivo: " . $response->getContent());

            // Eliminar el archivo de la base de datos
            DB::table('archivos')->where('id', $archivo_id)->delete();
            return response()->json(['message' => 'Archivo eliminado exitosamente.'], 200);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function getTareasPendientes(Request $request, int $clase_id): JsonResponse
    {
        $userData = $request->userData;
        $alumno_id = $userData['id'];

        try {
            // Obtener la fecha actual
            $fechaActual = now();

            // Recuperar las tareas pendientes de la clase
            $tareasPendientes = DB::table('tareas')
                ->join('temas', 'tareas.tema_id', '=', 'temas.id') // Unir con la tabla temas
                ->join('clases', 'temas.clase_id', '=', 'clases.id') // Unir con la tabla clases
                ->where('clases.id', $clase_id) // Filtrar por clase
                ->where('tareas.fecha_entrega', '>=', $fechaActual) // Filtrar tareas no vencidas
                ->whereNotExists(function ($query) use ($alumno_id) {
                    $query->select(DB::raw(1))
                        ->from('entregas')
                        ->whereRaw('entregas.tarea_id = tareas.id')
                        ->where('entregas.alumno_matricula', $alumno_id)
                        ->where('entregas.entregada', 1); // Excluir tareas ya entregadas
                })
                ->select('tareas.id', 'tareas.titulo as nombre', 'tareas.fecha_entrega') // Seleccionar campos específicos
                ->get();

            // Convertir las fechas al formato ISO 8601
            $tareasPendientes->transform(function ($tarea) {
                $tarea->fecha_entrega = Carbon::parse($tarea->fecha_entrega)->toISOString();
                return $tarea;
            });

            return response()->json($tareasPendientes, 200);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}