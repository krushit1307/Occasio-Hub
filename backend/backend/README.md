# Occassio Hub - PHP Backend

A comprehensive PHP backend API for the Occassio Hub event vendor marketplace platform.

## Features

- **RESTful API** with proper HTTP status codes
- **JWT Authentication** with access and refresh tokens
- **User Management** (registration, login, profile management)
- **Vendor Management** (CRUD operations, search, filtering)
- **Image Upload** functionality
- **Database Integration** with MySQL
- **CORS Support** for cross-origin requests
- **Security Features** (password hashing, input sanitization, SQL injection prevention)

## Requirements

- PHP 7.4 or higher
- MySQL 5.7 or higher
- Apache/Nginx web server
- PHP extensions: PDO, PDO_MySQL, JSON, FileInfo

## Installation

1. **Clone or download the backend files** to your web server directory
2. **Set up the database:**
   ```sql
   -- Import the database schema
   mysql -u root -p < backend/database/schema.sql
   ```
3. **Configure database connection** in `backend/config/database.php`:
   ```php
   private $host = "localhost";
   private $db_name = "occassio_hub";
   private $username = "your_username";
   private $password = "your_password";
   ```
4. **Set up file permissions:**
   ```bash
   chmod 755 backend/uploads/images/
   ```
5. **Configure your web server** to serve the backend directory

## API Endpoints

### Authentication

#### Register User
```
POST /backend/api/auth/register.php
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 98765 43210",
  "password": "password123",
  "role": "user"
}
```

#### Login
```
POST /backend/api/auth/login.php
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response includes JWT tokens:
```json
{
  "message": "Login successful.",
  "success": true,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "tokens": {
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "expires_in": 3600
  }
}
```

### Vendors

#### Get All Vendors
```
GET /backend/api/vendors/read.php
```

**Query Parameters:**
- `category` - Filter by category (Personal/Professional)
- `location` - Filter by location
- `maxPrice` - Filter by maximum price
- `minRating` - Filter by minimum rating
- `services` - Filter by services (comma-separated)
- `search` - Search term for name, location, or description

**Example:**
```
GET /backend/api/vendors/read.php?category=Personal&location=Ahmedabad&maxPrice=100000&minRating=4.5
```

#### Get Single Vendor
```
GET /backend/api/vendors/read_one.php?id=1
```

#### Create Vendor
```
POST /backend/api/vendors/create.php
Content-Type: application/json

{
  "name": "New Vendor",
  "category": "Personal",
  "services": ["Photography", "Videography"],
  "specialties": ["Weddings", "Birthdays"],
  "location": "Ahmedabad",
  "priceRange": {
    "min": 50000,
    "max": 200000
  },
  "rating": 4.5,
  "phone": "+91 98765 43210",
  "email": "contact@newvendor.com",
  "address": "Satellite, Ahmedabad, Gujarat",
  "images": ["/backend/uploads/images/vendor-1-1.jpg"],
  "description": "Professional event services"
}
```

### Image Upload

#### Upload Image
```
POST /backend/api/upload/image.php
Content-Type: multipart/form-data

Form data:
- image: [file] (JPEG, PNG, GIF, WebP, max 5MB)
```

Response:
```json
{
  "message": "Image uploaded successfully.",
  "success": true,
  "file_url": "/backend/uploads/images/unique_filename.jpg",
  "filename": "unique_filename.jpg"
}
```

## Database Schema

### Users Table
- `id` - Primary key
- `name` - User's full name
- `email` - Unique email address
- `phone` - Phone number
- `password` - Hashed password
- `role` - User role (user/vendor/admin)
- `created_at` - Account creation timestamp
- `updated_at` - Last update timestamp

### Vendors Table
- `id` - Primary key
- `name` - Vendor business name
- `category` - Personal or Professional
- `services` - JSON array of services offered
- `specialties` - JSON array of event specialties
- `location` - City/location
- `price_min` - Minimum price range
- `price_max` - Maximum price range
- `rating` - Average rating (0-5)
- `phone` - Contact phone
- `email` - Contact email
- `address` - Business address
- `images` - JSON array of image URLs
- `description` - Business description
- `created_at` - Registration timestamp
- `updated_at` - Last update timestamp

### Bookings Table
- `id` - Primary key
- `user_id` - Foreign key to users table
- `vendor_id` - Foreign key to vendors table
- `event_date` - Scheduled event date
- `event_type` - Type of event
- `services_requested` - JSON array of requested services
- `total_amount` - Total booking amount
- `status` - Booking status (pending/confirmed/completed/cancelled)
- `notes` - Additional notes
- `created_at` - Booking creation timestamp
- `updated_at` - Last update timestamp

### Reviews Table
- `id` - Primary key
- `user_id` - Foreign key to users table
- `vendor_id` - Foreign key to vendors table
- `booking_id` - Foreign key to bookings table
- `rating` - Rating (1-5)
- `comment` - Review comment
- `created_at` - Review creation timestamp

## Security Features

1. **Password Hashing** - All passwords are hashed using bcrypt
2. **JWT Authentication** - Secure token-based authentication
3. **Input Sanitization** - All user inputs are sanitized
4. **SQL Injection Prevention** - Using prepared statements
5. **CORS Protection** - Proper CORS headers for cross-origin requests
6. **File Upload Security** - File type and size validation

## Error Handling

The API returns consistent error responses with appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `405` - Method Not Allowed
- `409` - Conflict
- `500` - Internal Server Error
- `503` - Service Unavailable

Error response format:
```json
{
  "message": "Error description",
  "success": false,
  "error": "Detailed error message (optional)"
}
```

## Frontend Integration

To integrate with the React frontend, update your API calls to use the PHP backend endpoints:

```javascript
// Example: Fetch vendors
const response = await fetch('/backend/api/vendors/read.php?category=Personal');
const data = await response.json();

// Example: User login
const loginResponse = await fetch('/backend/api/auth/login.php', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});
const loginData = await loginResponse.json();
```

## Testing

The database comes with sample data for testing:
- 3 sample users (including admin)
- 10 sample vendors with complete data
- Sample bookings and reviews

Default admin credentials:
- Email: `admin@occassiohub.com`
- Password: `password` (hashed in database)

## File Structure

```
backend/
├── config/
│   ├── database.php
│   └── cors.php
├── models/
│   ├── Vendor.php
│   └── User.php
├── utils/
│   └── JwtHandler.php
├── api/
│   ├── auth/
│   │   ├── register.php
│   │   └── login.php
│   ├── vendors/
│   │   ├── read.php
│   │   ├── read_one.php
│   │   └── create.php
│   └── upload/
│       └── image.php
├── database/
│   └── schema.sql
├── uploads/
│   └── images/
└── README.md
```

## Support

For issues or questions, please refer to the project documentation or contact the development team.
