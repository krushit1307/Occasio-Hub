<?php
require_once '../../config/cors.php';
require_once '../../config/database.php';
require_once '../../models/Vendor.php';

$database = new Database();
$db = $database->getConnection();

$vendor = new Vendor($db);

// Get filters from query parameters
$filters = array();

if (isset($_GET['category'])) {
    $filters['category'] = $_GET['category'];
}

if (isset($_GET['location'])) {
    $filters['location'] = $_GET['location'];
}

if (isset($_GET['maxPrice'])) {
    $filters['maxPrice'] = (int)$_GET['maxPrice'];
}

if (isset($_GET['minRating'])) {
    $filters['minRating'] = (float)$_GET['minRating'];
}

if (isset($_GET['services'])) {
    $filters['services'] = explode(',', $_GET['services']);
}

// Get search term
$search_term = isset($_GET['search']) ? $_GET['search'] : '';

try {
    if (!empty($search_term)) {
        $stmt = $vendor->search($search_term);
    } else {
        $stmt = $vendor->read($filters);
    }

    $vendors_arr = array();
    $vendors_arr["records"] = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);

        $vendor_item = array(
            "id" => $id,
            "name" => $name,
            "category" => $category,
            "services" => json_decode($services, true),
            "specialties" => json_decode($specialties, true),
            "location" => $location,
            "priceRange" => array(
                "min" => (int)$price_min,
                "max" => (int)$price_max
            ),
            "rating" => (float)$rating,
            "contact" => array(
                "phone" => $phone,
                "email" => $email,
                "address" => $address
            ),
            "images" => json_decode($images, true),
            "description" => $description,
            "created_at" => $created_at,
            "updated_at" => $updated_at
        );

        array_push($vendors_arr["records"], $vendor_item);
    }

    $vendors_arr["count"] = count($vendors_arr["records"]);
    $vendors_arr["success"] = true;

    http_response_code(200);
    echo json_encode($vendors_arr);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "message" => "Unable to read vendors.",
        "error" => $e->getMessage(),
        "success" => false
    ));
}
?>
