// Authentication service for handling login, signup, and Google OAuth
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

class AuthService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Health check helper
  async health() {
    try {
      const res = await fetch(`${this.baseURL}/health`);
      return res.ok;
    } catch (err) {
      console.error('Health check failed:', err);
      return false;
    }
  }

  // Login with email/password
  async login(email, password, rememberMe = false) {
    try {
      const response = await fetch(`${this.baseURL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, remember_me: rememberMe }),
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type') || '';
        // try to read JSON error, otherwise text
        const errText = contentType.includes('application/json')
          ? (await response.json()).detail || JSON.stringify(await response.json()).slice(0, 200)
          : await response.text();
        return { success: false, error: `HTTP ${response.status}: ${errText}` };
      }

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        const text = await response.text();
        return { success: false, error: `Expected JSON but got: ${contentType}. Response: ${text.substring(0, 200)}` };
      }

      const data = await response.json();

      // store token if returned
      const token = data.access_token;
      if (token) {
        localStorage.setItem('token', token);
        if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
      }

      return { success: true, data };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'Login failed' };
    }
  }

  // Google credential login
  async googleLogin(credential) {
    try {
      // Decode the JWT credential to get user info
      const payload = JSON.parse(atob(credential.split('.')[1]));
      
      const googleData = {
        email: payload.email,
        first_name: payload.given_name,
        last_name: payload.family_name,
        google_id: payload.sub,
        avatar_url: payload.picture
      };

      const response = await fetch(`${this.baseURL}/api/auth/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(googleData),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ detail: 'Google login failed' }));
        return { success: false, error: err.detail || 'Google login failed' };
      }

      const data = await response.json();
      const token = data.access_token;
      if (token) {
        localStorage.setItem('token', token);
        if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
      }

      return { success: true, data };
    } catch (error) {
      console.error('Google login error:', error);
      return { success: false, error: error.message || 'Google login failed' };
    }
  }

  // Google OAuth authentication
  async initiateGoogleAuth() {
    try {
      // First check if the backend is available
      const configResponse = await fetch(`${this.baseURL}/auth/config`);
      if (!configResponse.ok) {
        throw new Error('Backend authentication service is not available');
      }
      
      const config = await configResponse.json();
      if (!config.has_client_secret) {
        throw new Error('Google OAuth is not properly configured. Please check the backend setup.');
      }
      
      // For development, we'll use a simple redirect approach
      // In production, you'd want to use Google's OAuth 2.0 flow
      const googleAuthUrl = `${this.baseURL}/auth/google`;
      window.location.href = googleAuthUrl;
    } catch (error) {
      console.error('Google auth initiation failed:', error);
      throw error;
    }
  }

  // Handle Google OAuth callback
  async handleGoogleCallback(code) {
    try {
      const response = await fetch(`${this.baseURL}/auth/google/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error('Google authentication failed');
      }

      const data = await response.json();
      
      // Store the token
      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      console.error('Google callback handling failed:', error);
      throw error;
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('token');
    return !!token;
  }

  // Get current user
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  }

  // Get auth token
  getToken() {
    return localStorage.getItem('token');
  }
}

export default new AuthService();
