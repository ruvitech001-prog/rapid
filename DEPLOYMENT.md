# Deployment Guide - Rapid.one

## Vercel Deployment

This project is configured for seamless deployment to Vercel.

### Prerequisites

- Vercel account (sign up at https://vercel.com)
- GitHub/GitLab/Bitbucket account with repository access
- Supabase project with API credentials

### Quick Start

1. **Push to Repository**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com/new
   - Select your repository
   - Click "Import"

3. **Configure Environment Variables**
   In the Vercel dashboard, add the following environment variables:

   **Required:**
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase Anonymous Key
   - `SUPABASE_SERVICE_ROLE_KEY` - Supabase Service Role Key
   - `SUPABASE_PROJECT_ID` - Your Supabase Project ID
   - `NEXT_PUBLIC_APP_URL` - Your production URL (e.g., https://yourapp.vercel.app)
   - `NEXT_PUBLIC_APP_NAME` - Application name

   **Optional (External Services):**
   - `SENDGRID_API_KEY` - For email notifications
   - `SPRINGSCAN_API_KEY_PROD` - For KYC verification
   - `SIGNEASY_API_KEY` - For e-signatures

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your application

### Environment Variables Setup

1. Get your Supabase credentials:
   - Visit https://app.supabase.com
   - Select your project
   - Go to Settings → API
   - Copy `URL` and `anon public key`
   - Copy `service_role key` from the "Service Role" section

2. In Vercel dashboard:
   - Go to Settings → Environment Variables
   - Add all required variables
   - Save and redeploy

### Automatic Deployments

- **Main branch**: Automatically deployed to production
- **Preview branches**: Automatic preview deployments on pull requests
- **Rollback**: Use Vercel dashboard to quickly rollback to previous deployments

### Monitoring & Logs

Access deployment logs:
1. Go to your project in Vercel dashboard
2. Click "Deployments"
3. Select a deployment
4. View logs in "Build Logs" and "Runtime Logs"

### Performance

The application is optimized for Vercel:
- ✅ Next.js 14 with App Router
- ✅ Server-side rendering and static generation
- ✅ Image optimization
- ✅ Code splitting and lazy loading
- ✅ Edge middleware support

### Troubleshooting

**Build fails with "Cannot find module"**
- Check that all environment variables are set
- Verify dependencies in `package.json`
- Run `npm install` locally to ensure compatibility

**Database connection errors**
- Verify Supabase credentials are correct
- Check Supabase project is active
- Ensure IP is whitelisted (or use dynamic IP)

**Slow deployments**
- Clear Vercel cache: Settings → Git → Clear Cache
- Check function size in deployment logs
- Optimize large dependencies

### Local Development

```bash
# Install dependencies
npm install

# Create .env.local from .env.example
cp .env.example .env.local

# Update with your actual values
nano .env.local

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Integration](https://supabase.com/partners/integrations/vercel)

---

**Last Updated:** November 24, 2024
**Version:** 2.0.0
