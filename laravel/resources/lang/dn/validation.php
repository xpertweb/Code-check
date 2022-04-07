<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines contain the default error messages used by
    | the validator class. Some of these rules have multiple versions such
    | as the size rules. Feel free to tweak each of these messages here.
    |
    */

    'accepted' => 'Det :attribute skal accepteres.',
    'active_url' => 'Det :attribute er ikke en gyldig URL.',
    'after' => 'Det :attribute skal være en dato efter :date.',
    'after_or_equal' => 'Det :attribute skal være en dato efter eller lig med :date.',
    'alpha' => 'Det :attribute må kun indeholde bogstaver.',
    'alpha_dash' => 'Det :attribute må kun indeholde bogstaver, tal, bindestreger og understregninger.',
    'alpha_num' => 'Det :attribute må kun indeholde bogstaver og tal.',
    'array' => 'Det :attribute skal være en matrix.',
    'before' => 'Det :attribute skal være en dato før :date.',
    'before_or_equal' => 'Det :attribute skal være en dato før eller lig med :date.',
    'between' => [
        'numeric' => 'Det :attribute skal være mellem :min og :max.',
        'file' => 'Det :attribute skal være mellem :min og :max kilobytes.',
        'string' => 'Det :attribute skal være mellem :min og :max characters.',
        'array' => 'Det :attribute skal være mellem :min og :max items.',
    ],
    'boolean' => 'Det :attribute felt skal være sandt eller falsk.',
    'confirmed' => 'Det :attribute bekræftelse stemmer ikke overens.',
    'date' => 'Det :attribute er ikke en gyldig dato.',
    'date_equals' => 'Det :attribute skal være en dato, der er lig med :date.',
    'date_format' => 'Det :attribute stemmer ikke overens med formatet :format.',
    'different' => 'Det :attribute og :other skal være anderledes.',
    'digits' => 'Det :attribute må være :digits cifre.',
    'digits_between' => 'Det :attribute skal være mellem :min og :max cifre.',
    'dimensions' => 'Det :attribute has invalid image dimensions.',
    'distinct' => 'Det :attribute feltet har en duplikatværdi.',
    'email' => 'Det :attribute Skal være en gyldig e-mail-adresse.',
    'ends_with' => 'Det :attribute skal slutte med et af følgende: :values',
    'exists' => 'Det valgte :attribute er ugyldig.',
    'file' => 'Det :attribute skal være en fil.',
    'filled' => 'Det :attribute felt skal have en værdi.',
    'gt' => [
        'numeric' => 'Det :attribute skal være større end :value.',
        'file' => 'Det :attribute skal være større end :value kilobytes.',
        'string' => 'Det :attribute skal være større end :value characters.',
        'array' => 'Det :attribute skal have mere end :value items.',
    ],
    'gte' => [
        'numeric' => 'Det :attribute skal være større end eller lige :value.',
        'file' => 'Det :attribute skal være større end eller lige :value kilobytes.',
        'string' => 'Det :attribute skal være større end eller lige :value characters.',
        'array' => 'Det :attribute må have :value varer eller mere.',
    ],
    'image' => 'Det :attribute skal være et billede.',
    'in' => 'Det valgte :attribute er ugyldig.',
    'in_array' => 'Det :attribute felt findes ikke i :other.',
    'integer' => 'Det :attribute skal være et heltal.',
    'ip' => 'Det :attribute skal være en gyldig IP-adresse.',
    'ipv4' => 'Det :attribute skal være en gyldig IPv4-adresse.',
    'ipv6' => 'Det :attribute skal være en gyldig IPv6-adresse.',
    'json' => 'Det :attribute skal være en gyldig JSON-streng.',
    'lt' => [
        'numeric' => 'Det :attribute skal være mindre end :value.',
        'file' => 'Det :attribute skal være mindre end :value kilobytes.',
        'string' => 'Det :attribute skal være mindre end :value characters.',
        'array' => 'Det :attribute skal have mindre end :value items.',
    ],
    'lte' => [
        'numeric' => 'Det :attribute skal være mindre end eller lige :value.',
        'file' => 'Det :attribute skal være mindre end eller lige :value kilobytes.',
        'string' => 'Det :attribute skal være mindre end eller lige :value characters.',
        'array' => 'Det :attribute må ikke have mere end :value items.',
    ],
    'max' => [
        'numeric' => 'Det :attribute må ikke være større end :max.',
        'file' => 'Det :attribute må ikke være større end :max kilobytes.',
        'string' => 'Det :attribute må ikke være større end :max characters.',
        'array' => 'Det :attribute må ikke være større end :max items.',
    ],
    'mimes' => 'Det :attribute skal være en filtype: :values.',
    'mimetypes' => 'Det :attribute skal være en filtype: :values.',
    'min' => [
        'numeric' => 'Det :attribute skal være mindst :min.',
        'file' => 'Det :attribute skal være mindst :min kilobytes.',
        'string' => 'Det :attribute skal være mindst :min characters.',
        'array' => 'Det :attribute skal være mindst :min items.',
    ],
    'not_in' => 'Det valgte :attribute er ugyldig.',
    'not_regex' => 'Det :attribute format er ugyldig.',
    'numeric' => 'Det :attribute skal være et tal.',
    'present' => 'Det :attribute felt skal være til stede.',
    'regex' => 'Det :attribute formatet er ugyldigt.',
    'required' => 'Det :attribute felt er påkrævet.',
    'required_if' => 'Det :attribute felt kræves når :other is :value.',
    'required_unless' => 'Det :attribute felt kræves, medmindre :other is in :values.',
    'required_with' => 'Det :attribute felt kræves når :values is present.',
    'required_with_all' => 'Det :attribute felt kræves når :values are present.',
    'required_without' => 'Det :attribute felt kræves når :values is not present.',
    'required_without_all' => 'Det :attribute felt kræves, når ingen af :values are present.',
    'same' => 'Det :attribute and :other must match.',
    'size' => [
        'numeric' => 'Det :attribute må være :size.',
        'file' => 'Det :attribute må være :size kilobytes.',
        'string' => 'Det :attribute må være :size characters.',
        'array' => 'Det :attribute skal indeholde :size items.',
    ],
    'starts_with' => 'Det :attribute skal starte med et af følgende: :values',
    'string' => 'Det :attribute skal være en streng.',
    'timezone' => 'Det :attribute skal være en gyldig zone.',
    'unique' => 'Det :attribute er allerede taget.',
    'uploaded' => 'Det :attribute kunne ikke uploades.',
    'url' => 'Det :attribute formatet er ugyldigt.',
    'uuid' => 'Det :attribute skal være en gyldig UUID.',

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | Here you may specify custom validation messages for attributes using the
    | convention "attribute.rule" to name the lines. This makes it quick to
    | specify a specific custom language line for a given attribute rule.
    |
    */

    'custom' => [
        'attribute-name' => [
            'rule-name' => 'custom-message',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    |
    | The following language lines are used to swap our attribute placeholder
    | with something more reader friendly such as "E-Mail Address" instead
    | of "email". This simply helps us make our message more expressive.
    |
    */

    'attributes' => [],

];
