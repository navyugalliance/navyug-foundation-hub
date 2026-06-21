/**
 * NavYug Alliance Event Registration Google Apps Script Integration
 * 
 * Instructions:
 * 1. Open the Google Sheet where you want to store responses.
 * 2. Click "Extensions" > "Apps Script".
 * 3. Delete any code in the editor and paste this code.
 * 4. Replace the LOGO_URL below with your public logo URL (optional).
 * 5. Click "Deploy" > "New Deployment".
 * 6. Select "Web App" as the deployment type:
 *    - Execute as: "Me" (your Google account)
 *    - Who has access: "Anyone" (allows public API posts from the website)
 * 7. Click Deploy, authorize permissions, and copy the resulting Web App URL.
 * 8. Paste this URL in the "Form Submit URL" field of the event editor on the website.
 */

const LOGO_URL = "https://raw.githubusercontent.com/navyugalliance/navyug-foundation-hub/main/logo.png"; // Replace with your live public logo URL if different

function flattenAnswers(answers) {
  const flat = {};
  for (const key in answers) {
    if (Object.prototype.hasOwnProperty.call(answers, key)) {
      const value = answers[key];
      if (key === "players" && Array.isArray(value)) {
        value.forEach((player, idx) => {
          const pNum = player.number || (idx + 1);
          flat["Player " + pNum + " Full Name"] = player.fullName || "";
          flat["Player " + pNum + " Age"] = player.age || "";
          flat["Player " + pNum + " Mobile Number"] = player.mobileNumber || "";
          flat["Player " + pNum + " Playing Role"] = player.playingRole || "";
          flat["Player " + pNum + " Email"] = player.mail || "";
          flat["Player " + pNum + " Mark as Substitute"] = player.isSubstitute || "";
        });
      } else {
        flat[key] = value;
      }
    }
  }
  return flat;
}

