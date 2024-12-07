import { createRouter } from 'next-connect';
import cors from 'cors';
// CORS configuration
const corsOptions = {
  origin: process.env.NEXT_PUBLIC_CORS_ALLOWED_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};
const handler = createRouter();
handler.use(cors(corsOptions));
handler.get(async (req, res) => {
  // Clear the token cookie
  res.setHeader('Set-Cookie', `token=; HttpOnly; Path=/; Max-Age=0; SameSite=None; Secure`);
  
  res.status(200).json({ 
    success: true, 
    message: 'Logged out successfully' 
  });
});

handler.all((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_CORS_ALLOWED_ORIGIN); // Set the allowed origin
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // Allow credentials (cookies)
  res.status(204).end(); // Respond with 204 for OPTIONS requests
});

export default handler.handler();
