import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ADMIN_EMAIL = "macociug@gmail.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  language?: string;
}

// Email templates multilinguale
const emailTemplates = {
  en: {
    clientSubject: "✅ Thank you for contacting me!",
    clientTitle: "Thank You for Your Message!",
    clientGreeting: "Dear",
    clientThankYou:
      "Thank you for reaching out! I have received your message regarding",
    clientResponseBox:
      "<strong>⚡ Quick Response Guaranteed!</strong><br>I typically respond within 24 hours during business days. Your message is important to me, and I'll get back to you as soon as possible.",
    clientNextSteps: "What's next?",
    clientSteps: [
      "I will review your message carefully",
      "You'll receive a personalized response to your email",
      "We can schedule a consultation if needed",
    ],
    clientInvite:
      "In the meantime, feel free to explore my website for more information about lactation consulting services and resources.",
    clientCTA: "Visit My Website",
    clientConnect: "Connect with me:",
    clientFooter: "IBCLC Certified Lactation Consultant",
    clientDisclaimer:
      "This is an automated confirmation email. Please do not reply directly to this message.",
  },
  ro: {
    clientSubject: "✅ Mulțumesc pentru că m-ai contactat!",
    clientTitle: "Mulțumesc pentru mesajul tău!",
    clientGreeting: "Dragă",
    clientThankYou:
      "Mulțumesc că m-ai contactat! Am primit mesajul tău cu privire la",
    clientResponseBox:
      "<strong>⚡ Răspuns Rapid Garantat!</strong><br>De obicei răspund în 24 de ore în timpul zilelor lucrătoare. Mesajul tău este important pentru mine și voi reveni cu un răspuns cât mai curând posibil.",
    clientNextSteps: "Ce urmează?",
    clientSteps: [
      "Voi analiza mesajul tău cu atenție",
      "Vei primi un răspuns personalizat pe email",
      "Putem programa o consultație dacă este necesar",
    ],
    clientInvite:
      "Între timp, te invit să explorezi site-ul meu pentru mai multe informații despre serviciile de consultanță în alăptare și resurse utile.",
    clientCTA: "Vizitează Site-ul",
    clientConnect: "Conectează-te cu mine:",
    clientFooter: "Consultant în Lactație Certificat IBCLC",
    clientDisclaimer:
      "Acesta este un email automat de confirmare. Te rog să nu răspunzi direct la acest mesaj.",
  },
  ru: {
    clientSubject: "✅ Спасибо за ваше сообщение!",
    clientTitle: "Спасибо за ваше сообщение!",
    clientGreeting: "Уважаемая(ый)",
    clientThankYou:
      "Спасибо, что связались со мной! Я получила ваше сообщение по теме",
    clientResponseBox:
      "<strong>⚡ Гарантированный быстрый ответ!</strong><br>Обычно я отвечаю в течение 24 часов в рабочие дни. Ваше сообщение важно для меня, и я свяжусь с вами как можно скорее.",
    clientNextSteps: "Что дальше?",
    clientSteps: [
      "Я внимательно изучу ваше сообщение",
      "Вы получите персонализированный ответ на email",
      "При необходимости мы можем назначить консультацию",
    ],
    clientInvite:
      "Тем временем, приглашаю вас посетить мой сайт для получения дополнительной информации о консультационных услугах по грудному вскармливанию.",
    clientCTA: "Посетить Сайт",
    clientConnect: "Свяжитесь со мной:",
    clientFooter: "Сертифицированный консультант по лактации IBCLC",
    clientDisclaimer:
      "Это автоматическое подтверждение. Пожалуйста, не отвечайте на это сообщение.",
  },
};

