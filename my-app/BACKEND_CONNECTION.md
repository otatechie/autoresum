# Connecting to a Python Backend

This guide explains how to connect your React frontend to a Python backend service.

## Overview

Our React app is set up to communicate with a Python backend API through HTTP requests using Axios. The connection is managed through a centralized API service in `src/services/api.js`.

## Setup Instructions

### 1. Configure Environment Variable

Create a `.env` file in your project root (if it doesn't exist) and add the backend URL:

```
VITE_API_URL=http://your-friends-api-url:port
```

For local development, you might use something like:
```
VITE_API_URL=http://localhost:5000
```

Note: In Vite projects, environment variables must be prefixed with `VITE_` to be accessible in the browser.

### 2. CORS Configuration

Ensure your friend's Python backend has CORS enabled to accept requests from your frontend:

#### For Flask:
```python
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # In production, specify exact origin

@app.route('/api/data')
def get_data():
    return {"message": "Data from Python backend"}

if __name__ == '__main__':
    app.run(debug=True)
```

#### For Django:
Add `corsheaders` to your `INSTALLED_APPS` and middleware in settings.py:
```python
INSTALLED_APPS = [
    # ...
    'corsheaders',
    # ...
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    # ... other middleware
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://yourfrontendurl.com",
]
```

### 3. Authentication

If your API requires authentication, the API service automatically adds the token to requests:

```javascript
// The token should be stored in localStorage after login
localStorage.setItem('token', 'your-auth-token');
```

Our API service is already configured to:
1. Add Authorization header with the token from localStorage
2. Handle 401 unauthorized responses by redirecting to login

## Usage Examples

### Basic GET Request
```javascript
import apiService from '../services/api';

// Inside a React component:
async function fetchData() {
  try {
    const data = await apiService.getResumes();
    console.log(data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
```

### POST Request with Data
```javascript
async function createNewResume() {
  const resumeData = {
    title: 'New Resume',
    template: 'professional',
    sections: {
      // Your resume data structure
    }
  };
  
  try {
    const newResume = await apiService.createResume(resumeData);
    console.log('Created resume:', newResume);
  } catch (error) {
    console.error('Error creating resume:', error);
  }
}
```

## Debugging Common Issues

1. **CORS Errors**: If you see CORS errors in the console, ensure your Python backend has CORS properly configured.

2. **Network Timeouts**: Check that the backend URL is correct and the server is running.

3. **Authentication Issues**: Make sure the token format matches what the backend expects (Bearer, JWT, etc.)

4. **Data Format Mismatches**: Ensure the data you're sending matches the structure expected by the API.

## Python Backend Requirements

Your friend's Python backend should:

1. Return JSON responses
2. Have endpoints that match those defined in your API service
3. Handle CORS appropriately for cross-domain requests
4. Implement proper authentication if required 