function doPost(e) {
  try {
    let data;
    if (e.postData.type === "application/json") {
      data = JSON.parse(e.postData.contents);
    } else {
      data = e.parameter;
    }

    const eventId = data.eventId;
    const eventTitle = data.eventTitle;
    const answers = data.answers;

    // 0.5 Handle Aadhaar File Upload in Google Apps Script if present
    if (answers.aadhaarFile && typeof answers.aadhaarFile === "object" && answers.aadhaarFile.data) {
      try {
        const fileObj = answers.aadhaarFile;
        let folder;
        const folders = DriveApp.getFoldersByName("navyug cricket carnival");
        if (folders.hasNext()) {
          folder = folders.next();
        } else {
          folder = DriveApp.createFolder("navyug cricket carnival");
        }

        // Decode base64 data
        const parts = fileObj.data.split(",");
        const base64Data = parts[1] || parts[0];
        const bytes = Utilities.base64Decode(base64Data);
        const blob = Utilities.newBlob(bytes, fileObj.type, fileObj.name);

        // Sanitize team name
        const teamName = answers.teamName || "Unknown_Team";
        const teamNameSanitized = teamName.replace(/[^a-zA-Z0-9_-]/g, "_");
        const dotIdx = fileObj.name.lastIndexOf(".");
        const ext = dotIdx !== -1 ? fileObj.name.substring(dotIdx) : "";
        const fileName = teamNameSanitized + "_Aadhaar_Cards" + ext;
        blob.setName(fileName);

        // Save file to folder
        const file = folder.createFile(blob);
        // Set permissions: Anyone with the link can view
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

        // Store the sharing link
        answers.aadhaarFile = file.getUrl();
      } catch (uploadErr) {
        console.error("Drive upload failed in Apps Script:", uploadErr);
        throw new Error("Failed to upload Aadhaar cards to Google Drive: " + uploadErr.toString());
      }
    }

    if (!eventId || !eventTitle || !answers) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: "Missing required fields (eventId, eventTitle, answers)"
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader("Access-Control-Allow-Origin", "*");
    }

    // 1. Find or create a brand new Spreadsheet document for this specific event in Google Drive
    const docName = "Registrations - " + eventTitle;
    let targetSpreadsheet;
    let isNewSpreadsheet = false;
    
    try {
      const files = DriveApp.getFilesByName(docName);
      if (files.hasNext()) {
        targetSpreadsheet = SpreadsheetApp.open(files.next());
      } else {
        targetSpreadsheet = SpreadsheetApp.create(docName);
        isNewSpreadsheet = true;
      }
    } catch (e) {
      // Fallback in case DriveApp is not authorized or fails: use active bound spreadsheet
      targetSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    }
    
    let targetSheet = targetSpreadsheet.getSheets()[0];
    const timestamp = Utilities.formatDate(new Date(), "GMT+5:30", "yyyy-MM-dd HH:mm:ss");
    const isCricket = eventId === "navyug-cricket-carnival-2026";
    let headers = [];
    let rowValues = [];

    if (isCricket) {
      headers = [
        "Timestamp",
        "Team Name",
        "Captain Name",
        "Captain Age",
        "Captain WhatsApp",
        "Captain Email",
        "Captain City",
        "Aadhaar File Link",
        "Captain Signature",
        "Agreement Accepted",
        "Registration Date"
      ];

      for (let i = 1; i <= 8; i++) {
        headers.push("Player " + i + " Full Name");
        headers.push("Player " + i + " Age");
        headers.push("Player " + i + " Mobile Number");
        headers.push("Player " + i + " Playing Role");
        headers.push("Player " + i + " Email");
        headers.push("Player " + i + " Mark as Substitute");
      }

      const getPlayerVal = function(idx, field) {
        const pArr = answers.players || [];
        const p = pArr[idx] || {};
        if (field === "fullName") return p.fullName || "";
        if (field === "age") return p.age || "";
        if (field === "mobileNumber") return p.mobileNumber || "";
        if (field === "playingRole") return p.playingRole || "";
        if (field === "mail") return p.mail || "";
        if (field === "isSubstitute") return p.isSubstitute || "";
        return "";
      };

      rowValues = [
        timestamp,
        answers.teamName || "",
        answers.captainName || "",
        answers.captainAge !== undefined && answers.captainAge !== null ? String(answers.captainAge) : "",
        answers.captainWhatsApp || "",
        answers.captainEmail || "",
        answers.captainCity || "",
        answers.aadhaarFile || "",
        answers.captainSignature || "",
        answers.agreement || "",
        answers.registrationDate || ""
      ];

      for (let i = 0; i < 8; i++) {
        rowValues.push(getPlayerVal(i, "fullName"));
        rowValues.push(getPlayerVal(i, "age"));
        rowValues.push(getPlayerVal(i, "mobileNumber"));
        rowValues.push(getPlayerVal(i, "playingRole"));
        rowValues.push(getPlayerVal(i, "mail"));
        rowValues.push(getPlayerVal(i, "isSubstitute"));
      }
    } else {
      const flatAnswers = flattenAnswers(answers);
      const keys = Object.keys(flatAnswers);
      headers = ["Timestamp", ...keys];
      rowValues = [timestamp];
      keys.forEach(key => {
        const val = flatAnswers[key];
        if (Array.isArray(val)) {
          rowValues.push(val.join(", "));
        } else {
          rowValues.push(val !== undefined && val !== null ? String(val) : "");
        }
      });
    }

    if (isNewSpreadsheet) {
      // Setup headers
      targetSheet.appendRow(headers);
      // Freeze header row and make it bold with Navy color
      targetSheet.setFrozenRows(1);
      targetSheet.getRange(1, 1, 1, headers.length)
        .setFontWeight("bold")
        .setBackground("#0B2D55")
        .setFontColor("#FFFDF6")
        .setHorizontalAlignment("center");
    }

    // 2. Add registration row values
    targetSheet.appendRow(rowValues);
    targetSheet.autoResizeColumns(1, headers.length);

    // 3. Send email to the registrant
    const emailAddress = answers.captainEmail || answers.email || answers.Email || answers.EmailAddress;
    const fullName = answers.captainName || answers.fullName || answers.Name || answers.name || answers.FullName || "Participant";

    // Extract player emails for BCC (except captain's email to prevent duplicate)
    const bccEmails = [];
    if (Array.isArray(answers.players)) {
      answers.players.forEach(p => {
        if (p.mail && typeof p.mail === "string") {
          const email = p.mail.trim();
          if (email && email.toLowerCase() !== (emailAddress || "").toLowerCase() && bccEmails.indexOf(email) === -1) {
            bccEmails.push(email);
          }
        }
      });
    }

    if (emailAddress) {
      // Build HTML table for registration answers
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
          value.forEach(player => {
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
          const displayLabel = key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, str => str.toUpperCase());
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
                  
                  <!-- Header -->
                  <tr>
                    <td align="center" style="background-color: #0B2D55; padding: 30px 20px; border-bottom: 3px solid #D4A64A;">
                      <img src="${LOGO_URL}" alt="NavYug Alliance Logo" width="100" style="display: block; margin-bottom: 15px; max-width: 120px;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
                      <h2 style="display: none; color: #F8F5EE; font-family: Georgia, serif; margin: 0; letter-spacing: 2px;">NAVYUG ALLIANCE</h2>
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

                  <!-- Details Table -->
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

                  <!-- Footer Text -->
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

      const mailOptions = {
        to: emailAddress,
        subject: `Registration Confirmed: ${eventTitle} — NavYug Alliance`,
        htmlBody: emailHtml
      };

      if (bccEmails.length > 0) {
        mailOptions.bcc = bccEmails.join(",");
      }

      MailApp.sendEmail(mailOptions);
    }

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: "Registration recorded and confirmation email sent!"
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*");

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: err.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*");
  }
}

// Enable CORS preflight response
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type");
}
