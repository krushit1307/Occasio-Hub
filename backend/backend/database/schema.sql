-- Occassio Hub Database Schema
-- Create database
CREATE DATABASE IF NOT EXISTS occassio_hub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE occassio_hub;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'vendor', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- Vendors table
CREATE TABLE vendors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category ENUM('Personal', 'Professional') NOT NULL,
    services JSON NOT NULL,
    specialties JSON NOT NULL,
    location VARCHAR(100) NOT NULL,
    price_min DECIMAL(10,2) DEFAULT 0.00,
    price_max DECIMAL(10,2) DEFAULT 0.00,
    rating DECIMAL(3,2) DEFAULT 0.00,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address TEXT,
    images JSON,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_location (location),
    INDEX idx_rating (rating),
    INDEX idx_price_min (price_min),
    INDEX idx_price_max (price_max)
);

-- Bookings table
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    vendor_id INT NOT NULL,
    event_date DATE NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    services_requested JSON NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_vendor_id (vendor_id),
    INDEX idx_event_date (event_date),
    INDEX idx_status (status)
);

-- Reviews table
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    vendor_id INT NOT NULL,
    booking_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    UNIQUE KEY unique_booking_review (booking_id),
    INDEX idx_vendor_id (vendor_id),
    INDEX idx_rating (rating)
);

-- Insert sample data for testing

