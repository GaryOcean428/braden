
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  serviceType?: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData: ContactEmailRequest = await req.json();
    const { name, email, phone, company, serviceType, message } = formData;

    console.log("Received contact form submission:", { name, email, serviceType });

    // Send confirmation email to the user
    const userEmailResponse = await resend.emails.send({
      from: "Braden Group <no-reply@coms.braden.com.au>",
      to: [email],
      subject: "Thank you for contacting Braden Group",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ab233a;">Thank you for contacting Braden Group</h2>
          <p>Dear ${name},</p>
          <p>We have received your enquiry and will get back to you as soon as possible.</p>
          <p>Your message details:</p>
          <ul>
            ${phone ? `<li>Phone: ${phone}</li>` : ''}
            ${company ? `<li>Company: ${company}</li>` : ''}
            ${serviceType ? `<li>Service Interest: ${serviceType}</li>` : ''}
            <li>Message: ${message}</li>
          </ul>
          <p>Best regards,<br>The Braden Group Team</p>
        </div>
      `,
    });

    // Send notification email to staff
    const staffEmailResponse = await resend.emails.send({
      from: "Braden Group Website <notifications@coms.braden.com.au>",
      to: ["braden.lang@bradengroup.com.au"],
      subject: "New Contact Form Submission",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ab233a;">New Contact Form Submission</h2>
          <h3>Contact Details:</h3>
          <ul>
            <li>Name: ${name}</li>
            <li>Email: ${email}</li>
            ${phone ? `<li>Phone: ${phone}</li>` : ''}
            ${company ? `<li>Company: ${company}</li>` : ''}
            ${serviceType ? `<li>Service Interest: ${serviceType}</li>` : ''}
          </ul>
          <h3>Message:</h3>
          <p>${message}</p>
        </div>
      `,
    });

    console.log("Confirmation email sent:", userEmailResponse);
    console.log("Staff notification email sent:", staffEmailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-confirmation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
