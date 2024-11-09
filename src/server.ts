import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/db";
import ticketsRoutes from "./routes/ticketsRoutes";
import { corsConfig } from "./config/cors";

dotenv.config();

connectDB();

const app = express();

app.use(cors(corsConfig));

// Log requests to console
app.use(morgan("dev"));

// Read data from body
app.use(express.json());

//Routes
app.use("/api/tickets", ticketsRoutes);

export default app;
