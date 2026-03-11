import nodemailer from "nodemailer";

interface QuestionnaireRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  songFor: string;
  relationship: string;
  musicPreferences: string;
  fiveThings: string;
  insideJokes: string;
  existingSongs: string;
  threeThings: string;
  keyMessage: string;
  wordsToliveBy: string;
  productionDate: string;
}

const guestEmailTemplate = (firstName: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #111827;
      background-color: #f9fafb;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: white;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      color: white;
      padding: 2rem;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 1.875rem;
      font-weight: 700;
    }
    .content {
      padding: 2rem;
    }
    .greeting {
      font-size: 1.25rem;
      margin-bottom: 1.5rem;
      color: #111827;
    }
    .footer-text {
      color: #6b7280;
      font-size: 0.875rem;
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e5e7eb;
    }
    .signature {
      color: #111827;
      margin-top: 1.5rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Custom Song Questionnaire Received</h1>
    </div>
    <div class="content">
      <div class="greeting">Hi ${firstName},</div>

      <p>Thank you for completing the Custom Song Questionnaire! I've received all of your answers and will start working on creating your custom song right away.</p>

      <p>I'll be reviewing your responses to understand the song subject, your relationship, their musical preferences, and all the special details you've shared. This information will help me craft a personalized song that truly captures what you wanted to express.</p>

      <p>I'll get back to you shortly with updates on the production timeline and next steps.</p>

      <div class="signature">
        <p>Best regards,<br>
        <strong>Ernie Halter</strong><br>
        <em>Musician & Performer</em></p>
      </div>

      <div class="footer-text">
        <p>If you need to provide any additional information or have questions, feel free to reply to this email or contact me directly.</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

const ernieEmailTemplate = (
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  songFor: string,
  relationship: string,
  musicPreferences: string,
  fiveThings: string,
  insideJokes: string,
  existingSongs: string,
  threeThings: string,
  keyMessage: string,
  wordsToliveBy: string,
  productionDate: string
) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #111827;
      background-color: #f9fafb;
    }
    .container {
      max-width: 700px;
      margin: 0 auto;
      background-color: white;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      color: white;
      padding: 2rem;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 1.875rem;
      font-weight: 700;
    }
    .content {
      padding: 2rem;
    }
    .section-title {
      font-size: 1rem;
      font-weight: 700;
      color: #111827;
      margin-top: 1.5rem;
      margin-bottom: 0.75rem;
      border-bottom: 2px solid #4f46e5;
      padding-bottom: 0.5rem;
    }
    .details-box {
      background-color: #f9fafb;
      border-left: 4px solid #4f46e5;
      padding: 1.25rem;
      margin: 1rem 0;
      border-radius: 0.375rem;
    }
    .detail-row {
      padding: 0.5rem 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .detail-row:last-child {
      border-bottom: none;
    }
    .detail-label {
      font-weight: 600;
      color: #374151;
    }
    .detail-value {
      color: #111827;
      word-break: break-word;
      margin-top: 0.25rem;
      padding-left: 1rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Song Questionnaire Submitted</h1>
    </div>
    <div class="content">
      <p><strong>New custom song questionnaire received! Here are the details:</strong></p>

      <div class="section-title">Client Information</div>
      <div class="details-box">
        <div class="detail-row">
          <div class="detail-label">Name:</div>
          <div class="detail-value">${firstName} ${lastName}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Email:</div>
          <div class="detail-value">${email}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Phone:</div>
          <div class="detail-value">${phone}</div>
        </div>
      </div>

      <div class="section-title">Song Subject & Relationship</div>
      <div class="details-box">
        <div class="detail-row">
          <div class="detail-label">Who will the song be written for?</div>
          <div class="detail-value">${songFor || 'Not provided'}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Relationship:</div>
          <div class="detail-value">${relationship || 'Not provided'}</div>
        </div>
      </div>

      <div class="section-title">Musical Preferences & Stories</div>
      <div class="details-box">
        <div class="detail-row">
          <div class="detail-label">Music they listen to:</div>
          <div class="detail-value">${musicPreferences || 'Not provided'}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">5 Things they love:</div>
          <div class="detail-value">${fiveThings || 'Not provided'}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Inside jokes/nicknames:</div>
          <div class="detail-value">${insideJokes || 'Not provided'}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Songs already written about them:</div>
          <div class="detail-value">${existingSongs || 'Not provided'}</div>
        </div>
      </div>

      <div class="section-title">Key Message & Values</div>
      <div class="details-box">
        <div class="detail-row">
          <div class="detail-label">3 Things they couldn't live without:</div>
          <div class="detail-value">${threeThings || 'Not provided'}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">One thing song needs to say:</div>
          <div class="detail-value">${keyMessage || 'Not provided'}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Words to live by:</div>
          <div class="detail-value">${wordsToliveBy || 'Not provided'}</div>
        </div>
      </div>

      ${productionDate ? `
      <div class="section-title">Production Timeline</div>
      <div class="details-box">
        <div class="detail-row">
          <div class="detail-label">Scheduled Production Date:</div>
          <div class="detail-value">${productionDate}</div>
        </div>
      </div>
      ` : ''}
    </div>
  </div>
</body>
</html>
`;

export const handler = async (event: any) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  try {
    const body: QuestionnaireRequest = JSON.parse(event.body);
    const {
      firstName,
      lastName,
      email,
      phone,
      songFor,
      relationship,
      musicPreferences,
      fiveThings,
      insideJokes,
      existingSongs,
      threeThings,
      keyMessage,
      wordsToliveBy,
      productionDate
    } = body;

    console.log("--- New Song Questionnaire Received ---");
    console.log(`Name: ${firstName} ${lastName}`);
    console.log(`Email: ${email}`);
    console.log(`Phone: ${phone}`);
    console.log(`Song For: ${songFor}`);
    console.log(`Relationship: ${relationship}`);
    console.log("------------------------------------");

    const smtpUrl = process.env.SMTP_URL;
    if (smtpUrl) {
      // Parse SMTP URL to handle URL-encoded passwords correctly
      const url = new URL(smtpUrl);
      const transporter = nodemailer.createTransport({
        host: url.hostname,
        port: parseInt(url.port),
        secure: url.protocol === 'smtps:',
        auth: {
          user: decodeURIComponent(url.username),
          pass: decodeURIComponent(url.password)
        }
      });

      // Send confirmation email to the guest
      await transporter.sendMail({
        from: '"Ernie Halter Music" <erniehalter@gmail.com>',
        to: email,
        subject: `Custom Song Questionnaire Received`,
        html: guestEmailTemplate(firstName),
        replyTo: "erniehalter@gmail.com"
      });

      // Send questionnaire details email to Ernie
      await transporter.sendMail({
        from: '"Questionnaire System" <erniehalter@gmail.com>',
        to: "erniehalter@gmail.com",
        replyTo: email,
        subject: `New Song Questionnaire from ${firstName} ${lastName}`,
        html: ernieEmailTemplate(
          firstName,
          lastName,
          email,
          phone,
          songFor,
          relationship,
          musicPreferences,
          fiveThings,
          insideJokes,
          existingSongs,
          threeThings,
          keyMessage,
          wordsToliveBy,
          productionDate
        )
      });

      console.log("✅ Emails sent successfully to guest and Ernie");
    } else {
      console.log("⚠️  SMTP_URL not configured. Emails will not be sent.");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Email service not configured" })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Questionnaire submitted successfully" })
    };
  } catch (error) {
    console.error("Error processing questionnaire:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: "Failed to process questionnaire" })
    };
  }
};
