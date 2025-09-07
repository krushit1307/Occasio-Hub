<?php
require_once '../../config/cors.php';
require_once '../../config/database.php';
require_once '../../models/Vendor.php';

// Only allow PUT method
if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
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
if (empty($data->id)) {
    http_response_code(400);
    echo json_encode(array(
        "message" => "Vendor ID is required.",
        "success" => false
    ));
    exit();
}

// Set vendor ID
$vendor->id = $data->id;

// Check if vendor exists
if (!$vendor->readOne()) {
    http_response_code(404);
    echo json_encode(array(
        "message" => "Vendor not found.",
        "success" => false
    ));
    exit();
}

// Update vendor properties if provided
if (isset($data->name)) {
    $vendor->name = $data->name;
}

if (isset($data->category)) {
    $vendor->category = $data->category;
}

if (isset($data->services)) {
    $vendor->services = $data->services;
}

if (isset($data->specialties)) {
    $vendor->specialties = $data->specialties;
}

if (isset($data->location)) {
    $vendor->location = $data->location;
}

if (isset($data->priceRange)) {
    if (isset($data->priceRange->min)) {
        $vendor->price_min = $data->priceRange->min;
    }
    if (isset($data->priceRange->max)) {
        $vendor->price_max = $data->priceRange->max;
    }
}

if (isset($data->rating)) {
    $vendor->rating = $data->rating;
}

if (isset($data->phone)) {
    $vendor->phone = $data->phone;
}

if (isset($data->email)) {
    $vendor->email = $data->email;
}

if (isset($data->address)) {
    $vendor->address = $data->address;
}

if (isset($data->images)) {
    $vendor->images = $data->images;
}

if (isset($data->description)) {
    $vendor->description = $data->description;
}

try {
    if ($vendor->update()) {
        http_response_code(200);
        echo json_encode(array(
            "message" => "Vendor was updated successfully.",
            "success" => true
        ));
    } else {
        http_response_code(503);
        echo json_encode(array(
            "message" => "Unable to update vendor.",
            "success" => false
        ));
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "message" => "Unable to update vendor.",
        "error" => $e->getMessage(),
        "success" => false
    ));
}
?>