-- Sample users
INSERT INTO users (name, email, phone, password, role) VALUES
('John Doe', 'john@example.com', '+91 98765 43210', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user'),
('Jane Smith', 'jane@example.com', '+91 98765 43211', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user'),
('Admin User', 'admin@occassiohub.com', '+91 98765 43212', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Sample vendors (matching the frontend mock data)
INSERT INTO vendors (name, category, services, specialties, location, price_min, price_max, rating, phone, email, address, images, description) VALUES
('Royal Events Gujarat', 'Personal', '["Photography", "Videography", "Catering"]', '["Weddings", "Birthdays", "Housewarmings"]', 'Ahmedabad', 50000.00, 200000.00, 4.80, '+91 98765 43210', 'contact@royalevents.com', 'Satellite, Ahmedabad, Gujarat', '["/backend/uploads/images/vendor-1-1.jpg", "/backend/uploads/images/vendor-1-2.jpg", "/backend/uploads/images/vendor-1-3.jpg", "/backend/uploads/images/vendor-1-4.jpg", "/backend/uploads/images/vendor-1-5.jpg"]', 'Premium event planning with exquisite attention to detail'),
('Elite Celebrations', 'Professional', '["Sound System", "Photography", "Catering"]', '["Corporate Events", "Conferences", "Exhibitions"]', 'Surat', 75000.00, 300000.00, 4.60, '+91 98765 43211', 'info@elitecelebrations.com', 'Adajan, Surat, Gujarat', '["/backend/uploads/images/vendor-2-1.jpg", "/backend/uploads/images/vendor-2-2.jpg", "/backend/uploads/images/vendor-2-3.jpg", "/backend/uploads/images/vendor-2-4.jpg", "/backend/uploads/images/vendor-2-5.jpg"]', 'Professional corporate event solutions with cutting-edge technology'),
('Dream Makers', 'Personal', '["Videography", "Photography", "Sound System"]', '["Weddings", "Casual Gatherings"]', 'Vadodara', 40000.00, 150000.00, 4.70, '+91 98765 43212', 'hello@dreammakers.com', 'Alkapuri, Vadodara, Gujarat', '["/backend/uploads/images/vendor-3-1.jpg", "/backend/uploads/images/vendor-3-2.jpg", "/backend/uploads/images/vendor-1-1.jpg", "/backend/uploads/images/vendor-2-2.jpg", "/backend/uploads/images/vendor-1-3.jpg"]', 'Making your dreams come true with creative event solutions'),
('Sparkle Events', 'Personal', '["Catering", "Photography"]', '["Birthdays", "Housewarmings"]', 'Rajkot', 25000.00, 80000.00, 4.30, '+91 98765 43213', 'events@sparkle.com', 'Race Course, Rajkot, Gujarat', '["/backend/uploads/images/vendor-1-3.jpg", "/backend/uploads/images/vendor-2-3.jpg", "/backend/uploads/images/vendor-1-5.jpg", "/backend/uploads/images/vendor-2-1.jpg", "/backend/uploads/images/vendor-3-2.jpg"]', 'Adding sparkle to your special moments'),
('Prime Productions', 'Professional', '["Videography", "Sound System"]', '["Corporate Events", "Conferences"]', 'Ahmedabad', 60000.00, 250000.00, 4.50, '+91 98765 43214', 'prime@productions.com', 'Bopal, Ahmedabad, Gujarat', '["/backend/uploads/images/vendor-2-2.jpg", "/backend/uploads/images/vendor-1-4.jpg", "/backend/uploads/images/vendor-2-4.jpg", "/backend/uploads/images/vendor-3-1.jpg", "/backend/uploads/images/vendor-1-2.jpg"]', 'Prime quality production services for corporate events'),
('Celebration Central', 'Personal', '["Photography", "Catering", "Sound System"]', '["Weddings", "Birthdays"]', 'Bhavnagar', 35000.00, 120000.00, 4.40, '+91 98765 43215', 'central@celebrations.com', 'Gandhi Nagar, Bhavnagar, Gujarat', '["/backend/uploads/images/vendor-1-1.jpg", "/backend/uploads/images/vendor-2-5.jpg", "/backend/uploads/images/vendor-1-3.jpg", "/backend/uploads/images/vendor-3-2.jpg", "/backend/uploads/images/vendor-2-1.jpg"]', 'Your central hub for all celebration needs'),
('Elegant Occasions', 'Professional', '["Photography", "Videography", "Catering"]', '["Exhibitions", "Corporate Events"]', 'Surat', 80000.00, 350000.00, 4.90, '+91 98765 43216', 'elegant@occasions.com', 'Vesu, Surat, Gujarat', '["/backend/uploads/images/vendor-2-4.jpg", "/backend/uploads/images/vendor-1-2.jpg", "/backend/uploads/images/vendor-2-3.jpg", "/backend/uploads/images/vendor-1-5.jpg", "/backend/uploads/images/vendor-3-1.jpg"]', 'Elegance redefined for your professional events'),
('Festive Vibes', 'Personal', '["Sound System", "Photography"]', '["Casual Gatherings", "Housewarmings"]', 'Jamnagar', 20000.00, 60000.00, 4.20, '+91 98765 43217', 'festive@vibes.com', 'Bedi Bunder, Jamnagar, Gujarat', '["/backend/uploads/images/vendor-3-1.jpg", "/backend/uploads/images/vendor-2-2.jpg", "/backend/uploads/images/vendor-1-1.jpg", "/backend/uploads/images/vendor-2-5.jpg", "/backend/uploads/images/vendor-1-4.jpg"]', 'Creating festive vibes for your gatherings'),
('Corporate Connect', 'Professional', '["Sound System", "Videography"]', '["Conferences", "Corporate Events"]', 'Gandhinagar', 45000.00, 180000.00, 4.60, '+91 98765 43218', 'connect@corporate.com', 'Sector 21, Gandhinagar, Gujarat', '["/backend/uploads/images/vendor-3-2.jpg", "/backend/uploads/images/vendor-2-4.jpg", "/backend/uploads/images/vendor-1-3.jpg", "/backend/uploads/images/vendor-2-1.jpg", "/backend/uploads/images/vendor-1-2.jpg"]', 'Connecting businesses through exceptional events'),
('Magical Moments', 'Personal', '["Photography", "Videography", "Catering"]', '["Weddings", "Birthdays"]', 'Anand', 55000.00, 190000.00, 4.80, '+91 98765 43219', 'magical@moments.com', 'Vallabh Vidyanagar, Anand, Gujarat', '["/backend/uploads/images/vendor-1-5.jpg", "/backend/uploads/images/vendor-3-1.jpg", "/backend/uploads/images/vendor-2-2.jpg", "/backend/uploads/images/vendor-1-4.jpg", "/backend/uploads/images/vendor-2-5.jpg"]', 'Creating magical moments that last forever');

-- Sample bookings
INSERT INTO bookings (user_id, vendor_id, event_date, event_type, services_requested, total_amount, status, notes) VALUES
(1, 1, '2024-06-15', 'Wedding', '["Photography", "Videography"]', 150000.00, 'confirmed', 'Outdoor wedding ceremony'),
(2, 3, '2024-07-20', 'Birthday', '["Photography", "Sound System"]', 80000.00, 'pending', 'Birthday party for 50 guests'),
(1, 5, '2024-08-10', 'Corporate Event', '["Videography", "Sound System"]', 200000.00, 'confirmed', 'Annual conference');

-- Sample reviews
INSERT INTO reviews (user_id, vendor_id, booking_id, rating, comment) VALUES
(1, 1, 1, 5, 'Excellent service! The team was professional and delivered amazing photos.'),
(2, 3, 2, 4, 'Great photography and sound system. Very satisfied with the service.');
