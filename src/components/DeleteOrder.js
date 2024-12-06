import React from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function DeleteOrder({ id }) {
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`/api/orders/${id}`);
      if (response.status === 200) {
        Swal.fire('Deleted!', 'Order deleted successfully.', 'success').then(() => {
          window.location.href = '/orders'; 
        });
      }
    } catch (error) {
      if (error.response) {
        Swal.fire('Error!', error.response.data.message, 'error');
      } else {
        Swal.fire('Error!', 'An error occurred. Please try again.', 'error');
      }
    }
  };

  const confirmDelete = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to delete this order?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete();
      }
    });
  };

  return (
    <>
      <button
        type="button"
        className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
        onClick={confirmDelete}
      >
        Delete Order
      </button>
    </>
  );
}
