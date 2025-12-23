# Deployment Guide

## Vercel Deployment (Recommended)

Agent Studio is optimized for Vercel Free Tier deployment with zero additional configuration.

### Requirements for Vercel Free Tier

✅ **What works:**
- Serverless functions (our `/api/run` route)
- Static generation and SSR
- Edge Network CDN
- Automatic HTTPS
- No database required (uses localStorage)

✅ **What we avoid:**
- Long-running processes (execution completes quickly)
- File system writes (everything in memory/localStorage)
- Background jobs
- Paid databases

### Step-by-Step Deployment

#### Option 1: Deploy via GitHub (Recommended)

1. **Create a GitHub repository**

```bash
git init
git add .
git commit -m "Initial commit: Agent Studio MVP"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/agent-studio.git
git push -u origin main
```

2. **Connect to Vercel**

- Visit [vercel.com](https://vercel.com)
- Sign up or log in
- Click "New Project"
- Import your GitHub repository
- Vercel will auto-detect Next.js settings

3. **Configure Environment Variables**

Add these in the Vercel dashboard (Settings → Environment Variables):

```
NEXT_PUBLIC_APP_NAME=Agent Studio
NEXT_PUBLIC_AUTHOR_NAME=Your Name
NEXT_PUBLIC_BOOK_URL=https://your-book-url.com
```

4. **Deploy**

- Click "Deploy"
- Wait ~2 minutes
- Your app is live! 🎉

#### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? agent-studio
# - Directory? ./
# - Override settings? No

# Production deployment
vercel --prod
```

### Post-Deployment Checklist

- [ ] Visit your deployment URL
- [ ] Test landing page loads
- [ ] Browse templates
- [ ] Create an agent in builder
- [ ] Run agent in sandbox mode
- [ ] Check run history and traces
- [ ] Export an agent as JSON
- [ ] (Optional) Test BYOK mode with OpenAI key

## Other Deployment Options

### Netlify

Agent Studio can also deploy to Netlify:

1. Connect your GitHub repo to Netlify
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Add environment variables
5. Enable Next.js runtime

### Self-Hosted (Docker)

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t agent-studio .
docker run -p 3000:3000 -e NEXT_PUBLIC_APP_NAME="Agent Studio" agent-studio
```

### Railway / Render

Both platforms support Next.js with minimal configuration:

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set start command: `npm start`
4. Add environment variables
5. Deploy

## Environment Variables

### Required for Production

```bash
NEXT_PUBLIC_APP_NAME=Agent Studio
NEXT_PUBLIC_AUTHOR_NAME=Your Name or Organization
NEXT_PUBLIC_BOOK_URL=https://link-to-companion-book.com
```

### Optional

None required! Everything else is managed client-side or in-memory.

## Performance Optimization

### Vercel Configuration

Add `vercel.json` for additional optimization (optional):

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "framework": "nextjs",
  "regions": ["iad1"],
  "functions": {
    "app/api/run/route.ts": {
      "maxDuration": 10
    }
  }
}
```

### Edge Caching

Landing and templates pages are statically generated and served from CDN automatically.

## Monitoring

### Vercel Analytics (Optional)

Enable in Vercel dashboard → Analytics tab (free tier available).

### Error Tracking

For production, consider adding:
- Sentry for error tracking
- LogRocket for session replay
- PostHog for product analytics

## Security Considerations

### API Routes

- Rate limiting is in-memory (5 requests/min)
- For production scale, use Redis or Upstash
- API keys are never logged or stored server-side

### Content Security Policy

Add to `next.config.js` if needed:

```javascript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};
```

## Troubleshooting Deployment

### Build Fails

```bash
# Check locally first
npm run build

# Common issues:
# - Missing dependencies: npm install
# - Type errors: npm run type-check (if you add this script)
# - Linter errors: Check for unused imports
```

### Function Timeout

Vercel Free Tier has 10-second function timeout. Our execution engine completes well within this.

If you hit limits:
- Reduce `MAX_STEPS` in `lib/executor.ts`
- Simplify agent logic
- Upgrade to Vercel Pro

### Large Bundle Size

Next.js automatically code-splits. If bundle is too large:
- Check for unnecessary dependencies
- Use dynamic imports for large components
- Optimize images with `next/image`

## Scaling

### Free Tier Limits

Vercel Free includes:
- 100GB bandwidth/month
- 100k serverless function invocations/month
- Unlimited sites

For Agent Studio:
- ~1MB per page load
- ~1 function call per agent run
- Can handle ~10k monthly active users on free tier

### When to Upgrade

Consider upgrading when:
- Monthly traffic exceeds 50k users
- Need longer function timeouts
- Require team collaboration features
- Need advanced analytics

## Custom Domain

### Add Custom Domain in Vercel

1. Go to your project → Settings → Domains
2. Add your domain (e.g., `agentstudio.yourdomain.com`)
3. Follow DNS configuration instructions
4. SSL certificate is automatic

## Rollback

Vercel keeps deployment history:

1. Go to Deployments tab
2. Find previous working deployment
3. Click ⋯ → "Promote to Production"

## Support

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Agent Studio Issues: Create issue in your GitHub repo

---

**Your Agent Studio should now be live and accessible globally!** 🚀

