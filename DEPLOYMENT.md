# Deployment Guide

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Backend API server running
- Web server (IIS, Apache, Nginx, or cloud hosting)

## 🏗️ Build for Production

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   - Copy `.env.example` to `.env`
   - Update the API base URL and other settings:
     ```
     VITE_API_BASE_URL=http://your-api-server.com
     ```

3. **Build the application:**
   ```bash
   npm run build
   ```
   
   The production-ready files will be generated in the `dist/` folder.

## 🚀 Deployment Options

### Option 1: IIS (Windows Server)

1. **Copy files:**
   - Copy all files from `dist/` folder to your IIS website root directory

2. **Configure IIS:**
   - Ensure URL Rewrite module is installed
   - The `web.config` file is already included in the dist folder
   - Configure your backend API URL in IIS Application Settings

3. **Set up API proxy (optional):**
   - Use IIS URL Rewrite or Application Request Routing (ARR)
   - Or update the `web.config` to proxy API requests

### Option 2: Apache Server

1. **Copy files:**
   - Upload all files from `dist/` folder to your web root (e.g., `/var/www/html/`)

2. **Enable modules:**
   ```bash
   sudo a2enmod rewrite
   sudo a2enmod headers
   sudo a2enmod deflate
   sudo a2enmod expires
   sudo systemctl restart apache2
   ```

3. **Configure Apache:**
   - The `.htaccess` file is already included in the dist folder
   - Ensure AllowOverride is set to All in your Apache configuration

### Option 3: Nginx

1. **Copy files:**
   - Upload all files from `dist/` folder to your web root

2. **Configure Nginx:**
   Create or update your site configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /path/to/dist;
       index index.html;

       # Gzip compression
       gzip on;
       gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

       # SPA routing
       location / {
           try_files $uri $uri/ /index.html;
       }

       # API proxy
       location /api {
           proxy_pass http://your-backend-api-url;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }

       # Cache static assets
       location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

3. **Reload Nginx:**
   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

### Option 4: Vercel

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```
   
3. **Configure:**
   - Update `vercel.json` with your backend API URL
   - Set environment variables in Vercel dashboard

### Option 5: Netlify

1. **Deploy via Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod
   ```

2. **Or use Netlify UI:**
   - Connect your Git repository
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Configure:**
   - Update `netlify.toml` with your backend API URL
   - Set environment variables in Netlify dashboard

### Option 6: Docker

Create a `Dockerfile`:
```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:
```bash
docker build -t voterdetails-app .
docker run -p 80:80 voterdetails-app
```

## 🔧 Configuration

### API Base URL

Update the API base URL based on your deployment:

**Option A: Environment Variables (Recommended)**
- Set `VITE_API_BASE_URL` in your `.env` file
- Update `src/services/api.js` to use: `import.meta.env.VITE_API_BASE_URL`

**Option B: Direct Configuration**
- Update the `baseURL` in `src/services/api.js` directly

### Proxy Configuration

If your frontend and backend are on different domains, configure:
- CORS headers on your backend API
- Or use a reverse proxy (recommended for production)

## 📝 Post-Deployment Checklist

- [ ] Test all routes work correctly
- [ ] Verify API calls are reaching the backend
- [ ] Check browser console for errors
- [ ] Test on different browsers (Chrome, Firefox, Safari, Edge)
- [ ] Verify mobile responsiveness
- [ ] Test with production data
- [ ] Set up SSL/HTTPS certificate
- [ ] Configure CDN (optional)
- [ ] Set up monitoring and error tracking
- [ ] Enable gzip compression
- [ ] Configure proper caching headers

## 🔐 Security Recommendations

1. **Always use HTTPS in production**
2. **Enable CORS on backend API with specific origins**
3. **Set proper security headers** (already configured in web.config/.htaccess)
4. **Keep dependencies updated:** `npm audit fix`
5. **Don't commit `.env` file to version control**
6. **Use environment-specific API keys**
7. **Implement rate limiting on API**

## 🐛 Troubleshooting

### Blank page after deployment
- Check browser console for errors
- Verify the base URL configuration
- Ensure all assets are accessible

### API calls failing
- Check CORS configuration on backend
- Verify API URL is correct
- Check network tab in browser dev tools
- Ensure backend is accessible from production

### Routes not working (404 errors)
- Verify URL rewrite is properly configured
- Check web.config/.htaccess file is present
- Ensure server supports SPA routing

### Assets not loading
- Check file paths and base URL
- Verify file permissions on server
- Check nginx/Apache configuration for static files

## 📞 Support

For issues or questions about deployment, check:
- Project documentation
- Server logs for errors
- Browser console for client-side errors
