<?php

namespace App\Http\Controllers\AlumnoControllers;

use App\Http\Controllers\ArchivosController;
use App\Http\Controllers\Controller;
use App\Models\Alumno;
use App\Models\Clase;
use App\Models\Tarea;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
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
            $tarea = DB::table('tareas')->where('id', $tarea_id)->first();
            if (!$tarea) {
                throw new Exception("La tarea no existe.");
            }

            // Registrar la entrega si no existe
            $entrega = DB::table('entregas')->where([
                ['alumno_matricula', '=', $alumno_id],
                ['tarea_id', '=', $tarea_id],
            ])->first();

            if (!$entrega) {
                $entrega_id = DB::table('entregas')->insertGetId([
                    'alumno_matricula' => $alumno_id,
                    'tarea_id' => $tarea_id,
                    'calificacion' => null,
                    'entregada' => 0, // Estado inicial
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            } else {
                $entrega_id = $entrega->id;
            }

            // Procesar y guardar los archivos
            $archivoRegistros = [];
            if ($archivos && count($archivos) > 0) {
                foreach ($archivos as $archivo) {
                    $archivo = (object)$archivo;

                    // Validar el archivo
                    if (!$archivo->isValid()) {
                        throw new Exception("El archivo no es válido.");
                    }
                    if ($archivo->getSize() > 5000000) {
                        throw new Exception("El archivo excede el tamaño máximo permitido.");
                    }
                    if (!in_array($archivo->getClientOriginalExtension(), ["jpg", "jpeg", "png", "pdf", "txt"])) {
                        throw new Exception("El tipo de archivo no es válido: " . $archivo->getClientOriginalExtension());
                    }

                    // Verificar si el archivo ya existe
                    $archivoExistente = DB::table('archivos')->where([
                        ['publicacion_id', '=', $entrega_id],
                        ['publicacion_tipo', '=', 'entregas'],
                        ['nombre_original', '=', $archivo->getClientOriginalName()],
                    ])->first();

                    if ($archivoExistente) {
                        continue; // Omitir si el archivo ya existe
                    }

                    // Guardar el archivo en la tabla 'archivos'
                    $archivo_id = DB::table('archivos')->insertGetId([
                        'publicacion_id' => $entrega_id,
                        'publicacion_tipo' => 'entregas',
                        'nombre_original' => $archivo->getClientOriginalName(),
                        'nombre_storage' => $archivo->store('entregas'), // Guardar en el almacenamiento
                        'extension' => $archivo->getClientOriginalExtension(),
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);

                    $archivoRegistros[] = DB::table('archivos')->where('id', $archivo_id)->first();
                }
            }

            DB::commit();
            return response()->json([
                'message' => 'Archivos subidos exitosamente.',
                'entrega' => DB::table('entregas')->where('id', $entrega_id)->first(),
                'archivos' => $archivoRegistros,
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
            ], 200);
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

            // Verificar si el archivo pertenece a la entrega
            $archivo = DB::table('archivos')->where([
                ['id', '=', $archivo_id],
                ['publicacion_id', '=', $entrega->id],
                ['publicacion_tipo', '=', 'entregas'],
            ])->first();

            if (!$archivo) {
                return response()->json(['message' => 'El archivo no pertenece a esta entrega.'], 403);
            }

            // Eliminar el archivo del almacenamiento
            if (\Storage::exists($archivo->nombre_storage)) {
                \Storage::delete($archivo->nombre_storage);
            }

            // Eliminar el archivo de la base de datos
            DB::table('archivos')->where('id', $archivo_id)->delete();

            return response()->json(['message' => 'Archivo eliminado exitosamente.'], 200);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}