# Uploads Directory

This directory stores uploaded images for the portfolio application.

## Structure

- **Project Images**: Images uploaded for portfolio projects
- **Profile Images**: Profile pictures and other personal images
- **General Assets**: Other uploaded media files

## File Naming Convention

Files are automatically named with the following pattern:
```
{fieldname}-{timestamp}-{random}.{extension}
```

Example: `image-1691234567890-123456789.jpg`

## File Restrictions

- **Allowed Types**: JPG, PNG, GIF, WebP
- **Maximum Size**: 5MB per file
- **Security**: Only authenticated admin users can upload files

## Access

Uploaded files are served statically at:
```
http://localhost:5001/uploads/{filename}
```

## Cleanup

Old or unused files should be cleaned up periodically to save disk space.

## Security Notes

- All uploads are validated for file type and size
- Only image files are accepted
- Authentication is required for upload operations
- Files are stored outside the web root for security
