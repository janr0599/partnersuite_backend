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
            console.log(colors.green("Sending email..."));

            // Create the email object as specified
            const sendSmtpEmail = new brevo.SendSmtpEmail();

            sendSmtpEmail.subject = "PartnerSuite Notification";
            sendSmtpEmail.htmlContent = `<h2>Account Created</h2> <p>Hi, ${data.name}.</p> <p>A new PartnerSuite account has been created for you.</p> <strong> <a href="${process.env.FRONTEND_URL}/auth/login-affiliate">Login here</a> </strong> <br /> <p>Cheers,</p> <p>PartnerSuite Team</p>`;
            sendSmtpEmail.to = [{ email: data.email, name: data.name }];
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

    static newCommentEmail = async (data: NotificationEmailProps) => {
        try {
            console.log(colors.green("Sending email..."));

            // Create the email object as specified
            const sendSmtpEmail = new brevo.SendSmtpEmail();

            sendSmtpEmail.subject = "PartnerSuite Notification";
            sendSmtpEmail.htmlContent = `<h2>New Comment</h2> <p>Hi, ${
                data.name
            }.</p> <p>${
                data.role === "Affiliate"
                    ? ` ${data.affiliateName} has added a comment to their ticket`
                    : `Your manager has added a new comment to your ticket.`
            }</p> <strong> <a href="${
                process.env.FRONTEND_URL
            }/tickets?viewTicket=${
                data.ticketId
            }">Click here to view the comment</a> </strong> </br> <p>Cheers,</p> <p>PartnerSuite Team</p>`;
            sendSmtpEmail.to = [{ email: data.email, name: data.name }];
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

    static topUpRequestUpdatedEmail = async (data: NotificationEmailProps) => {
        try {
            console.log(colors.green("Sending email..."));

            // Create the email object as specified
            const sendSmtpEmail = new brevo.SendSmtpEmail();

            sendSmtpEmail.subject = "PartnerSuite Notification";
            sendSmtpEmail.htmlContent = `<h2>Top-up request updated</h2> <p>Hi, ${data.name}.</p> <p>Your top-up request has been ${data.topUpRequestStatus}.</p> <strong> <a href="${process.env.FRONTEND_URL}/top-up-requests">View your top-up requests</a> </strong> <br /> <p>Cheers,</p> <p>PartnerSuite Team</p>`;
            sendSmtpEmail.to = [{ email: data.email, name: data.name }];
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
}
