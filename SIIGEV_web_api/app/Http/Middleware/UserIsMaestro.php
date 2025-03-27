<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class UserIsMaestro
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $userData = $request->userData;

        if (!$userData || !isset($userData["rol"]) || $userData["rol"] != "maestro") {
            return response()->json(["message" => "No autorizado"], 403);
        }

        return $next($request);
    }
}
