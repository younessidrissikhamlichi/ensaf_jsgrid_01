<?php
$path    = 'assets/js/';
$files = scandir($path,SCANDIR_SORT_DESCENDING );
$files = array_diff(scandir($path), array('.', '..'));
foreach ($files as $value) {
    
    $ext = pathinfo('/assets/css/'.$value, PATHINFO_EXTENSION);
    if($ext !="js"){
        continue;
    }
    if($value==".DS_Store")
        continue;
    echo '<script src="/assets/js/'.$value.'"></script>';
}
?>