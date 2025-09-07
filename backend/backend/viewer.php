<?php
require_once 'config/database.php';

// Database connection
try {
    $database = new Database();
    $db = $database->getConnection();
} catch (Exception $e) {
    die("Database connection failed: " . $e->getMessage());
}

// Get table data
function getTableData($db, $table, $limit = 100) {
    try {
        $stmt = $db->prepare("SELECT * FROM $table ORDER BY id DESC LIMIT $limit");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
        
        return [];
    }
}

// Get all tables
function getTables($db) {
    try {
        $stmt = $db->prepare("SHOW TABLES");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_COLUMN);
    } catch (Exception $e) {
        return [];
    }
}

$tables = getTables($db);
$selected_table = $_GET['table'] ?? ($tables[0] ?? '');
$table_data = $selected_table ? getTableData($db, $selected_table) : [];
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Occassio Hub - Database Viewer</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; background: #f4f4f4; }
        .header { background: #333; color: white; padding: 20px; text-align: center; }
        .header h1 { font-size: 28px; margin-bottom: 10px; }
        .header p { color: #ccc; }
        .container { max-width: 1200px; margin: 20px auto; padding: 0 20px; }
        .nav { background: white; border-radius: 8px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .nav select { padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px; width: 200px; }
        .card { background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden; }
        .card-header { background: #f8f9fa; padding: 20px; border-bottom: 1px solid #ddd; }
        .card-header h2 { color: #333; }
        .card-body { padding: 20px; }
        .table { width: 100%; border-collapse: collapse; }
        .table th, .table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        .table th { background: #f8f9fa; font-weight: bold; color: #333; }
        .table tr:hover { background: #f8f9fa; }
        .table tr:nth-child(even) { background: #f9f9f9; }
        .json-data { background: #f8f9fa; padding: 8px; border-radius: 4px; font-family: monospace; font-size: 12px; max-width: 300px; overflow-x: auto; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .stat-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center; }
        .stat-number { font-size: 2em; font-weight: bold; color: #007bff; }
        .stat-label { color: #666; margin-top: 5px; }
        .no-data { text-align: center; padding: 40px; color: #666; }
        .admin-link { position: fixed; top: 20px; right: 20px; background: #007bff; color: white; padding: 10px 15px; border-radius: 4px; text-decoration: none; }
        .admin-link:hover { background: #0056b3; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Occassio Hub Database Viewer</h1>
        <p>View and explore your database tables</p>
    </div>

    <a href="admin/dashboard.php" class="admin-link">Admin Panel</a>

    <div class="container">
        <!-- Statistics -->
        <div class="stats">
            <?php foreach ($tables as $table_name): ?>
                <?php 
                $count = 0;
                try {
                    $stmt = $db->prepare("SELECT COUNT(*) FROM $table_name");
                    $stmt->execute();
                    $count = $stmt->fetchColumn();
                } catch (Exception $e) {
                    $count = 0;
                }
                ?>
                <div class="stat-card">
                    <div class="stat-number"><?php echo $count; ?></div>
                    <div class="stat-label"><?php echo ucfirst($table_name); ?></div>
                </div>
            <?php endforeach; ?>
        </div>

        <!-- Table Selector -->
        <div class="nav">
            <form method="GET">
                <label for="table">Select Table:</label>
                <select name="table" id="table" onchange="this.form.submit()">
                    <?php foreach ($tables as $table_name): ?>
                        <option value="<?php echo $table_name; ?>" <?php echo $selected_table === $table_name ? 'selected' : ''; ?>>
                            <?php echo ucfirst($table_name); ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </form>
        </div>

        <!-- Table Data -->
        <?php if ($selected_table && !empty($table_data)): ?>
            <div class="card">
                <div class="card-header">
                    <h2><?php echo ucfirst($selected_table); ?> Table (<?php echo count($table_data); ?> records)</h2>
                </div>
                <div class="card-body">
                    <div style="overflow-x: auto;">
                        <table class="table">
                            <thead>
                                <tr>
                                    <?php foreach (array_keys($table_data[0]) as $column): ?>
                                        <th><?php echo ucfirst($column); ?></th>
                                    <?php endforeach; ?>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($table_data as $row): ?>
                                    <tr>
                                        <?php foreach ($row as $value): ?>
                                            <td>
                                                <?php 
                                                if (is_string($value)) {
                                                    // Check if it's JSON
                                                    if (strpos($value, '[') === 0 || strpos($value, '{') === 0) {
                                                        $decoded = json_decode($value, true);
                                                        if (json_last_error() === JSON_ERROR_NONE) {
                                                            echo '<div class="json-data">' . htmlspecialchars(json_encode($decoded, JSON_PRETTY_PRINT)) . '</div>';
                                                        } else {
                                                            echo htmlspecialchars($value);
                                                        }
                                                    } else {
                                                        if (strlen($value) > 100) {
                                                            echo htmlspecialchars(substr($value, 0, 100)) . '...';
                                                        } else {
                                                            echo htmlspecialchars($value);
                                                        }
                                                    }
                                                } else {
                                                    echo htmlspecialchars($value);
                                                }
                                                ?>
                                            </td>
                                        <?php endforeach; ?>
                                    </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        <?php elseif ($selected_table): ?>
            <div class="card">
                <div class="card-header">
                    <h2><?php echo ucfirst($selected_table); ?> Table</h2>
                </div>
                <div class="card-body">
                    <div class="no-data">
                        <h3>No data found in this table</h3>
                        <p>The table exists but contains no records.</p>
                    </div>
                </div>
            </div>
        <?php endif; ?>
    </div>

    <script>
        // Auto-refresh every 30 seconds
        setTimeout(function() {
            location.reload();
        }, 30000);
    </script>
</body>
</html>
