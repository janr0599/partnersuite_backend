import cron from "node-cron";
import Affiliate from "../models/Affiliate";
import { NotificationEmail } from "../emails/NotificationsEmail";
import { ManagerType } from "../types/Managers";

// Schedule a job to run at midnight every day
cron.schedule("0 0 * * *", async () => {
    try {
        const twoWeeksAgoStart = new Date();
        twoWeeksAgoStart.setDate(twoWeeksAgoStart.getDate() - 14);
        twoWeeksAgoStart.setHours(0, 0, 0, 0);

        const twoWeeksAgoEnd = new Date();
        twoWeeksAgoEnd.setDate(twoWeeksAgoEnd.getDate() - 14);
        twoWeeksAgoEnd.setHours(23, 59, 59, 999);

        console.log(
            "Looking for affiliates created between:",
            twoWeeksAgoStart,
            "and",
            twoWeeksAgoEnd
        );

        const affiliates = await Affiliate.find({
            createdAt: { $gte: twoWeeksAgoStart, $lte: twoWeeksAgoEnd },
        }).populate({ path: "manager", select: "email name" });

        console.log("Affiliates found:", affiliates);

        for (const affiliate of affiliates) {
            const manager = affiliate.manager as ManagerType;
            if (manager?.email && manager?.name) {
                try {
                    await NotificationEmail.sendTrialEndEmail({
                        email: manager.email,
                        affiliateName: affiliate.name,
                        name: manager.name,
                    });
                    console.log(
                        `Email sent to ${manager.email} for affiliate ${affiliate.name}`
                    );
                } catch (emailError) {
                    console.error(
                        `Failed to send email for ${affiliate.name}:`,
                        emailError
                    );
                }
            } else {
                console.warn(
                    `Manager details missing for affiliate ${affiliate.name}`
                );
            }
        }

        console.log("Trial end emails sent successfully.");
    } catch (error) {
        console.error("Error sending trial end emails:", error);
    }
});
