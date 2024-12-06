import { createRouter } from 'next-connect';
import User from '@/models/User';
import dbConnect from '@/utils/dbConnect';
import jwt from 'jsonwebtoken';

const handler = createRouter();

handler.post(async (req, res) => {
  await dbConnect();
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Please provide email and password' 
    });
  }

  try {
    // Find user and select password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Create token
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    // Set cookie
    res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict`);

    res.status(200).json({ 
      success: true, 
      message: 'Logged in successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

export default handler.handler();