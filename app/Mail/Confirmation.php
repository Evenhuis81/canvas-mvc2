<?php

declare(strict_types = 1);

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class Confirmation extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $url;

    /**
     * Create a new message instance.
     */
    // phpcs:disable
    public function __construct(User $user)
    {
        $this->user = $user;
        // $this->url = "http://127.0.0.1:8000/";
        $this->url = env('APP_URL');
    }
    // phpcs:enable

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->markdown('emails.confirmation', [
            'user' => $this->user,
            'url' => $this->url,
        ])->subject('Bevestiging registratie voor TimeInsight');
    }
}
