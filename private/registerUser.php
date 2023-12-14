<?php
require $_SERVER['DOCUMENT_ROOT'] . '/ww.php';

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$type = $_GET["type"];
$name = $_GET["name"];
$browser = $_GET["browser"];
$current_date = date("Y-m-d");

$check_query = "SELECT COUNT(*) as count FROM players WHERE PLAYER_NAME = ? AND TYPE = ? AND DATE = ?";
$check_stmt = $mysqli->prepare($check_query);
$check_stmt->bind_param("sss", $name, $type, $current_date);
$check_stmt->execute();
$check_result = $check_stmt->get_result();
$check_data = $check_result->fetch_assoc();

if ($check_data['count'] > 0) {
    $response = ["message" => "User already exists for today"];
    echo json_encode($response);
} else {
    $qry = "INSERT INTO players (PLAYER_NAME, TYPE, DATE, BROWSER) VALUES (?, ?, ?, ?)";
    $mysqli_stmt = $mysqli->prepare($qry);
    $mysqli_stmt->bind_param("ssss", $name, $type, $current_date, $browser);
    $mysqli_stmt->execute();
    $mysqli_stmt->close();

    $response = ["message" => "User inserted successfully"];
    echo json_encode($response);
}

$mysqli->close();
header('Content-Type: application/json; charset=utf-8');
?>
