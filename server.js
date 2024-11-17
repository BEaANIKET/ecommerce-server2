import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv'
import { dbConnect } from './db/index.js';
import passport from 'passport';

const app = express();
dotenv.config()

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));


await dbConnect()
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use(passport.initialize()); 


import AuthRouter from './router/auth.router.js'

app.use('/api/auth', AuthRouter)

app.use('/', (req, res) => {
    res.send('Hello, World!');
})
app.listen(4000, '0.0.0.0', () => {
    console.log("Server is running on port http://localhost:4000");
});            