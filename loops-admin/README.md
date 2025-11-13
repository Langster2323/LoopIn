# Loops Admin - User Management System

A comprehensive user management system built with Next.js that includes authentication, friend invitations, and conversion tracking.

## Features

- ✅ User authentication (sign up/sign in)
- ✅ Friend invitation system with unique invite links
- ✅ Conversion tracking and attribution
- ✅ Analytics dashboard with conversion rates
- ✅ Secure Row Level Security (RLS) policies
- ✅ Modern, responsive UI with dark mode support

## Tech Stack

- **Next.js 16** - React framework for production
- **TypeScript** - Type-safe development
- **Supabase** - Authentication and PostgreSQL database
- **TanStack Query** - Data fetching and state management
- **Tailwind CSS** - Utility-first CSS framework

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for your project to be fully provisioned

### 2. Set Up Database Schema

1. In your Supabase dashboard, go to the SQL Editor
2. Copy and paste the contents of `supabase/schema.sql`
3. Run the SQL script to create all necessary tables, policies, and triggers

### 3. Configure Environment Variables

1. In your Supabase dashboard, go to Settings > API
2. Copy your Project URL and anon/public key
3. Create a `.env.local` file in the root of your project:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

### Authentication Flow

1. Users can sign up or sign in through the `/login` and `/signup` pages
2. Supabase handles password hashing and session management
3. User profiles are automatically created via database triggers

### Invitation System

1. Authenticated users can invite friends by entering their email
2. A unique invitation token is generated and stored
3. An invitation link is created: `/invite/[token]`
4. When the friend clicks the link, they see an invitation page
5. They can sign up using the invitation link, which automatically attributes the conversion

### Conversion Tracking

1. When a user signs up with an invitation token, a conversion record is created
2. The conversion links:
   - The inviter (who sent the invitation)
   - The invitee (who signed up)
   - The invitation record
3. The dashboard displays:
   - Total invitations sent
   - Accepted invitations
   - Pending invitations
   - Conversion rate (conversions / total invitations)

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/          # Authentication endpoints
│   │   ├── invitations/   # Invitation management
│   │   └── analytics/      # Conversion tracking
│   ├── dashboard/         # Main dashboard page
│   ├── login/             # Sign in page
│   ├── signup/            # Sign up page
│   └── invite/[token]/    # Invitation acceptance page
├── lib/
│   └── supabase/          # Supabase client utilities
├── supabase/
│   └── schema.sql         # Database schema
└── middleware.ts          # Auth middleware
```

## Security Features

- Row Level Security (RLS) enabled on all tables
- Users can only view their own invitations and conversions
- Invitation tokens are cryptographically secure
- Automatic session management via middleware
- Protected API routes with authentication checks

## Resources & Credits

This project was built using the following resources and tools:

- **[Supabase Documentation](https://supabase.com/docs)** - Used for authentication setup, database configuration, and Row Level Security policies
- **[Supabase](https://supabase.com)** - Provides authentication service and PostgreSQL database for all user data, invitations, and conversions
- **[TanStack Query](https://tanstack.com/query/latest)** - Used for cleaner code and efficient data fetching, state management, and caching throughout the application
- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first CSS framework used for all styling and responsive design
- **[v0.dev](https://v0.dev)** - Used for visual representation and UI design inspiration
- **[Loveable](https://loveable.dev)** - Used for visual representation and UI design inspiration

## Next Steps

- Add email notifications for invitations
- Implement invitation expiration handling
- Add more detailed analytics and reporting
- Customize the UI to match your brand
- Deploy to production (Vercel recommended)

## Troubleshooting

### "Invalid API key" error
- Make sure your `.env.local` file has the correct Supabase URL and anon key
- Restart your development server after changing environment variables

### Database errors
- Ensure you've run the SQL schema in your Supabase SQL Editor
- Check that all tables and policies were created successfully

### Authentication not working
- Verify your Supabase project is active
- Check that email authentication is enabled in Supabase Auth settings
