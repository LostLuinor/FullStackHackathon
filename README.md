# Frontend Application

A modern SvelteKit application with authentication and responsive design.

## Features

- 🔐 **Authentication System**: Complete login and registration functionality
- 🎨 **Modern UI**: Built with TailwindCSS for beautiful, responsive design
- 📱 **Mobile-First**: Fully responsive across all device sizes
- 🚀 **Fast Performance**: SvelteKit for optimal performance
- 🔗 **API Integration**: Ready to connect with your backend API

## Pages

- **Home**: Landing page with feature showcase
- **Login**: User authentication with email/password
- **Sign Up**: User registration with validation
- **Dashboard**: Protected route for authenticated users

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure your backend API:**
   Copy `.env.example` to `.env` and update the API URL:
   ```
   VITE_API_URL=http://localhost:3000/api
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173`

## API Integration

The application expects your backend API to have the following endpoints:

### Authentication
- `POST /auth/login` - User login
  ```json
  {
    "email": "user@example.com",
    "password": "password"
  }
  ```

- `POST /auth/register` - User registration
  ```json
  {
    "name": "John Doe",
    "email": "user@example.com", 
    "password": "password"
  }
  ```

- `POST /auth/logout` - User logout

### User Profile
- `GET /user/profile` - Get user profile
- `PUT /user/profile` - Update user profile

## Project Structure

```
src/
├── lib/
│   ├── components/
│   │   ├── Navigation.svelte
│   │   └── LoadingSpinner.svelte
│   ├── stores/
│   │   └── auth.js
│   ├── api.js
│   └── index.js
├── routes/
│   ├── login/
│   │   └── +page.svelte
│   ├── signup/
│   │   └── +page.svelte
│   ├── dashboard/
│   │   ├── +page.js
│   │   └── +page.svelte
│   ├── +layout.svelte
│   └── +page.svelte
├── app.css
└── app.html
```

## Technologies Used

- **SvelteKit**: Full-stack web framework
- **TailwindCSS**: Utility-first CSS framework  
- **JavaScript**: ES6+ features with JSDoc typing
- **Vite**: Fast build tool and dev server

## Environment Variables

- `VITE_API_URL`: Backend API base URL (default: http://localhost:3000/api)

## Build & Deploy

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request
