import { createRouter } from 'next-connect';
import dbConnect from '@/utils/dbConnect';
import Order from '@/models/Order';
import { authenticateUser } from '@/app/middlewares/auth';

const handler = createRouter();

handler.get(authenticateUser, async (req, res) => {
  try {
    await dbConnect();

    const order = await Order.findById(req.query.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid Order ID' });
    }

    res.status(500).json({ success: false, message: error.message });
  }
});

handler.patch(authenticateUser, async (req, res) => {
  try {
    await dbConnect();
    if (req?.user.roles!=='admin') {
      return res.status(401).json({ success: false, message: 'You are not allowed' });
    }
    const { id } = req.query;
    const { orderStatus } = req.body;

    if (!orderStatus) {
      return res.status(400).json({ success: false, message: 'Order status is required' });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { orderStatus },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, data: updatedOrder });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid Order ID' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: error.message });
    }

    res.status(500).json({ success: false, message: error.message });
  }
});

handler.delete(authenticateUser, async (req, res) => {
  try {
    await dbConnect();
    if (req?.user.roles!=='admin') {
      return res.status(401).json({ success: false, message: 'You are not allowed' });
    }
    const { id } = req.query;

    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid Order ID' });
    }

    res.status(500).json({ success: false, message: error.message });
  }
});

export default handler.handler();
