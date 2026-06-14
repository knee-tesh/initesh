# Nitesh's Portfolio

A terminal-themed portfolio website showcasing technical expertise, consulting services, and professional journey.

## Overview

This portfolio demonstrates expertise in fullstack development, system architecture, and production-ready solutions. It features an interactive terminal interface that emulates a Unix-like environment for navigation and exploration.

## Key Features

### Core Experience
- **Interactive Terminal Interface** - Navigate through skills, services, projects, and contact using a simulated command-line environment
- **Live Visitor Tracking** - Real-time analytics showing visit statistics, geographic data, and user behavior
- **Query/Guestbook System** - Visitors can submit questions or messages with email notifications
- **Admin Dashboard** - Password-protected admin interface for managing visitor data and queries

### Technical Showcase
- **Visitor Analytics** - Tracks page views, geographic locations, and user agents
- **Rate Limiting** - Prevents spam with IP-based rate limiting (3 requests/hour)
- **Session Management** - Secure admin authentication with session cookies
- **Data Export** - JSON export functionality for data backup and analysis

## Technology Stack

### Frontend
- Next.js 16 (App Router)
- React 19 with TypeScript
- Tailwind CSS 4
- Terminal UI components

### Backend
- Next.js API Routes
- Turso (SQLite over HTTP) for serverless database
- SHA-256 IP hashing for privacy
- Session-based authentication

### Development
- Jest for testing
- ESLint + Prettier for code quality
- GitHub Actions for CI/CD

## Installation & Setup

### Local Development
```bash
# Clone the repository
git clone https://github.com/knee-tesh/initesh.git

# Navigate to project directory
cd initesh

# Install dependencies
npm install

# Set up environment variables (copy from .env.local.example)
cp .env.local.example .env.local

# Start the development server
npm run dev
```

### Environment Variables
Create a `.env.local` file with the following:

```env
TURSO_DATABASE_URL=your-turso-database-url
TURSO_AUTH_TOKEN=your-turso-auth-token
ADMIN_PASSWORD=your-secure-password
IP_HASH_SALT=your-random-salt-string
```

## Project Structure

```
/src
  /app                    # Next.js app routes
    /(terminal)/          # Terminal-themed pages
      /page.tsx          # Home page
      /contact/page.tsx  # Contact page with guestbook
      /admin/page.tsx    # Admin dashboard
      /layout.tsx        # Terminal layout wrapper
    /api                 # API routes
      /track/route.ts    # Visitor tracking endpoint
      /queries/route.ts  # Query submission endpoint
      /admin/            # Admin API routes
  /components            # React components
    /process-card.tsx   # Process card component
    /terminal-layout.tsx # Terminal layout component
  /hooks                 # Custom hooks
    /use-visitor-tracking.ts # Visitor tracking hook
  /lib                  # Library code
    /types.ts           # Type definitions
    /storage.ts         # Storage abstraction
    /auth.ts            # Authentication utilities
    /ip-hash.ts         # IP hashing utility
    /migrate.ts         # Database migration script
  /data                 # Static data files
    /contact.json       # Contact information
  __tests__/            # Test files
```

## Usage

### Navigation
- Press `⌘K` or `Ctrl+K` to open command palette
- Use arrow keys to navigate, `Enter` to select
- Type `help` for available commands

### Visitor Tracking
The portfolio automatically tracks:
- Page views and navigation patterns
- Geographic location (country, city)
- Browser and device information
- Referrer sources

### Submitting Queries
Visit the Contact page and use the "Leave a Query" section to submit questions or messages. All submissions are rate-limited (3 per IP per hour) to prevent spam.

### Admin Access
Access the admin dashboard at `/admin` and log in with the password set in `ADMIN_PASSWORD`. The dashboard provides:
- Visitor statistics and analytics
- List of submitted queries
- Export functionality for data backup

## Features Timeline

### Completed
- [x] Visitor tracking system
- [x] Query/guestbook functionality
- [x] Admin dashboard
- [x] IP hashing and rate limiting
- [x] Terminal-themed UI
- [x] Interactive navigation

### Planned
- [ ] Advanced analytics dashboard
- [ ] Real-time visitor presence
- [ ] Interactive project showcase
- [ ] API documentation

## Credits

- **Design & Development:** Nitesh
- **Database:** Turso (SQLite over HTTP)
- **Hosting:** Vercel
- **Icons:** Font Awesome (via Next.js)
- **Fonts:** System fonts with fallbacks

## License

This portfolio is open source. Feel free to explore, contribute, or fork the project for your own use.

## Acknowledgments

Special thanks to the open-source community for amazing tools and libraries that made this project possible.
