@component('mail::message')
<h1>Bevestiging registratie voor TimeInsight</h1>
Hoi {{$user->first_name}},
Je bent nu geregistreerd als beheerder voor TimeInsight. Klik op de onderstaande knop om in te loggen.

@component('mail::button', ['url' => $url])
Naar TimeInsight
@endcomponent

@endcomponent
