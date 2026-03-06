/**
 * JTL API Wrapper
 * Kommuniziert mit der JTL REST API des jeweiligen Tenants.
 * API-Key und URL sind tenant-spezifisch (in tenants Tabelle gespeichert).
 */

export async function fetchJTLOrder(orderId, { apiKey, apiUrl }) {
  if (!apiKey || !apiUrl) {
    throw new Error('JTL API nicht konfiguriert. Bitte in den Einstellungen hinterlegen.')
  }

  const res = await fetch(`${apiUrl}/orders/${orderId}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    throw new Error(`JTL API Fehler: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

export async function testJTLConnection({ apiKey, apiUrl }) {
  if (!apiKey || !apiUrl) return { ok: false, message: 'API-Key und URL sind erforderlich.' }

  try {
    const res = await fetch(`${apiUrl}/ping`, {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: AbortSignal.timeout(5000),
    })
    return { ok: res.ok, status: res.status }
  } catch (err) {
    return { ok: false, message: err.message }
  }
}
