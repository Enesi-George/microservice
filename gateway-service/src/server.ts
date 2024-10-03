import express from 'express';
import { Request, Response, NextFunction } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:3001';
const assetServiceUrl = process.env.ASSET_SERVICE_URL || 'http://localhost:3002';

app.use('/api/users', createProxyMiddleware({
    target:userServiceUrl,
    changeOrigin: true,
    pathRewrite:{
        '^/api/users': '/api/users', 
    }
}))

app.use('/api/assets', createProxyMiddleware({
    target: assetServiceUrl,
    changeOrigin: true,
    pathRewrite: {
        '^/api/assets': '/api/assets', 
    },
  }));

app.get('/heath', (req:Request, res:Response, next:NextFunction)=>{
    res.status(200).json({"message":"Gateway service route is running"});
})

//check for error
app.use((err:any, req:Request, res:Response, next:NextFunction)=>{
    console.error(err.stack);
    res.status(500).send('something went wrong! check the middlewear');
})

app.listen(PORT, () => {
    console.log(`Gateway service is running on port ${PORT}`);
    console.log(`User Service URL: ${userServiceUrl}`);
    console.log(`Asset Service URL: ${assetServiceUrl}`);
  });
