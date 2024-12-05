import * as brevo from "@getbrevo/brevo";
import colors from "colors";
import dotenv from "dotenv";

dotenv.config();

// Verify that the environment variable is set
if (!process.env.TRANSACTIONAL_EMAILS_API_KEY) {
    console.error(colors.red("TRANSACTIONAL_EMAILS_API_KEY is not set"));
    process.exit(1);
}

// Create an instance of ApiClient and set the API key
const apiClient = brevo.ApiClient.instance;
const apiKey = apiClient.authentications["api-key"];
apiKey.apiKey = process.env.TRANSACTIONAL_EMAILS_API_KEY!;

const apiInstance = new brevo.TransactionalEmailsApi();

type NotificationEmailProps = {
    email: string;
    name: string;
    token: string;
};

// Function to send notification emails
export const sendTokenEmail = async (data: NotificationEmailProps) => {
    try {
        // Create the email object as specified
        const sendSmtpEmail = new brevo.SendSmtpEmail();

        sendSmtpEmail.subject = "PartnerSuite Notification";
        sendSmtpEmail.htmlContent = `
                    <h2>Request to reset Password</h2>                 
                    <p>Hi ${data.name},</p>
                    <p>We received a request to reset your password. Click the link below and enter the confirmation token:</p>
                    <p><strong>Confirmation Token: ${data.token}</strong>
                    <p><a href="${process.env.FRONTEND_URL}/auth/new-password">Reset Password</a><p>
                    </p>If you didn’t request this action, you can safely ignore this email.</p>  </br> <p>Cheers,</p> <p>PartnerSuite Team</p>`;
        sendSmtpEmail.to = [{ email: data.email, name: data.name }];
        sendSmtpEmail.sender = {
            email: "partnersuiteapp@gmail.com",
            name: "PartnerSuite App",
        };

        // Send the email
        const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    } catch (error) {
        console.error(colors.red("Error sending email:"), error);
    }
};
