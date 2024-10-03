import express from 'express';
import dotenv from 'dotenv';
import assetRoutes from './routes/assetRoutes';

dotenv.config();
const app = express();
app.use(express.json());

app.use('/api/asset', assetRoutes);

const PORT = process.env.PORT ||3002;
app.listen(PORT, ()=>console.log(`asset service is running on ${PORT}`))
