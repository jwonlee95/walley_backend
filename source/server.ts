import http from 'http';
import bodyParser from 'body-parser';
import express from 'express';
import logging from './config/logging';
import expenseRoutes from './routes/expense';
import mongoose from 'mongoose';
import firebaseAdmin from 'firebase-admin';
import userRoutes from './routes/user';
import incomeRoutes from './routes/income';
import subscriptionRoutes from './routes/subscription';
import dotenv from 'dotenv';

const router = express();

dotenv.config();
/** Connect to Firebase */
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string);

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
router.use((req, res, next) => {
    /** Log the req */
    logging.info(`METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

    res.on('finish', () => {
        /** Log the res */
        logging.info(`METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
    });

    next();
});

/** Parse the body of the request */
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

/** Rules of our API */
router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }

    next();
});

/** Routes go here */
router.use('/users', userRoutes);
router.use('/api/expense', expenseRoutes);
router.use('/api/income', incomeRoutes);
router.use('/api/subscription', subscriptionRoutes);

/** Error handling */
router.use((req, res, next) => {
    const error = new Error('Not found');

    res.status(404).json({
        message: error.message
    });
});

const httpServer = http.createServer(router);
const port = process.env.SERVER_PORT;
const host = process.env.SERVER_HOSTNAME;

httpServer.listen(port, () => logging.info(`Server is running ${host}:${port}`));
