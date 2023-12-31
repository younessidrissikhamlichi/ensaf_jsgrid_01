<?php
$path    = 'assets/css/';
$files = scandir($path);
$files = array_diff(scandir($path), array('.', '..'));
foreach ($files as $value) {
    echo '<link href="/assets/css/'.$value.'" rel="stylesheet" />';
}
?>