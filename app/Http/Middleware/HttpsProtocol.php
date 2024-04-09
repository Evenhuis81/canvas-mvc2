<?php

declare(strict_types = 1);

namespace App\Http\Middleware;

// the middleware will redirect every request to https if:
//
// * The current request comes with no secure protocol (http)
// * If your environment is equals to production. So, just adjust the settings according to your preferences.
//
// more info at: https://stackoverflow.com/questions/28402726/laravel-5-redirect-to-https
// class HttpsProtocol
// {

//     public function handle($request, Closure $next)
//     {
//         $request->setTrustedProxies([$request->getClientIp()], Request::HEADER_X_FORWARDED_ALL);

//         if (!$request->secure() && App::environment() === 'production') {
//             return redirect()->secure($request->getRequestUri());
//         }

//         return $next($request);
//     }
// }
