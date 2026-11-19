<?php
// Local PHP development router only. Never upload this file as a public endpoint.
$root=realpath($_SERVER['DOCUMENT_ROOT']);
$path=rawurldecode(parse_url($_SERVER['REQUEST_URI'],PHP_URL_PATH));
if(str_contains($path,'..')||str_contains($path,"\0")||preg_match('~(?:^|/)\.~',$path)){http_response_code(404);exit;}
$file=realpath($root.$path);
if($file&&str_starts_with($file,$root.DIRECTORY_SEPARATOR)&&is_file($file))return false;
if($file&&is_dir($file)&&is_file($file.'/index.html')){
    if(!str_ends_with($path,'/')){header('Location: '.$path.'/',true,308);exit;}
    header('Content-Type: text/html; charset=utf-8');readfile($file.'/index.html');return true;
}
http_response_code(404);header('Content-Type: text/html; charset=utf-8');readfile($root.'/404.html');
