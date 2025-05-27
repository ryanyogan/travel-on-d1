## Live Demo
https://funroad.ryanyogan.workers.dev

## About

Funroad is a serverless application demonstrating how to deploy a web application to Cloudflare Workers. It showcases modern web development techniques and serverless architecture.

The UI and general application idea came from https://www.youtube.com/watch?v=xZ1ba-RLrjo&t=20025s

## Features

- Serverless deployment on Cloudflare Workers
- Fast global distribution via Cloudflare's edge network
- Simple and responsive design
- Minimal dependencies

## Technologies

- Cloudflare Workers
- Cloudflare D1 Bindings
- Cloudflare R2 (In-Progress)
- - Image & Assets
- - Trigger.dev -> Sharp -> Image Optimization
- React Router 7
- Drizzle ORM
- Better Auth
- TailwindCSS
- ShadcnUI
- Better UI (In-Progress)
- Server -> Client hydration (In-Progress)
- Pagination (In-Progress)

## Getting Started

### Prerequisites

- Node.js or Bun
- Wrangler CLI (`npm install -g wrangler`)
- Cloudflare account

### Installation

1. Clone the repository
```bash
git clone https://github.com/ryanyogan/funroad.git
cd funroad
```

2. Install dependencies
```bash
bun install
```

3. Start development server
```bash
bun run dev
bunx wrangler dev (Production Mode)
```

4. Start local production server
```bash
bunx wrangler dev (Production Mode)
```

### Deployment

Deploy to Cloudflare Workers:
```bash
wrangler publish
```