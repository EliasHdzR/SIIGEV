<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class UserIsAlumno
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $userData = $request->userData;

        if (!$userData || !isset($userData["rol"]) || $userData["rol"] != "alumno") {
            return response()->json(["message" => "No autorizado"], 403);
        }

        return $next($request);
    }
}
