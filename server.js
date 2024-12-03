import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv'
import { dbConnect } from './db/index.js';
import passport from 'passport';

const app = express();
dotenv.config()

const allowedOrigins = [
    'http://localhost:5173',
    'https://ae6a-2409-40e4-2052-1056-f4b2-46dd-84a-2d08.ngrok-free.app',
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, origin);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 204,
}));

app.options('*', (req, res) => {
    // const origin = req.headers.origin;
    res.setHeader('Access-Control-Allow-Origin', 'https://20d0-2409-40e5-12-784-d636-7b8e-2c1a-75c1.ngrok-free.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.sendStatus(204);
});


await dbConnect()
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use(passport.initialize());

app.use((err, req, res, next) => {
    console.error('Error:', err.message);

    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
    });
});


import AuthRouter from './router/auth.router.js'
import roleRouter from './router/role.router.js'
import ProductRoute from './router/product.router.js'
import userRouter from './router/user.router.js'
import CartRouter from './router/cart.router.js'
import AddressRouter from './router/address.router.js'
import orderRouter from './router/order.router.js'

app.use('/api/auth', AuthRouter)
app.use('/api/role', roleRouter)
app.use('/api/product', ProductRoute)
app.use('/api/user', userRouter)
app.use('/api/cart', CartRouter)
app.use('/api/address', AddressRouter)
app.use('/api/order', orderRouter)


app.listen(4000, '0.0.0.0', () => {
    console.log("Server is running on port http://localhost:4000");
});            