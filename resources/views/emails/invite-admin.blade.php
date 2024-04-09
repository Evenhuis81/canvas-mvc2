@component('mail::message')
<h1>Uitnodiging voor TimeInsight</h1>
Hoi {{$user->first_name}},
Je bent uitgenodigd als beheerder voor TimeInsight. Klik op de onderstaande knop om je te registreren.

@component('mail::button', ['url' => $url])
Registreren als beheerder
@endcomponent

@endcomponent
