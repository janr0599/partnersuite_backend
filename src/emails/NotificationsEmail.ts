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

// Type and Email Notification Logic (same as before)
type NotificationEmailProps = {
    email: string;
    name: string;
    affiliateName?: string;
    role?: string;
    topUpRequestStatus?: string;
    ticketId?: string;
};

// Function to send notification emails
export class NotificationEmail {
    static affiliateAccountCreatedEmail = async (
        data: NotificationEmailProps
    ) => {
        try {
            const sendSmtpEmail = new brevo.SendSmtpEmail();
            sendSmtpEmail.subject = "PartnerSuite Notification";
            sendSmtpEmail.htmlContent = `<h2>Account Created</h2> <p>Hi, ${data.name}.</p> <p>A new PartnerSuite account has been created for you.</p> <strong> <a href="${process.env.FRONTEND_URL}/auth/login-affiliate">Login here</a> </strong> <br /> <p>Cheers,</p> <p>PartnerSuite Team</p>`;
            sendSmtpEmail.to = [{ email: data.email, name: data.name }];
            sendSmtpEmail.sender = {
                email: "partnersuiteapp@gmail.com",
                name: "PartnerSuite App",
            };

            const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
        } catch (error) {
            console.error(colors.red("Error sending email:"), error);
        }
    };

    static newCommentEmail = async (data: NotificationEmailProps) => {
        if (data.role === "Manager") {
            try {
                const sendSmtpEmail = new brevo.SendSmtpEmail();
                sendSmtpEmail.subject = "PartnerSuite Notification";
                sendSmtpEmail.htmlContent = `<p>Hi, ${data.name}.</p> <p>
                        Your manager has added a new comment to your ticket.
                </p> <strong> <a href="${process.env.FRONTEND_URL}/tickets?viewTicket=${data.ticketId}">Click here to view the comment</a> </strong> </br> <p>Cheers,</p> <p>PartnerSuite Team</p>`;
                sendSmtpEmail.to = [{ email: data.email, name: data.name }];
                sendSmtpEmail.sender = {
                    email: "partnersuiteapp@gmail.com",
                    name: "PartnerSuite App",
                };

                const response = await apiInstance.sendTransacEmail(
                    sendSmtpEmail
                );
            } catch (error) {
                console.error(colors.red("Error sending email:"), error);
            }
        } else {
            return;
        }
    };

    static topUpRequestUpdatedEmail = async (data: NotificationEmailProps) => {
        try {
            const sendSmtpEmail = new brevo.SendSmtpEmail();
            sendSmtpEmail.subject = "PartnerSuite Notification";
            sendSmtpEmail.htmlContent = `<h2>Top-up request updated</h2> <p>Hi, ${data.name}.</p> <p>Your top-up request has been ${data.topUpRequestStatus}.</p> <strong> <a href="${process.env.FRONTEND_URL}/top-up-requests">View your top-up requests</a> </strong> <br /> <p>Cheers,</p> <p>PartnerSuite Team</p>`;
            sendSmtpEmail.to = [{ email: data.email, name: data.name }];
            sendSmtpEmail.sender = {
                email: "partnersuiteapp@gmail.com",
                name: "PartnerSuite App",
            };

            const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
        } catch (error) {
            console.error(colors.red("Error sending email:"), error);
        }
    };
}
