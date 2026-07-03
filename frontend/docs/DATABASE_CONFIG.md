# Database Configuration

## Required Environment Variables

The following environment variables are required for backend database connectivity. These should be configured in the backend environment, not the frontend.

### Backend Environment Variables (Provided)

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=aalto_admin
DB_USER=root
DB_PASSWORD=Ruthi@21
```

### Variable Descriptions

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| DB_HOST | Database server hostname or IP | `localhost` or `192.168.1.100` | Yes |
| DB_PORT | Database server port | `3306` (default MySQL) | Yes |
| DB_NAME | Database name from SQL dump | `aalto_engineers_db` | Yes |
| DB_USER | Database username with appropriate privileges | `root` or `aalto_user` | Yes |
| DB_PASSWORD | Database user password | `secure_password_123` | Yes |

## Database Schema Information

**Database Name**: `aalto_engineers_db`

**Tables** (from schema analysis):
- users (admin_users)
- enquiries
- blogs
- careers
- applicants
- gallery
- gallery_images
- case_studies
- refresh_tokens
- activity_logs
- notifications
- websites

## Security Notes

1. **Never commit DB_PASSWORD to version control**
2. **Use strong passwords** (minimum 12 characters, mixed case, numbers, symbols)
3. **Use environment-specific passwords** (different for dev, staging, production)
4. **Limit database user privileges** to only what's needed
5. **Use SSL/TLS for database connections** in production
6. **Rotate passwords regularly**

## Database User Privileges

For production, create a dedicated user with limited privileges:

```sql
CREATE USER 'aalto_user'@'%' IDENTIFIED BY 'secure_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON aalto_engineers_db.* TO 'aalto_user'@'%';
FLUSH PRIVILEGES;
```

## Frontend Configuration

The frontend does NOT require direct database connectivity. It communicates with the backend API.

**Frontend Environment Variables** (`.env`):
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_API_TIMEOUT=30000
VITE_APP_NAME=Aalto Engineers Admin
VITE_APP_VERSION=1.0.0
VITE_ENABLE_MOCK_API=false
VITE_ENABLE_DEBUG_MODE=false
```

## Connection Testing

Once credentials are provided, test database connectivity:

```bash
# Using MySQL client
mysql -h DB_HOST -P DB_PORT -u DB_USER -p DB_NAME

# Using Node.js (backend)
node scripts/test-db-connection.js
```

## Tasks Requiring Database Credentials

The following tasks cannot be completed until database credentials are provided:

1. **Backend API Connection Testing**
   - Verify API endpoints respond correctly
   - Test authentication flow
   - Validate CRUD operations

2. **Data Validation**
   - Verify actual data matches schema
   - Test foreign key constraints
   - Validate enum values in database

3. **Integration Testing**
   - End-to-end API testing
   - File upload testing
   - Pagination and filtering testing

4. **Performance Testing**
   - Query performance analysis
   - Load testing with real data
   - Index optimization verification

## Current Status

- ✅ Database schema analyzed from documentation
- ✅ Frontend types match database schema
- ✅ API contracts documented
- ✅ Frontend prepared for integration
- ⚠️ Database credentials NOT provided
- ⚠️ No live database connection available
- ⚠️ Backend API not yet tested

## Next Steps

1. **Provide database credentials** to proceed with backend integration
2. **Configure backend environment** with database variables
3. **Start backend server** with database connection
4. **Test API endpoints** with real database
5. **Validate frontend-backend integration**

---

**Note**: This file is for configuration reference only. Do not commit actual passwords to version control.
