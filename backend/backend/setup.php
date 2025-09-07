<?php
/**
 * Occassio Hub Backend Setup Script
 * Run this script to test your backend configuration
 */

echo "=== Occassio Hub Backend Setup ===\n\n";

// Test database connection
echo "1. Testing database connection...\n";
try {
    require_once 'config/database.php';
    $database = new Database();
    $db = $database->getConnection();
    
    if ($db) {
        echo "✓ Database connection successful!\n";
        
        // Test if tables exist
        $tables = ['users', 'vendors', 'bookings', 'reviews'];
        foreach ($tables as $table) {
            $query = "SHOW TABLES LIKE '$table'";
            $stmt = $db->prepare($query);
            $stmt->execute();
            
            if ($stmt->rowCount() > 0) {
                echo "✓ Table '$table' exists\n";
            } else {
                echo "✗ Table '$table' not found\n";
            }
        }
    } else {
        echo "✗ Database connection failed!\n";
    }
} catch (Exception $e) {
    echo "✗ Database connection error: " . $e->getMessage() . "\n";
}

echo "\n2. Testing API endpoints...\n";

// Test vendors endpoint
$base_url = "http://localhost/backend"; // Update this to your actual URL
$endpoints = [
    'vendors' => '/api/vendors/read.php',
    'auth_register' => '/api/auth/register.php',
    'auth_login' => '/api/auth/login.php',
    'upload' => '/api/upload/image.php',
    'stats' => '/api/stats/dashboard.php'
];

foreach ($endpoints as $name => $endpoint) {
    $url = $base_url . $endpoint;
    
    // Use cURL to test endpoint
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_HEADER, true);
    
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($http_code == 200 || $http_code == 405) {
        echo "✓ Endpoint '$name' is accessible (HTTP $http_code)\n";
    } else {
        echo "✗ Endpoint '$name' failed (HTTP $http_code)\n";
    }
}

echo "\n3. Checking file permissions...\n";

$directories = [
    'uploads/images' => 'uploads/images/',
    'config' => 'config/',
    'api' => 'api/'
];

foreach ($directories as $name => $path) {
    if (is_dir($path)) {
        if (is_readable($path)) {
            echo "✓ Directory '$name' is readable\n";
        } else {
            echo "✗ Directory '$name' is not readable\n";
        }
        
        if (is_writable($path)) {
            echo "✓ Directory '$name' is writable\n";
        } else {
            echo "✗ Directory '$name' is not writable\n";
        }
    } else {
        echo "✗ Directory '$name' does not exist\n";
    }
}

echo "\n4. PHP Configuration Check...\n";

$required_extensions = ['pdo', 'pdo_mysql', 'json', 'fileinfo'];
foreach ($required_extensions as $ext) {
    if (extension_loaded($ext)) {
        echo "✓ PHP extension '$ext' is loaded\n";
    } else {
        echo "✗ PHP extension '$ext' is not loaded\n";
    }
}

echo "\n5. Sample API Test...\n";

// Test vendor creation
$test_data = [
    'name' => 'Test Vendor',
    'category' => 'Personal',
    'services' => ['Photography', 'Videography'],
    'specialties' => ['Weddings', 'Birthdays'],
    'location' => 'Ahmedabad',
    'priceRange' => [
        'min' => 50000,
        'max' => 200000
    ],
    'rating' => 4.5,
    'phone' => '+91 98765 43210',
    'email' => 'test@vendor.com',
    'address' => 'Test Address, Ahmedabad',
    'images' => [],
    'description' => 'Test vendor description'
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $base_url . '/api/vendors/create.php');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($test_data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Content-Length: ' . strlen(json_encode($test_data))
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($http_code == 201) {
    echo "✓ Vendor creation test successful\n";
} else {
    echo "✗ Vendor creation test failed (HTTP $http_code)\n";
    echo "Response: $response\n";
}

echo "\n=== Setup Complete ===\n";
echo "\nNext steps:\n";
echo "1. Update the base_url in this script to match your server configuration\n";
echo "2. Ensure your web server is configured to serve the backend directory\n";
echo "3. Test the API endpoints from your frontend application\n";
echo "4. Check the README.md file for detailed API documentation\n";
?>
