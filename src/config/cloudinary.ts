import { v2 as cloudinary } from "cloudinary";
import colors from "colors";
import dotenv from "dotenv";

dotenv.config();

// Verify that the environment variables are set
if (!process.env.CLOUDINARY_CLOUD_NAME) {
    console.error(colors.red("CLOUDINARY_CLOUD_NAME is not set"));
    process.exit(1);
}

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
