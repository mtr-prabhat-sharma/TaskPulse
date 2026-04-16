import axios from "axios";

const MSG91_API_KEY = process.env.MSG91_API_KEY;
const WHATSAPP_NUMBER = process.env.MSG91_WHATSAPP_NUMBER;

export const sendWhatsAppMessage = async (
  phone: string,
  message: string
) => {
  try {
    await axios.post(
      "https://api.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/bulk/",
      {
        integrated_number: WHATSAPP_NUMBER,
        content_type: "text",
        payload: {
          type: "text",
          text: message,
        },
        recipients: [
          {
            mobile: phone,
          },
        ],
      },
      {
        headers: {
          authkey: MSG91_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ WhatsApp sent");
  } catch (error: any) {
    console.error("❌ WhatsApp error:", error.response?.data || error.message);
  }
};