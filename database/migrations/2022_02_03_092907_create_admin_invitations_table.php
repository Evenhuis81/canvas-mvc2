<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAdminInvitationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('admin_invitations', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->unsignedBigInteger('invitee_user_id');
            $table->foreign('invitee_user_id')->references('id')->on('users')->onDelete('cascade');
            $table->boolean('accepted')->default(false);
            $table->string('hash');
            $table->dateTime('expiration_date');
            $table->unsignedBigInteger('inviter_user_id');
            $table->foreign('inviter_user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('admin_invitations');
    }
}
