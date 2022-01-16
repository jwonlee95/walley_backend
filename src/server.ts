import http from 'http';
import express from 'express';
import logging from './config/logging';
import expenseRoutes from './routes/expense';
import mongoose from 'mongoose';
import firebaseAdmin from 'firebase-admin';
import userRoutes from './routes/user';
import incomeRoutes from './routes/income';
import subscriptionRoutes from './routes/subscription';
import typesRoutes from './routes/types';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
dotenv.config();

const app = express();
const allowedOrigins = process.env.ORIGIN!;
const options: cors.CorsOptions = {
    origin: allowedOrigins,
    methods: ['PUT', 'POST', 'DELETE', 'GET'],
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
const serviceAccount = require('./config/serviceAccountKey.json');

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

/** Parse the body of the request */
/** Rules of our API */
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

//     if (req.method == 'OPTIONS') {
//         res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
//         return res.status(200).json({});
//     }

//     next();
// });

/** Routes go here */
app.use('/users', userRoutes);
app.use('/api/expense', expenseRoutes);
app.use('/api/income', incomeRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/types', typesRoutes);

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
