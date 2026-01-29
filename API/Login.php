
<?php
/* 
Input input Json 
{ "login": "someLogin", "password": "somePass" }

Output Json 
{ "success": true, "message": "Login successful", "data": { "userId": 1, "firstName": "...", "lastName": "..." } }

*/
require_once(__DIR__ . "/config.php");
require_once(__DIR__ . "/db.php");

$data = get_json_body();

$login = trim($data["login"] ?? "");
$password = trim($data["password"] ?? "");

if ($login === "" || $password === "") {
    send_json(400, [
        "success" => false,
        "message" => "Missing required fields: login, password"
    ]);
}

try {
    $conn = get_db_connection();

    // Schema: Users(Login, Password)
    $stmt = $conn->prepare("SELECT ID, FirstName, LastName, Password FROM Users WHERE Login = ?");
    $stmt->bind_param("s", $login);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        send_json(401, [
            "success" => false,
            "message" => "Invalid login or password"
        ]);
    }

    $user = $result->fetch_assoc();

   // plaintext password
    if ($user["Password"] !== $password) {
        send_json(401, [
            "success" => false,
            "message" => "Invalid login or password"
        ]);
    }

    send_json(200, [
        "success" => true,
        "message" => "Login successful",
        "data" => [
            "userId" => (int)$user["ID"],
            "firstName" => $user["FirstName"],
            "lastName" => $user["LastName"]
        ]
    ]);

} catch (mysqli_sql_exception $e) {
    send_json(500, [
        "success" => false,
        "message" => "Database error"
        
    ]);
}
