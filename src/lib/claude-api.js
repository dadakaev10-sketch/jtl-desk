import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function generateTicketReply({ ticket, messages, orderData, tenantName }) {
  const systemPrompt = `Du bist ein freundlicher, professioneller Kundenservice-Mitarbeiter für ${tenantName || 'einen JTL-Händler'}.
Antworte immer auf Deutsch. Sei präzise, hilfreich und lösungsorientiert.
${orderData ? `Bestelldaten: ${JSON.stringify(orderData, null, 2)}` : ''}
Halte Antworten kurz (max. 3 Absätze).`

  const userMessages = messages.map((m) => ({
    role: m.sender_type === 'customer' ? 'user' : 'assistant',
    content: m.body,
  }))

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: systemPrompt,
    messages: userMessages.length > 0 ? userMessages : [
      { role: 'user', content: ticket.subject },
    ],
  })

  return response.content[0].text
}
