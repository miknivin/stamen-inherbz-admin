import { authenticateUser } from '@/app/middlewares/auth';
import User from '@/models/User';
import dbConnect from '@/utils/dbConnect';

export default async function handler(req, res) {
  await dbConnect();

  await authenticateUser(req, res, async () => {
    console.log(req?.user);
    if (req?.user?.isAdmin()) {
      res.status(200).json({ success: true, data: req.user });
    } else {
      res.status(403).json({
        success: false,
        message: 'Forbidden: Admins only',
      });
    }
  });
}