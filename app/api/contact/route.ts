import { Resend } from "resend";
import { NextResponse } from "next/server";
import { contactSchema } from "@/components/footer/form/schemas/contact-schema";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid form data.",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { name, email, message } = parsed.data;

    const toEmails = (
      process.env.CONTACT_TO_EMAIL || "david.dev7279@outlook.com"
    )
      .split(",")
      .map((email) => email.trim())
      .filter(Boolean);

    const { data, error } = await resend.emails.send({
      from:
        process.env.CONTACT_FROM_EMAIL ||
        "Contact Form <onboarding@resend.dev>",
      to: toEmails,
      replyTo: email,
      subject: `New message from ${name}`,
      text: [`Name: ${name}`, `Email: ${email}`, "", "Message:", message].join(
        "\n",
      ),
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          </head>
          <body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#f4f4f5;padding:40px 16px;">
              <tr>
                <td align="center">
                  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:520px;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
                    
                    <!-- Header -->
                    <tr>
                      <td style="padding:32px 32px 24px;border-bottom:1px solid #f0f0f0;">
                        <p style="margin:0;font-size:11px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:#71717a;">
                          New Contact Message
                        </p>
                        <h1 style="margin:8px 0 0;font-size:22px;font-weight:600;letter-spacing:-0.03em;color:#09090b;line-height:1.3;">
                          ${name}
                        </h1>
                      </td>
                    </tr>
        
                    <!-- Content -->
                    <tr>
                      <td style="padding:28px 32px;">
                        
                        <!-- Email -->
                        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:24px;">
                          <tr>
                            <td>
                              <p style="margin:0 0 6px;font-size:11px;font-weight:500;letter-spacing:0.06em;text-transform:uppercase;color:#a1a1aa;">
                                Email
                              </p>
                              <a href="mailto:${email}" style="font-size:15px;color:#09090b;text-decoration:none;">
                                ${email}
                              </a>
                            </td>
                          </tr>
                        </table>
        
                        <!-- Message -->
                        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                          <tr>
                            <td>
                              <p style="margin:0 0 10px;font-size:11px;font-weight:500;letter-spacing:0.06em;text-transform:uppercase;color:#a1a1aa;">
                                Message
                              </p>
                              <div style="font-size:15px;line-height:1.65;color:#3f3f46;white-space:pre-wrap;">
                                ${message.replace(/\n/g, "<br />")}
                              </div>
                            </td>
                          </tr>
                        </table>
        
                      </td>
                    </tr>
        
                    <!-- Footer -->
                    <tr>
                      <td style="padding:20px 32px;background-color:#fafafa;border-top:1px solid #f0f0f0;">
                        <p style="margin:0;font-size:12px;color:#a1a1aa;line-height:1.5;">
                          You received this message from the contact form on your website.
                        </p>
                      </td>
                    </tr>
        
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
          `,
    });

    if (error) {
      console.error("Resend error:", JSON.stringify(error, null, 2));
      return NextResponse.json(
        {
          error: "Failed to send email.",
          details: error, // só em desenvolvimento
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "Email sent successfully", id: data?.id },
      { status: 200 },
    );
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
