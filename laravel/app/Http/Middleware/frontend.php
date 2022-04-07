<?php

namespace App\Http\Middleware;
use Closure;
use Config;

class frontend
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        config(['services.site.domain' => '1']);
        return $next($request);
    }
}
