# Loops Admin - User Management System

A comprehensive user management system built with Next.js that includes authentication, friend invitations, and conversion tracking.

## Features

- ✅ User authentication (sign up/sign in)
- ✅ Friend invitation system with unique invite links
- ✅ Conversion tracking and attribution
- ✅ Analytics dashboard with conversion rates
- ✅ Secure Row Level Security (RLS) policies
- ✅ Modern, responsive UI with dark mode support
- ✅ Atomic Design component architecture for maintainability and reusability

## Tech Stack

- **Next.js 16** - React framework for production
- **TypeScript** - Type-safe development
- **Supabase** - Authentication and PostgreSQL database
- **TanStack Query** - Data fetching and state management
- **Tailwind CSS** - Utility-first CSS framework
- **Prettier** - Code formatter for consistent code style

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
├── components/            # Atomic design component library
│   ├── atoms/             # Basic building blocks
│   ├── molecules/         # Simple component combinations
│   ├── organisms/         # Complex UI components
│   └── templates/         # Page-level layouts
├── lib/
│   └── supabase/          # Supabase client utilities
├── supabase/
│   └── schema.sql         # Database schema
└── middleware.ts          # Auth middleware
```

## Component Architecture: Atomic Design Pattern

This project follows the **Atomic Design** methodology, which organizes components into a hierarchical structure from smallest to largest. This approach promotes reusability, consistency, and maintainability.

### What is Atomic Design?

Atomic Design breaks down interfaces into five distinct levels:

1. **Atoms** - Basic building blocks (buttons, inputs, labels)
2. **Molecules** - Simple combinations of atoms (form fields, search bars)
3. **Organisms** - Complex UI components (headers, forms, tables)
4. **Templates** - Page-level layouts
5. **Pages** - Specific page implementations

### Component Structure

#### Atoms (`components/atoms/`)

Basic, indivisible UI elements that cannot be broken down further:

- **Button** - Reusable button with variants (primary, secondary, ghost), sizes, and loading states
- **Input** - Form input with error states and dark mode support
- **Label** - Form label with optional required indicator
- **Badge** - Status badge with color variants (success, warning, error, info)
- **Alert** - Alert message component with variants
- **Card** - Container component for content sections

**Example:**
```tsx
import { Button } from '@/components/atoms'

<Button variant="primary" size="md" isLoading={isLoading}>
  Submit
</Button>
```

#### Molecules (`components/molecules/`)

Simple combinations of atoms that form functional units:

- **FormField** - Combines Label + Input with error handling
- **MetricCard** - Displays a metric with label and value
- **StatusBadge** - Badge that automatically maps status strings to color variants

**Example:**
```tsx
import { FormField } from '@/components/molecules'

<FormField
  label="Email address"
  required
  inputProps={{
    id: 'email',
    type: 'email',
    value: email,
    onChange: (e) => setEmail(e.target.value),
  }}
  error={errors.email}
/>
```

#### Organisms (`components/organisms/`)

Complex components that combine molecules and atoms into meaningful UI sections:

- **NavBar** - Navigation bar with title and sign out functionality
- **MetricsGrid** - Grid layout displaying multiple metric cards
- **InviteForm** - Complete invitation form with validation and success states
- **InvitationsTable** - Table displaying all invitations with status badges
- **ConversionsList** - List of conversions with user information
- **AuthForm** - Reusable authentication form component

**Example:**
```tsx
import { InviteForm } from '@/components/organisms'

<InviteForm
  onSubmit={handleInvite}
  isLoading={isLoading}
  error={error}
  successMessage="Invitation sent!"
  inviteLink={inviteLink}
  onCopyLink={copyLink}
/>
```

#### Templates (`components/templates/`)

Page-level layouts that define the structure of pages:

- **AuthLayout** - Layout wrapper for authentication pages
- **DashboardLayout** - Layout wrapper for dashboard pages with navigation

**Example:**
```tsx
import { DashboardLayout } from '@/components/templates'

<DashboardLayout title="Loops Admin" onSignOut={handleSignOut}>
  {/* Page content */}
</DashboardLayout>
```

### Benefits of This Architecture

1. **Reusability** - Components can be easily reused across different pages
2. **Consistency** - Shared design system ensures consistent UI/UX
3. **Maintainability** - Changes to base components propagate throughout the app
4. **Scalability** - Easy to add new components following the established pattern
5. **Type Safety** - All components are fully typed with TypeScript
6. **Developer Experience** - Clear component hierarchy makes code easier to understand

### Using Components

All components are exported from their respective index files for easy importing:

```tsx
// Import from specific category
import { Button, Input, Label } from '@/components/atoms'
import { FormField, MetricCard } from '@/components/molecules'
import { NavBar, InviteForm } from '@/components/organisms'
import { DashboardLayout } from '@/components/templates'

// Or import everything from the main index
import { Button, FormField, NavBar, DashboardLayout } from '@/components'
```

### Adding New Components

When adding new components, follow these guidelines:

1. **Atoms** - Single-purpose, highly reusable elements
2. **Molecules** - Combine 2-3 atoms for a specific function
3. **Organisms** - Combine multiple molecules/atoms for complex features
4. **Templates** - Page-level structure, not page-specific content

Always:
- Export components from the appropriate `index.ts` file
- Include TypeScript interfaces for props
- Support dark mode via Tailwind classes
- Make components accessible (ARIA labels, keyboard navigation)

## Development

### Code Formatting

This project uses [Prettier](https://prettier.io) for consistent code formatting. Prettier checks are automatically run in CI to ensure code quality.

#### Formatting Commands

```bash
# Format all files
npm run format

