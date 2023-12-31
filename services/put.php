<?php
$connect = new PDO("mysql:host=localhost;dbname=ensaf_jsgrid_01", "root", "");

parse_str(file_get_contents("php://input"), $_PUT);
$data = array(
    ':id'   => $_PUT['id'],
    ':first_name' => $_PUT['first_name'],
    ':last_name' => $_PUT['last_name'],
    ':age'   => $_PUT['age'],
    ':gender'  => $_PUT['gender']
);
$query = " 
        UPDATE sample_data 
        SET first_name = :first_name, 
        last_name = :last_name, 
        age = :age, 
        gender = :gender 
        WHERE id = :id
    ";
$statement = $connect->prepare($query);
$statement->execute($data);
