<?php

declare(strict_types = 1);

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/register-admin/{hash}', fn () => view('welcome'))->middleware('hash.valid')->name('register-admin');

Route::get('/{any}', fn () => view('welcome'))->where('any', '.*');
