import jwt from "jsonwebtoken";
import { UserPayload } from "../types/Managers";

export const generateJWT = (payload: UserPayload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    return token;
};
