<?php
require_once '../../config/cors.php';
require_once '../../config/database.php';
require_once '../../models/User.php';

// Only allow POST method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
    exit();
}

$database = new Database();
$db = $database->getConnection();

$user = new User($db);

// Get posted data
$data = json_decode(file_get_contents("php://input"));

// Validate required fields
if (
    empty($data->name) ||
    empty($data->email) ||
    empty($data->phone) ||
    empty($data->password)
) {
    http_response_code(400);
    echo json_encode(array(
        "message" => "Unable to register user. Data is incomplete.",
        "success" => false
    ));
    exit();
}

// Validate email format
if (!filter_var($data->email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(array(
        "message" => "Invalid email format.",
        "success" => false
    ));
    exit();
}

// Validate password strength (minimum 6 characters)
if (strlen($data->password) < 6) {
    http_response_code(400);
    echo json_encode(array(
        "message" => "Password must be at least 6 characters long.",
        "success" => false
    ));
    exit();
}

// Set user property values
$user->name = $data->name;
$user->email = $data->email;
$user->phone = $data->phone;
$user->password = $data->password;
$user->role = isset($data->role) ? $data->role : 'user';

try {
    // Check if email already exists
    if ($user->emailExists()) {
        http_response_code(409);
        echo json_encode(array(
            "message" => "Email already exists.",
            "success" => false
        ));
        exit();
    }

    if ($user->create()) {
        http_response_code(201);
        echo json_encode(array(
            "message" => "User registered successfully.",
            "success" => true
        ));
    } else {
        http_response_code(503);
        echo json_encode(array(
            "message" => "Unable to register user.",
            "success" => false
        ));
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "message" => "Unable to register user.",
        "error" => $e->getMessage(),
        "success" => false
    ));
}
?>
