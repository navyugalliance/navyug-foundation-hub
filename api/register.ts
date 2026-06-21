import type { VercelRequest, VercelResponse } from "@vercel/node";
import { google } from "googleapis";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { Readable } from "stream";


function flattenAnswers(answers: Record<string, any>): Record<string, any> {
  const flat: Record<string, any> = {};
  for (const [key, value] of Object.entries(answers)) {
    if (key === "players" && Array.isArray(value)) {
      value.forEach((player: any, idx: number) => {
        const pNum = player.number || (idx + 1);
        flat[`Player ${pNum} Full Name`] = player.fullName || "";
        flat[`Player ${pNum} Age`] = player.age || "";
        flat[`Player ${pNum} Mobile Number`] = player.mobileNumber || "";
        flat[`Player ${pNum} Playing Role`] = player.playingRole || "";
        flat[`Player ${pNum} Email`] = player.mail || "";
        flat[`Player ${pNum} Mark as Substitute`] = player.isSubstitute || "";
      });
    } else {
      flat[key] = value;
    }
  }
  return flat;
}

// Support local development .env loading if dotenv is installed, or just read process.env
// Vercel serverless environment automatically populates process.env.
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const { eventId, eventTitle, answers } = req.body;

    if (!eventId || !eventTitle || !answers) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields (eventId, eventTitle, answers)",
      });
    }

    // 1. Resolve credentials
    let auth: any;
    const scopes = [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/drive.file",
      "https://www.googleapis.com/auth/gmail.send"
    ];

    if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
      const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
      auth = new google.auth.JWT(
        credentials.client_email,
        undefined,
        credentials.private_key,
        scopes
      );
    } else if (
      process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.GOOGLE_REFRESH_TOKEN
    ) {
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET
      );
      oauth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
      });
      auth = oauth2Client;
    } else {
      throw new Error(
        "No valid Google credentials configured. Please set GOOGLE_SERVICE_ACCOUNT_KEY or OAuth credentials."
      );
    }

    const drive = google.drive({ version: "v3", auth });
    const sheets = google.sheets({ version: "v4", auth });

    // 1.5 Handle Aadhaar File Upload if present
    if (answers.aadhaarFile && typeof answers.aadhaarFile === "object" && answers.aadhaarFile.data) {
      try {
        const fileObj = answers.aadhaarFile;
        // The data is a base64 data URL: e.g. "data:application/pdf;base64,..."
        const parts = fileObj.data.split(",");
        const base64Data = parts[1] || parts[0];
        const buffer = Buffer.from(base64Data, "base64");

        // Find or create "navyug cricket carnival" folder
        let folderId: string | null = null;
        try {
          const folderSearch = await drive.files.list({
            q: "mimeType='application/vnd.google-apps.folder' and name='navyug cricket carnival' and trashed=false",
            fields: "files(id, name)",
            spaces: "drive",
          });
          if (folderSearch.data.files && folderSearch.data.files.length > 0) {
            folderId = folderSearch.data.files[0].id || null;
          }
        } catch (searchErr) {
          console.warn("Folder search failed, will attempt to create folder:", searchErr);
        }

        if (!folderId) {
          const folderCreate = await drive.files.create({
            requestBody: {
              name: "navyug cricket carnival",
              mimeType: "application/vnd.google-apps.folder",
            },
            fields: "id",
          });
          folderId = folderCreate.data.id || null;
        }

        // Determine file name and upload
        const teamName = answers.teamName || "Unknown_Team";
        const teamNameSanitized = teamName.replace(/[^a-zA-Z0-9_-]/g, "_");
        const ext = path.extname(fileObj.name || "") || "";
        const fileName = `${teamNameSanitized}_Aadhaar_Cards${ext}`;

        const bufferStream = new Readable();
        bufferStream.push(buffer);
        bufferStream.push(null);

        const driveFile = await drive.files.create({
          requestBody: {
            name: fileName,
            parents: folderId ? [folderId] : [],
          },
          media: {
            mimeType: fileObj.type,
            body: bufferStream,
          },
          fields: "id, webViewLink",
        });

        const fileId = driveFile.data.id;
        const webViewLink = driveFile.data.webViewLink;

        if (fileId) {
          // Set sharing permission to public read
          await drive.permissions.create({
            fileId: fileId,
            requestBody: {
              role: "reader",
              type: "anyone",
            },
          });
        }

        // Overwrite the file object with the public webViewLink
        answers.aadhaarFile = webViewLink || "";
      } catch (uploadErr: any) {
        console.error("Google Drive Upload Error:", uploadErr);
        throw new Error(`Failed to upload Aadhaar cards file to Google Drive: ${uploadErr.message}`);
      }
    }

    // 2. Find or Create Spreadsheet for this specific event
    const fileName = `Registrations - ${eventTitle}`;
    let spreadsheetId: string | null = null;

    try {
      const listRes = await drive.files.list({
        q: `mimeType='application/vnd.google-apps.spreadsheet' and name='${fileName.replace(/'/g, "\\'")}' and trashed=false`,
        fields: "files(id, name)",
        spaces: "drive",
      });

      if (listRes.data.files && listRes.data.files.length > 0) {
        spreadsheetId = listRes.data.files[0].id || null;
      }
    } catch (err) {
      console.warn("Could not search Google Drive. Attempting direct creation...", err);
    }

    const flatAnswers = flattenAnswers(answers);
    const headers = ["Timestamp", ...Object.keys(flatAnswers)];
    let isNewSpreadsheet = false;

    if (!spreadsheetId) {
      // Create new spreadsheet file
      const createRes = await sheets.spreadsheets.create({
        requestBody: {
          properties: {
            title: fileName,
          },
        },
      });

      spreadsheetId = createRes.data.spreadsheetId || null;
      if (!spreadsheetId) {
        throw new Error("Failed to create a new spreadsheet file.");
      }
      isNewSpreadsheet = true;
    }

    // Default sheet name in a new spreadsheet is 'Sheet1'
    const sheetName = "Sheet1";

    if (isNewSpreadsheet) {
      // Write headers
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetName}!A1`,
        valueInputOption: "RAW",
        requestBody: {
          values: [headers],
        },
      });

      // Format header row (bold, Navy color)
      try {
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId,
          requestBody: {
            requests: [
              {
                repeatCell: {
                  range: {
                    sheetId: 0,
                    startRowIndex: 0,
                    endRowIndex: 1,
                    startColumnIndex: 0,
                    endColumnIndex: headers.length,
                  },
                  cell: {
                    userEnteredFormat: {
                      textFormat: {
                        bold: true,
                        foregroundColor: { red: 1.0, green: 1.0, blue: 1.0 },
                      },
                      backgroundColor: { red: 11 / 255, green: 45 / 255, blue: 85 / 255 }, // #0B2D55
                    },
                  },
                  fields: "userEnteredFormat(textFormat,backgroundColor)",
                },
              },
            ],
          },
        });
      } catch (err) {
        console.warn("Could not apply formatting to headers", err);
      }
    }

    // Prepare row values
    const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    const rowValues = [timestamp, ...Object.keys(flatAnswers).map((k) => {
      const val = flatAnswers[k];
      if (Array.isArray(val)) return val.join(", ");
      return val !== undefined && val !== null ? String(val) : "";
    })];

    // Append response row
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:A`,
      valueInputOption: "RAW",
      requestBody: {
        values: [rowValues],
      },
    });

    // 3. Send email to the registrant
    const emailAddress = answers.captainEmail || answers.email || answers.Email || answers.EmailAddress;
    const fullName = answers.captainName || answers.fullName || answers.Name || answers.name || answers.FullName || "Participant";

    // Extract player emails for BCC (except captain's email to prevent duplicate)
    const bccEmails: string[] = [];
    if (Array.isArray(answers.players)) {
      answers.players.forEach((p: any) => {
        if (p.mail && typeof p.mail === "string") {
          const email = p.mail.trim();
          if (email && email.toLowerCase() !== emailAddress?.toLowerCase() && !bccEmails.includes(email)) {
            bccEmails.push(email);
          }
        }
      });
    }

    if (emailAddress) {
      // Configure email transporter
      let transporter: nodemailer.Transporter;

      if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        // Custom SMTP
        transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 587),
          secure: process.env.SMTP_SECURE === "true",
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });
      } else if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
        // Gmail SMTP using app password
        transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
          },
        });
      } else if (
        process.env.GOOGLE_CLIENT_ID &&
        process.env.GOOGLE_CLIENT_SECRET &&
        process.env.GOOGLE_REFRESH_TOKEN &&
        (process.env.GMAIL_USER || process.env.GOOGLE_USER_EMAIL)
      ) {
        // OAuth 2.0 Gmail SMTP
        transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            type: "OAuth2",
            user: process.env.GMAIL_USER || process.env.GOOGLE_USER_EMAIL,
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
          },
        } as any);
      } else {
        console.warn("Mail configurations are missing. Skipping confirmation email.");
        return res.status(200).json({
          success: true,
          message: "Registered successfully! (Email not sent due to missing credentials)",
        });
      }

      // Check if local logo.png exists
      const logoPath = path.join(process.cwd(), "logo.png");
      const hasLogo = fs.existsSync(logoPath);
      const attachments = hasLogo
        ? [
            {
              filename: "logo.png",
              path: logoPath,
              cid: "navyug_logo", // same cid value as in the html img src
            },
          ]
        : [];

      // Construct dynamic form entries table
      let tableRowsHtml = "";
      for (const [key, value] of Object.entries(answers)) {
        if (key === "players" && Array.isArray(value)) {
          tableRowsHtml += `
            <tr>
              <td colspan="2" style="padding: 12px 10px; border-bottom: 1px solid #ECE9E2; font-weight: bold; color: #0B2D55; font-size: 14px; background-color: #F4ECE1; font-family: Georgia, serif;">
                Player Roster (7 Playing + 1 Substitute)
              </td>
            </tr>
          `;
          value.forEach((player: any) => {
            tableRowsHtml += `
              <tr>
                <td style="padding: 8px 10px; border-bottom: 1px solid #ECE9E2; font-weight: bold; color: #0B2D55; font-size: 13px; pl: 20px;">
                  Player #${player.number} ${player.isSubstitute === "Yes" ? '<span style="color:#D4A64A;">(Substitute)</span>' : ""}
                </td>
                <td style="padding: 8px 10px; border-bottom: 1px solid #ECE9E2; color: #4A4A4A; font-size: 13px; line-height: 1.4;">
                  <strong>Name:</strong> ${player.fullName}<br/>
                  <strong>Age:</strong> ${player.age}<br/>
                  <strong>Mobile:</strong> ${player.mobileNumber}<br/>
                  <strong>Role:</strong> ${player.playingRole}<br/>
                  <strong>Email:</strong> ${player.mail}
                </td>
              </tr>
            `;
          });
        } else {
          // Clean label names for UI display
          const displayLabel = key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase());
          const displayValue = Array.isArray(value) ? value.join(", ") : String(value);

          tableRowsHtml += `
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ECE9E2; font-weight: bold; color: #0B2D55; font-size: 14px;">${displayLabel}</td>
              <td style="padding: 10px; border-bottom: 1px solid #ECE9E2; color: #4A4A4A; font-size: 14px;">${displayValue}</td>
            </tr>
          `;
        }
      }

      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Registration Received — NavYug Alliance</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #F8F5EE; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F8F5EE; padding: 40px 10px;">
            <tr>
              <td align="center">
                <!-- Wrapper Card -->
                <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #FFFDF6; border: 1px solid #D4C3A3; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-radius: 4px; overflow: hidden;">
                  
                  <!-- Navy Blue Header -->
                  <tr>
                    <td align="center" style="background-color: #0B2D55; padding: 30px 20px; border-bottom: 3px solid #D4A64A;">
                      ${
                        hasLogo
                          ? '<img src="cid:navyug_logo" alt="NavYug Alliance Logo" width="100" style="display: block; margin-bottom: 15px; max-width: 120px;" />'
                          : '<h2 style="color: #F8F5EE; font-family: Georgia, serif; margin: 0; letter-spacing: 2px;">NAVYUG ALLIANCE</h2>'
                      }
                      <span style="color: #D4A64A; font-size: 11px; letter-spacing: 3px; font-weight: bold; text-transform: uppercase;">Every Victory Has a Story</span>
                    </td>
                  </tr>

                  <!-- Greeting Body -->
                  <tr>
                    <td style="padding: 40px 30px 20px 30px;">
                      <h1 style="font-family: Georgia, serif; color: #0B2D55; font-size: 24px; margin-top: 0; margin-bottom: 10px; text-align: center;">Registration Received!</h1>
                      <p style="color: #555555; font-size: 15px; line-height: 1.6; text-align: center; margin-bottom: 15px;">
                        Congratulations <strong>${fullName}</strong>, your team registration request for the <strong>${eventTitle}</strong> (scheduled for <strong>11th and 12th of July, 2026</strong>) has been successfully received.
                      </p>
                      
                      <!-- Decorative line -->
                      <div style="text-align: center; margin: 15px 0;">
                        <span style="display: inline-block; width: 50px; height: 1.5px; background-color: #D4A64A;"></span>
                      </div>
                    </td>
                  </tr>

                  <!-- Important Next Steps & WhatsApp Link -->
                  <tr>
                    <td style="padding: 0 30px 20px 30px;">
                      <div style="background-color: #FFFDEB; border: 1px solid #D4C3A3; border-radius: 4px; padding: 20px; text-align: center; box-shadow: 0 2px 5px rgba(0,0,0,0.02);">
                        <h4 style="color: #0B2D55; font-family: Georgia, serif; font-size: 15px; margin-top: 0; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px;">⚠️ Registration Status: Under Review</h4>
                        <p style="color: #4A4A4A; font-size: 14px; line-height: 1.5; margin: 0 0 15px 0;">
                          Please note: <strong>Registration does not guarantee your spot in the playing team.</strong> Slots are strictly limited and allocated on a first-come, first-served basis. The core committee will verify your details and contact you via email shortly. If approved, you will receive payment processing instructions to finalize and secure your team slot.
                        </p>
                        <div style="margin-top: 15px; border-top: 1px dashed #D4C3A3; padding-top: 15px;">
                          <p style="color: #0B2D55; font-size: 13px; font-weight: bold; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 0.5px;">📢 Join the Official WhatsApp Group</p>
                          <p style="color: #555555; font-size: 12px; margin: 0 0 12px 0;">Please join the group for all future match schedules, tournament updates, and communication:</p>
                          <a href="https://chat.whatsapp.com/DkanlL2if1d0VEtZfhiMWm" target="_blank" style="background-color: #25D366; color: #FFFFFF; text-decoration: none; padding: 10px 20px; font-weight: bold; font-size: 13px; border-radius: 4px; display: inline-block; box-shadow: 0 2px 4px rgba(37,211,102,0.3);">Join WhatsApp Group</a>
                        </div>
                      </div>
                    </td>
                  </tr>

                  <!-- Submission Details Table -->
                  <tr>
                    <td style="padding: 0 30px 30px 30px;">
                      <div style="background-color: #FDFCF9; border: 1px solid #EAE5D9; border-radius: 3px; padding: 20px;">
                        <h3 style="font-family: Georgia, serif; color: #0B2D55; font-size: 16px; margin-top: 0; margin-bottom: 15px; border-bottom: 1.5px solid #D4A64A; padding-bottom: 5px;">Your Registration Details</h3>
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
                          ${tableRowsHtml}
                        </table>
                      </div>
                    </td>
                  </tr>

                  <!-- Footer / Next Steps -->
                  <tr>
                    <td style="padding: 0 30px 40px 30px; text-align: center;">
                      <p style="color: #555555; font-size: 14px; line-height: 1.6; margin-bottom: 25px;">
                        Our core team is compiling the rosters and schedules. We will contact you shortly with match schedules, player kits, and guidelines.
                      </p>
                      <a href="https://instagram.com/navyugalliance" target="_blank" style="background-color: #D4A64A; color: #0B2D55; text-decoration: none; padding: 12px 25px; font-weight: bold; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; border-radius: 2px; display: inline-block; box-shadow: 0 2px 4px rgba(212,166,74,0.3);">Follow Us on Instagram</a>
                    </td>
                  </tr>

                  <!-- Bottom border/attribution -->
                  <tr>
                    <td style="background-color: #ECE9E2; padding: 15px 20px; text-align: center; font-size: 11px; color: #7A7A7A; border-top: 1px solid #DDD9CD;">
                      NavYug Alliance • Nandura, Maharashtra • Together We Rise
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;

      const mailOptions: any = {
        from: `"${eventTitle} - NavYug Alliance" <${process.env.GMAIL_USER || process.env.GOOGLE_USER_EMAIL || process.env.SMTP_USER}>`,
        to: emailAddress,
        subject: `Registration Confirmed: ${eventTitle} — NavYug Alliance`,
        html: emailHtml,
        attachments,
      };

      if (bccEmails.length > 0) {
        mailOptions.bcc = bccEmails;
      }

      await transporter.sendMail(mailOptions);
    }

    return res.status(200).json({
      success: true,
      message: "Registration recorded and email sent successfully!",
    });
  } catch (error: any) {
    console.error("Registration Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "An unexpected error occurred during registration",
    });
  }
}
