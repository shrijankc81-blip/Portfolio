# Image Upload Feature Guide

This guide explains how the image upload feature works in the portfolio application.

## 🖼️ Overview

The portfolio now supports direct image uploads from your device instead of requiring external URLs. This provides better control, security, and reliability for project images.

## 🔧 How It Works

### Frontend (Client)
1. **File Selection**: Users can select images using a file input
2. **Preview**: Selected images are previewed before upload
3. **Validation**: Client-side validation for file type and size
4. **Upload**: Images are uploaded when the form is submitted
5. **URL Construction**: Image URLs are automatically constructed for display

### Backend (Server)
1. **File Storage**: Images are stored in `/server/uploads/` directory
2. **Validation**: Server validates file type, size, and authentication
3. **Unique Naming**: Files are given unique names to prevent conflicts
4. **Static Serving**: Images are served at `/uploads/{filename}`

## 📁 File Structure

```
server/
├── uploads/                    # Image storage directory
│   ├── image-123456789.jpg    # Uploaded images
│   └── README.md              # Upload documentation
├── src/
│   ├── middleware/
│   │   └── upload.js          # Multer configuration
│   └── routes/
│       └── upload.js          # Upload API endpoints
└── index.js                   # Static file serving setup

client/
├── src/
│   ├── utils/
│   │   └── imageUtils.js      # Image URL utilities
│   ├── components/
│   │   ├── Projects.jsx       # Updated to use image utils
│   │   └── admin/
│   │       ├── ProjectForm.jsx    # File upload form
│   │       └── ProjectList.jsx    # Updated to use image utils
│   └── config/
│       └── api.js             # API endpoints including upload
└── src/index.css              # Error handling styles
```

## 🎯 Usage Instructions

### For Admins

#### Adding a New Project with Image
1. Go to Admin Panel (`/admin`)
2. Click "Add New Project"
3. Fill in project details
4. Click the file input to select an image
5. Preview the selected image
6. Submit the form to save

#### Editing Project Image
1. Edit an existing project
2. Current image will be shown as preview
3. Select a new image to replace it
4. Click the × button to remove the image
5. Submit to save changes

### For Developers

#### Image URL Handling
```javascript
import { getImageUrl } from '../utils/imageUtils';

// Automatically handles both uploaded and external images
const imageUrl = getImageUrl(project.image);

// Usage in JSX
<img src={getImageUrl(project.image)} alt="Project" />
```

#### Error Handling
```javascript
import { handleImageError } from '../utils/imageUtils';

// Add error handling to images
<img 
  src={getImageUrl(project.image)} 
  onError={handleImageError}
  alt="Project" 
/>
```

## 🔐 Security Features

### File Validation
- **Type Check**: Only image files (JPG, PNG, GIF, WebP)
- **Size Limit**: Maximum 5MB per file
- **MIME Validation**: Server-side MIME type checking

### Authentication
- **Admin Only**: Only authenticated admin users can upload
- **Token Validation**: JWT token required for upload endpoints

### Storage Security
- **Unique Names**: Prevents filename conflicts and overwrites
- **Secure Directory**: Files stored outside web root
- **Access Control**: Controlled through API endpoints

## 🛠️ API Endpoints

### Upload Image
```
POST /api/upload/image
Authorization: Bearer {token}
Content-Type: multipart/form-data

Body: FormData with 'image' field
```

### Delete Image
```
DELETE /api/upload/image/{filename}
Authorization: Bearer {token}
```

### Get Image
```
GET /uploads/{filename}
```

## 🎨 Image Display Logic

### URL Construction
1. **External URLs**: `http://` or `https://` → Used as-is
2. **Relative Paths**: `/uploads/...` → Prepend server URL
3. **Filenames**: `image.jpg` → Construct full upload URL

### Error Handling
1. **Image Load Error**: Fallback to placeholder image
2. **Missing Image**: Show "No Image" placeholder
3. **Invalid URL**: Graceful degradation with error styling

## 🚀 Benefits

### For Users
- ✅ **Easy Upload**: Simple drag-and-drop or click to select
- ✅ **Instant Preview**: See images before saving
- ✅ **No External Dependencies**: No need for image hosting services
- ✅ **Better Performance**: Local images load faster

### For Developers
- ✅ **Centralized Storage**: All images in one location
- ✅ **Consistent URLs**: Automatic URL construction
- ✅ **Error Handling**: Built-in fallback mechanisms
- ✅ **Type Safety**: Validation at multiple levels

### For Deployment
- ✅ **Self-Contained**: No external image hosting required
- ✅ **Scalable**: Easy to move to cloud storage later
- ✅ **Backup-Friendly**: Images included in application backups
- ✅ **Version Control**: Image management through admin panel

## 🔧 Configuration

### Environment Variables
```env
# Client (.env)
VITE_API_URL=http://localhost:5001

# Server (.env)
# No additional config needed for basic file upload
```

### File Limits
- **Max Size**: 5MB (configurable in `upload.js`)
- **Allowed Types**: Images only (configurable in middleware)
- **Storage Location**: `/server/uploads/` (configurable)

## 🐛 Troubleshooting

### Images Not Loading
1. Check if server is serving static files: `/uploads/{filename}`
2. Verify image URLs are constructed correctly
3. Check browser console for 404 errors
4. Ensure uploads directory exists and has proper permissions

### Upload Failures
1. Check file size (must be < 5MB)
2. Verify file type (images only)
3. Ensure user is authenticated
4. Check server logs for detailed errors

### Preview Issues
1. Verify `getImageUrl()` utility is imported
2. Check if `handleImageError` is attached to images
3. Ensure CSS error styles are loaded

The image upload feature is now fully functional and provides a seamless experience for managing project images!
