# Autoresum UI

![Autoresum Logo](/images/logo.png)

This repository contains the frontend UI for Autoresum, a modern resume building application. Built with React and styled with Tailwind CSS, this UI offers a clean, responsive interface with dark mode support. It's designed to connect to a separate Python backend service.

## 🌟 Features

- **Clean, Modern Interface**: Professional-looking UI components based on a design system
- **Dark Mode Support**: System-preference based dark mode for comfortable viewing
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dashboard Layout**: Organized layout for managing resume content
- **Style Guide**: Comprehensive style guide for consistent design

## 🚀 Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn
- Python backend API service (separate repository)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/autoresum-ui.git
cd autoresum-ui
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the project root to connect to your backend:
```
VITE_API_URL=http://localhost:5000
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

5. Open your browser and navigate to `http://localhost:3000`

## 🔄 Connecting to the Backend

This UI is designed to connect to a Python backend API. For development, you can:

1. Use the included mock API service which provides sample data
2. Connect to a real Python backend by setting the `VITE_API_URL` environment variable

See the `BACKEND_CONNECTION.md` file for detailed instructions on how to integrate with your Python backend.

## 🏗️ Project Structure

```
my-app/
├── public/               # Static files
├── src/
│   ├── components/       # Reusable UI components
│   ├── layouts/          # Page layout components
│   │   ├── AuthLayout.jsx    # Layout for authentication pages
│   │   ├── BaseLayout.jsx    # Basic layout
│   │   ├── DashboardLayout.jsx # Main dashboard layout
│   │   └── MainLayout.jsx    # Layout for main pages
│   ├── pages/            # Page components
│   ├── services/         # API services 
│   │   ├── api.js        # Real API service for Python backend
│   │   └── mockApiService.js # Mock API for development
│   ├── App.jsx           # Main application component
│   └── main.jsx          # Application entry point
└── BACKEND_CONNECTION.md # Documentation for backend integration
```

## 📱 UI Components

The UI includes several key components:

- **Authentication Forms**: Login, signup, password reset
- **Dashboard**: User interface for managing resumes
- **Navigation**: Mobile and desktop navigation elements
- **User Menu**: Profile and settings dropdown
- **Style Guide**: Interactive page showcasing all design components

## 🎨 Style Guide

Access the style guide at `/style-guide` to see all UI components:

- Typography system using Libre Franklin font
- Light and dark mode color palettes
- Form elements, buttons, and inputs
- Spacing utilities and grid layouts
- Card components and variants

## 🛠️ Technologies Used

- **Frontend Framework**: React
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **HTTP Client**: Axios
- **Avatars**: DiceBear Avataaars
- **Build Tool**: Vite

## 📋 Required Backend Endpoints

This UI expects the following API endpoints on your Python backend:

- Authentication: `/auth/login`, `/auth/register`
- User: `/user/profile`
- Resumes: `/resumes`, `/resumes/:id`
- Templates: `/templates`
- Generation: `/generate`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
# autoresum-reactjs
