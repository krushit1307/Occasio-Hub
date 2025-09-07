<?php
require_once 'config/database.php';

echo "<h1>Data Insertion Test</h1>";

try {
    $database = new Database();
    $db = $database->getConnection();
    
    if ($db) {
        echo "<p style='color: green;'>✅ Database connected!</p>";
        
        // Test inserting a vendor
        $test_vendor = [
            'name' => 'Test Vendor ' . date('Y-m-d H:i:s'),
            'category' => 'Personal',
            'services' => json_encode(['Photography', 'Videography']),
            'specialties' => json_encode(['Weddings', 'Birthdays']),
            'location' => 'Ahmedabad',
            'price_min' => 50000,
            'price_max' => 200000,
            'rating' => 4.5,
            'phone' => '+91 98765 43210',
            'email' => 'test@vendor.com',
            'address' => 'Test Address, Ahmedabad',
            'images' => json_encode(['/test/image1.jpg']),
            'description' => 'This is a test vendor created at ' . date('Y-m-d H:i:s')
        ];
        
        $columns = implode(', ', array_keys($test_vendor));
        $values = implode(', ', array_fill(0, count($test_vendor), '?'));
        
        $stmt = $db->prepare("INSERT INTO vendors ($columns) VALUES ($values)");
        $result = $stmt->execute(array_values($test_vendor));
        
        if ($result) {
            $new_id = $db->lastInsertId();
            echo "<p style='color: green;'>✅ Test vendor inserted successfully! ID: $new_id</p>";
            
            // Show the inserted record
            $show_stmt = $db->prepare("SELECT * FROM vendors WHERE id = ?");
            $show_stmt->execute([$new_id]);
            $record = $show_stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($record) {
                echo "<h3>Inserted Record:</h3>";
                echo "<table border='1' style='border-collapse: collapse;'>";
                echo "<tr><th>Field</th><th>Value</th></tr>";
                foreach ($record as $field => $value) {
                    echo "<tr>";
                    echo "<td style='padding: 5px; background: #f0f0f0;'>$field</td>";
                    echo "<td style='padding: 5px;'>" . htmlspecialchars($value) . "</td>";
                    echo "</tr>";
                }
                echo "</table>";
            }
        } else {
            echo "<p style='color: red;'>❌ Failed to insert test vendor</p>";
        }
        
        // Show total count
        $count_stmt = $db->prepare("SELECT COUNT(*) FROM vendors");
        $count_stmt->execute();
        $total_count = $count_stmt->fetchColumn();
        echo "<p><strong>Total vendors in database: $total_count</strong></p>";
        
    } else {
        echo "<p style='color: red;'>❌ Database connection failed!</p>";
    }
} catch (Exception $e) {
    echo "<p style='color: red;'>❌ Error: " . $e->getMessage() . "</p>";
}

echo "<hr>";
echo "<h2>Quick Links:</h2>";
echo "<p><a href='test_db.php' style='color: blue;'>🔍 Database Test</a></p>";
echo "<p><a href='viewer.php' style='color: blue;'>📊 Database Viewer</a></p>";
echo "<p><a href='admin/dashboard.php' style='color: blue;'>🔧 Admin Panel</a></p>";
?>
