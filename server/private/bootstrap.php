<?php
declare(strict_types=1);

const HOTEL_NAMES = [
 'landhotel-tanne'=>'Landhotel & Restaurant Tanne', 'hotel-adler'=>'Hotel & Restaurant Adler',
 'goldenen-wagen'=>'Hotel zum Goldenen Wagen', 'ochsen-binzen'=>'Ochsen Hotel & Restaurant',
 'krone-wiechs'=>'Hotel Restaurant Krone',
];
function config(): array {
    static $value;
    if (!$value) {
        $value = require (getenv('NOVUS_CONFIG') ?: __DIR__ . '/config.php');
        if (strlen($value['secret'] ?? '') < 32) throw new RuntimeException('Missing application secret');
    }
    return $value;
}
function db(): PDO {
    static $pdo;
    if (!$pdo) {
        $c = config();
        $pdo = new PDO($c['dsn'], $c['db_user'], $c['db_password'], [PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION, PDO::ATTR_EMULATE_PREPARES=>false, PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC]);
    }
    return $pdo;
}
function reply(array $data, int $status=200): never { http_response_code($status); echo json_encode($data, JSON_UNESCAPED_UNICODE|JSON_THROW_ON_ERROR); exit; }
function fail(string $message, int $status=400): never { reply(['error'=>$message],$status); }
function query(string $sql, array $args=[]): PDOStatement { $q=db()->prepare($sql);$q->execute($args);return $q; }
function session_open(): void {
    if (session_status()===PHP_SESSION_ACTIVE) return;
    ini_set('session.use_strict_mode','1'); ini_set('session.use_only_cookies','1');
    session_name('novus_session');
    session_set_cookie_params(['lifetime'=>0,'path'=>'/','secure'=>config()['secure_cookies'],'httponly'=>true,'samesite'=>'Strict']);
    session_start();
    if (isset($_SESSION['seen']) && time()-$_SESSION['seen']>1800) { $_SESSION=[];session_regenerate_id(true); }
    $_SESSION['seen']=time();
    $_SESSION['csrf'] ??= bin2hex(random_bytes(32));
}
function csrf(): void {
    session_open();
    if (!hash_equals($_SESSION['csrf'], $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '')) fail('Ihre Sitzung ist abgelaufen. Bitte erneut versuchen.',403);
    if (($_SERVER['HTTP_SEC_FETCH_SITE'] ?? '')==='cross-site') fail('Nicht erlaubt.',403);
}
function admin(string $site): void {
    if ($site!=='collection') fail('Bitte die zentrale Verwaltung verwenden.',403);
    session_open();
    if (!isset($_SESSION['user']) || !query('SELECT id FROM users WHERE id=? AND active=1',[$_SESSION['user']])->fetch()) fail('Bitte erneut anmelden.',401);
}
function rate(string $kind,int $max,int $seconds): void {
    $key=hash_hmac('sha256',$kind.'|'.($_SERVER['REMOTE_ADDR']??''),config()['secret']);
    query('DELETE FROM rate_limits WHERE expires_at < ?', [time()]);
    query('INSERT INTO rate_limits(bucket,hits,expires_at) VALUES(?,1,?) ON DUPLICATE KEY UPDATE hits=hits+1',[$key,time()+$seconds]);
    if ((int)query('SELECT hits FROM rate_limits WHERE bucket=?',[$key])->fetchColumn()>$max) {header('Retry-After: '.$seconds);fail('Zu viele Versuche. Bitte später erneut versuchen.',429);}
}
function payload(): array {
    if ((int)($_SERVER['CONTENT_LENGTH']??0)>65536) fail('Die Anfrage ist zu groß.',413);
    if (!str_starts_with(strtolower($_SERVER['CONTENT_TYPE']??''),'application/json')) fail('JSON erforderlich.',415);
    $raw=file_get_contents('php://input',false,null,0,65537);
    if(strlen($raw)>65536)fail('Die Anfrage ist zu groß.',413);
    try{$data=json_decode($raw,true,32,JSON_THROW_ON_ERROR);}catch(Throwable){fail('Ungültige Anfrage.');}
    if(!is_array($data)||array_is_list($data))fail('Ungültige Anfrage.');return $data;
}
function text_field(mixed $value,int $max,bool $required=false): string {
    if (!is_string($value)||mb_strlen($value)>$max||($required&&trim($value)==='')) fail('Bitte die Eingaben prüfen.');
    return trim($value);
}
function hotel_key(mixed $hotel,string $site): string {
    if(!is_string($hotel)||!isset(HOTEL_NAMES[$hotel]))fail('Unbekanntes Hotel.');
    if($site!=='collection'&&$hotel!==$site)fail('Nicht erlaubt.',403);return $hotel;
}
function menu_day(mixed $day): string {
    if(!is_string($day))fail('Ungültiges Datum.');
    $d=DateTimeImmutable::createFromFormat('!Y-m-d',$day);
    if(!$d||$d->format('Y-m-d')!==$day||$day<'2020-01-01'||$day>'2100-12-31')fail('Ungültiges Datum.');return $day;
}
function validate_dish(mixed $dish): array {
    if(!is_array($dish))fail('Ungültiges Gericht.');
    $out=[];
    foreach(['title'=>100,'description'=>240,'price'=>30] as $field=>$max)$out[$field]=text_field($dish[$field]??null,$max,$field!=='description');
    if(!preg_match('/^\d{1,4}(?:[.,]\d{1,2})?\s*€?$/u',$out['price']))fail('Ungültiger Preis.');
    foreach(['ingredients','origin','portion','pairing','allergenDetail'] as $field)if(isset($dish[$field]))$out[$field]=text_field($dish[$field],500);
    foreach(['signature','allergenConfirmed'] as $field)if(isset($dish[$field])){if(!is_bool($dish[$field]))fail('Ungültige Angaben.');$out[$field]=$dish[$field];}
    if(isset($dish['course'])){if(!in_array($dish['course'],['Vorspeise','Hauptgang','Dessert','Beilage','Getränk'],true))fail('Ungültiger Gang.');$out['course']=$dish['course'];}
    if(isset($dish['diet'])){if(!in_array($dish['diet'],['unspecified','vegetarian','vegan'],true))fail('Ungültige Ernährungsweise.');$out['diet']=$dish['diet'];}
    $allowed=['gluten','crustaceans','eggs','fish','peanuts','soy','milk','nuts','celery','mustard','sesame','sulphites','lupin','molluscs'];
    foreach(['allergens','traces'] as $field){$list=$dish[$field]??[];if(!is_array($list)||!array_is_list($list)||count($list)>14)fail('Ungültige Allergene.');foreach($list as $a)if(!is_string($a)||!in_array($a,$allowed,true))fail('Ungültige Allergene.');if(count(array_unique($list))!==count($list))fail('Doppelte Allergene.');$out[$field]=$list;}
    if(array_intersect($out['allergens'],$out['traces']))fail('Allergene und Spuren bitte getrennt angeben.');
    if(($out['allergenConfirmed']??false)&&array_intersect($out['allergens'],['gluten','nuts'])&&empty($out['allergenDetail']))fail('Getreide- und Nussarten bitte ergänzen.');
    $animal=['fish','crustaceans','molluscs'];if(($out['diet']??'')==='vegan')$animal=array_merge($animal,['milk','eggs']);
    if(in_array($out['diet']??'',['vegan','vegetarian'])&&array_intersect($out['allergens'],$animal))fail('Ernährungsweise und Allergene widersprechen sich.');
    return $out;
}
function menu_api(string $site,string $method): never {
    if($method==='GET'){
        $hotel=hotel_key($_GET['hotel']??null,$site);$day=menu_day($_GET['day']??null);
        $content=query('SELECT content FROM menus WHERE hotel=? AND menu_day=?',[$hotel,$day])->fetchColumn();
        $empty=['title'=>'','description'=>'','price'=>'','validOn'=>$day,'dishes'=>[]];
        reply(['special'=>$content?json_decode($content,true):$empty,'saved'=>(bool)$content]);
    }
    admin($site);csrf();
    if($method==='PUT'){
        $data=payload();$hotel=hotel_key($data['hotel']??null,$site);$day=menu_day($data['day']??null);
        $items=$data['special']['dishes']??null;
        if(!is_array($items)||!array_is_list($items)||count($items)<1||count($items)>12)fail('Bitte 1 bis 12 Gerichte angeben.');
        $dishes=array_map('validate_dish',$items);$special=array_merge($dishes[0],['validOn'=>$day,'dishes'=>$dishes]);
        query('INSERT INTO menus(hotel,menu_day,content) VALUES(?,?,?) ON DUPLICATE KEY UPDATE content=VALUES(content)',[$hotel,$day,json_encode($special,JSON_UNESCAPED_UNICODE|JSON_THROW_ON_ERROR)]);
        reply(['ok'=>true]);
    }
    if($method==='DELETE'){$hotel=hotel_key($_GET['hotel']??null,$site);$day=menu_day($_GET['day']??null);query('DELETE FROM menus WHERE hotel=? AND menu_day=?',[$hotel,$day]);reply(['ok'=>true]);}
    fail('Methode nicht erlaubt.',405);
}
function pdf_api(string $site,string $method): never {
    $hotel=hotel_key($_GET['hotel']??null,$site);
    if($method==='GET'){
        $row=query('SELECT filename,size FROM menu_files WHERE hotel=?',[$hotel])->fetch();
        if(!isset($_GET['file']))reply(['available'=>(bool)$row,'size'=>$row?(int)$row['size']:0]);
        if(!$row)fail('Keine PDF hinterlegt.',404);
        $file=config()['storage'].'/pdf/'.$row['filename'];if(!is_file($file))fail('Keine PDF hinterlegt.',404);
        header('Content-Type: application/pdf');header('Content-Length: '.filesize($file));header('Content-Disposition: attachment; filename="speisekarte-'.$hotel.'.pdf"');header("Content-Security-Policy: sandbox; default-src 'none'");readfile($file);exit;
    }
    admin($site);csrf();if($method!=='POST')fail('Methode nicht erlaubt.',405);
    $file=$_FILES['file']??null;
    if(!$file||is_array($file['error'])||$file['error']!==UPLOAD_ERR_OK||$file['size']<8||$file['size']>10*1024*1024||!is_uploaded_file($file['tmp_name']))fail('Bitte eine PDF bis 10 MB auswählen.');
    if(strtolower(pathinfo($file['name'],PATHINFO_EXTENSION))!=='pdf'||(new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name'])!=='application/pdf')fail('Ungültige PDF.');
    $bytes=file_get_contents($file['tmp_name']);if(!str_starts_with($bytes,'%PDF-')||!str_contains(substr($bytes,-1024),'%%EOF'))fail('Ungültige PDF.');
    $dir=config()['storage'].'/pdf';if(!is_dir($dir)&&!mkdir($dir,0700,true))throw new RuntimeException('Storage');
    $name=bin2hex(random_bytes(24)).'.pdf';$target=$dir.'/'.$name;
    if(!move_uploaded_file($file['tmp_name'],$target))throw new RuntimeException('Upload');
    try{
        db()->beginTransaction();$old=query('SELECT filename FROM menu_files WHERE hotel=? FOR UPDATE',[$hotel])->fetchColumn();
        query('INSERT INTO menu_files(hotel,filename,size) VALUES(?,?,?) ON DUPLICATE KEY UPDATE filename=VALUES(filename),size=VALUES(size)',[$hotel,$name,$file['size']]);db()->commit();
    }catch(Throwable $e){if(db()->inTransaction())db()->rollBack();unlink($target);throw $e;}
    if($old&&is_file($dir.'/'.$old))unlink($dir.'/'.$old);reply(['ok'=>true]);
}
function contact_api(string $site): never {
    csrf();rate('contact',5,900);$data=payload();$hotel=hotel_key($data['hotel']??null,$site);
    if(!empty($data['website']))fail('Die Nachricht konnte nicht gesendet werden.');
    $name=text_field($data['name']??null,100,true);$email=text_field($data['email']??null,180,true);$message=text_field($data['message']??null,2000,true);$phone=text_field($data['phone']??'',40);
    $topic=text_field($data['topic']??'general',30);
    if(!in_array($topic,['general','event','wellness','meeting'],true)||mb_strlen($name)<2||mb_strlen($message)<10||!filter_var($email,FILTER_VALIDATE_EMAIL)||preg_match('/[\r\n]/',$email))fail('Bitte Name, E-Mail und Nachricht prüfen.');
    $c=config();$to=$c['recipients'][$hotel]??'';$from=$c['mail_from']??'';
    foreach([$to,$from] as $address)if(!filter_var($address,FILTER_VALIDATE_EMAIL)||preg_match('/[\r\n]/',$address))fail('Das Kontaktformular ist noch nicht freigeschaltet. Bitte kontaktieren Sie uns direkt.',503);
    $id=bin2hex(random_bytes(16));$body="Kontaktanfrage: ".HOTEL_NAMES[$hotel]."\nAnliegen: $topic\nName: $name\nE-Mail: $email\nTelefon: $phone\n\n$message\n\nReferenz: $id";
    query('INSERT INTO contact_messages(id,hotel,content,status) VALUES(?,?,?,?)',[$id,$hotel,json_encode(['name'=>$name,'email'=>$email,'phone'=>$phone,'topic'=>$topic,'message'=>$message],JSON_UNESCAPED_UNICODE),'pending']);
    if(($c['mail_transport']??'mail')==='log'){
        if($c['secure_cookies'])throw new RuntimeException('Test transport forbidden in production');
        $dir=$c['storage'].'/mail';if(!is_dir($dir))mkdir($dir,0700,true);$sent=file_put_contents($dir.'/'.$id.'.txt',$body)!==false;
    }else{
        $subject='=?UTF-8?B?'.base64_encode('Kontaktanfrage · '.HOTEL_NAMES[$hotel]).'?=';
        $sent=mail($to,$subject,$body,['From'=>$from,'Reply-To'=>$email,'MIME-Version'=>'1.0','Content-Type'=>'text/plain; charset=UTF-8']);
    }
    query('UPDATE contact_messages SET status=? WHERE id=?',[$sent?'accepted':'failed',$id]);
    if(!$sent)fail('Der E-Mail-Versand ist fehlgeschlagen. Bitte kontaktieren Sie das Hotel direkt.',503);
    reply(['ok'=>true,'reference'=>$id]);
}
function dispatch(string $site): never {
    $endpoint=$_GET['endpoint']??'';$method=$_SERVER['REQUEST_METHOD'];
    if($endpoint==='session'&&$method==='GET'){session_open();reply(['csrf'=>$_SESSION['csrf'],'authenticated'=>$site==='collection'&&isset($_SESSION['user']),'testMode'=>(config()['mail_transport']??'mail')==='log'&&!config()['secure_cookies']]);}
    if($endpoint==='login'&&$method==='POST'){
        if($site!=='collection')fail('Nicht erlaubt.',403);csrf();rate('login',10,900);$data=payload();
        $email=text_field($data['email']??null,180,true);$password=$data['password']??null;
        if(!is_string($password)||strlen($password)>128||$password==='')fail('E-Mail-Adresse oder Passwort ist nicht korrekt.',401);
        $user=query('SELECT * FROM users WHERE email=? AND active=1',[strtolower($email)])->fetch();
        $hash=$user['password_hash']??'$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.';
        if(!password_verify($password,$hash)||!$user)fail('E-Mail-Adresse oder Passwort ist nicht korrekt.',401);
        session_regenerate_id(true);$_SESSION['user']=$user['id'];$_SESSION['csrf']=bin2hex(random_bytes(32));reply(['ok'=>true]);
    }
    if($endpoint==='logout'&&$method==='POST'){csrf();$_SESSION=[];session_destroy();setcookie('novus_session','',['expires'=>time()-3600,'path'=>'/','secure'=>config()['secure_cookies'],'httponly'=>true,'samesite'=>'Strict']);reply(['ok'=>true]);}
    if($endpoint==='menu')menu_api($site,$method);
    if($endpoint==='pdf')pdf_api($site,$method);
    if($endpoint==='contact'&&$method==='POST')contact_api($site);
    fail('Nicht gefunden.',404);
}
