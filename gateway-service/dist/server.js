"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_proxy_middleware_1 = require("http-proxy-middleware");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
const userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:3001';
const assetServiceUrl = process.env.ASSET_SERVICE_URL || 'http://localhost:3002';
app.use('/api/users', (0, http_proxy_middleware_1.createProxyMiddleware)({
    target: userServiceUrl,
    changeOrigin: true,
    pathRewrite: {
        '^/api/users': '/api/users',
    }
}));
app.use('/api/assets', (0, http_proxy_middleware_1.createProxyMiddleware)({
    target: assetServiceUrl,
    changeOrigin: true,
    pathRewrite: {
        '^/api/assets': '/api/assets',
    },
}));
app.get('/heath', (req, res, next) => {
    res.status(200).json({ "message": "Gateway service route is running" });
});
//check for error
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('something went wrong! check the middlewear');
});
app.listen(PORT, () => {
    console.log(`Gateway service port is running on port ${PORT}`);
});
