# Vercel Deployment Guide

## Configuration

The application is configured for Vercel deployment with the following settings:

### vercel.json
- **Build Command**: `npm run build`
- **Output Directory**: `dist/complements/browser`
- **Routing**: All routes redirect to `index.html` for Angular client-side routing

### Key Files
- `vercel.json` - Vercel deployment configuration
- `package.json` - Build scripts and dependencies
- `angular.json` - Angular build configuration

## Deployment Steps

1. **Connect to Vercel**:
   - Import your GitHub repository to Vercel
   - Vercel will automatically detect the Angular project

2. **Build Settings** (should auto-detect):
   - Framework Preset: `Angular`
   - Build Command: `npm run build`
   - Output Directory: `dist/complements/browser`
   - Install Command: `npm install`

3. **Environment Variables** (if needed):
   - Add any required environment variables in Vercel dashboard

4. **Deploy**:
   - Click "Deploy" and Vercel will build and deploy your application

## Troubleshooting

### 404 Errors
- Ensure `vercel.json` is in the root directory
- Verify `outputDirectory` points to `dist/complements/browser`
- Check that `index.html` exists in the output directory

### Build Errors
- Ensure all dependencies are in `package.json`
- Check that the build command runs successfully locally
- Verify Angular configuration in `angular.json`

### Routing Issues
- The `vercel.json` includes proper routing rules for Angular
- All non-asset routes redirect to `index.html`
- Static assets are served from their correct paths