function getClientEmailHTML(data: ContactFormData, lang: string = "en") {
  const t = emailTemplates[lang] || emailTemplates.en;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ec4899 0%, #f97316 100%); color: white; padding: 40px; border-radius: 10px 10px 0 0; text-align: center; }
          .content { background: #ffffff; padding: 40px; border: 1px solid #e5e7eb; border-top: none; }
          .message-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .cta-button { display: inline-block; background: linear-gradient(135deg, #ec4899 0%, #f97316 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
          .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
          .social-icons { margin: 20px 0; }
          ul { padding-left: 20px; }
          li { margin-bottom: 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💌 ${t.clientTitle}</h1>
          </div>
          <div class="content">
            <p>${t.clientGreeting} <strong>${data.name}</strong>,</p>
            
            <p>${t.clientThankYou} "<strong>${data.subject}</strong>".</p>
            
            <div class="message-box">
              ${t.clientResponseBox}
            </div>
            
            <p><strong>${t.clientNextSteps}</strong></p>
            <ul>
              ${t.clientSteps.map((step) => `<li>${step}</li>`).join("")}
            </ul>
            
            <p>${t.clientInvite}</p>
            
            <center>
              <a href="https://yourwebsite.com" class="cta-button">${
                t.clientCTA
              }</a>
            </center>
            
            <div class="social-icons">
              <p><strong>${t.clientConnect}</strong></p>
              <p>
                <a href="https://facebook.com">Facebook</a> |
                <a href="https://instagram.com">Instagram</a> |
                <a href="https://wa.me/40123456789">WhatsApp</a>
              </p>
            </div>
            
            <div class="footer">
              <p><strong>Marina Cociug</strong> - ${t.clientFooter}</p>
              <p>📧 ${ADMIN_EMAIL} | 📞 +40 123 456 789</p>
              <p style="margin-top: 15px; color: #9ca3af;">
                ${t.clientDisclaimer}
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

function getAdminEmailHTML(data: ContactFormData) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ec4899 0%, #f97316 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .field { margin-bottom: 20px; }
          .label { font-weight: bold; color: #ec4899; display: block; margin-bottom: 5px; }
          .value { background: white; padding: 10px; border-radius: 5px; border-left: 3px solid #ec4899; }
          .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 New Contact Message</h1>
          </div>
          <div class="content">
            <div class="field">
              <span class="label">👤 Name:</span>
              <div class="value">${data.name}</div>
            </div>
            
            <div class="field">
              <span class="label">📧 Email:</span>
              <div class="value"><a href="mailto:${data.email}">${
    data.email
  }</a></div>
            </div>
            
            ${
              data.phone
                ? `
            <div class="field">
              <span class="label">📞 Phone:</span>
              <div class="value"><a href="tel:${data.phone}">${data.phone}</a></div>
            </div>
            `
                : ""
            }
            
            ${
              data.language
                ? `
            <div class="field">
              <span class="label">🌍 Language:</span>
              <div class="value">${data.language.toUpperCase()}</div>
            </div>
            `
                : ""
            }
            
            <div class="field">
              <span class="label">📝 Subject:</span>
              <div class="value">${data.subject}</div>
            </div>
            
            <div class="field">
              <span class="label">💬 Message:</span>
              <div class="value">${data.message.replace(/\n/g, "<br>")}</div>
            </div>
          </div>
          <div class="footer">
            <p>This email was sent from your website contact form</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const formData: ContactFormData = await req.json();
    const { name, email, phone, subject, message, language = "en" } = formData;

    // Validare
    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: "All required fields must be filled" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 1. Email către Marina (notificare)
    const adminEmailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Marina's Website <contact@marina-cociug.com>",
        to: [ADMIN_EMAIL],
        subject: `📩 New Contact Message: ${subject}`,
        html: getAdminEmailHTML(formData),
      }),
    });

    if (!adminEmailResponse.ok) {
      const error = await adminEmailResponse.text();
      console.error("Admin email error:", error);
      throw new Error("Failed to send admin notification");
    }

    // 2. Email către client (confirmare în limba lor)
    const t = emailTemplates[language] || emailTemplates.en;

    const clientEmailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Marina Cociug <noreply@marina-cociug.com>",
        to: [email],
        subject: t.clientSubject,
        html: getClientEmailHTML(formData, language),
      }),
    });

    if (!clientEmailResponse.ok) {
      const error = await clientEmailResponse.text();
      console.error("Client email error:", error);
      throw new Error("Failed to send client confirmation");
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Emails sent successfully",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error sending emails:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to send emails",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
