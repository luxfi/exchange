// biome-ignore lint/style/noRestrictedImports: playwright fixtures need direct test import
import { test as base } from '@playwright/test'

type EventsFixture = {
  events: {
    /**
     * Wait for a Hanzo Insights event captured to insights.hanzo.ai with the given
     * `event` name and (optionally) required property keys. Returns the captured event.
     */
    waitForEvent: (eventName: string, requiredProperties?: string[]) => Promise<any>
  }
}

export const test = base.extend<EventsFixture>({
  async events({ page }, use) {
    const captured: any[] = []

    // Insights `/e/` is the canonical capture endpoint on insights.hanzo.ai.
    await page.route(/https:\/\/insights\.hanzo\.ai\/e\/?/, async (route) => {
      const request = route.request()
      const postData = request.postData()
      if (!postData) {
        return route.continue()
      }
      try {
        const body = JSON.parse(postData)
        const events = Array.isArray(body) ? body : body.batch ?? [body]
        for (const evt of events) {
          captured.push(evt)
        }
        return route.fulfill({
          status: 200,
          body: JSON.stringify({ status: 1 }),
        })
      } catch {
        return route.continue()
      }
    })

    const waitForEvent = (eventName: string, requiredProperties?: string[]) => {
      return new Promise<any>((resolve) => {
        const tick = () => {
          const i = captured.findIndex((e) => {
            if (e.event !== eventName) return false
            if (!requiredProperties) return true
            return requiredProperties.every((p) => e.properties && p in e.properties)
          })
          if (i !== -1) {
            const evt = captured[i]
            captured.splice(0, i + 1)
            resolve(evt)
          } else {
            setTimeout(tick, 100)
          }
        }
        tick()
      })
    }

    await use({ waitForEvent })
  },
})
