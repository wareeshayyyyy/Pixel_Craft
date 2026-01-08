# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for your PixelCraft application.

## Prerequisites

1. A Google account
2. Access to Google Cloud Console

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" at the top of the page
3. Click "New Project"
4. Enter a project name (e.g., "PixelCraft")
5. Click "Create"

## Step 2: Enable Google+ API

1. In your project, go to "APIs & Services" > "Library"
2. Search for "Google+ API"
3. Click on it and click "Enable"

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. If prompted, configure the OAuth consent screen first:
   - User Type: External
   - App name: PixelCraft
   - User support email: your-email@domain.com
   - Developer contact information: your-email@domain.com
4. Click "Create Credentials" > "OAuth 2.0 Client IDs"
5. Application type: Web application
6. Name: PixelCraft Web Client
7. Authorized redirect URIs: `http://localhost:3000/auth/callback`
8. Click "Create"

## Step 4: Get Your Credentials

After creating the OAuth client, you'll get:
- Client ID
- Client Secret

## Step 5: Configure Environment Variables

Create a `.env` file in your `pc-frontend` directory:

```env
REACT_APP_GOOGLE_CLIENT_ID=your-client-id-here
REACT_APP_GOOGLE_CLIENT_SECRET=your-client-secret-here
REACT_APP_API_URL=http://localhost:8000
```

## Step 6: Configure Backend

In your `pc-backend/main.py`, update these lines with your actual credentials:

```python
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "your-google-client-id")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET", "your-google-client-secret")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:3000/auth/callback")
```

## Step 7: Test the Integration

1. Start your backend: `cd pc-backend && python main.py`
2. Start your frontend: `cd pc-frontend && npm start`
3. Go to `/login` or `/signup`
4. Click "Sign in with Google" or "Sign up with Google"
5. You should be redirected to Google's OAuth consent screen
6. After authorization, you'll be redirected back to your app

## Troubleshooting

### Common Issues:

1. **"redirect_uri_mismatch" error**: Make sure the redirect URI in Google Cloud Console matches exactly: `http://localhost:3000/auth/callback`

2. **"invalid_client" error**: Check that your Client ID and Client Secret are correct

3. **CORS errors**: Ensure your backend has CORS properly configured

4. **"access_denied" error**: Check that the Google+ API is enabled in your project

### Security Notes:

- Never commit your `.env` file to version control
- Use environment variables in production
- Regularly rotate your OAuth credentials
- Monitor your OAuth usage in Google Cloud Console

## Production Deployment

For production, you'll need to:

1. Add your production domain to authorized redirect URIs
2. Set up proper environment variables on your hosting platform
3. Use HTTPS (Google OAuth requires secure connections)
4. Consider implementing additional security measures like state parameters
5. Set up proper session management and token storage
