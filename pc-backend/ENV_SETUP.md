# Backend Environment Setup

## Required Environment Variables

Create a `.env` file in your `pc-backend` directory with the following variables:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback

# JWT Configuration
SECRET_KEY=your-secret-key-here-change-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## Installation

1. Install the required dependencies:
```bash
pip install -r requirements.txt
```

2. Set up your environment variables (see above)

3. Start the backend server:
```bash
python main.py
```

## Security Notes

- Never commit your `.env` file to version control
- Use a strong, unique SECRET_KEY in production
- Regularly rotate your OAuth credentials
- Monitor your OAuth usage in Google Cloud Console
