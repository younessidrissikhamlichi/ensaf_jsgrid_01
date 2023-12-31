<?php

$connect = new PDO("mysql:host=localhost;dbname=ensaf_jsgrid_01", "root", "");

$data = array(
    ':first_name'   =>  $_POST['first_name'],
    ':last_name'    =>  $_POST["last_name"],
    ':age'          =>  $_POST["age"],
    ':gender'       =>  $_POST["gender"]
);

$query = "INSERT INTO sample_data (first_name, last_name, age, gender) VALUES (:first_name, :last_name, :age, :gender)";
$statement = $connect->prepare($query);
$statement->execute($data);
