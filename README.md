# Vaidra - Educational Audiobooks Platform

A Next.js web application for providing free educational and self-improvement audiobooks in regional Indian languages.

## Features

- Multi-language support (Hindi, Tamil, Telugu, Kannada, Marathi, Punjabi, English)
- Browse audiobooks, courses, and research papers
- Category-based filtering
- Responsive design with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Prisma (PostgreSQL)
- **Deployment**: Ready for Vercel/Netlify

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database (for production)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/aarohkandy/Vaidra.git
cd Vaidra
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your database URL:
```
DATABASE_URL="postgresql://user:password@localhost:5432/vaidra?schema=public"
```

4. Generate Prisma client:
```bash
npx prisma generate
```

5. Run database migrations (when database is set up):
```bash
npx prisma migrate dev
```

6. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build for Production

```bash
npm run build
npm start
```

## Deployment

The application is ready to deploy on Vercel, Netlify, or any platform that supports Next.js.

### Vercel Deployment

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables (DATABASE_URL)
4. Deploy!

## Project Structure

```
├── app/              # Next.js App Router pages
│   ├── api/         # API routes
│   ├── about/       # About page
│   ├── browse/      # Browse audiobooks
│   ├── categories/  # Categories page
│   ├── contact/     # Contact page
│   ├── research/    # Research papers
│   └── layout.tsx   # Root layout
├── components/      # React components
├── lib/             # Utility functions
├── prisma/          # Database schema
└── public/          # Static assets
```

## License

ISC

