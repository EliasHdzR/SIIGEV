<?php

namespace App\Http\Middleware;

use App\Http\Controllers\UserDataController;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class UserIsAuthenticated
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $authorization = $request->header('Authorization');
        if (!$authorization || !str_starts_with($authorization, "Bearer ")) {
            return response()->json(["message" => "No se proporcionó el token"], 400);
        }

        $token = explode(" ", $authorization)[1];
        $userResponse = UserDataController::getUserDataFromAccessToken($token);
        if($userResponse->status() != 200) return response()->json($userResponse->getData(), $userResponse->getStatusCode());

        $userData = json_decode($userResponse->getContent(), true);
        $request->merge(["userData" => $userData]);
        return $next($request);
    }
}
