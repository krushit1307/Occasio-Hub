
<?php
require_once 'config/database.php';

echo "<h1>Debug Database Viewer</h1>";

// Database connection
try {
    $database = new Database();
    $db = $database->getConnection();
    echo "<p style='color: green;'>✅ Database connected successfully</p>";
} catch (Exception $e) {
    die("❌ Database connection failed: " . $e->getMessage());
}

// Get all tables
function getTables($db) {
    try {
        $stmt = $db->prepare("SHOW TABLES");
        $stmt->execute();
        $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
        echo "<p>📋 Found " . count($tables) . " tables: " . implode(', ', $tables) . "</p>";
        return $tables;
    } catch (Exception $e) {
        echo "<p style='color: red;'>❌ Error getting tables: " . $e->getMessage() . "</p>";
        return [];
    }
}

// Get table data with debug info
function getTableData($db, $table, $limit = 100) {
    try {
        echo "<p>🔍 Fetching data from table: $table</p>";
        $stmt = $db->prepare("SELECT * FROM $table ORDER BY id DESC LIMIT $limit");
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo "<p>📊 Found " . count($data) . " records in $table</p>";
        return $data;
    } catch (Exception $e) {
        echo "<p style='color: red;'>❌ Error getting data from $table: " . $e->getMessage() . "</p>";
        return [];
    }
}

$tables = getTables($db);
$selected_table = $_GET['table'] ?? ($tables[0] ?? '');

echo "<p><strong>Selected table:</strong> $selected_table</p>";

if ($selected_table) {
    $table_data = getTableData($db, $selected_table);
} else {
    $table_data = [];
    echo "<p style='color: orange;'>⚠️ No table selected</p>";
}

echo "<hr>";

// Show table selector
echo "<h2>Select Table:</h2>";
echo "<form method='GET'>";
echo "<select name='table' onchange='this.form.submit()'>";
foreach ($tables as $table_name) {
    $selected = ($selected_table === $table_name) ? 'selected' : '';
    echo "<option value='$table_name' $selected>$table_name</option>";
}
echo "</select>";
echo "</form>";

echo "<hr>";

// Show table data
if ($selected_table && !empty($table_data)) {
    echo "<h2>Data from $selected_table table:</h2>";
    echo "<table border='1' style='border-collapse: collapse; width: 100%;'>";
    
    // Headers
    echo "<tr>";
    foreach (array_keys($table_data[0]) as $column) {
        echo "<th style='padding: 8px; background: #f0f0f0;'>$column</th>";
    }
    echo "</tr>";
    
    // Data
    foreach ($table_data as $row) {
        echo "<tr>";
        foreach ($row as $value) {
            if (is_string($value)) {
                // Check if it's JSON
                if (strpos($value, '[') === 0 || strpos($value, '{') === 0) {
                    $decoded = json_decode($value, true);
                    if (json_last_error() === JSON_ERROR_NONE) {
                        echo "<td style='padding: 8px;'><pre style='font-size: 10px;'>" . htmlspecialchars(json_encode($decoded, JSON_PRETTY_PRINT)) . "</pre></td>";
                    } else {
                        echo "<td style='padding: 8px;'>" . htmlspecialchars($value) . "</td>";
                    }
                } else {
                    if (strlen($value) > 100) {
                        echo "<td style='padding: 8px;'>" . htmlspecialchars(substr($value, 0, 100)) . "...</td>";
                    } else {
                        echo "<td style='padding: 8px;'>" . htmlspecialchars($value) . "</td>";
                    }
                }
            } else {
                echo "<td style='padding: 8px;'>" . htmlspecialchars($value) . "</td>";
            }
        }
        echo "</tr>";
    }
    echo "</table>";
} elseif ($selected_table) {
    echo "<h2>No data found in $selected_table table</h2>";
    echo "<p style='color: orange;'>The table exists but contains no records.</p>";
} else {
    echo "<h2>No table selected</h2>";
}

echo "<hr>";
echo "<h2>Quick Links:</h2>";
echo "<p><a href='test_db.php' style='color: blue;'>🔍 Database Test</a></p>";
echo "<p><a href='test_insert.php' style='color: blue;'>➕ Insert Test Data</a></p>";
echo "<p><a href='viewer.php' style='color: blue;'>📊 Normal Viewer</a></p>";
echo "<p><a href='admin/dashboard.php' style='color: blue;'>🔧 Admin Panel</a></p>";
?>
