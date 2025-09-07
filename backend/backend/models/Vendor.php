<?php
require_once '../config/database.php';

class Vendor {
    private $conn;
    private $table_name = "vendors";

    public $id;
    public $name;
    public $category;
    public $services;
    public $specialties;
    public $location;
    public $price_min;
    public $price_max;
    public $rating;
    public $phone;
    public $email;
    public $address;
    public $images;
    public $description;
    public $created_at;
    public $updated_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Read all vendors
    public function read($filters = []) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE 1=1";
        $params = [];

        // Apply filters
        if (!empty($filters['category'])) {
            $query .= " AND category = ?";
            $params[] = $filters['category'];
        }

        if (!empty($filters['location'])) {
            $query .= " AND location = ?";
            $params[] = $filters['location'];
        }

        if (!empty($filters['maxPrice'])) {
            $query .= " AND price_min <= ?";
            $params[] = $filters['maxPrice'];
        }

        if (!empty($filters['minRating'])) {
            $query .= " AND rating >= ?";
            $params[] = $filters['minRating'];
        }

        if (!empty($filters['services'])) {
            $serviceConditions = [];
            foreach ($filters['services'] as $service) {
                $serviceConditions[] = "services LIKE ?";
                $params[] = "%$service%";
            }
            $query .= " AND (" . implode(" OR ", $serviceConditions) . ")";
        }

        $query .= " ORDER BY rating DESC, created_at DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->execute($params);

        return $stmt;
    }

    // Read single vendor
    public function readOne() {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = ? LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            $this->name = $row['name'];
            $this->category = $row['category'];
            $this->services = json_decode($row['services'], true);
            $this->specialties = json_decode($row['specialties'], true);
            $this->location = $row['location'];
            $this->price_min = $row['price_min'];
            $this->price_max = $row['price_max'];
            $this->rating = $row['rating'];
            $this->phone = $row['phone'];
            $this->email = $row['email'];
            $this->address = $row['address'];
            $this->images = json_decode($row['images'], true);
            $this->description = $row['description'];
            return true;
        }

        return false;
    }

    // Create vendor
    public function create() {
        $query = "INSERT INTO " . $this->table_name . "
                SET
                    name = :name,
                    category = :category,
                    services = :services,
                    specialties = :specialties,
                    location = :location,
                    price_min = :price_min,
                    price_max = :price_max,
                    rating = :rating,
                    phone = :phone,
                    email = :email,
                    address = :address,
                    images = :images,
                    description = :description";

        $stmt = $this->conn->prepare($query);

        // Sanitize
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->category = htmlspecialchars(strip_tags($this->category));
        $this->location = htmlspecialchars(strip_tags($this->location));
        $this->phone = htmlspecialchars(strip_tags($this->phone));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->address = htmlspecialchars(strip_tags($this->address));
        $this->description = htmlspecialchars(strip_tags($this->description));

        // Bind data
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":category", $this->category);
        $stmt->bindParam(":services", json_encode($this->services));
        $stmt->bindParam(":specialties", json_encode($this->specialties));
        $stmt->bindParam(":location", $this->location);
        $stmt->bindParam(":price_min", $this->price_min);
        $stmt->bindParam(":price_max", $this->price_max);
        $stmt->bindParam(":rating", $this->rating);
        $stmt->bindParam(":phone", $this->phone);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":address", $this->address);
        $stmt->bindParam(":images", json_encode($this->images));
        $stmt->bindParam(":description", $this->description);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Update vendor
    public function update() {
        $query = "UPDATE " . $this->table_name . "
                SET
                    name = :name,
                    category = :category,
                    services = :services,
                    specialties = :specialties,
                    location = :location,
                    price_min = :price_min,
                    price_max = :price_max,
                    rating = :rating,
                    phone = :phone,
                    email = :email,
                    address = :address,
                    images = :images,
                    description = :description,
                    updated_at = NOW()
                WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        // Sanitize
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->category = htmlspecialchars(strip_tags($this->category));
        $this->location = htmlspecialchars(strip_tags($this->location));
        $this->phone = htmlspecialchars(strip_tags($this->phone));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->address = htmlspecialchars(strip_tags($this->address));
        $this->description = htmlspecialchars(strip_tags($this->description));

        // Bind data
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":category", $this->category);
        $stmt->bindParam(":services", json_encode($this->services));
        $stmt->bindParam(":specialties", json_encode($this->specialties));
        $stmt->bindParam(":location", $this->location);
        $stmt->bindParam(":price_min", $this->price_min);
        $stmt->bindParam(":price_max", $this->price_max);
        $stmt->bindParam(":rating", $this->rating);
        $stmt->bindParam(":phone", $this->phone);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":address", $this->address);
        $stmt->bindParam(":images", json_encode($this->images));
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":id", $this->id);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Delete vendor
    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Search vendors
    public function search($search_term) {
        $query = "SELECT * FROM " . $this->table_name . "
                WHERE name LIKE ? OR location LIKE ? OR description LIKE ?
                ORDER BY rating DESC";

        $search_param = "%{$search_term}%";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $search_param);
        $stmt->bindParam(2, $search_param);
        $stmt->bindParam(3, $search_param);
        $stmt->execute();

        return $stmt;
    }
}
?>
