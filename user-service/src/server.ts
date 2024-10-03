import express from "express";
import dotenv from "dotenv";
import userRoutes from './routes/userRoutes'

dotenv.config();

const app = express();
app.use(express.json());


// Check for JWT_SECRET in the environment variables
if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined. Please set it in the .env file.");
  }

app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, ()=>console.log(`user service is running on port ${PORT}`))

