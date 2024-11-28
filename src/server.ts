import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/db";
import { corsConfig } from "./config/cors";
import TicketsRoutes from "./routes/ticketsRoutes";
import AuthRoutes from "./routes/authRoutes";
import AffiliatesRoutes from "./routes/affiliatesRoutes";
import TopUpRequestsRoutes from "./routes/topUpRequestsRoutes";
import ProfileRoutes from "./routes/profileRoutes";

dotenv.config();

connectDB();

const app = express();

app.use(cors(corsConfig));

// Log requests to console
app.use(morgan("dev"));

// Read data from body
app.use(express.json());

//Routes
app.use("/api/tickets", TicketsRoutes);
app.use("/api/auth", AuthRoutes);
app.use("/api/affiliates", AffiliatesRoutes);
app.use("/api/topUpRequests", TopUpRequestsRoutes);
app.use("/api/profile", ProfileRoutes);

export default app;
