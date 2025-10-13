# TemplateV2 - Modern Full-Stack Web Application Template

A production-ready, state-of-the-art full-stack web application template built with React, TypeScript, Chakra UI, and Django. Features sophisticated role-based access control, modern UI components, and comprehensive testing.

![TemplateV2 Home Page](https://github.com/user-attachments/assets/fd4e23f4-cf42-490b-a3be-aaf40dac6ff2)

## ✨ Features

### 🎨 **Modern UI/UX**
- **Chakra UI Components**: Beautiful, accessible, and customizable component library
- **Custom Theme System**: Fully customizable color palette with professional design
- **Responsive Design**: Mobile-first approach that works perfectly on all devices
- **Smooth Animations**: Elegant transitions and hover effects throughout the app

### 🔐 **Authentication & Authorization**
- **Role-Based Access Control**: Support for Admin, Moderator, User, and Guest roles
- **Protected Routes**: Secure routing with role-based access restrictions  
- **Feature Flags**: Dynamic UI based on user permissions and roles
- **Mock Authentication**: Ready-to-use authentication system with demo credentials

### 🛠 **Developer Experience**
- **TypeScript**: Full type safety and excellent IDE support
- **Component Architecture**: Clean, reusable, and well-organized components
- **Comprehensive Testing**: Unit tests for utilities and components
- **Modern Tooling**: Latest React, TypeScript, and build tools

### 🚀 **Technical Stack**
- **Frontend**: React 18, TypeScript, Chakra UI, React Router
- **Backend**: Django (basic structure included)
- **Styling**: Chakra UI with custom theme system
- **Testing**: Jest, React Testing Library
- **Build Tools**: Create React App with TypeScript template

## 🎯 Demo & Live Preview

The application is designed to showcase different features based on user roles:

### Demo Credentials
- **Admin**: `admin@example.com` / `admin123`
- **Moderator**: `moderator@example.com` / `mod123`
- **Regular User**: `user@example.com` / `user123`

Each role provides different levels of access and functionality, demonstrating the flexible permission system.

## 🚀 Quick Start

### **Automatic Setup (Recommended)**

#### For Linux/macOS:
1. **Install all dependencies**
   ```bash
   ./install.sh
   ```

2. **Start both frontend and backend servers**
   ```bash
   ./start.sh
   ```

#### For Windows:
1. **Install all dependencies**
   ```cmd
   install.bat
   ```

2. **Start both frontend and backend servers**
   ```cmd
   start.bat
   ```

#### Access the Application:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000/api/`
- Admin Panel: `http://localhost:8000/admin/`

### **Manual Setup (Alternative)**

If you prefer to set up manually:

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations and initialize database**
   ```bash
   python manage.py migrate
   python manage.py init_acl  # Initialize ACL system
   python init_db.py          # Configure database for concurrency (SQLite WAL mode)
   ```

5. **Start server**
   ```bash
   python manage.py runserver
   ```

## 🔄 Concurrent User Support

The application now supports multiple concurrent users with the following improvements:

- **Unique Session Tokens**: Each login generates a unique authentication token, allowing multiple sessions per user
- **SQLite WAL Mode**: Enhanced database concurrency using Write-Ahead Logging
- **Automatic Retries**: Built-in retry logic handles transient database locks
- **Atomic Transactions**: Prevents race conditions during concurrent operations

**Performance**: Tested and verified to handle 15-20 concurrent users reliably. For more details, see [CONCURRENCY_FIXES.md](CONCURRENCY_FIXES.md).

**Production Note**: For applications expecting >50 concurrent users, consider upgrading from SQLite to PostgreSQL or MySQL.

## 📁 Project Structure

```
templateV2/
├── frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── Layout.tsx   # Main layout with navigation
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── RoleBasedRender.tsx
│   │   ├── pages/           # Page components
│   │   │   ├── Home.tsx     # Landing page
│   │   │   ├── Login.tsx    # Authentication
│   │   │   ├── SignUp.tsx   # User registration
│   │   │   └── Dashboard.tsx # Role-based dashboard
│   │   ├── hooks/           # Custom React hooks
│   │   │   └── useAuth.tsx  # Authentication logic
│   │   ├── utils/           # Utility functions
│   │   │   └── permissions.ts # Role-based permissions
│   │   ├── types/           # TypeScript definitions
│   │   │   └── index.ts     # Common types
│   │   └── theme/           # Chakra UI theme
│   │       └── index.ts     # Custom theme configuration
├── backend/                 # Django backend (basic structure)
│   ├── templatev2_backend/  # Django project
│   └── requirements.txt     # Python dependencies
└── README.md
```

## 🎨 Key Components

### Authentication System
- **useAuth Hook**: Centralized authentication state management
- **ProtectedRoute Component**: Route-level access control
- **RoleBasedRender Component**: Conditional rendering based on user roles

### UI Components
- **Layout Component**: Responsive navigation with role-based menu items
- **Home Page**: Beautiful landing page with feature showcase
- **Login/SignUp Pages**: Polished authentication forms with validation
- **Dashboard**: Role-specific content and permissions display

### Permission System
- **Role Hierarchy**: Guest < User < Moderator < Admin
- **Feature Flags**: Dynamic feature availability based on roles
- **Component Permissions**: Granular control over UI elements

## 🧪 Testing

Run the test suite:

```bash
cd frontend
npm test
```

The project includes comprehensive tests for:
- Permission utility functions
- Component behavior
- Authentication logic

## 🎨 Customization

### Theme Customization
The theme system is fully customizable. Edit `frontend/src/theme/index.ts` to:
- Change color palettes
- Modify component styles
- Add new design tokens
- Customize typography

### Adding New Roles
1. Update `UserRole` enum in `types/index.ts`
2. Modify permission logic in `utils/permissions.ts`
3. Update feature flags and component permissions as needed

## 📱 Responsive Design

The template is built with a mobile-first approach:
- **Breakpoints**: Responsive design for all screen sizes
- **Navigation**: Collapsible mobile menu
- **Components**: All components adapt to different viewports
- **Typography**: Responsive text sizing

## 🔗 API Documentation

The backend provides a RESTful API with the following endpoints:

### Authentication Endpoints
- `GET /api/health/` - Health check endpoint
- `POST /api/auth/login/` - User login
- `POST /api/auth/signup/` - User registration
- `GET /api/auth/profile/` - Get current user profile (requires authentication)

### API Response Format
```json
{
  "user": {
    "id": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "role": "ADMIN|MODERATOR|USER",
    "isActive": boolean,
    "createdAt": "ISO string",
    "updatedAt": "ISO string"
  },
  "token": "string" // For login/signup responses
}
```

### Demo Credentials
The API supports these demo accounts:
- **Admin**: `admin@example.com` / `admin123`
- **Moderator**: `moderator@example.com` / `mod123`
- **User**: `user@example.com` / `user123`

## 🔧 Troubleshooting

### Common Issues

**Installation Issues:**
- Ensure Node.js (v16+) and Python (v3.8+) are installed
- On Linux/macOS: If permission denied, run: `chmod +x install.sh start.sh`
- On Windows: Use Command Prompt or PowerShell to run `.bat` files
- Check that ports 3000 and 8000 are not in use by other applications

**Server Connection Issues:**
- Check if ports 3000 and 8000 are available
- Ensure both servers are running: `./start.sh`
- Check logs in the `logs/` directory for error details

**Frontend-Backend Connection:**
- Verify backend health: `curl http://localhost:8000/api/health/`
- Check CORS settings in Django if getting network errors
- Ensure API_BASE_URL in frontend matches backend URL

**Authentication Issues:**
- Clear browser localStorage if login issues persist
- Check Django admin panel for user accounts
- Verify token-based authentication is working

### Log Files
When using `./start.sh`, logs are available at:
- Frontend: `logs/frontend.log`
- Backend: `logs/backend.log`

## 🔧 Built With

### Frontend
- [React](https://reactjs.org/) - Frontend framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Chakra UI](https://chakra-ui.com/) - Component library
- [React Router](https://reactrouter.com/) - Client-side routing
- [Jest](https://jestjs.io/) - Testing framework

### Backend
- [Django](https://www.djangoproject.com/) - Backend framework
- [Django REST Framework](https://www.django-rest-framework.org/) - API development
- [Django CORS Headers](https://github.com/adamchainz/django-cors-headers) - CORS handling
- [SQLite](https://sqlite.org/) - Database (development)

### Development Tools
- **Installation Script**: `install.sh` - One-command dependency installation
- **Startup Script**: `start.sh` - Concurrent frontend/backend server startup

## 📄 License

This project is licensed under the Mozilla Public License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 💡 Next Steps

This template now provides a complete full-stack foundation with working frontend-backend integration. Consider adding:
- Additional API endpoints and business logic
- Database models and advanced migrations
- Advanced authentication (OAuth, 2FA, JWT refresh tokens)
- Real-time features (WebSocket, Server-Sent Events)
- Advanced testing (E2E, visual regression, API testing)
- Production deployment configuration
- CI/CD pipeline setup
- Docker containerization

---

Built with ❤️ for the developer community. Ready to power your next amazing project!
