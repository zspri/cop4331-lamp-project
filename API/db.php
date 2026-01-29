<?php

function get_db_connection(): mysqli
{
    
    $DB_HOST = "localhost";
    $DB_NAME = "COP4331";
    $DB_USER = "root";
    $DB_PASS = "";
    $DB_PORT = 3306;

    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

    $conn = new mysqli($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME, $DB_PORT);
    $conn->set_charset("utf8mb4");

    return $conn;
}
