<?php
require_once '../../config/cors.php';
require_once '../../utils/JwtHandler.php';

// Only allow POST method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
    exit();
}

$jwt = new JwtHandler();

// Get posted data
$data = json_decode(file_get_contents("php://input"));

// Validate required fields
if (empty($data->refresh_token)) {
    http_response_code(400);
    echo json_encode(array(
        "message" => "Refresh token is required.",
        "success" => false
    ));
    exit();
}

try {
    // Decode refresh token
    $decoded = $jwt->_jwt_decode_refresh_token($data->refresh_token);
    
    if ($decoded && isset($decoded->data)) {
        $user_data = $decoded->data;
        
        // Generate new tokens
        $tokens = $jwt->generateTokens($user_data->id, $user_data->email, $user_data->role);
        
        http_response_code(200);
        echo json_encode(array(
            "message" => "Tokens refreshed successfully.",
            "success" => true,
            "tokens" => $tokens
        ));
    } else {
        http_response_code(401);
        echo json_encode(array(
            "message" => "Invalid refresh token.",
            "success" => false
        ));
    }
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(array(
        "message" => "Token refresh failed.",
        "error" => $e->getMessage(),
        "success" => false
    ));
}
?>
