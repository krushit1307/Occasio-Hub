<?php
require_once '../../config/cors.php';
require_once '../../config/database.php';
require_once '../../models/Vendor.php';

$database = new Database();
$db = $database->getConnection();

$vendor = new Vendor($db);

// Get vendor ID from URL parameter
$vendor->id = isset($_GET['id']) ? $_GET['id'] : die();

try {
    if ($vendor->readOne()) {
        $vendor_arr = array(
            "id" => $vendor->id,
            "name" => $vendor->name,
            "category" => $vendor->category,
            "services" => $vendor->services,
            "specialties" => $vendor->specialties,
            "location" => $vendor->location,
            "priceRange" => array(
                "min" => (int)$vendor->price_min,
                "max" => (int)$vendor->price_max
            ),
            "rating" => (float)$vendor->rating,
            "contact" => array(
                "phone" => $vendor->phone,
                "email" => $vendor->email,
                "address" => $vendor->address
            ),
            "images" => $vendor->images,
            "description" => $vendor->description,
            "success" => true
        );

        http_response_code(200);
        echo json_encode($vendor_arr);
    } else {
        http_response_code(404);
        echo json_encode(array(
            "message" => "Vendor not found.",
            "success" => false
        ));
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "message" => "Unable to read vendor.",
        "error" => $e->getMessage(),
        "success" => false
    ));
}
?>
