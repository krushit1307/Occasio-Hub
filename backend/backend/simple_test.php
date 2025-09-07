<?php
echo "<h1>Simple Database Connection Test</h1>";

// Step 1: Check if PDO is available
echo "<h2>Step 1: Check PDO Extension</h2>";
if (extension_loaded('pdo')) {
    echo "<p style='color: green;'>✅ PDO extension is loaded</p>";
} else {
    echo "<p style='color: red;'>❌ PDO extension is NOT loaded</p>";
    exit();
}

if (extension_loaded('pdo_mysql')) {
    echo "<p style='color: green;'>✅ PDO MySQL extension is loaded</p>";
} else {
    echo "<p style='color: red;'>❌ PDO MySQL extension is NOT loaded</p>";
    exit();
}

// Step 2: Test direct connection
echo "<h2>Step 2: Test Direct Database Connection</h2>";
try {
    $pdo = new PDO("mysql:host=localhost;dbname=occassio_hub", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "<p style='color: green;'>✅ Direct PDO connection successful!</p>";
    
    // Test a simple query
    $stmt = $pdo->query("SELECT COUNT(*) FROM vendors");
    $count = $stmt->fetchColumn();
    echo "<p>📊 Total vendors in database: <strong>$count</strong></p>";
    
} catch (PDOException $e) {
    echo "<p style='color: red;'>❌ Direct PDO connection failed: " . $e->getMessage() . "</p>";
}

// Step 3: Test using our Database class
echo "<h2>Step 3: Test Using Database Class</h2>";
try {
    require_once 'config/database.php';
    $database = new Database();
    $db = $database->getConnection();
    
    if ($db) {
        echo "<p style='color: green;'>✅ Database class connection successful!</p>";
        
        // Test a query through our class
        $stmt = $db->prepare("SELECT COUNT(*) FROM vendors");
        $stmt->execute();
        $count = $stmt->fetchColumn();
        echo "<p>📊 Total vendors through class: <strong>$count</strong></p>";
        
    } else {
        echo "<p style='color: red;'>❌ Database class connection failed!</p>";
    }
    
} catch (Exception $e) {
    echo "<p style='color: red;'>❌ Database class error: " . $e->getMessage() . "</p>";
}

// Step 4: Test table data
echo "<h2>Step 4: Test Table Data</h2>";
try {
    $stmt = $pdo->query("SELECT * FROM vendors LIMIT 3");
    $vendors = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (!empty($vendors)) {
        echo "<p style='color: green;'>✅ Successfully fetched " . count($vendors) . " vendors</p>";
        
        echo "<table border='1' style='border-collapse: collapse; margin: 10px 0;'>";
        echo "<tr>";
        foreach (array_keys($vendors[0]) as $header) {
            echo "<th style='padding: 5px; background: #f0f0f0;'>$header</th>";
        }
        echo "</tr>";
        
        foreach ($vendors as $vendor) {
            echo "<tr>";
            foreach ($vendor as $value) {
                if (is_string($value) && strlen($value) > 30) {
                    echo "<td style='padding: 5px;'>" . htmlspecialchars(substr($value, 0, 30)) . "...</td>";
                } else {
                    echo "<td style='padding: 5px;'>" . htmlspecialchars($value) . "</td>";
                }
            }
            echo "</tr>";
        }
        echo "</table>";
    } else {
        echo "<p style='color: orange;'>⚠️ No vendors found in database</p>";
    }
    
} catch (Exception $e) {
    echo "<p style='color: red;'>❌ Error fetching vendors: " . $e->getMessage() . "</p>";
}

echo "<hr>";
echo "<h2>PHP Information:</h2>";
echo "<p><strong>PHP Version:</strong> " . phpversion() . "</p>";
echo "<p><strong>Loaded Extensions:</strong></p>";
echo "<ul>";
$extensions = ['pdo', 'pdo_mysql', 'json', 'fileinfo'];
foreach ($extensions as $ext) {
    if (extension_loaded($ext)) {
        echo "<li style='color: green;'>✅ $ext</li>";
    } else {
        echo "<li style='color: red;'>❌ $ext</li>";
    }
}
echo "</ul>";

echo "<hr>";
echo "<h2>Quick Links:</h2>";
echo "<p><a href='test_db.php' style='color: blue;'>🔍 Full Database Test</a></p>";
echo "<p><a href='viewer.php' style='color: blue;'>📊 Database Viewer</a></p>";
echo "<p><a href='admin/dashboard.php' style='color: blue;'>🔧 Admin Panel</a></p>";
?>
