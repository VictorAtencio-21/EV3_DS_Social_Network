const express = require("express");
const app = express();
const morgan = require("morgan");
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config()

//Settings
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '127.0.0.1';
app.use(morgan('dev'));

//URLs
const API = process.env.API_SERVICE_URL
const AUTH = process.  env.AUTH_SERVICE_URL


//Routes
app.get('/info', (req, res, next) => {
    res.json({
        message: 'This is a proxy serving both Auth API and API Server.'
    })
});

//Proxy API Endpoint
app.use('/api/posts', createProxyMiddleware({
    target: API,
    changeOrigin: true
    }
))

//Proxy Auth Endpoint
app.use('/api/', createProxyMiddleware({
    target: AUTH,
    changeOrigin: true
    }
))

//Middlewares
app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.listen(PORT, () => console.log(`Proxy Running on http://${HOST}:${PORT}`))