<?php
require $_SERVER['DOCUMENT_ROOT'] . '/ww.php';

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$cps = $_GET["cps"];
$name = $_GET["user"];
$type = $_GET["type"];
$browser = $_GET["browser"];
$current_date = date("Y-m-d");

$qry = "SELECT CPS FROM players WHERE PLAYER_NAME = ? AND DATE = ? AND TYPE = ?";
$mysqli_stmt = $mysqli->prepare($qry);
$mysqli_stmt->bind_param("sss", $name, $current_date, $type);
$mysqli_stmt->execute();
$res = $mysqli_stmt->get_result();
$pog = $res->fetch_assoc();
if ($cps >= $pog['CPS'] || $pog['CPS'] == NULL){   
    $qry = "UPDATE players SET CPS = ?, BROWSER = ? WHERE PLAYER_NAME = ? AND DATE = ? AND TYPE = ?";
    $mysqli_stmt = $mysqli->prepare($qry);
    $mysqli_stmt->bind_param("sssss",$cps, $browser, $name, $current_date, $type);
    $mysqli_stmt->execute();
    $result = $mysqli_stmt->get_result();
    $mysqli->close();
}

header('Content-Type: application/json; charset=utf-8');