import { test, expect } from '@playwright/test'
import { createTestUser, signUpUser, signInUser, signOutUser } from './helpers/auth'

test.describe('Authentication', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveTitle(/Loops Admin/)
    await expect(page.locator('h2')).toContainText('Sign In')
    await expect(page.locator('input[name="email"]')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('input[name="password"]')).toBeVisible({ timeout: 10000 })
  })

  test('should display signup page', async ({ page }) => {
    await page.goto('/signup')
    // Wait for Suspense to resolve
    await page.waitForSelector('input[name="fullName"]', { timeout: 15000 })
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveTitle(/Loops Admin/)
    await expect(page.locator('h2')).toContainText('Create Account')
    await expect(page.locator('input[name="fullName"]')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('input[name="email"]')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('input[name="password"]')).toBeVisible({ timeout: 10000 })
  })

  test('should sign up a new user', async ({ page }) => {
    const user = createTestUser()

    await signUpUser(page, user)

    // Should be redirected to dashboard
    await expect(page).toHaveURL(/\/dashboard/)
    await expect(page.locator('text=Welcome back')).toBeVisible()
  })

  test('should sign in an existing user', async ({ page }) => {
    // First, create a user
    const user = createTestUser()
    await signUpUser(page, user)

    // Sign out
    await signOutUser(page)

    // Sign in again
    await signInUser(page, user.email, user.password)

    // Should be on dashboard
    await expect(page).toHaveURL(/\/dashboard/)
    await expect(page.locator('text=Welcome back')).toBeVisible()
  })

  test('should show error on invalid login credentials', async ({ page }) => {
    await page.goto('/login')
    await page.waitForSelector('input[name="email"]', { timeout: 10000 })
    await page.fill('input[name="email"]', 'nonexistent@example.com')
    await page.fill('input[name="password"]', 'wrongpassword')
    await page.waitForSelector('button[type="submit"]:not([disabled])', { timeout: 5000 })
    await page.click('button[type="submit"]')

    // Should show error message
    await expect(page.locator('text=/error|invalid|incorrect|failed/i')).toBeVisible({
      timeout: 10000,
    })
  })

  test('should redirect authenticated user from login to dashboard', async ({
    page,
  }) => {
    // Sign up a user
    const user = createTestUser()
    await signUpUser(page, user)

    // Try to visit login page
    await page.goto('/login')

    // Should be redirected to dashboard
    await expect(page).toHaveURL(/\/dashboard/)
  })

  test('should sign out user', async ({ page }) => {
    // Sign up a user
    const user = createTestUser()
    await signUpUser(page, user)

    // Sign out
    await signOutUser(page)

    // Should be on login page
    await expect(page).toHaveURL(/\/login/)
  })
})

