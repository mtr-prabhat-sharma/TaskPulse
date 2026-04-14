import axios from "axios";

const API_KEY = process.env.WHATSAPP_API_KEY;

export const sendWhatsAppMessage = async (
  phone: string,
  message: string
) => {
  try {
    await axios.post(
      "https://api.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/bulk/",
      {
        integrated_number: "YOUR_SANDBOX_NUMBER",
        content_type: "text",
        payload: {
          type: "text",
          text: message,
        },
        recipients: [
          {
            to: phone,
          },
        ],
      },
      {
        headers: {
          authkey: API_KEY,
        },
      }
    );
  } catch (error) {
    console.log("WhatsApp error:", error);
  }
};