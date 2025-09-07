<?php
session_start();
require_once '../config/database.php';

// Simple authentication (you can enhance this)
$admin_username = "admin";
$admin_password = "admin123";

if (!isset($_SESSION['admin_logged_in'])) {
    if (isset($_POST['username']) && isset($_POST['password'])) {
        if ($_POST['username'] === $admin_username && $_POST['password'] === $admin_password) {
            $_SESSION['admin_logged_in'] = true;
        } else {
            $error = "Invalid credentials";
        }
    }
    
    if (!isset($_SESSION['admin_logged_in'])) {
        ?>
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Occassio Hub - Admin Login</title>
            <style>
                body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
                .login-container { max-width: 400px; margin: 100px auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                .form-group { margin-bottom: 20px; }
                label { display: block; margin-bottom: 5px; font-weight: bold; }
                input[type="text"], input[type="password"] { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
                button { background: #007bff; color: white; padding: 12px 20px; border: none; border-radius: 4px; cursor: pointer; width: 100%; }
                button:hover { background: #0056b3; }
                .error { color: red; margin-bottom: 15px; }
                h1 { text-align: center; color: #333; margin-bottom: 30px; }
            </style>
        </head>
        <body>
            <div class="login-container">
                <h1>Occassio Hub Admin</h1>
                <?php if (isset($error)): ?>
                    <div class="error"><?php echo $error; ?></div>
                <?php endif; ?>
                <form method="POST">
                    <div class="form-group">
                        <label for="username">Username:</label>
                        <input type="text" id="username" name="username" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Password:</label>
                        <input type="password" id="password" name="password" required>
                    </div>
                    <button type="submit">Login</button>
                </form>
                <p style="text-align: center; margin-top: 20px; color: #666;">
                    Default: admin / admin123
                </p>
            </div>
        </body>
        </html>
        <?php
        exit();
    }
}

// Database connection
try {
    $database = new Database();
    $db = $database->getConnection();
} catch (Exception $e) {
    die("Database connection failed: " . $e->getMessage());
}

// Handle actions
$action = $_GET['action'] ?? 'dashboard';
$table = $_GET['table'] ?? '';
$id = $_GET['id'] ?? '';

// Handle delete action
if ($action === 'delete' && $table && $id) {
    try {
        $stmt = $db->prepare("DELETE FROM $table WHERE id = ?");
        $stmt->execute([$id]);
        $success = "Record deleted successfully";
    } catch (Exception $e) {
        $error = "Error deleting record: " . $e->getMessage();
    }
}

// Handle insert/update actions
if ($_POST && isset($_POST['action'])) {
    if ($_POST['action'] === 'insert') {
        $table = $_POST['table'];
        $data = $_POST['data'];
        
        try {
            $columns = implode(', ', array_keys($data));
            $values = implode(', ', array_fill(0, count($data), '?'));
            $stmt = $db->prepare("INSERT INTO $table ($columns) VALUES ($values)");
            $stmt->execute(array_values($data));
            $success = "Record inserted successfully";
        } catch (Exception $e) {
            $error = "Error inserting record: " . $e->getMessage();
        }
    }
}

// Get table data
function getTableData($db, $table, $limit = 50) {
    try {
        $stmt = $db->prepare("SELECT * FROM $table ORDER BY id DESC LIMIT $limit");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
        return [];
    }
}

// Get table structure
function getTableStructure($db, $table) {
    try {
        $stmt = $db->prepare("DESCRIBE $table");
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
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Occassio Hub - Database Admin</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; background: #f4f4f4; }
        .header { background: #333; color: white; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; }
        .header h1 { font-size: 24px; }
        .logout { color: white; text-decoration: none; padding: 8px 15px; background: #dc3545; border-radius: 4px; }
        .logout:hover { background: #c82333; }
        .container { display: flex; min-height: calc(100vh - 70px); }
        .sidebar { width: 250px; background: white; border-right: 1px solid #ddd; padding: 20px; }
        .sidebar h3 { margin-bottom: 15px; color: #333; }
        .sidebar a { display: block; padding: 10px; color: #333; text-decoration: none; border-radius: 4px; margin-bottom: 5px; }
        .sidebar a:hover { background: #f8f9fa; }
        .sidebar a.active { background: #007bff; color: white; }
        .main-content { flex: 1; padding: 20px; }
        .card { background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-bottom: 20px; }
        .card-header { padding: 20px; border-bottom: 1px solid #ddd; }
        .card-body { padding: 20px; }
        .table { width: 100%; border-collapse: collapse; }
        .table th, .table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        .table th { background: #f8f9fa; font-weight: bold; }
        .table tr:hover { background: #f8f9fa; }
        .btn { padding: 8px 15px; border: none; border-radius: 4px; cursor: pointer; text-decoration: none; display: inline-block; margin: 2px; }
        .btn-primary { background: #007bff; color: white; }
        .btn-danger { background: #dc3545; color: white; }
        .btn-success { background: #28a745; color: white; }
        .btn:hover { opacity: 0.8; }
        .alert { padding: 15px; margin-bottom: 20px; border-radius: 4px; }
        .alert-success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .alert-danger { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .stat-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center; }
        .stat-number { font-size: 2em; font-weight: bold; color: #007bff; }
        .stat-label { color: #666; margin-top: 5px; }
        .form-group { margin-bottom: 15px; }
        .form-group label { display: block; margin-bottom: 5px; font-weight: bold; }
        .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
        .form-group textarea { height: 100px; }
        .modal { display: none; position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); }
        .modal-content { background: white; margin: 5% auto; padding: 20px; border-radius: 8px; width: 80%; max-width: 600px; }
        .close { float: right; font-size: 28px; font-weight: bold; cursor: pointer; }
        .close:hover { color: #999; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Occassio Hub Database Admin</h1>
        <a href="?action=logout" class="logout">Logout</a>
    </div>

    <div class="container">
        <div class="sidebar">
            <h3>Tables</h3>
            <a href="?action=dashboard" class="<?php echo $action === 'dashboard' ? 'active' : ''; ?>">Dashboard</a>
            <?php foreach ($tables as $table_name): ?>
                <a href="?action=table&table=<?php echo $table_name; ?>" 
                   class="<?php echo $action === 'table' && $table === $table_name ? 'active' : ''; ?>">
                    <?php echo ucfirst($table_name); ?>
                </a>
            <?php endforeach; ?>
        </div>

        <div class="main-content">
            <?php if (isset($success)): ?>
                <div class="alert alert-success"><?php echo $success; ?></div>
            <?php endif; ?>
            
            <?php if (isset($error)): ?>
                <div class="alert alert-danger"><?php echo $error; ?></div>
            <?php endif; ?>

            <?php if ($action === 'dashboard'): ?>
                <!-- Dashboard -->
                <div class="card">
                    <div class="card-header">
                        <h2>Database Overview</h2>
                    </div>
                    <div class="card-body">
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
                        
                        <h3>Recent Activity</h3>
                        <div class="table-responsive">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Table</th>
                                        <th>Action</th>
                                        <th>Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>All Tables</td>
                                        <td>Database accessed</td>
                                        <td><?php echo date('Y-m-d H:i:s'); ?></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            <?php elseif ($action === 'table' && $table): ?>
                <!-- Table View -->
                <div class="card">
                    <div class="card-header">
                        <h2><?php echo ucfirst($table); ?> Table</h2>
                        <button class="btn btn-success" onclick="showAddModal()">Add New Record</button>
                    </div>
                    <div class="card-body">
                        <?php 
                        $data = getTableData($db, $table);
                        $structure = getTableStructure($db, $table);
                        ?>
                        
                        <?php if (!empty($data)): ?>
                            <div class="table-responsive">
                                <table class="table">
                                    <thead>
                                        <tr>
                                            <?php foreach (array_keys($data[0]) as $column): ?>
                                                <th><?php echo ucfirst($column); ?></th>
                                            <?php endforeach; ?>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <?php foreach ($data as $row): ?>
                                            <tr>
                                                <?php foreach ($row as $value): ?>
                                                    <td>
                                                        <?php 
                                                        if (is_string($value) && strlen($value) > 50) {
                                                            echo htmlspecialchars(substr($value, 0, 50)) . '...';
                                                        } else {
                                                            echo htmlspecialchars($value);
                                                        }
                                                        ?>
                                                    </td>
                                                <?php endforeach; ?>
                                                <td>
                                                    <a href="?action=edit&table=<?php echo $table; ?>&id=<?php echo $row['id']; ?>" 
                                                       class="btn btn-primary">Edit</a>
                                                    <a href="?action=delete&table=<?php echo $table; ?>&id=<?php echo $row['id']; ?>" 
                                                       class="btn btn-danger" 
                                                       onclick="return confirm('Are you sure you want to delete this record?')">Delete</a>
                                                </td>
                                            </tr>
                                        <?php endforeach; ?>
                                    </tbody>
                                </table>
                            </div>
                        <?php else: ?>
                            <p>No data found in this table.</p>
                        <?php endif; ?>
                    </div>
                </div>

                <!-- Add Record Modal -->
                <div id="addModal" class="modal">
                    <div class="modal-content">
                        <span class="close" onclick="closeModal()">&times;</span>
                        <h2>Add New Record</h2>
                        <form method="POST">
                            <input type="hidden" name="action" value="insert">
                            <input type="hidden" name="table" value="<?php echo $table; ?>">
                            
                            <?php foreach ($structure as $column): ?>
                                <?php if ($column['Field'] !== 'id' && $column['Field'] !== 'created_at' && $column['Field'] !== 'updated_at'): ?>
                                    <div class="form-group">
                                        <label for="<?php echo $column['Field']; ?>"><?php echo ucfirst($column['Field']); ?></label>
                                        <?php if (strpos($column['Type'], 'text') !== false): ?>
                                            <textarea name="data[<?php echo $column['Field']; ?>]" id="<?php echo $column['Field']; ?>"></textarea>
                                        <?php elseif (strpos($column['Type'], 'json') !== false): ?>
                                            <input type="text" name="data[<?php echo $column['Field']; ?>]" id="<?php echo $column['Field']; ?>" 
                                                   placeholder='["item1", "item2"]'>
                                        <?php else: ?>
                                            <input type="text" name="data[<?php echo $column['Field']; ?>]" id="<?php echo $column['Field']; ?>">
                                        <?php endif; ?>
                                    </div>
                                <?php endif; ?>
                            <?php endforeach; ?>
                            
                            <button type="submit" class="btn btn-success">Add Record</button>
                            <button type="button" class="btn btn-primary" onclick="closeModal()">Cancel</button>
                        </form>
                    </div>
                </div>

            <?php endif; ?>
        </div>
    </div>

    <script>
        function showAddModal() {
            document.getElementById('addModal').style.display = 'block';
        }

        function closeModal() {
            document.getElementById('addModal').style.display = 'none';
        }

        // Close modal when clicking outside
        window.onclick = function(event) {
            var modal = document.getElementById('addModal');
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        }
    </script>
</body>
</html>
