import { expect, test } from '@playwright/test'

test('should load the app', async ({ page }) => {
  await page.goto('/')

  const root = page.locator('#root')
  await expect(root).toBeVisible()
})
