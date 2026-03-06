import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function generateTicketReply({ ticket, messages, orderData, tenantName }) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

  const systemContext = `Du bist ein freundlicher, professioneller Kundenservice-Mitarbeiter für ${tenantName || 'einen JTL-Händler'}.
Antworte immer auf Deutsch. Sei präzise, hilfreich und lösungsorientiert.
Halte Antworten kurz (max. 3 Absätze).
${orderData ? `Bestelldaten: ${JSON.stringify(orderData, null, 2)}` : ''}`

  const history = messages.map((m) => ({
    role: m.sender_type === 'customer' ? 'user' : 'model',
    parts: [{ text: m.body }],
  }))

  const chat = model.startChat({
    history: [
      { role: 'user', parts: [{ text: systemContext }] },
      { role: 'model', parts: [{ text: 'Verstanden. Ich helfe als Kundenservice-Mitarbeiter.' }] },
      ...history,
    ],
  })

  const lastMessage = messages.length > 0
    ? messages[messages.length - 1].body
    : ticket.subject

  const result = await chat.sendMessage(lastMessage)
  return result.response.text()
}
