import * as brevo from "@getbrevo/brevo";
import colors from "colors";
import dotenv from "dotenv";

dotenv.config();

// Verify that the environment variable is set
if (!process.env.TRANSACTIONAL_EMAILS_API_KEY) {
    console.error(colors.red("TRANSACTIONAL_EMAILS_API_KEY is not set"));
    process.exit(1);
}

const apiInstance = new brevo.TransactionalEmailsApi();

// Set the API key
apiInstance.setApiKey(
    brevo.TransactionalEmailsApiApiKeys.apiKey,
    process.env.TRANSACTIONAL_EMAILS_API_KEY!
);

// Function to send notification email
export const sendNotificationEmail = async () => {
    try {
        console.log(colors.green("Sending email..."));

        // Create the email object as specified
        const sendSmtpEmail = new brevo.SendSmtpEmail();

        sendSmtpEmail.subject = "PartnerSuite Notification";
        sendSmtpEmail.htmlContent = `<h1>New Comment</h1> <p>A new comment has been added to your ticket</p> <>Ticket ID: </span>`;
        sendSmtpEmail.to = [
            { email: "javiernr0599@gmail.com", name: "Javier" },
        ];
        sendSmtpEmail.sender = {
            email: "partnersuiteapp@gmail.com",
            name: "PartnerSuite App",
        };

        // Send the email
        const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log(colors.green("Email sent successfully:"), response);
    } catch (error) {
        console.error(colors.red("Error sending email:"), error);
    }
};
