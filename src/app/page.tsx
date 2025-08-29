import { HomePage } from "./components/HomePage"
import type { NewsItem } from "./components/NewsCard"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://onefeed-th-api.artzakub.com/api/v1'

export default async function Page() {
  let initialNews: NewsItem[] = []

  try {
    // SSR: Fetch initial news for SEO optimization
    const response = await fetch(`${API_URL}/news`, {
      method: "POST",
      body: JSON.stringify({
        source: ["MacThai", "DroidSans", "เกมถูกบอกด้วย"], // Start with main sources
        page: 1,
        limit: 20,
      }),
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    })

    if (response.ok) {
      const data = await response.json()
      initialNews = data.data || []
    }
  } catch (error) {
    console.error('Failed to fetch initial news:', error)
    // Continue with empty array - client will fetch
  }

  return <HomePage initialNews={initialNews} />
}
