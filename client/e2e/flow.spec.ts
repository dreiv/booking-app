import { expect, test } from './fixtures'

test('User completes a full booking journey', async ({ page }) => {
  await page.goto('/')

  await page.getByTestId('stay-card').first().getByLabel(/book/i).click()

  await page.getByPlaceholder(/john doe/i).fill('Andrei')
  await page.getByPlaceholder('john@example.com').fill('andrei@gmail.com')

  await page.getByRole('button', { name: /Confirm Booking/i }).click()

  await expect(page).toHaveURL(/\/bookings/)

  await expect(page.getByText(/Confirmed/i)).toBeVisible()
})
