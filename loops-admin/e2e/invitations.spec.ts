import { test, expect } from '@playwright/test'
import {
  createTestUser,
  signUpUser,
  signOutUser,
} from './helpers/auth'
import {
  createInvitation,
  acceptInvitation,
  extractTokenFromInviteLink,
} from './helpers/invitations'

test.describe('Invitations', () => {
  test('should create an invitation', async ({ page }) => {
    // Sign up as inviter
    const inviter = createTestUser()
    await signUpUser(page, inviter)

    // Create invitation
    const inviteeEmail = `invitee-${Date.now()}@example.com`
    const inviteLink = await createInvitation(page, inviteeEmail)

    // Should have an invite link
    expect(inviteLink).toBeTruthy()
    expect(inviteLink).toContain('/invite/')

    // Should show success message
    await expect(page.locator('text=Invitation sent!')).toBeVisible()
  })

  test('should display invitation in invitations table', async ({ page }) => {
    // Sign up as inviter
    const inviter = createTestUser()
    await signUpUser(page, inviter)

    // Create invitation
    const inviteeEmail = `invitee-${Date.now()}@example.com`
    await createInvitation(page, inviteeEmail)

    // Check invitations table
    await expect(page.locator('text=Your Invitations')).toBeVisible()
    await expect(page.locator('text=' + inviteeEmail)).toBeVisible()
    await expect(page.locator('text=pending')).toBeVisible()
  })

  test('should accept invitation and create conversion', async ({
    page,
    context,
  }) => {
    // Sign up as inviter in first browser context
    const inviter = createTestUser()
    await signUpUser(page, inviter)

    // Create invitation
    const inviteeEmail = `invitee-${Date.now()}@example.com`
    const inviteLink = await createInvitation(page, inviteeEmail)

    // Sign out inviter
    await signOutUser(page)

    // Create new page for invitee
    const inviteePage = await context.newPage()

    // Accept invitation as invitee
    const invitee = createTestUser()
    invitee.email = inviteeEmail
    await acceptInvitation(inviteePage, inviteLink, invitee)

    // Should be on dashboard
    await expect(inviteePage).toHaveURL(/\/dashboard/)

    // Switch back to inviter's page and sign in
    await signInUser(page, inviter.email, inviter.password)

    // Check that conversion was created
    await expect(page.locator('text=Conversions')).toBeVisible()
    // The conversion should appear in the conversions list
    await expect(
      page.locator('text=' + invitee.fullName).or(
        page.locator('text=' + inviteeEmail)
      )
    ).toBeVisible({ timeout: 10000 })

    await inviteePage.close()
  })

  test('should display invitation page with correct details', async ({
    page,
    context,
  }) => {
    // Sign up as inviter
    const inviter = createTestUser()
    await signUpUser(page, inviter)

    // Create invitation
    const inviteeEmail = `invitee-${Date.now()}@example.com`
    const inviteLink = await createInvitation(page, inviteeEmail)

    // Create new page for invitee
    const inviteePage = await context.newPage()

    // Visit invitation page
    await inviteePage.goto(inviteLink)

    // Should show invitation details
    await expect(inviteePage.locator('text=You\'re Invited!')).toBeVisible()
    await expect(inviteePage.locator('text=' + inviteeEmail)).toBeVisible()
    await expect(
      inviteePage.locator('text=Accept Invitation & Sign Up')
    ).toBeVisible()

    await inviteePage.close()
  })

  test('should show metrics after invitation acceptance', async ({
    page,
    context,
  }) => {
    // Sign up as inviter
    const inviter = createTestUser()
    await signUpUser(page, inviter)

    // Create invitation
    const inviteeEmail = `invitee-${Date.now()}@example.com`
    await createInvitation(page, inviteeEmail)

    // Check initial metrics
    await expect(page.locator('text=Total Invitations')).toBeVisible()
    await expect(page.locator('text=1')).toBeVisible() // Should show 1 invitation

    // Get the invite link from the page
    const inviteLinkInput = page.locator('input[readonly]').first()
    const inviteLink = await inviteLinkInput.inputValue()

    // Accept invitation
    const inviteePage = await context.newPage()
    const invitee = createTestUser()
    invitee.email = inviteeEmail
    await acceptInvitation(inviteePage, inviteLink, invitee)

    // Wait a bit for the conversion to be processed
    await page.waitForTimeout(2000)

    // Refresh the page to see updated metrics
    await page.reload()

    // Check updated metrics
    await expect(page.locator('text=Conversion Rate')).toBeVisible()
    // Should show at least 1 conversion
    await expect(page.locator('text=1').first()).toBeVisible()

    await inviteePage.close()
  })
})

