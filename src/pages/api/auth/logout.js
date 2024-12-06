import { createRouter } from 'next-connect';

const handler = createRouter();

handler.get(async (req, res) => {
  // Clear the token cookie
  res.setHeader('Set-Cookie', `token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict`);
  
  res.status(200).json({ 
    success: true, 
    message: 'Logged out successfully' 
  });
});

export default handler.handler();