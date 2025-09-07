<?php
require_once '../../config/cors.php';
require_once '../../config/database.php';
require_once '../../models/Vendor.php';

// Only allow DELETE method
if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
    exit();
}

$database = new Database();
$db = $database->getConnection();

$vendor = new Vendor($db);

// Get vendor ID from query parameter
$vendor->id = isset($_GET['id']) ? $_GET['id'] : die();

try {
    // Check if vendor exists
    if (!$vendor->readOne()) {
        http_response_code(404);
        echo json_encode(array(
            "message" => "Vendor not found.",
            "success" => false
        ));
        exit();
    }

    if ($vendor->delete()) {
        http_response_code(200);
        echo json_encode(array(
            "message" => "Vendor was deleted successfully.",
            "success" => true
        ));
    } else {
        http_response_code(503);
        echo json_encode(array(
            "message" => "Unable to delete vendor.",
            "success" => false
        ));
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "message" => "Unable to delete vendor.",
        "error" => $e->getMessage(),
        "success" => false
    ));
}
?>
