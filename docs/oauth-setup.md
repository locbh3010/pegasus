# OAuth Authentication Setup Guide

This guide explains how to configure OAuth authentication with Google and GitHub providers in your Supabase project.

## Prerequisites

- Supabase project with authentication enabled
- Google Cloud Console account
- GitHub account with developer access

## 1. Supabase Configuration

### Step 1: Access Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** > **Providers**

### Step 2: Configure Redirect URLs

Add the following redirect URLs in your Supabase Auth settings:

- **Development**: `http://localhost:3000/auth/callback`
- **Production**: `https://yourdomain.com/auth/callback`

## 2. Google OAuth Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API (if not already enabled)

### Step 2: Configure OAuth Consent Screen

1. Go to **APIs & Services** > **OAuth consent screen**
2. Choose **External** user type (unless you have a Google Workspace)
3. Fill in the required information:
    - **App name**: Your application name
    - **User support email**: Your email
    - **Developer contact information**: Your email
4. Add your domain to **Authorized domains** (for production)
5. Save and continue through the scopes and test users sections

### Step 3: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client IDs**
3. Choose **Web application** as the application type
4. Add these Authorized redirect URIs:
    ```
    https://your-project-ref.supabase.co/auth/v1/callback
    ```
5. Click **Create**

### Step 4: Get Client Credentials

1. Copy your **Client ID** and **Client Secret**

### Step 5: Configure in Supabase

1. In Supabase dashboard, go to **Authentication** > **Providers**
2. Find **Google** and click **Enable**
3. Enter your Google **Client ID** and **Client Secret**
4. Save configuration

## 3. GitHub OAuth Setup

### Step 1: Create GitHub OAuth App

1. Go to [GitHub Settings](https://github.com/settings/developers)
2. Click **OAuth Apps** > **New OAuth App**
3. Fill in the application details:
    - **Application name**: Your app name
    - **Homepage URL**: `http://localhost:3000` (for development)
    - **Authorization callback URL**: `https://your-project-ref.supabase.co/auth/v1/callback`
4. Click **Register application**

### Step 2: Get App Credentials

1. Copy your **Client ID**
2. Click **Generate a new client secret** and copy the **Client Secret**

### Step 3: Configure in Supabase

1. In Supabase dashboard, go to **Authentication** > **Providers**
2. Find **GitHub** and click **Enable**
3. Enter your GitHub **Client ID** and **Client Secret**
4. Save configuration

## 4. Environment Variables

Ensure your `.env.local` file contains:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_SUPABASE_SERVICE_KEY=your-supabase-service-key
```

## 5. Testing OAuth Flow

### Development Testing

1. Start your development server: `yarn dev`
2. Navigate to `http://localhost:3000/auth/signin`
3. Click on Google or GitHub login buttons
4. Complete the OAuth flow
5. Verify user is created in your database

### Production Deployment

1. Update OAuth app settings with production URLs
2. Update Supabase redirect URLs for production
3. Deploy your application
4. Test OAuth flow in production environment

## 6. Troubleshooting

### Common Issues

#### OAuth Redirect Mismatch

- **Error**: `redirect_uri_mismatch`
- **Solution**: Ensure redirect URIs in OAuth apps match Supabase callback URL

#### Invalid Client ID/Secret

- **Error**: `invalid_client`
- **Solution**: Verify client credentials in Supabase match OAuth app settings

#### User Creation Fails

- **Error**: Database insertion error
- **Solution**: Check UserService logs and ensure database permissions are correct

### Debug Steps

1. Check browser network tab for failed requests
2. Review Supabase Auth logs
3. Check application console for error messages
4. Verify OAuth app settings in provider dashboards

## 8. Security Considerations

### Production Checklist

- [ ] Use HTTPS for all redirect URLs
- [ ] Rotate OAuth secrets regularly
- [ ] Monitor authentication logs
- [ ] Implement rate limiting
- [ ] Validate user data from OAuth providers
- [ ] Handle OAuth errors gracefully

### Data Privacy

- Only request necessary OAuth scopes
- Inform users about data collection
- Implement data retention policies
- Provide user data deletion options

## 9. Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Facebook Login Documentation](https://developers.facebook.com/docs/facebook-login/)
- [GitHub OAuth Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps)
