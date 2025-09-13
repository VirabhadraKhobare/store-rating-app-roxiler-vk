# 🏪 Store Rating Application

A full-stack web application that allows users to submit ratings for stores registered on the platform. Built with modern web technologies and featuring a unique doodle-themed design.

## ✨ Features

### 🔐 Authentication & Authorization
- Secure user registration and login with JWT tokens
- Role-based access control (System Admin, Normal User, Store Owner)
- Password encryption with bcrypt
- Protected routes based on user roles

### 👑 System Administrator Features
- **Dashboard**: View total users, stores, and ratings statistics
- **User Management**: Add new users (admin, normal user, store owner)
- **Store Management**: Add new stores and assign owners
- **Data Overview**: List and filter users by name, email, address, and role
- **Store Analytics**: View stores with ratings and customer feedback
- **User Details**: Access detailed user information including store ratings for owners

### 👤 Normal User Features
- **Registration**: Sign up with name, email, password, and address
- **Store Discovery**: Browse all registered stores
- **Search Functionality**: Find stores by name and address
- **Rating System**: Submit ratings (1-5 stars) for stores
- **Rating Management**: Modify previously submitted ratings
- **Dashboard**: View personal rating statistics and activity

### 🏪 Store Owner Features
- **Store Dashboard**: View store performance and analytics
- **Customer Insights**: See list of users who rated the store
- **Rating Analytics**: Access average rating and total review count
- **Performance Metrics**: Monitor store rating trends


## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js v22.14.0
- **Framework**: Express.js
- **Database**: MySQL (switched from PostgreSQL)
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Security**: Helmet.js, CORS

### Frontend
- **Framework**: React 18.2.0
- **Language**: TypeScript
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios (direct calls, no service file)
- **State Management**: React Context API
- **Styling**: Custom CSS with doodle theme

### Development Tools
- **Backend Dev**: Nodemon
- **Database**: MySQL with connection pooling
- **API Testing**: Built-in test scripts

## 📁 Project Structure

```
store-rating-app/
├── backend/
│   ├── src/
│   │   ├── config/         # Database and app configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Authentication and validation
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Helper functions
│   │   ├── models/         # Database models
│   │   ├── app.js         # Express app setup
│   │   └── server.js      # Server entry point
│   ├── database/
│   │   ├── schema.sql     # Database schema
│   │   ├── seeds/         # Sample data
│   │   └── setup.js       # Database setup script
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript types
│   │   ├── utils/         # Utility functions
│   │   ├── constants/     # App constants
│   │   └── styles/        # CSS styles
│   ├── package.json
│   └── public/
└── README.md
```

## 🚀 Installation & Setup


### Prerequisites
- Node.js v22.14.0 or higher
- npm v10.x or higher
- MySQL 8+ installed and running

### 1. Clone Repository
```bash
git clone https://github.com/VirabhadraKhobare/store-rating-app-roxiler-vk.git
cd store-rating-app-roxiler-vk
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env


# Edit .env with your database credentials
# DB_HOST=localhost
# DB_PORT=3306
# DB_NAME=store_rating_db
# DB_USER=your_mysql_user
# DB_PASSWORD=your_mysql_password
# JWT_SECRET=your-secret-key


# Setup database (creates tables and seeds data)
# You can use MySQL Workbench or CLI to run the SQL files in backend/database/schema.sql and backend/database/seeds/001_seed_initial_data.sql

# Start development server
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup
```bash
# Navigate to frontend directory (new terminal)
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```


Frontend will run on `http://localhost:3000`


## 🎯 Usage

### Default Login Credentials
```
System Administrator:
Email: admin@storerating.com
Password: password

Store Owner:
Email: john.smith@techstore.com
Password: password

Normal User:
Register a new account or use seeded users
Password for all seeded users: password
```

### User Workflows

#### For Normal Users:
1. Register a new account or login
2. Browse stores on the stores page
3. Search for specific stores by name/address
4. Click on rating buttons (1-5 stars) to rate stores
5. View your rating statistics on the dashboard

