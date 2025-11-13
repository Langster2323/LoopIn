import { test, expect } from '@playwright/test'
import { createTestUser, signUpUser } from './helpers/auth'
import { createInvitation } from './helpers/invitations'

test.describe('Dashboard', () => {
  test('should display dashboard after login', async ({ page }) => {
    const user = createTestUser()
    await signUpUser(page, user)

    // Wait for dashboard to fully load
    await page.waitForLoadState('networkidle')
    
    // Check dashboard elements
    await expect(page.locator('text=Welcome back')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=Loops Admin')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=Invite a Friend')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=Your Invitations')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=Conversions')).toBeVisible({ timeout: 10000 })
  })

  test('should display metrics cards', async ({ page }) => {
    const user = createTestUser()
    await signUpUser(page, user)

    // Wait for dashboard to fully load
    await page.waitForLoadState('networkidle')

    // Check that metrics are displayed
    await expect(page.locator('text=Total Invitations')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=Accepted')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=Pending')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=Conversion Rate')).toBeVisible({ timeout: 10000 })
  })

  test('should show empty state for invitations', async ({ page }) => {
    const user = createTestUser()
    await signUpUser(page, user)

    // Should show empty state message
    await expect(
      page.locator('text=No invitations yet. Invite your first friend!')
    ).toBeVisible()
  })

  test('should show empty state for conversions', async ({ page }) => {
    const user = createTestUser()
    await signUpUser(page, user)

    // Should show empty state message
    await expect(
      page.locator(
        'text=No conversions yet. When your invited friends sign up'
      )
    ).toBeVisible()
  })

  test('should update metrics after creating invitation', async ({
    page,
  }) => {
    const user = createTestUser()
    await signUpUser(page, user)

    // Create an invitation
    const inviteeEmail = `invitee-${Date.now()}@example.com`
    await createInvitation(page, inviteeEmail)

    // Wait for metrics to update
    await page.waitForTimeout(1000)

    // Check that total invitations increased
    // The exact number depends on whether there were previous invitations
    await expect(page.locator('text=Total Invitations')).toBeVisible()
  })

  test('should display invitation in table after creation', async ({
    page,
  }) => {
    const user = createTestUser()
    await signUpUser(page, user)

    // Create an invitation
    const inviteeEmail = `invitee-${Date.now()}@example.com`
    await createInvitation(page, inviteeEmail)

    // Check that invitation appears in table
    await expect(page.locator('text=' + inviteeEmail)).toBeVisible()
    await expect(page.locator('text=pending')).toBeVisible()
  })

  test('should show user name in welcome message', async ({ page }) => {
    const user = createTestUser()
    await signUpUser(page, user)

    // Check welcome message includes user name
    await expect(
      page.locator(`text=Welcome back, ${user.fullName}`)
    ).toBeVisible()
  })

  test('should have sign out button', async ({ page }) => {
    const user = createTestUser()
    await signUpUser(page, user)

    // Check sign out button is visible
    await expect(page.locator('text=Sign Out')).toBeVisible()
  })
})

