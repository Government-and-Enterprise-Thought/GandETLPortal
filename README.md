> [!IMPORTANT]
> This repository has migrated to Forgejo: https://git.gandetl.com/Government_Enterprise_Thought_Leaders/GandETLPortal
> The GitHub copy is archived and read-only.

# GandETL Portal

A modern, responsive portal page for gandetl.com built with Next.js, React, and TypeScript.

## Features

- 🎨 Modern, beautiful UI with gradient backgrounds
- 📱 Fully responsive design
- ⚡ Fast and optimized with Next.js
- 🎯 Interactive tab-based navigation
- 💼 Professional portal interface
- 🗄️ MongoDB database integration

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up MongoDB connection:
   - Create a `.env.local` file in the root directory
   - Add the following line:
   ```
   MONGODB_URI=mongodb://192.168.1.84:27017/gandetl
   ```
   - Make sure your MongoDB server at `192.168.1.84` is accessible and running

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:30001](http://localhost:30001) in your browser to see the portal.

## Project Structure

```
GandETLPortal/
├── app/
│   ├── api/                # API routes
│   │   ├── test/           # MongoDB connection test endpoint
│   │   └── examples/       # Example CRUD endpoints
│   ├── layout.tsx          # Root layout component
│   ├── page.tsx            # Main portal page
│   ├── page.module.css     # Portal page styles
│   └── globals.css         # Global styles
├── lib/
│   └── mongodb.ts          # MongoDB connection utility
├── models/                 # Mongoose models
│   └── Example.ts          # Example model
├── package.json            # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── next.config.js         # Next.js configuration
```

## MongoDB Setup

The application is configured to connect to MongoDB at `192.168.1.84` using the database `gandetl`.

### Connection

The MongoDB connection is handled in `lib/mongodb.ts` with connection pooling for optimal performance in Next.js.

### Testing the Connection

You can test the MongoDB connection by visiting:
```
http://localhost:30001/api/test
```

### Example API Endpoints

- `GET /api/examples` - Get all examples
- `POST /api/examples` - Create a new example

### Creating Models

Create new Mongoose models in the `models/` directory. See `models/Example.ts` for a reference implementation.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

The portal can be deployed to various platforms:

- **Vercel** (recommended for Next.js): Connect your GitHub repository
- **Netlify**: Use the Next.js build command
- **AWS/Azure/GCP**: Follow Next.js deployment guides

## Customization

The portal includes several customizable sections:
- Overview
- Data Pipelines
- Datasets
- Analytics
- Settings

You can modify the content, styling, and functionality in `app/page.tsx` and `app/page.module.css`.

## License

Copyright © 2024 GandETL. All rights reserved.

