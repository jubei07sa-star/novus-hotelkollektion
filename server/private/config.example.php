<?php
// Copy to config.php OUTSIDE every domain's document root. Never commit credentials.
return [
    'dsn' => 'mysql:host=localhost;dbname=YOUR_DATABASE;charset=utf8mb4',
    'db_user' => 'YOUR_DATABASE_USER',
    'db_password' => '',
    'secret' => '', // At least 32 random characters; generate with bin2hex(random_bytes(32)).
    'secure_cookies' => true,
    'storage' => __DIR__ . '/storage',
    'mail_from' => '', // A real mailbox on an operator-owned domain, configured in ALL-INKL.
    'mail_transport' => 'mail', // Uses ALL-INKL's local mail service; 'log' ONLY in local tests.
    'recipients' => [
        'landhotel-tanne' => '', 'hotel-adler' => '', 'goldenen-wagen' => '',
        'ochsen-binzen' => '', 'krone-wiechs' => '',
    ],
];
