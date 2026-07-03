# Aalto Engineers Admin Panel - Backend API

Backend API server for the Aalto Engineers Admin Panel, built with Node.js, Express, and MySQL.

## Features

- RESTful API architecture
- JWT authentication with refresh tokens
- MySQL database integration
- File upload support (resumes, images)
- Request validation with express-validator
- CORS enabled for frontend integration
- Comprehensive error handling

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_NAME=aalto_admin
DB_USER=root
DB_PASSWORD=your_password

JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

CORS_ORIGIN=http://localhost:5173
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=16777216
```

4. Ensure MySQL database exists:
```sql
CREATE DATABASE IF NOT EXISTS aalto_admin CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

5. Run database migrations (if available) or import schema:
```bash
# Import the schema from docs/03-database-schema.md
mysql -u root -p aalto_admin < schema.sql
```

6. Seed admin user:
```bash
node src/scripts/seedAdmin.js
```

Default credentials:
- Email: `admin@aaltoengineers.com`
- Password: `admin123`

## Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server will start on `http://localhost:5000`

## API Endpoints

### Authentication

- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/me` - Get current user

### Enquiries

- `GET /api/v1/enquiries` - Get all enquiries (with pagination, filters)
- `GET /api/v1/enquiries/:id` - Get enquiry by ID
- `POST /api/v1/enquiries` - Create new enquiry
- `PUT /api/v1/enquiries/:id` - Update enquiry
- `DELETE /api/v1/enquiries/:id` - Delete enquiry

### Blogs

- `GET /api/v1/blogs` - Get all blogs (with pagination, filters)
- `GET /api/v1/blogs/:id` - Get blog by ID
- `POST /api/v1/blogs` - Create new blog
- `PUT /api/v1/blogs/:id` - Update blog
- `DELETE /api/v1/blogs/:id` - Delete blog

### Careers

- `GET /api/v1/careers` - Get all careers (with pagination, filters)
- `GET /api/v1/careers/:id` - Get career by ID
- `POST /api/v1/careers` - Create new career
- `PUT /api/v1/careers/:id` - Update career
- `DELETE /api/v1/careers/:id` - Delete career

### Applicants

- `GET /api/v1/applicants` - Get all applicants (with pagination, filters)
- `GET /api/v1/applicants/:id` - Get applicant by ID
- `POST /api/v1/applicants` - Create new applicant
- `PUT /api/v1/applicants/:id` - Update applicant
- `DELETE /api/v1/applicants/:id` - Delete applicant

### Gallery

- `GET /api/v1/gallery` - Get all galleries (with pagination, filters)
- `GET /api/v1/gallery/:id` - Get gallery by ID (with images)
- `POST /api/v1/gallery` - Create new gallery
- `PUT /api/v1/gallery/:id` - Update gallery
- `DELETE /api/v1/gallery/:id` - Delete gallery

### Case Studies

- `GET /api/v1/case-studies` - Get all case studies (with pagination, filters)
- `GET /api/v1/case-studies/:id` - Get case study by ID
- `POST /api/v1/case-studies` - Create new case study
- `PUT /api/v1/case-studies/:id` - Update case study
- `DELETE /api/v1/case-studies/:id` - Delete case study

## API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message"
}
```

### Paginated Response
```json
{
  "success": true,
  "message": "Items retrieved successfully",
  "data": {
    "items": [],
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

## Authentication

All protected endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <access_token>
```

## Query Parameters

### Pagination
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

### Filters
- `status` - Filter by status
- `search` - Search across text fields
- Module-specific filters (e.g., `service_type`, `employment_type`)

## File Uploads

File uploads are handled via Multer. Supported file types:

- **Images**: JPEG, PNG, WebP, GIF (max 16MB)
- **Documents**: PDF, Word documents (max 16MB)

Upload directories:
- `uploads/resumes/` - Resume files
- `uploads/images/` - General images
- `uploads/featured/` - Featured images

## Database Schema

The database schema is documented in `../docs/03-database-schema.md`

Key tables:
- `users` - User accounts and authentication
- `refresh_tokens` - JWT refresh tokens
- `enquiries` - Customer enquiries
- `blogs` - Blog posts
- `careers` - Job postings
- `applicants` - Job applicants
- `galleries` - Image galleries
- `gallery_images` - Gallery images
- `case_studies` - Case studies

## Error Handling

The API includes comprehensive error handling:

- Validation errors (400)
- Authentication errors (401)
- Not found errors (404)
- Database errors (500)
- Custom error messages

## Development

### Adding New Endpoints

1. Create controller in `src/controllers/`
2. Create routes in `src/routes/`
3. Import and register routes in `src/server.js`
4. Add validation rules if needed

### Database Queries

Use the connection pool from `src/config/database.js`:

```javascript
const { pool } = require('../config/database');

const [results] = await pool.query('SELECT * FROM table WHERE id = ?', [id]);
```

## Testing

Test the API using tools like Postman, cURL, or the frontend application.

Example login request:
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@aaltoengineers.com","password":"admin123"}'
```

## Troubleshooting

### Database Connection Failed

- Verify MySQL is running
- Check database credentials in `.env`
- Ensure database `aalto_admin` exists

### Port Already in Use

Change the PORT in `.env` or stop the process using the port.

### JWT Token Errors

- Verify `JWT_SECRET` is set in `.env`
- Check token expiration time

## License

ISC
