import { test as base } from '@playwright/test'

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route(/\/api\/stays(\?.*)?$/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              id: 1,
              name: 'Transylvania Cabin',
              price: 450,
              location: 'Brasov',
              images: [],
              _count: { bookings: 0 },
            },
          ],
        }),
      })
    })

    await page.route(/\/api\/stays\/\d+/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',

        body: JSON.stringify({
          id: 1,
          name: 'Transylvania Cabin',
          price: 450,
          location: 'Brasov',
          images: [],
          description: 'A cozy cabin in the woods.',
          _count: { bookings: 0 },
        }),
      })
    })

    await page.route(/\/api\/bookings/, async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          body: JSON.stringify({ success: true }),
        })
      }
    })

    await use(page)
  },
})

export { expect } from '@playwright/test'
