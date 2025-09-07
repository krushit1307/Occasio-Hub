<?php
require_once '../../config/cors.php';
require_once '../../config/database.php';
require_once '../../models/User.php';
require_once '../../utils/JwtHandler.php';

// Only allow POST method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
    exit();
}

$database = new Database();
$db = $database->getConnection();

$user = new User($db);
$jwt = new JwtHandler();

// Get posted data
$data = json_decode(file_get_contents("php://input"));

// Validate required fields
if (empty($data->email) || empty($data->password)) {
    http_response_code(400);
    echo json_encode(array(
        "message" => "Email and password are required.",
        "success" => false
    ));
    exit();
}

// Set email property
$user->email = $data->email;

try {
    // Check if email exists
    if ($user->emailExists()) {
        // Verify password
        if (password_verify($data->password, $user->password)) {
            // Generate JWT tokens
            $tokens = $jwt->generateTokens($user->id, $user->email, $user->role);

            http_response_code(200);
            echo json_encode(array(
                "message" => "Login successful.",
                "success" => true,
                "user" => array(
                    "id" => $user->id,
                    "name" => $user->name,
                    "email" => $user->email,
                    "role" => $user->role
                ),
                "tokens" => $tokens
            ));
        } else {
            http_response_code(401);
            echo json_encode(array(
                "message" => "Invalid password.",
                "success" => false
            ));
        }
    } else {
        http_response_code(404);
        echo json_encode(array(
            "message" => "User not found.",
            "success" => false
        ));
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "message" => "Unable to login.",
        "error" => $e->getMessage(),
        "success" => false
    ));
}
?>
