# Authentication System Documentation

## Overview

This authentication system provides a comprehensive, class-based approach to handling user authentication in the React frontend. It includes proper error handling, input validation, token management, and user feedback through toast notifications.

## Features

### Core Authentication Methods
- **signUp(userData)** - User registration with validation
- **signIn(credentials)** - User login with remember me option
- **forgotPassword(email)** - Password reset initiation
- **resetPassword(token, newPassword, confirmPassword)** - Password reset completion
- **signOut()** - User logout with token cleanup
- **refreshToken()** - JWT token refresh
- **getCurrentUser()** - Get current user profile

### Security Features
- Input validation and sanitization
- Password strength validation (configurable)
- Email format validation
- XSS prevention
- JWT token management
- Automatic token cleanup on 401 errors

### User Experience
- Loading states for all async operations
- Toast notifications for success/error feedback
- Comprehensive error handling
- Form validation with real-time feedback
- Password visibility toggles

## Usage Examples

### Basic Authentication Service Usage

```javascript
import AuthService from '../services/AuthService';
import { toast } from '../utils/notifications';

const authService = new AuthService();

// User Registration
try {
  const result = await authService.signUp({
    email: 'user@example.com',
    password: 'SecurePassword123',
    confirmPassword: 'SecurePassword123',
    firstName: 'John',
    lastName: 'Doe'
  });
  
  toast.success(result.message);
  // Redirect to dashboard
} catch (error) {
  toast.error(error.message);
  // Handle validation errors
  if (error.validationErrors) {
    setFormErrors(error.validationErrors);
  }
}

// User Login
try {
  const result = await authService.signIn({
    email: 'user@example.com',
    password: 'SecurePassword123',
    rememberMe: true
  });
  
  toast.success(result.message);
  // Redirect to dashboard
} catch (error) {
  toast.error(error.message);
}

// Password Reset
try {
  const result = await authService.forgotPassword('user@example.com');
  toast.success(result.message);
} catch (error) {
  toast.error(error.message);
}
```

### React Component Integration

```javascript
import React, { useState } from 'react';
import AuthService from '../services/AuthService';
import { toast } from '../utils/notifications';

function LoginForm() {
  const authService = new AuthService();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await authService.signIn(formData);
      toast.success(result.message);
      // Handle success
    } catch (error) {
      toast.error(error.message);
      if (error.validationErrors) {
        setFormErrors(error.validationErrors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ... rest of component
}
```

## Configuration

The authentication system uses environment variables for configuration:

```env
# API Configuration
VITE_API_URL=http://localhost:8000/api
VITE_API_TIMEOUT=10000

# Authentication
VITE_TOKEN_STORAGE_KEY=auth_token
VITE_USER_STORAGE_KEY=auth_user

# Password Validation
VITE_PASSWORD_MIN_LENGTH=8
VITE_PASSWORD_MAX_LENGTH=128
VITE_PASSWORD_REQUIRE_UPPERCASE=true
VITE_PASSWORD_REQUIRE_LOWERCASE=true
VITE_PASSWORD_REQUIRE_NUMBERS=true
VITE_PASSWORD_REQUIRE_SPECIAL=false

# Features
VITE_ENABLE_GOOGLE_AUTH=true
VITE_ENABLE_REGISTRATION=true
VITE_ENABLE_PASSWORD_RESET=true
```

## API Endpoints

The authentication service expects the following backend endpoints:

- `POST /auth/signup` - User registration
- `POST /auth/signin` - User login
- `POST /auth/forgot-password` - Password reset initiation
- `POST /auth/reset-password` - Password reset completion
- `POST /auth/signout` - User logout
- `POST /auth/refresh` - Token refresh
- `GET /auth/me` - Get current user

### Expected Request/Response Formats

#### Registration Request
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Registration Response
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### Error Response
```json
{
  "message": "Validation failed",
  "errors": {
    "email": "Email is already taken",
    "password": "Password is too weak"
  }
}
```

## Error Handling

The system provides comprehensive error handling:

- **400 Bad Request** - Invalid request data
- **401 Unauthorized** - Invalid credentials or expired token
- **422 Unprocessable Entity** - Validation errors
- **429 Too Many Requests** - Rate limiting
- **500 Internal Server Error** - Server errors
- **Network Errors** - Connection issues

## Validation

### Email Validation
- Valid email format required
- Maximum length configurable

### Password Validation
- Minimum/maximum length (configurable)
- Uppercase letters (optional)
- Lowercase letters (optional)
- Numbers (optional)
- Special characters (optional)

### Input Sanitization
- XSS prevention
- HTML tag removal
- JavaScript protocol removal

## Toast Notifications

The system includes a built-in toast notification system:

```javascript
import { toast } from '../utils/notifications';

// Different notification types
toast.success('Operation successful!');
toast.error('Something went wrong!');
toast.warning('Please check your input');
toast.info('Information message');

// Custom duration
toast.success('Message', 3000); // 3 seconds
```

## Security Considerations

1. **Token Storage** - Tokens are stored in localStorage (consider httpOnly cookies for production)
2. **Input Validation** - All inputs are validated and sanitized
3. **Error Messages** - Generic error messages to prevent information disclosure
4. **HTTPS** - Always use HTTPS in production
5. **Token Expiration** - Implement proper token refresh logic

## Testing

To test the authentication system:

1. Set up your backend API endpoints
2. Configure environment variables
3. Test each authentication flow
4. Verify error handling
5. Test form validation
6. Check toast notifications

## Troubleshooting

### Common Issues

1. **CORS Errors** - Configure your backend to allow requests from your frontend domain
2. **Token Issues** - Check token format and expiration
3. **Validation Errors** - Verify password requirements match frontend/backend
4. **Network Errors** - Check API URL and network connectivity

### Debug Mode

Enable debug mode in development:

```env
VITE_DEBUG_MODE=true
VITE_LOG_LEVEL=debug
```

This will provide detailed logging for troubleshooting.
