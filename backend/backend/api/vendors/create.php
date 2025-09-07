<?php
require_once '../../config/cors.php';
require_once '../../config/database.php';
require_once '../../models/Vendor.php';

// Only allow POST method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
    exit();
}

$database = new Database();
$db = $database->getConnection();

$vendor = new Vendor($db);

// Get posted data
$data = json_decode(file_get_contents("php://input"));

// Validate required fields
if (
    empty($data->name) ||
    empty($data->category) ||
    empty($data->services) ||
    empty($data->location) ||
    empty($data->phone) ||
    empty($data->email)
) {
    http_response_code(400);
    echo json_encode(array(
        "message" => "Unable to create vendor. Data is incomplete.",
        "success" => false
    ));
    exit();
}

// Set vendor property values
$vendor->name = $data->name;
$vendor->category = $data->category;
$vendor->services = $data->services;
$vendor->specialties = isset($data->specialties) ? $data->specialties : [];
$vendor->location = $data->location;
$vendor->price_min = isset($data->priceRange->min) ? $data->priceRange->min : 0;
$vendor->price_max = isset($data->priceRange->max) ? $data->priceRange->max : 0;
$vendor->rating = isset($data->rating) ? $data->rating : 0.0;
$vendor->phone = $data->phone;
$vendor->email = $data->email;
$vendor->address = isset($data->address) ? $data->address : '';
$vendor->images = isset($data->images) ? $data->images : [];
$vendor->description = isset($data->description) ? $data->description : '';

try {
    if ($vendor->create()) {
        http_response_code(201);
        echo json_encode(array(
            "message" => "Vendor was created successfully.",
            "success" => true
        ));
    } else {
        http_response_code(503);
        echo json_encode(array(
            "message" => "Unable to create vendor.",
            "success" => false
        ));
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "message" => "Unable to create vendor.",
        "error" => $e->getMessage(),
        "success" => false
    ));
}
?>
