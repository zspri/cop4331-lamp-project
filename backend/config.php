<?php

function send_json(int $statusCode, array $payload): void
{
    http_response_code($statusCode);
    echo json_encode($payload);
    exit();
}

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Preflight request for CORS
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

// Enforce POST for all endpoints (you can remove this if you want GET endpoints)
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    send_json(405, [
        "success" => false,
        "message" => "Method not allowed. Use POST."
    ]);
}

function get_json_body(): array
{
    $raw = file_get_contents("php://input");
    $data = json_decode($raw, true);

    if ($data === null) {
        send_json(400, [
            "success" => false,
            "message" => "Invalid or missing JSON payload"
        ]);
    }

    return $data;
}
