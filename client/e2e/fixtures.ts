import { test as base } from '@playwright/test'

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route('**/*stays*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 1, name: 'Transylvania Cabin', price: 450 },
          { id: 2, name: 'Bucharest Loft', price: 300 },
        ]),
      })
    })

    await use(page)
  },
})

export { expect } from '@playwright/test'
