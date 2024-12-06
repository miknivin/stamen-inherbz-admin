'use client'
import axios from 'axios';

// Fetch order details by ID
export async function fetchOrderDetails(orderId) {
  try {
    console.log(process.env.FRONTEND_URL,'frontend')
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/orders/${orderId}`, {
      withCredentials: true, 
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return data.data;
  } catch (error) {
    console.error('Order fetch error:', error);
    return null;
  }
}
