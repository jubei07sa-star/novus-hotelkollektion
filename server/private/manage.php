<?php
declare(strict_types=1);
if(PHP_SAPI!=='cli'){http_response_code(404);exit;}
require __DIR__.'/bootstrap.php';
$command=$argv[1]??'';
if($command==='install'){db()->exec(file_get_contents(__DIR__.'/schema.sql'));echo "Database tables ready.\n";}
elseif($command==='user'){
    // Credentials arrive on stdin as JSON, never as command-line arguments.
    $data=json_decode(stream_get_contents(STDIN),true,16,JSON_THROW_ON_ERROR);
    if(!filter_var($data['email']??'',FILTER_VALIDATE_EMAIL)||strlen($data['password']??'')<14||strlen($data['password'])>72)throw new RuntimeException('Valid email and a 14–72 byte password required');
    query('INSERT INTO users(email,password_hash) VALUES(?,?) ON DUPLICATE KEY UPDATE password_hash=VALUES(password_hash),active=1',[strtolower($data['email']),password_hash($data['password'],PASSWORD_DEFAULT)]);echo "Administrator saved.\n";
}elseif($command==='prune'){
    query('DELETE FROM contact_messages WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY)');
    query('DELETE FROM rate_limits WHERE expires_at < ?',[time()]);echo "Expired records removed.\n";
}else{echo "Commands: install | user (JSON stdin) | prune\n";exit(1);}
