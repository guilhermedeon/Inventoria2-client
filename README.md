# Inventoria2 Client

React + TypeScript frontend for the Inventoria2 inventory management system.

## Features

- 📦 **Item Management** - Track item definitions, variants, and pack definitions
- 🏷️ **Categories & Tags** - Organize items with hierarchical categories and tags
- 📍 **Inventory Management** - Manage storage locations and nested inventories
- 🔍 **Real-time Updates** - React Query for efficient data fetching and caching
- 🎨 **Modern UI** - Clean, responsive design with intuitive navigation

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **TanStack Query (React Query)** - Data fetching and caching
- **Axios** - HTTP client

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── api/              # API service layer
│   ├── categories.ts
│   ├── item-definitions.ts
│   └── inventories.ts
├── hooks/            # React Query hooks
│   ├── use-categories.ts
│   ├── use-item-definitions.ts
│   └── use-inventories.ts
├── lib/              # Core utilities
│   └── api-client.ts
├── pages/            # Page components
│   ├── CategoriesPage.tsx
│   ├── ItemDefinitionsPage.tsx
│   └── InventoriesPage.tsx
├── types/            # TypeScript type definitions
│   └── index.ts
├── App.tsx           # Main app component
└── main.tsx          # App entry point
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:5000
```

## API Integration

The frontend connects to the Inventoria2 backend API. Ensure the backend is running before starting the frontend.

### Authentication

The app uses JWT bearer tokens stored in localStorage:
- `accessToken` - Short-lived access token
- `refreshToken` - Long-lived refresh token

Tokens are automatically included in API requests via Axios interceptors.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Code Style

- TypeScript strict mode enabled
- ESLint configured for React and TypeScript
- Consistent code formatting

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT
