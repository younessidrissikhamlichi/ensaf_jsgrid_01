<?php

$connect = new PDO("mysql:host=localhost;dbname=ensaf_jsgrid_01", "root", "");

parse_str(file_get_contents("php://input"), $_DELETE);
$query = "DELETE FROM sample_data WHERE id = '" . $_DELETE["id"] . "'";
$statement = $connect->prepare($query);
$statement->execute();
