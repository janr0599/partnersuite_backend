import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { connectDB } from "./config.ts/db";
import ticketsRoutes from "./routes/ticketsRoutes";

dotenv.config();

connectDB();

const app = express();

// Log requests to console
app.use(morgan("dev"));

// Read data from body
app.use(express.json());

//Routes
app.use("/api/tickets", ticketsRoutes);

export default app;
