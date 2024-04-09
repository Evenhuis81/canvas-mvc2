<?php

declare(strict_types = 1);

namespace App\Mail;

use App\Models\AdminInvitation;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class InviteAsAdmin extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $adminInvitation;
    public $url;

    /**
     * Create a new message instance.
     */
    // phpcs:disable
    public function __construct(User $user, AdminInvitation $adminInvitation)
    {
        $this->user = $user;
        $this->adminInvitation = $adminInvitation;
        $this->url = route('register-admin', $adminInvitation->hash);
    }
    // phpcs:enable

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->markdown('emails.invite-admin', [
            'user' => $this->user,
            'adminInvitation' => $this->adminInvitation,
            'url' => $this->url,
        ])->subject('Uitnodiging voor TimeInsight');
    }
}
