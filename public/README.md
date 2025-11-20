# Public Assets

## Purpose
Static files served directly by Next.js without processing.

## Structure
```
public/
├── icons/      # App icons, favicon.ico
├── images/     # Static images (logo, illustrations)
└── fonts/      # Custom web fonts (if any)
```

## Usage
Files in this folder are accessible from the root URL.

Example:
- `public/logo.png` → accessible at `/logo.png`
- `public/icons/favicon.ico` → `/icons/favicon.ico`

## Best Practices
- ✅ Optimize images before adding (use next/image for dynamic images)
- ✅ Use descriptive filenames
- ✅ Keep file sizes small
- ❌ Don't put sensitive data here (publicly accessible)

