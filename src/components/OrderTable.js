import Link from "next/link";

export default function OrderTable({orders}) {
  // Log the orders prop when the component renders
  console.log('Orders:', orders);
  
  return (
    <div className="relative overflow-x-auto shadow-md">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">ID</th>
            <th scope="col" className="px-6 py-3">Date</th>
            <th scope="col" className="px-6 py-3">Payment Status</th>
            <th scope="col" className="px-6 py-3">Order Status</th>
            <th scope="col" className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr 
              key={order._id} 
              className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
            >
              <td className="px-6 py-4">
                {order._id.slice(-6)}
              </td>
              <td className="px-6 py-4">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4">
                {order.paymentMethod}
              </td>
              <td className="px-6 py-4">
                {order.orderStatus}
              </td>
              <td className="px-6 py-4">
                <Link
                  href={`/orders/${order._id}`}
                  className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                >
                  View Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}