# Binal Studio Website Deployment Checklist

## Pre-Deployment Setup

### 1. Domain Purchase
- [ ] Purchase domain from registrar (Namecheap, Google Domains, etc.)
- [ ] Set up DNS records to point to hosting platform
- [ ] Configure SSL certificate (usually automatic with modern hosts)

### 2. Database Setup
- [ ] Create PostgreSQL database on hosting platform
- [ ] Note down DATABASE_URL connection string
- [ ] Run database migrations: `npm run db:push`

### 3. Environment Variables
- [ ] Set NODE_ENV=production
- [ ] Set DATABASE_URL=your_postgres_url
- [ ] Set PORT=5000 (or as required by host)
- [ ] Add any EmailJS credentials if using contact forms

### 4. Code Preparation
- [ ] Test build locally: `npm run build`
- [ ] Test production start: `npm start`
- [ ] Commit all changes to Git
- [ ] Push to GitHub repository

## Deployment Steps

### Option A: Railway Deployment
1. [ ] Sign up at railway.app
2. [ ] Connect GitHub repository
3. [ ] Add PostgreSQL service
4. [ ] Set environment variables
5. [ ] Deploy and test

### Option B: Vercel Deployment  
1. [ ] Sign up at vercel.com
2. [ ] Connect GitHub repository
3. [ ] Configure build settings
4. [ ] Add database (Vercel Postgres or external)
5. [ ] Deploy and test

### Option C: Render Deployment
1. [ ] Sign up at render.com
2. [ ] Create web service from GitHub
3. [ ] Add PostgreSQL database
4. [ ] Configure environment variables
5. [ ] Deploy and test

## Post-Deployment

### Testing
- [ ] Test all pages load correctly
- [ ] Test contact forms work
- [ ] Test admin dashboard functionality
- [ ] Test image gallery loads properly
- [ ] Test responsive design on mobile

### Domain Configuration
- [ ] Configure custom domain in hosting platform
- [ ] Set up DNS records (A, CNAME)
- [ ] Verify SSL certificate is active
- [ ] Test website loads on custom domain

### Performance Optimization
- [ ] Enable CDN if available
- [ ] Optimize images for web
- [ ] Set up monitoring/analytics
- [ ] Configure caching headers

### Maintenance
- [ ] Set up backup schedule for database
- [ ] Monitor website uptime
- [ ] Keep dependencies updated
- [ ] Regular security updates

## Estimated Costs
- Domain: $8-15/year
- Hosting: $5-20/month (depending on platform)
- Database: $0-10/month (often included)
- Total: ~$70-250/year

## Support Resources
- Railway docs: https://docs.railway.app
- Vercel docs: https://vercel.com/docs
- Render docs: https://render.com/docs