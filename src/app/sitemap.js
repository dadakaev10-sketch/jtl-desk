export default function sitemap() {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'https://[DOMAIN]'

  return [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/impressum`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/datenschutz`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/agb`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ]
}
