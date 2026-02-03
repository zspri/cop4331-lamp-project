<?php

/* 
{
  "userId": 1,
  "contactId": 10,
  "firstName": "New",
  "lastName": "Name",
  "phone": "555",
  "email": "new@email.com"
}

*/

require_once(__DIR__ . "/config.php");
require_once(__DIR__ . "/db.php");

$data = get_json_body();

$userId    = (int)($data["userId"] ?? 0);
$contactId = (int)($data["contactId"] ?? 0);

if ($userId <= 0 || $contactId <= 0) {
    send_json(400, [
        "success" => false,
        "message" => "Missing required fields: userId, contactId"
    ]);
}

// Allow partial updates: only update provided fields
$firstName = array_key_exists("firstName", $data) ? trim((string)$data["firstName"]) : null;
$lastName  = array_key_exists("lastName",  $data) ? trim((string)$data["lastName"])  : null;
$phone     = array_key_exists("phone",     $data) ? trim((string)$data["phone"])     : null;
$email     = array_key_exists("email",     $data) ? trim((string)$data["email"])     : null;

$fields = [];
$params = [];
$types  = "";

// Build dynamic SET clause safely
if ($firstName !== null) { $fields[] = "FirstName = ?"; $params[] = $firstName; $types .= "s"; }
if ($lastName  !== null) { $fields[] = "LastName  = ?"; $params[] = $lastName;  $types .= "s"; }
if ($phone     !== null) { $fields[] = "Phone     = ?"; $params[] = $phone;     $types .= "s"; }
if ($email     !== null) { $fields[] = "Email     = ?"; $params[] = $email;     $types .= "s"; }

if (count($fields) === 0) {
    send_json(400, [
        "success" => false,
        "message" => "No updatable fields provided (firstName, lastName, phone, email)"
    ]);
}

try {
    $conn = get_db_connection();

    // Ensure the contact exists AND belongs to the user
    $check = $conn->prepare("SELECT ID FROM Contacts WHERE ID = ? AND UserID = ?");
    $check->bind_param("ii", $contactId, $userId);
    $check->execute();
    $checkRes = $check->get_result();

    if ($checkRes->num_rows === 0) {
        send_json(404, [
            "success" => false,
            "message" => "Contact not found for this user"
        ]);
    }

    $setClause = implode(", ", $fields);

    // Add WHERE params
    $types .= "ii";
    $params[] = $contactId;
    $params[] = $userId;

    $sql = "UPDATE Contacts SET $setClause WHERE ID = ? AND UserID = ?";
    $stmt = $conn->prepare($sql);

    // Bind dynamically
    $stmt->bind_param($types, ...$params);
    $stmt->execute();

    send_json(200, [
        "success" => true,
        "message" => "Contact updated",
        "data" => [
            "updatedRows" => $stmt->affected_rows
        ]
    ]);

} catch (mysqli_sql_exception $e) {
    send_json(500, [
        "success" => false,
        "message" => "Database error"
    ]);
}
