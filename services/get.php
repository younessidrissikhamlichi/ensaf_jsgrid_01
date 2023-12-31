<?php

$connect = new PDO("mysql:host=localhost;dbname=ensaf_jsgrid_01", "root", "");

$data = array(
    ':first_name'   => "%" . $_GET['first_name'] . "%",
    ':last_name'    => "%" . $_GET['last_name'] . "%",
    ':age'          => "%" . $_GET['age'] . "%",
    ':gender'       => "%" . $_GET['gender'] . "%"
);
$query = "SELECT * FROM sample_data WHERE first_name LIKE :first_name AND last_name LIKE :age AND age LIKE :age AND gender LIKE :gender ORDER BY id DESC";
$statement = $connect->prepare($query);
$statement->execute($data);
$result = $statement->fetchAll();
foreach ($result as $row) {
    $output[] = array(
        'id'            =>  $row['id'],
        'first_name'    =>  $row['first_name'],
        'last_name'     =>  $row['last_name'],
        'age'           =>  $row['age'],
        'gender'        =>  $row['gender']
    );
}
header("Content-Type: application/json");
echo json_encode($output);
