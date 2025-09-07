<?php
class Database {
    private $host = "localhost";
    private $db_name = "occassio_hub";
    private $username = "root";
    private $password = ""; // Try empty first, if it fails, you might need to set a password
    private $conn;

    public function getConnection() {
        $this->conn = null;

        try {
            // Try connection without password first
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->exec("set names utf8");
        } catch(PDOException $exception) {
            // If connection fails, try with common passwords
            $passwords = ["", "root", "admin", "password", "123456"];
            
            foreach ($passwords as $pwd) {
                try {
                    $this->conn = new PDO(
                        "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                        $this->username,
                        $pwd
                    );
                    $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                    $this->conn->exec("set names utf8");
                    
                    // If we get here, connection was successful
                    break;
                } catch(PDOException $e) {
                    // Continue to next password
                    continue;
                }
            }
            
            // If we still don't have a connection, throw the original error
            if (!$this->conn) {
                throw new PDOException("Connection failed with all attempted passwords. Original error: " . $exception->getMessage());
            }
        }

        return $this->conn;
    }
}
?>
