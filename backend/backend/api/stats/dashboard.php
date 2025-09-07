<?php
require_once '../../config/cors.php';
require_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

try {
    $stats = array();
    
    // Total vendors count
    $query = "SELECT COUNT(*) as total_vendors FROM vendors";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    $stats['total_vendors'] = (int)$result['total_vendors'];
    
    // Total users count
    $query = "SELECT COUNT(*) as total_users FROM users WHERE role = 'user'";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    $stats['total_users'] = (int)$result['total_users'];
    
    // Total bookings count
    $query = "SELECT COUNT(*) as total_bookings FROM bookings";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    $stats['total_bookings'] = (int)$result['total_bookings'];
    
    // Total revenue
    $query = "SELECT SUM(total_amount) as total_revenue FROM bookings WHERE status = 'completed'";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    $stats['total_revenue'] = (float)$result['total_revenue'] ?? 0;
    
    // Vendors by category
    $query = "SELECT category, COUNT(*) as count FROM vendors GROUP BY category";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $stats['vendors_by_category'] = array();
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $stats['vendors_by_category'][$row['category']] = (int)$row['count'];
    }
    
    // Vendors by location
    $query = "SELECT location, COUNT(*) as count FROM vendors GROUP BY location ORDER BY count DESC LIMIT 10";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $stats['vendors_by_location'] = array();
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $stats['vendors_by_location'][$row['location']] = (int)$row['count'];
    }
    
    // Average rating
    $query = "SELECT AVG(rating) as avg_rating FROM vendors";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    $stats['average_rating'] = round((float)$result['avg_rating'], 2);
    
    // Recent bookings
    $query = "SELECT b.id, b.event_date, b.event_type, b.total_amount, b.status, 
                     v.name as vendor_name, u.name as user_name
              FROM bookings b 
              JOIN vendors v ON b.vendor_id = v.id 
              JOIN users u ON b.user_id = u.id 
              ORDER BY b.created_at DESC LIMIT 5";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $stats['recent_bookings'] = array();
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $stats['recent_bookings'][] = array(
            'id' => (int)$row['id'],
            'event_date' => $row['event_date'],
            'event_type' => $row['event_type'],
            'total_amount' => (float)$row['total_amount'],
            'status' => $row['status'],
            'vendor_name' => $row['vendor_name'],
            'user_name' => $row['user_name']
        );
    }
    
    // Top rated vendors
    $query = "SELECT id, name, rating, location FROM vendors ORDER BY rating DESC LIMIT 5";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $stats['top_vendors'] = array();
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $stats['top_vendors'][] = array(
            'id' => (int)$row['id'],
            'name' => $row['name'],
            'rating' => (float)$row['rating'],
            'location' => $row['location']
        );
    }
    
    $stats['success'] = true;
    
    http_response_code(200);
    echo json_encode($stats);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "message" => "Unable to fetch dashboard statistics.",
        "error" => $e->getMessage(),
        "success" => false
    ));
}
?>
