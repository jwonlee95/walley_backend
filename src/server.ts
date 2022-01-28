import http from 'http';
import express from 'express';
import logging from './config/logging';
import transactionRoutes from './routes/transaction';
import mongoose from 'mongoose';
import firebaseAdmin from 'firebase-admin';
import userRoutes from './routes/user';

import subscriptionRoutes from './routes/subscription';
import categoryRoutes from './routes/category';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
dotenv.config();

const app = express();
const allowedOrigins = process.env.ORIGIN!;
const options: cors.CorsOptions = {
    origin: allowedOrigins,
    methods: ['PUT', 'POST', 'DELETE', 'GET', 'PATCH'],
    credentials: true
};
app.use(cors(options));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
    session({
        secret: process.env.SESSION_SECRET!,
        name: process.env.COOKIE_NAME!,
        saveUninitialized: true,
        resave: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7, //7 days
            httpOnly: false,

            secure: process.env.NODE_ENV! === 'production',
            sameSite: process.env.NODE_ENV! === 'production' ? 'none' : undefined
        }
    })
);

/** Connect to Firebase */
const serviceAccount = require('../serviceAccountKey.json');

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount)
});

const mongoUrl = process.env.MONGO_URL as string;

/** Connect to Mongo */
mongoose
    .connect(mongoUrl)
    .then((result) => {
        logging.info('Mongo Connected');
    })
    .catch((error) => {
        logging.error(error);
    });

/** Log the request */

app.use((req, res, next) => {
    /** Log the req */
    logging.info(`METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

    res.on('finish', () => {
        /** Log the res */
        logging.info(`METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
    });

    next();
});

/** Routes go here */
app.use('/users', userRoutes);
app.use('/api/transaction', transactionRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/category', categoryRoutes);

/** Error handling */
app.use((req, res, next) => {
    const error = new Error('Not found');

    res.status(404).json({
        message: error.message
    });
});

const httpServer = http.createServer(app);
const port = process.env.SERVER_PORT;
const host = process.env.SERVER_HOSTNAME;

httpServer.listen(port, () => logging.info(`Server is running ${host}:${port}`));
