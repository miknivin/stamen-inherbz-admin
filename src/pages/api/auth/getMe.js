import { authenticateUser } from '@/app/middlewares/auth';
import dbConnect from '@/utils/dbConnect';
import cors from 'cors';
import { createRouter } from 'next-connect';

// CORS configuration
const corsOptions = {
  origin: process.env.NEXT_PUBLIC_CORS_ALLOWED_ORIGIN, // Adjust this to the front-end origin
  credentials: true, // Allow cookies to be sent with requests
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false, // Do not continue to the next handler for preflight requests
  optionsSuccessStatus: 204, // Handle legacy browsers that might not support the 204 status code
};

const handler = createRouter();

handler.use(cors(corsOptions));

handler.use(async (req, res, next) => {
  await dbConnect();
  next();
});

handler.use(authenticateUser);

handler.get(async (req, res) => {
  res.status(200).json({ success: true, data: req.user });
});

handler.all((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_CORS_ALLOWED_ORIGIN); // Set the allowed origin
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // Allow credentials (cookies)
  res.status(204).end(); // Respond with 204 for OPTIONS requests
});

export default handler.handler();