#### For Store Owners:
1. Login with store owner credentials
2. View your store's dashboard
3. Check average rating and total reviews
4. See list of customers who rated your store

#### For System Administrators:
1. Login with admin credentials
2. View system statistics on dashboard
3. Add new users and stores
4. Manage all platform data
5. Filter and search through users and stores

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/password` - Update password
- `POST /api/auth/logout` - User logout

### Admin Routes (System Admin Only)
- `GET /api/admin/dashboard` - Get dashboard statistics
- `POST /api/admin/users` - Create new user
- `GET /api/admin/users` - Get all users with filtering
- `GET /api/admin/users/:id` - Get user details
- `POST /api/admin/stores` - Create new store
- `GET /api/admin/stores` - Get all stores with ratings

### User Routes (Normal Users Only)
- `GET /api/user/stores` - Get all stores with user's ratings
- `POST /api/user/ratings` - Submit or update store rating

### Store Owner Routes (Store Owners Only)
- `GET /api/store-owner/dashboard` - Get store dashboard data
- `GET /api/store-owner/ratings` - Get all ratings for owner's store

## 📋 Form Validations

### User Registration/Creation
- **Name**: 20-60 characters, letters and spaces only
- **Email**: Valid email format, unique in system
- **Password**: 8-16 characters, must include:
  - At least one uppercase letter
  - At least one special character
- **Address**: Maximum 400 characters (optional)

### Store Creation
- **Name**: 20-60 characters
- **Email**: Valid email format, unique in system
- **Address**: Maximum 400 characters (optional)
- **Owner**: Valid store owner user ID (optional)

### Rating Submission
- **Rating**: Integer between 1 and 5 (inclusive)
- **Store**: Must be a valid existing store
- **User**: One rating per user per store (can be updated)

## 🎨 Design Features

### Doodle Theme
- Hand-drawn borders with organic border-radius
- Kalam font for handwritten feel
- Black and white color scheme
- Tilted and rotated elements
- Sketchy shadows and animations
- Paper-like background patterns

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Touch-friendly buttons
- Optimized for all screen sizes

## ✅ Assignment Requirements Fulfilled

- [x] **Role-based access control** - 3 distinct user roles
- [x] **User authentication** - Secure JWT-based auth
- [x] **User registration** - Complete signup process
- [x] **Dashboard statistics** - Total counts for admin
- [x] **User management** - Add users with all roles
- [x] **Store management** - Add and list stores
- [x] **Store listings** - View all registered stores
- [x] **Search functionality** - Filter by name and address
- [x] **Rating system** - Submit 1-5 star ratings
- [x] **Rating modification** - Update existing ratings
- [x] **Store owner analytics** - View customer ratings
- [x] **Data validation** - All form validations implemented
- [x] **Responsive design** - Works on all devices
- [x] **Database design** - Optimized schema with indexes

## 🧪 Testing

### Backend Testing
```bash
cd backend
node test-auth.js  # Test authentication endpoints
```

### Frontend Testing
```bash
cd frontend
npm test  # Run React tests
```

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Role-based route protection
- [ ] Store listing and search
- [ ] Rating submission and modification
- [ ] Admin user and store creation
- [ ] Dashboard statistics accuracy
- [ ] Mobile responsiveness
- [ ] Form validations

## 🛡️ Security Features

- **Password Encryption**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Comprehensive form validation
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Helmet.js security headers
- **CORS Configuration**: Controlled cross-origin requests
- **Role-based Authorization**: Protected API endpoints


## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## 👨‍💻 Author & Credits

**Original Author:** Virabhadra Khobare
- GitHub: [@VirabhadraKhobare](https://github.com/VirabhadraKhobare)

## 🙏 Acknowledgments

- Express.js team for the robust backend framework
- React team for the excellent frontend library
- MySQL community for the reliable database
---

*Built with ❤️ for the Roxiler Systems Assignment*
