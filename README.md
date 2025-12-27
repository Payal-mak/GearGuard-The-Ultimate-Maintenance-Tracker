# GearGuard - The Ultimate Maintenance Tracker

A modern maintenance management system for tracking assets, managing teams, and streamlining maintenance workflows.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=flat-square&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

## Features

- Equipment tracking with categories, work centers, and scrap management
- Team management with dynamic member assignment
- Maintenance requests with Kanban board and calendar view
- Real-time search and filtering
- Dashboard with statistics
- Supabase authentication and Row Level Security

## Tech Stack

**Frontend:** Next.js 15, TypeScript, Tailwind CSS, shadcn/ui  
**Backend:** Supabase (PostgreSQL + Auth)

## Quick Start

### Prerequisites
- Node.js 18.x or higher
- Supabase account

### Installation

1. Clone and install dependencies:
   ```bash
   git clone https://github.com/your-username/GearGuard-The-Ultimate-Maintenance-Tracker.git
   cd GearGuard-The-Ultimate-Maintenance-Tracker
   npm install
   ```

2. Create `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

3. Run migrations in Supabase SQL Editor:
   - Execute `scripts/001_create_tables.sql`
   - Execute `scripts/002_add_equipment_fields.sql`

4. Start development server:
   ```bash
   npm run dev
   ```

Visit [http://localhost:3000](http://localhost:3000)

## License

MIT License

---

Made with Next.js, TypeScript, and Supabase
