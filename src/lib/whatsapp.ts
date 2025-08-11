export async function sendWhatsAppMessage(to: string, message: string) {
  try {
    const url = `https://graph.facebook.com/v17.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`
    const payload = {
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: message }
    }

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })

    const data = await res.json()
    if (!res.ok) {
      console.error("❌ WhatsApp send error:", data)
      return { success: false, error: data }
    }

    console.log("📱 WhatsApp message sent:", data)
    return { success: true }
  } catch (error) {
    console.error("🚨 WhatsApp send exception:", error)
    return { success: false, error }
  }
}
