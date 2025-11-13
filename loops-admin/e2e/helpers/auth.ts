import { Page } from '@playwright/test'

/**
 * Helper functions for authentication flows in E2E tests
 */

export interface TestUser {
  email: string
  password: string
  fullName: string
}

/**
 * Generate a unique test user email
 */
export function generateTestUserEmail(): string {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 10000)
  return `test-${timestamp}-${random}@example.com`
}

/**
 * Create a test user
 */
export function createTestUser(): TestUser {
  return {
    email: generateTestUserEmail(),
    password: 'TestPassword123!',
    fullName: 'Test User',
  }
}

/**
 * Sign up a new user
 */
export async function signUpUser(
  page: Page,
  user: TestUser
): Promise<void> {
  await page.goto('/signup')
  // Wait for the form to be fully loaded (Suspense might cause delay)
  await page.waitForSelector('input[name="fullName"]', { timeout: 10000 })
  await page.waitForSelector('input[name="email"]', { timeout: 10000 })
  await page.waitForSelector('input[name="password"]', { timeout: 10000 })
  
  await page.fill('input[name="fullName"]', user.fullName)
  await page.fill('input[name="email"]', user.email)
  await page.fill('input[name="password"]', user.password)
  
  // Wait for submit button to be enabled
  await page.waitForSelector('button[type="submit"]:not([disabled])', { timeout: 5000 })
  await page.click('button[type="submit"]')
  
  // Wait for redirect to dashboard
  await page.waitForURL('/dashboard', { timeout: 15000 })
}

/**
 * Sign in an existing user
 */
export async function signInUser(
  page: Page,
  email: string,
  password: string
): Promise<void> {
  await page.goto('/login')
  // Wait for form to be ready
  await page.waitForSelector('input[name="email"]', { timeout: 10000 })
  await page.waitForSelector('input[name="password"]', { timeout: 10000 })
  
  await page.fill('input[name="email"]', email)
  await page.fill('input[name="password"]', password)
  
  // Wait for submit button to be enabled
  await page.waitForSelector('button[type="submit"]:not([disabled])', { timeout: 5000 })
  await page.click('button[type="submit"]')
  
  // Wait for redirect to dashboard or handle error
  try {
    await page.waitForURL('/dashboard', { timeout: 15000 })
  } catch {
    // If redirect fails, check if there's an error message
    const errorVisible = await page
      .locator('text=/error|invalid|incorrect/i')
      .isVisible()
    if (errorVisible) {
      throw new Error('Sign in failed - check credentials')
    }
    throw new Error('Sign in failed - no redirect to dashboard')
  }
}

/**
 * Sign out the current user
 */
export async function signOutUser(page: Page): Promise<void> {
  await page.click('text=Sign Out')
  await page.waitForURL('/login', { timeout: 5000 })
}

/**
 * Check if user is authenticated (on dashboard)
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
  try {
    await page.waitForURL('/dashboard', { timeout: 2000 })
    return true
  } catch {
    return false
  }
}

