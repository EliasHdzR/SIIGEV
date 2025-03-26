<?php

namespace App\Http\Controllers;

use App\Models\Alumno;
use App\Models\Maestro;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;

class UserDataController extends Controller
{
    public static function getUserDataFromAccessToken($token): JsonResponse
    {
        if(!$token) return response()->json(["message" => "No se proporcionó el token"], 400);

        try {
            $secretKey = env('ACCESS_TOKEN_SECRET');
            $tokenData = JWT::decode($token, new Key($secretKey, 'HS256'));
            $userData = self::getUserByUserId($tokenData->userId);
            return response()->json($userData);
        } catch (\Exception $e) {
            return response()->json(["message" => $e->getMessage()], 401);
        }
    }

    public static function getUserByUserId($userId): ?array
    {
        if (strlen($userId) == 7) {
            $alumno = Alumno::where('matricula', '=', $userId)->first();
            return [
                "id" => $alumno->matricula,
                "nombre" => $alumno->nombre,
                "email" => $alumno->email,
            ];
        }

        $maestro = Maestro::where('id', '=', $userId)->first();
        if ($maestro) return $maestro->toArray();

        return null;
    }

    public static function getUserByEmail($email): ?array
    {
        $alumno = Alumno::where('email', '=', $email)->first();
        if ($alumno) {
            return [
                "id" => $alumno->matricula,
                "nombre" => $alumno->nombre,
                "email" => $alumno->email,
                "password" => $alumno->password,
                "rol" => "alumno",
            ];
        }

        $maestro = Maestro::where('email', '=', $email)->first();
        if ($maestro) {
            return [
                "id" => $maestro->id,
                "nombre" => $maestro->nombre,
                "email" => $maestro->email,
                "password" => $maestro->password,
                "rol" => "maestro",
            ];
        }

        return null;
    }
}
