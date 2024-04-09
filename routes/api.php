<?php

declare(strict_types = 1);

use App\Http\Controllers\AdminInvitationController;
use App\Http\Controllers\CardController;
use App\Http\Controllers\CardLinkController;
use App\Http\Controllers\CardTagScanController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\TagScanController;
use App\Http\Controllers\UserAdminInvitationController;
use App\Http\Controllers\UserCardController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WeekTagScanController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::resource('cards.tag_scans', CardTagScanController::class)->middleware('card.valid');

Route::get('/admin_invitations/{hash}', [AdminInvitationController::class, 'show'])->middleware('hash.valid');

Route::put('/admin_invitations/{hash}', [AdminInvitationController::class, 'update'])->middleware('hash.valid');

Route::middleware(['auth:sanctum'])->group(function () {
    Route::resource('date.tag_scans', WeekTagScanController::class);

    Route::resource('tag_scans', TagScanController::class);

    Route::resource('users', UserController::class);

    Route::resource('roles', RoleController::class);

    Route::resource('card_links', CardLinkController::class);

    Route::resource('users.cards', UserCardController::class);

    Route::resource('cards', CardController::class);

    Route::resource('admin_invitations', AdminInvitationController::class)->except(['show', 'update']);

    Route::resource('users.admin_invitations', UserAdminInvitationController::class);
});

require __DIR__ . '/auth.php';
