export async function sendWhatsAppMessage(
  adminPhone: string,
  newUser: {
    name: string;
    fatherName?: string | null;
    city?: string | null;
    email: string;
    phone?: string | null;
  }
) {
  try {
    const url = `https://graph.facebook.com/v17.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

    const templateName = "mauryavansham_signup_request"; 
    const variables = [
      newUser.name,
      newUser.fatherName,
      newUser.city,
    ];

    const payload = {
      messaging_product: "whatsapp",
      // to: adminPhone,
      to: 7991154536,
      type: "template",
      template: {
        name: templateName,
        language: { code: "en" }, // ya "hi" agar template Hindi me hai
        components: [
          {
            type: "body",
            parameters: variables.map((value) => ({
              type: "text",
              text: value,
            })),
          },
        ],
      },
    };

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("❌ WhatsApp send error:", data);
      return { success: false, error: data };
    }

    console.log("📱 WhatsApp template message sent:", data);
    return { success: true };
  } catch (error) {
    console.error("🚨 WhatsApp send exception:", error);
    return { success: false, error };
  }
}
