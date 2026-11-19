<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('X-Robots-Tag: noindex, nofollow');
try {
    $site = require __DIR__ . '/site.php';
    require dirname(__DIR__, 2) . '/private/bootstrap.php';
    dispatch($site);
} catch (Throwable $e) {
    error_log('Hotel API failed: ' . get_class($e));
    http_response_code(503);
    echo json_encode(['error' => 'Der Dienst ist vorübergehend nicht verfügbar. Bitte kontaktieren Sie das Hotel direkt.']);
}
