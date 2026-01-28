<?php
// api/deleteContact.php
require_once(__DIR__ . "/config.php");
require_once(__DIR__ . "/db.php");

$data = get_json_body();

// Expected input:
// { "userId":123, "contactId":456 }
$userId    = $data["userId"] ?? null;
$contactId = $data["contactId"] ?? null;

if (!$userId || !$contactId) {
    send_json(400, [
        "success" => false,
        "message" => "Missing required fields: userId, contactId"
    ]);
}

$stmt = $conn->prepare(
    "DELETE FROM Contacts WHERE ID = ? AND UserID = ?"
);
$stmt->bind_param("ii", $contactId, $userId);

if (!$stmt->execute()) {
    send_json(500, [
        "success" => false,
        "message" => "Failed to delete contact"
    ]);
}

if ($stmt->affected_rows === 0) {
    send_json(404, [
        "success" => false,
        "message" => "Contact not found or does not belong to user"
    ]);
}

$stmt->close();

send_json(200, [
    "success" => true,
    "message" => "Contact deleted successfully",
    "data" => [
        "deleted" => true,
        "contactId" => $contactId
    ]
]);
