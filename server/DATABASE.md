# Database Configuration Guide

This document explains the database configuration and management system for the Portfolio API.

## 📁 Configuration Structure

```
server/src/config/
├── index.js          # Main configuration file
├── database.js       # Database connection configuration
├── migrations.js     # Database migration system
└── seeders.js        # Sample data seeders
```

## 🗄️ Database Configuration

### Environment Variables

Create a `.env` file in the server directory with the following variables:

```env
# Database Configuration
DB_NAME=website
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_SSL=false

# Test Database (optional)
DB_NAME_TEST=website_test

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=24h

# CORS Configuration (optional)
CORS_ORIGIN=http://localhost:5173,http://localhost:5174
```

### Database Connection

The database configuration supports multiple environments:

- **Development**: Full logging, local PostgreSQL
- **Test**: Separate test database, no logging
- **Production**: SSL support, connection pooling, no logging

## 🚀 Database Management CLI

Use the built-in CLI for database operations:

### Available Commands

```bash
# Test database connection
npm run db:test

# Initialize database (sync tables + migrations + seeders)
npm run db:init

# Run migrations only
npm run db:migrate

# Rollback last migration
npm run db:rollback

# Seed database with sample data
npm run db:seed

# Reset database (clear + reseed)
npm run db:reset

# Drop all tables (destructive!)
npm run db:drop

# Show database status
npm run db:status
```

### CLI Examples

```bash
# Check if database is connected
npm run db:test

# Get current database status
npm run db:status

# Reset database with fresh sample data
npm run db:reset

# Initialize a fresh database
npm run db:init
```

## 📊 Database Schema

### Tables

1. **Projects** - Portfolio projects
   - id, title, description, image, technologies (JSON)
   - liveUrl, githubUrl, featured, order
   - createdAt, updatedAt

2. **Skills** - Technical skills
   - id, name, category, level (1-5), icon, order
   - createdAt, updatedAt

3. **Experiences** - Work experience and education
   - id, title, company, location
   - startDate, endDate, current (boolean)
   - description, type (work/education), order
   - createdAt, updatedAt

4. **Admins** - Admin users
   - id, username, email, password (hashed)
   - createdAt, updatedAt

5. **Migrations** - Migration tracking
   - id, name, executed_at

### Indexes

Performance indexes are automatically created:

- Projects: featured, order
- Skills: category, level
- Experiences: type, current, startDate

## 🔄 Migration System

### How Migrations Work

1. Migrations are stored in `src/config/migrations.js`
2. Each migration has a unique name and `up()` function
3. Executed migrations are tracked in the `Migrations` table
4. Migrations run automatically on server start
5. Use CLI for manual migration management

### Adding New Migrations

```javascript
// In src/config/migrations.js
{
  name: "005_add_new_feature",
  up: async () => {
    const queryInterface = sequelize.getQueryInterface();
    
    // Add your migration logic here
    await queryInterface.addColumn("Projects", "newField", {
      type: sequelize.Sequelize.STRING,
      allowNull: true,
    });
  },
}
```

## 🌱 Seeding System

### Sample Data

The seeder automatically creates sample data in development:

- 2 sample projects (e-commerce, task management)
- 15 sample skills (React, Node.js, etc.)
- 3 sample experiences (work + education)
- 1 default admin user (admin/admin123)

### Custom Seeders

Add new seeders in `src/config/seeders.js`:

```javascript
const seedCustomData = async () => {
  // Your seeding logic here
};
```

## 🔧 Configuration Features

### Environment-Specific Settings

- **Development**: Auto-seeding, full logging, local database
- **Production**: SSL support, connection pooling, no auto-seeding
- **Test**: Separate test database, minimal logging

### Security Features

- Password hashing with bcrypt
- JWT token authentication
- Environment variable validation
- SQL injection protection via Sequelize

### Performance Features

- Connection pooling
- Database indexes
- Query optimization
- Prepared statements

## 🛠️ Troubleshooting

### Common Issues

1. **Connection Failed**
   ```bash
   npm run db:test
   ```
   Check your PostgreSQL server and credentials.

2. **Migration Errors**
   ```bash
   npm run db:rollback
   npm run db:migrate
   ```

3. **Reset Everything**
   ```bash
   npm run db:drop
   npm run db:init
   ```

### Database Reset

If you need to completely reset your database:

```bash
# Option 1: Reset data only
npm run db:reset

# Option 2: Drop and recreate everything
npm run db:drop
npm run db:init
```

## 📈 Monitoring

### Database Status

Check your database health:

```bash
npm run db:status
```

This shows:
- Connection status
- Table count and record counts
- Environment information
- Database configuration

### Logs

Database operations are logged with emojis for easy identification:

- 🚀 Server startup
- ✅ Successful operations
- ❌ Errors
- 📊 Database sync
- 🔄 Migrations
- 🌱 Seeding
- 📋 Table operations

## 🔐 Security Best Practices

1. **Environment Variables**: Never commit `.env` files
2. **Strong Passwords**: Use complex database passwords
3. **JWT Secrets**: Use long, random JWT secrets (32+ characters)
4. **SSL**: Enable SSL in production (`DB_SSL=true`)
5. **Firewall**: Restrict database access to application servers only

## 🚀 Production Deployment

### Environment Setup

1. Set `NODE_ENV=production`
2. Configure production database credentials
3. Enable SSL if required (`DB_SSL=true`)
4. Set strong JWT secret
5. Configure CORS origins

### Database Initialization

```bash
# On production server
npm run db:init
```

This will:
- Test database connection
- Sync all tables
- Run migrations
- Create admin user
- Skip auto-seeding (production mode)

The database configuration is now fully organized and production-ready!
