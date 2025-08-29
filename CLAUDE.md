# OneFeed TH UI - Project Overview

## Project Description
OneFeed TH UI is a comprehensive Thai RSS news aggregator web application that collects and displays news from all available Thai RSS feed sources. The app provides a unified interface for browsing diverse news content including politics, business, entertainment, sports, technology, lifestyle, and more, with tag-based filtering and pagination.

## Tech Stack
- **Framework**: Next.js 15.5.2 with App Router and Turbopack
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: FontAwesome
- **React**: v19.1.0

## Architecture Overview

### Server-Side Rendering (SSR)
- Initial page load fetches 50 news items server-side for SEO optimization
- Uses Next.js App Router for routing

### Client-Side Features
- Dynamic pagination (20 items per page)
- Tag-based filtering with localStorage persistence
- Smooth scroll-to-top on page navigation

### API Integration
- External API endpoint: `https://onefeed-th-api.artzakub.com/api/v1`
- Endpoints:
  - `POST /news` - Fetch news with source filtering and pagination
  - `GET /tags` - Fetch available tags for filtering
  - `GET /health` - Health check endpoint

## News Sources
The application aggregates news from dynamic RSS feed sources including:
- Thai news sources (all categories: politics, business, entertainment, sports, technology, lifestyle)
- International sources (planned: ArchDaily and other global RSS feeds)
- Sources are dynamically added/removed via the API
- Image URLs are served directly from the database/API

## Project Structure
```
src/app/
├── components/
│   ├── NewsCard.tsx      # Individual news item display
│   ├── NewsList.tsx      # News list with pagination logic
│   └── TagSelector.tsx   # Tag filter component
├── types/
│   └── NewsResponse.tsx  # TypeScript type definitions
├── layout.tsx            # Root layout
└── page.tsx             # Home page with SSR
```

## Key Components

### NewsList.tsx
- Manages news display and pagination
- Handles client-side data fetching
- Implements loading states
- Pagination with Previous/Next buttons

### TagSelector.tsx  
- Displays available tags from API
- Manages tag selection state
- Persists selections to localStorage
- Visual feedback for selected tags

### NewsCard.tsx
- Renders individual news items
- Displays title, source, published date, and image

## Data Types
```typescript
type NewsItem = {
  title: string;
  source: string;
  publishedAt: string;
  image: string;
  link: string;
}

type NewsResponse = {
  data?: NewsItem[];
}
```

## Development Commands
```bash
npm run dev    # Start development server with Turbopack
npm run build  # Build for production
npm run start  # Start production server
npm run lint   # Run ESLint
```

## Environment Variables
- `NEXT_PUBLIC_API_URL` - Backend API URL for news data (https://onefeed-th-api.artzakub.com/api/v1)

## Recent Updates
- Added API URL configuration via environment variable
- Implemented smooth scroll-to-top on pagination
- Initial project setup with core news aggregation features

## Notes for Development
- The app uses Turbopack for faster builds
- Client components use "use client" directive
- Server components handle initial data fetching
- localStorage is used for persisting user preferences
- No authentication currently implemented
- Mobile-responsive design with Tailwind CSS