import { createRouter } from 'next-connect';
import User from '@/models/User';
import dbConnect from '@/utils/dbConnect';
import jwt from 'jsonwebtoken';
import cors from 'cors';

// CORS configuration
const corsOptions = {
  origin: process.env.NEXT_PUBLIC_CORS_ALLOWED_ORIGIN, // Adjust this to the front-end origin
  credentials: true, // Allow cookies to be sent with requests
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false, // Allow the preflight to be handled by this middleware
  optionsSuccessStatus: 204, // Handle legacy browsers that might not support the 204 status code
};

const handler = createRouter();

// Apply the CORS middleware globally
handler.use(cors(corsOptions));

// Handle the POST request for user registration or login
handler.post(async (req, res) => {
  try {
    await dbConnect();
    const { name, phone, password, accessToken } = req.body;
    console.log(phone);
    
    // Validate input
    if (!name || !phone || !password || !accessToken) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields' 
      });
    }

    // Check if user already exists with this phone number
    const existingUser = await User.findOne({ phone });

    if (existingUser) {
      // User already exists, generate JWT token and send it back
      console.log('existing');
      
      const token = jwt.sign(
        { id: existingUser._id }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1d' }
      );

      // Set cookie
      res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=None; Secure`);

      return res.status(200).json({ 
        success: true, 
        message: 'User found, token issued', 
        user: {
          id: existingUser._id,
          name: existingUser.name,
          phone: existingUser.phone
        }
      });
    }

    // User does not exist, create a new user
    const user = await User.create({ 
      name, 
      phone, 
      password,
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    // Set cookie
    res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=None; Secure`);

    res.status(201).json({ 
      success: true, 
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Handle OPTIONS preflight requests
handler.all((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_CORS_ALLOWED_ORIGIN); // Set the allowed origin
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // Allow credentials (cookies)
  res.status(204).end(); // Respond with 204 for OPTIONS requests
});

export default handler.handler();
