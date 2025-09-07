<?php
require_once 'config/database.php';

echo "<h1>Database Connection Test</h1>";

// Test database connection
try {
    $database = new Database();
    $db = $database->getConnection();
    
    if ($db) {
        echo "<p style='color: green;'>✅ Database connection successful!</p>";
        
        // Test if tables exist
        $tables = ['users', 'vendors', 'bookings', 'reviews'];
        foreach ($tables as $table) {
            $stmt = $db->prepare("SHOW TABLES LIKE '$table'");
            $stmt->execute();
            if ($stmt->rowCount() > 0) {
                echo "<p style='color: green;'>✅ Table '$table' exists</p>";
                
                // Count records in table
                $count_stmt = $db->prepare("SELECT COUNT(*) FROM $table");
                $count_stmt->execute();
                $count = $count_stmt->fetchColumn();
                echo "<p>📊 Records in $table: <strong>$count</strong></p>";
                
                // Show recent records
                if ($count > 0) {
                    $recent_stmt = $db->prepare("SELECT * FROM $table ORDER BY id DESC LIMIT 3");
                    $recent_stmt->execute();
                    $recent_records = $recent_stmt->fetchAll(PDO::FETCH_ASSOC);
                    
                    echo "<h3>Recent records in $table:</h3>";
                    echo "<table border='1' style='border-collapse: collapse; margin: 10px 0;'>";
                    
                    if (!empty($recent_records)) {
                        // Headers
                        echo "<tr>";
                        foreach (array_keys($recent_records[0]) as $header) {
                            echo "<th style='padding: 5px; background: #f0f0f0;'>$header</th>";
                        }
                        echo "</tr>";
                        
                        // Data
                        foreach ($recent_records as $record) {
                            echo "<tr>";
                            foreach ($record as $value) {
                                if (is_string($value) && strlen($value) > 50) {
                                    echo "<td style='padding: 5px;'>" . htmlspecialchars(substr($value, 0, 50)) . "...</td>";
                                } else {
                                    echo "<td style='padding: 5px;'>" . htmlspecialchars($value) . "</td>";
                                }
                            }
                            echo "</tr>";
                        }
                    }
                    echo "</table>";
                }
            } else {
                echo "<p style='color: red;'>❌ Table '$table' does not exist</p>";
            }
        }
        
    } else {
        echo "<p style='color: red;'>❌ Database connection failed!</p>";
    }
} catch (Exception $e) {
    echo "<p style='color: red;'>❌ Error: " . $e->getMessage() . "</p>";
}

echo "<hr>";
echo "<h2>Database Configuration:</h2>";
echo "<p><strong>Host:</strong> localhost</p>";
echo "<p><strong>Database:</strong> occassio_hub</p>";
echo "<p><strong>Username:</strong> root</p>";

echo "<hr>";
echo "<h2>Quick Links:</h2>";
echo "<p><a href='viewer.php' style='color: blue;'>📊 Database Viewer</a></p>";
echo "<p><a href='admin/dashboard.php' style='color: blue;'>🔧 Admin Panel</a></p>";
echo "<p><a href='setup.php' style='color: blue;'>⚙️ Setup Script</a></p>";
?>