# Check if files are formatted (used in CI)
npm run format:check
```

#### Prettier Configuration

The Prettier configuration is defined in `.prettierrc.yml` with the following settings:

- 80 character line width
- 2 space indentation
- Single quotes
- No semicolons
- Trailing commas (ES5)

#### CI Integration

Prettier formatting checks are automatically run in GitHub Actions on every push and pull request. The CI workflow (`.github/workflows/ci.yml`) will:

1. Check code formatting with Prettier
2. Run ESLint
3. Type check with TypeScript
4. Build the project

If formatting checks fail, you can fix them locally by running `npm run format` and committing the changes.

#### Requiring Checks for Pull Requests

To ensure Prettier checks (and other CI checks) are required before merging pull requests:

1. Go to your repository on GitHub
2. Navigate to **Settings** > **Branches**
3. Add or edit branch protection rules for `main` (and `develop` if applicable)
4. Enable **Require status checks to pass before merging**
5. Select the `lint-and-format` job from the list of required status checks
6. Optionally enable **Require branches to be up to date before merging**

This ensures that:

- All Prettier formatting checks must pass
- All ESLint checks must pass
- TypeScript type checking must pass
- The build must succeed

Pull requests cannot be merged until all these checks pass.

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

## Deployment to Vercel

Vercel offers a free tier that's perfect for deploying Next.js applications. Follow these steps to deploy your app:

### Prerequisites

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Have your Supabase credentials ready

### Step-by-Step Deployment

#### 1. Create a Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with your GitHub, GitLab, or Bitbucket account (recommended for easy integration)

#### 2. Import Your Project

1. Click **"Add New..."** → **"Project"**
2. Import your Git repository
3. Vercel will automatically detect it's a Next.js project

#### 3. Configure Environment Variables

Before deploying, add your environment variables in Vercel:

1. In the project settings, go to **Settings** → **Environment Variables**
2. Add the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
```

**Important:** 
- Replace `your_supabase_project_url` with your actual Supabase project URL
- Replace `your_supabase_anon_key` with your actual Supabase anon key
- For `NEXT_PUBLIC_APP_URL`, use your Vercel deployment URL (you can update this after the first deployment)

#### 4. Deploy

1. Click **"Deploy"**
2. Vercel will build and deploy your application
3. The deployment typically takes 1-2 minutes

#### 5. Update App URL (After First Deployment)

1. Once deployed, copy your production URL (e.g., `https://your-app-name.vercel.app`)
2. Go back to **Settings** → **Environment Variables**
3. Update `NEXT_PUBLIC_APP_URL` with your actual Vercel URL
4. Redeploy (or wait for automatic redeploy on next push)

### Automatic Deployments

Vercel automatically deploys:
- **Production:** Every push to your `main` branch
- **Preview:** Every push to other branches (creates a preview URL)

### Vercel Free Tier Limits

The free tier includes:
- ✅ Unlimited personal projects
- ✅ 100GB bandwidth per month
- ✅ 100 serverless function executions per day
- ✅ Automatic SSL certificates
- ✅ Global CDN
- ✅ Preview deployments for every PR

### Post-Deployment Checklist

After deploying, make sure to:

1. ✅ Test the signup/login flow
2. ✅ Verify environment variables are set correctly
3. ✅ Test invitation creation and acceptance
4. ✅ Check that the dashboard loads correctly
5. ✅ Update `NEXT_PUBLIC_APP_URL` in Supabase if needed (for invitation links)

### Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Follow Vercel's DNS configuration instructions
4. Update `NEXT_PUBLIC_APP_URL` to your custom domain

## Next Steps

- Add email notifications for invitations
- Implement invitation expiration handling
- Add more detailed analytics and reporting
- Customize the UI to match your brand

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

### Deployment issues on Vercel

- **404 Error on deployment:**
  - **Check environment variables:** Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set in Vercel project settings
  - **Verify build logs:** Check the Vercel deployment logs for any build errors
  - **Redeploy:** After adding environment variables, trigger a new deployment

- **Cache issues (stale deployments):**
  - **Clear Vercel build cache:**
    1. Go to your Vercel project dashboard
    2. Navigate to **Settings** → **General**
    3. Scroll down to **"Clear Build Cache"** and click it
    4. Redeploy your project
  - **Force a fresh deployment:**
    1. Make a small change (like adding a comment) to any file
    2. Commit and push to trigger a new deployment
    3. Or use Vercel CLI: `vercel --force`
  - **Clear CDN cache:**
    1. In Vercel dashboard, go to **Deployments**
    2. Click the three dots (⋯) on your production deployment
    3. Select **"Redeploy"** with **"Use existing Build Cache"** unchecked
  - **Browser cache:**
    - Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
    - Or open in incognito/private mode
  - **Environment variable cache:**
    - After adding/updating env vars, you MUST redeploy for changes to take effect
    - Vercel caches env vars during build time

- **Build fails:** Check the build logs in Vercel dashboard for specific errors
- **Environment variables not working:** Make sure variables are added for all environments (Production, Preview, Development)
- **Invitation links broken:** Verify `NEXT_PUBLIC_APP_URL` is set to your Vercel deployment URL
- **Database connection errors:** Ensure your Supabase project is active and the URL/key are correct
- **CORS errors:** Check Supabase settings to ensure your Vercel domain is allowed (usually automatic)
