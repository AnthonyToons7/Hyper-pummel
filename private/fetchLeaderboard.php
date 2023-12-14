<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require $_SERVER['DOCUMENT_ROOT'] . '/ww.php';

$type = $_GET["filterType"];
$userinfo = [];
$searchBrowser = '%' . $type . '%';

switch($type){
    case "firefox":
    case "chrome":
        $qry = "SELECT PLAYER_NAME, TYPE, CPS, DATE, BROWSER FROM players WHERE BROWSER LIKE ? ORDER BY CPS DESC";
        $mysqli_stmt = $mysqli->prepare($qry);
        $mysqli_stmt->bind_param("s",$searchBrowser);
        $mysqli_stmt->execute();
        $result = $mysqli_stmt->get_result();
        while ($yes = $result->fetch_assoc()){
            $userinfo[] = $yes;
        }
        break;
    case "cps":
        $qry = "SELECT PLAYER_NAME, TYPE, CPS, DATE, BROWSER FROM players ORDER BY CPS DESC";
        $mysqli_stmt = $mysqli->prepare($qry);
        $mysqli_stmt->execute();
        $result = $mysqli_stmt->get_result();
        while ($yes = $result->fetch_assoc()){
            $userinfo[] = $yes;
        }
        break;
    default:
        $qry = "SELECT PLAYER_NAME, TYPE, CPS, DATE, BROWSER FROM players WHERE TYPE = ? ORDER BY CPS DESC";
        $mysqli_stmt = $mysqli->prepare($qry);
        $mysqli_stmt->bind_param("s",$type);
        $mysqli_stmt->execute();
        $result = $mysqli_stmt->get_result();
        while ($yes = $result->fetch_assoc()){
            $userinfo[] = $yes;
        }
        break;
}

$mysqli->close();

header('Content-Type: application/json; charset=utf-8');

echo json_encode($userinfo);