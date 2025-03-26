<?php

namespace App\Http\Controllers;

use Firebase\JWT\JWT;
use Illuminate\Http\JsonResponse;
use Ulid\Ulid;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $user = [
            "email" => $request["email"],
            "password" => $request["password"],
        ];

        if (!trim($user["email"]) || !trim($user["password"])) {
            return response()->json(["message" => "Se debe enviar username y password"], 400);
        }

        $userData = $this->validateCredentials($user);
        if (!$userData) return response()->json(["message" => "Credenciales incorrectas"], 401);

        $accesToken = $this->createAccessToken($userData["userId"]);
        if (!$accesToken) return response()->json(["message" => "Error al generar el token"], 500);
        $refreshToken = $this->createRefreshToken($userData["userId"]);

        return response()->json(["access_token" => $accesToken, "refresh_token" => $refreshToken, "rol" => $userData["userRol"]]);
    }

    private function validateCredentials($user): ?array
    {
        $userDB = UserDataController::getUserByEmail($user["email"]);
        if (!$userDB) return null;
        if (!Hash::check($user["password"], $userDB["password"])) return null;

        return [
            "userId" => $userDB["id"],
            "userRol" => $userDB["rol"],
        ];
    }

    private function createAccessToken($userId): ?string
    {
        $user = UserDataController::getUserByUserId($userId);
        if (!$user) return null;

        $exp = time() + env('ACCESS_TOKEN_EXPIRATION_SEC');
        $tokenData = [
            "userId" => $user["id"],
            "username" => $user["nombre"],
            "exp" => floor($exp),
        ];

        return JWT::encode($tokenData, env('ACCESS_TOKEN_SECRET'),'HS256');
    }

    private function createRefreshToken($userId): string
    {
        $now = time();
        $refreshToken = Ulid::generate(true);
        $fecha = date('Y-m-d H:i:s', $now);
        $fecha_caduca = date('Y-m-d H:i:s', $now + env('REFRESH_TOKEN_EXPIRATION_DAYS') * 24 * 60 * 60);

        $tokenDB = [
            "refresh_token" => $refreshToken,
            "alumno_matricula" => strlen($userId) == 7 ? $userId : null,
            "maestro_id" => strlen($userId) == 7 ? null : $userId,
            "fecha_generado" => $fecha,
            "fecha_caduca" => $fecha_caduca,
            "activo" => 1
        ];

        DB::table('refresh_tokens')->insert($tokenDB);
        return strval($refreshToken);
    }

    public function refreshToken(Request $request): JsonResponse
    {
        $refreshToken = $request->refresh_token;
        if(!$refreshToken) return response()->json(["message" => "Debe proporcionar el refresh token"], 400);

        $accessToken = $this->refreshAccessToken($refreshToken);
        if(!$accessToken) return response()->json(["message" => "Refresh token no válido o expirado"], 401);
        return response()->json(["access_token" => $accessToken]);
    }

    private function refreshAccessToken($refreshToken): ?string
    {
        $refreshTokenData = DB::table('refresh_tokens')
            ->where('refresh_token', $refreshToken)
            ->where('activo', 1)
            ->first();

        if(!$refreshTokenData) return null;

        if(time() > $refreshTokenData->fecha_caduca){
            $this->invalidateRefreshToken($refreshToken);
            return null;
        }

        return $this->createAccessToken($refreshTokenData->usuario_id);
    }

    public function logout(Request $request): JsonResponse
    {
        $refreshToken = $request->refresh_token;
        if(!$refreshToken) return response()->json(["message" => "Debe proporcionar el refresh token"], 400);

        $this->invalidateRefreshToken($refreshToken);
        return response()->json(["message" => "Sesión cerrada"]);
    }

    private function invalidateRefreshToken($refreshToken): void
    {
        DB::table('refresh_tokens')
            ->where('refresh_token', $refreshToken)
            ->update(['activo' => 0]);
    }
}
