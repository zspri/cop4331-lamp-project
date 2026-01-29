<?php

/*
input json
{
  "userId": 1,
  "firstName": "John",
  "lastName": "Doe",
  "phone": "123",
  "email": "john@x.com"
}

output json
{ "success": true, "message": "Contact added", "data": { "contactId": 10 } }
*/

require_once(__DIR__ . "/config.php");
require_once(__DIR__ . "/db.php");

$data = get_json_body();

$userId    = (int)($data["userId"] ?? 0);
$firstName = trim($data["firstName"] ?? "");
$lastName  = trim($data["lastName"] ?? "");
$phone     = trim($data["phone"] ?? "");
$email     = trim($data["email"] ?? "");

if ($userId <= 0 || $firstName === "" || $lastName === "") {
    send_json(400, [
        "success" => false,
        "message" => "Missing required fields: userId, firstName, lastName"
    ]);
}

try {
    $conn = get_db_connection();

    // Optional: verify user exists
    $u = $conn->prepare("SELECT ID FROM Users WHERE ID = ?");
    $u->bind_param("i", $userId);
    $u->execute();
    $uRes = $u->get_result();
    if ($uRes->num_rows === 0) {
        send_json(404, [
            "success" => false,
            "message" => "User not found"
        ]);
    }

    // Schema: Contacts(FirstName, LastName, Phone, Email, UserID)
    $stmt = $conn->prepare(
        "INSERT INTO Contacts (FirstName, LastName, Phone, Email, UserID)
         VALUES (?, ?, ?, ?, ?)"
    );
    $stmt->bind_param("ssssi", $firstName, $lastName, $phone, $email, $userId);
    $stmt->execute();

    send_json(201, [
        "success" => true,
        "message" => "Contact added",
        "data" => [
            "contactId" => (int)$conn->insert_id
        ]
    ]);

} catch (mysqli_sql_exception $e) {
    send_json(500, [
        "success" => false,
        "message" => "Database error"
    ]);
}
