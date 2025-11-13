import { Page } from '@playwright/test'

/**
 * Helper functions for invitation flows in E2E tests
 */

/**
 * Create an invitation from the dashboard
 */
export async function createInvitation(
  page: Page,
  email: string
): Promise<string> {
  // Navigate to dashboard if not already there
  if (!page.url().includes('/dashboard')) {
    await page.goto('/dashboard')
  }

  // Fill in the invitation email
  // Find the email input by placeholder or by being in the form with "Invite a Friend" text
  const emailInput = page
    .locator('input[type="email"][placeholder*="friend"]')
    .or(page.locator('form:has-text("Invite a Friend") input[type="email"]'))
    .first()
  await emailInput.fill(email)
  await page.click('button:has-text("Send Invite")')

  // Wait for success message and invite link
  await page.waitForSelector('text=Invitation sent!', { timeout: 10000 })

  // Extract the invite link from the readonly input
  const inviteLinkInput = page.locator('input[readonly]').first()
  const inviteLink = await inviteLinkInput.inputValue()

  return inviteLink
}

/**
 * Extract invitation token from invite link
 */
export function extractTokenFromInviteLink(inviteLink: string): string {
  const url = new URL(inviteLink)
  const pathParts = url.pathname.split('/')
  const tokenIndex = pathParts.indexOf('invite') + 1
  return pathParts[tokenIndex]
}

/**
 * Accept an invitation by visiting the invite page and signing up
 */
export async function acceptInvitation(
  page: Page,
  inviteLink: string,
  user: { email: string; password: string; fullName: string }
): Promise<void> {
  // Visit the invitation page
  await page.goto(inviteLink)

  // Wait for the invitation page to load
  await page.waitForSelector('text=You\'re Invited!', { timeout: 10000 })

  // Click the accept invitation button
  await page.click('text=Accept Invitation & Sign Up')

  // Should redirect to signup with token
  await page.waitForURL(/\/signup/, { timeout: 5000 })

  // Fill in the signup form
  await page.fill('input[name="fullName"]', user.fullName)
  // Email should be pre-filled, but we'll fill it anyway
  await page.fill('input[name="email"]', user.email)
  await page.fill('input[name="password"]', user.password)

  // Submit the form
  await page.click('button[type="submit"]')

  // Wait for redirect to dashboard
  await page.waitForURL('/dashboard', { timeout: 10000 })
}

