<?php
require_once '../../config/cors.php';

// Only allow POST method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
    exit();
}

// Check if file was uploaded
if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(array(
        "message" => "No image file uploaded or upload error.",
        "success" => false
    ));
    exit();
}

$file = $_FILES['image'];

// Validate file type
$allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
$file_type = mime_content_type($file['tmp_name']);

if (!in_array($file_type, $allowed_types)) {
    http_response_code(400);
    echo json_encode(array(
        "message" => "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.",
        "success" => false
    ));
    exit();
}

// Validate file size (max 5MB)
$max_size = 5 * 1024 * 1024; // 5MB in bytes
if ($file['size'] > $max_size) {
    http_response_code(400);
    echo json_encode(array(
        "message" => "File size too large. Maximum size is 5MB.",
        "success" => false
    ));
    exit();
}

// Create upload directory if it doesn't exist
$upload_dir = '../../uploads/images/';
if (!file_exists($upload_dir)) {
    mkdir($upload_dir, 0755, true);
}

// Generate unique filename
$file_extension = pathinfo($file['name'], PATHINFO_EXTENSION);
$unique_filename = uniqid() . '_' . time() . '.' . $file_extension;
$upload_path = $upload_dir . $unique_filename;

try {
    // Move uploaded file to destination
    if (move_uploaded_file($file['tmp_name'], $upload_path)) {
        // Return the file URL
        $file_url = '/backend/uploads/images/' . $unique_filename;
        
        http_response_code(200);
        echo json_encode(array(
            "message" => "Image uploaded successfully.",
            "success" => true,
            "file_url" => $file_url,
            "filename" => $unique_filename
        ));
    } else {
        http_response_code(500);
        echo json_encode(array(
            "message" => "Failed to save uploaded file.",
            "success" => false
        ));
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "message" => "Error uploading image.",
        "error" => $e->getMessage(),
        "success" => false
    ));
}
?>
