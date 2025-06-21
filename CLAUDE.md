# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15.3.4 application using TypeScript and the App Router architecture. The project uses Tailwind CSS v4 for styling with dark mode support.

## Key Commands

```bash
# Development
npm run dev        # Start development server at http://localhost:3000

# Production
npm run build      # Build for production
npm run start      # Start production server

# Code Quality
npm run lint       # Run ESLint
```

## Architecture

### Tech Stack
- **Framework**: Next.js 15.3.4 with App Router
- **Language**: TypeScript (strict mode enabled)
- **Styling**: Tailwind CSS v4 with PostCSS
- **UI**: React 19.0.0

### Project Structure
- `/app/` - App Router pages and layouts
  - `layout.tsx` - Root layout with Geist font configuration
  - `page.tsx` - Homepage component
  - `globals.css` - Global styles and Tailwind directives
- `/public/` - Static assets (images, icons)

### Important Patterns
- **Imports**: Use `@/` alias for imports (maps to project root)
- **Components**: Functional React components with TypeScript
- **Styling**: Tailwind utility classes, CSS variables for theming
- **Fonts**: Geist fonts loaded via `next/font/google`

## Development Notes

- The project supports both light and dark modes via CSS custom properties
- No testing framework is currently configured
- TypeScript strict mode is enabled - ensure proper typing
- Tailwind CSS v4 uses a new configuration approach (no separate config file)

## Project Components

### Landing Page
- `/app/page.tsx` - Main landing page with technology showcase
- `/components/HeroSection.tsx` - Hero section with video demo and feature list
- `/components/SAM2Feature.tsx` - SAM2 technology showcase with video
- `/components/LlamaFeature.tsx` - Llama AI feature explanation with video
- `/components/VoiceFeature.tsx` - Voice interaction showcase with video
- `/components/DemoSection.tsx` - QR code generator for demo access
- `/components/SetupInstructions.tsx` - Step-by-step setup guide

### Hackathon Context
This is a Meta AI hackathon project demonstrating:
- SAM2 for real-time ingredient detection and tracking
- Llama for recipe generation and conversational guidance
- Voice AI for hands-free interaction
- iPhone camera streaming to MacBook for demo