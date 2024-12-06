'use client'
import OrderTable from "@/components/OrderTable";
import { useState, useEffect } from "react";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Loading from "@/components/Loading";

export default function Page() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 10
  });
  const router = useRouter();

  const getOrders = async (page = 1) => {
    setError('');
    setLoading(true);

    try {
      const response = await axios.get(`/api/orders?page=${page}&limit=${pagination.itemsPerPage}`);
      if (response.data.success) {
        setOrders(response.data.data);
        setPagination(response.data.pagination);
      } else {
        setError('Failed to fetch orders.');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'An error occurred. Please try again.'
      );
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  const handlePageChange = (page) => {
    getOrders(page);
  };

  return (
    <>
    {loading?(
      <div className="w-full h-full flex justify-center items-center mt-10">
        <Loading/>
      </div>
      
    ):(
      <div className=" max-w-6xl mx-auto mt-12"> 
      <div className="relative flex flex-col w-full h-full overflow-auto text-gray-700 dark:bg-slate-600 bg-slate-300 shadow-md rounded-lg bg-clip-border">
        <OrderTable orders={orders} />
        
        <div className="flex justify-between items-center px-4 py-3">
          <div className="text-sm dark:text-slate-400 text-slate-600 ">
            Showing <b>{(pagination.currentPage - 1) * pagination.itemsPerPage + 1}-{Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}</b> of {pagination.totalItems}
          </div>
          
          <div className="flex space-x-1">
            <button 
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className={`px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease ${pagination.currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Prev
            </button>

            {[...Array(pagination.totalPages)].map((_, index) => (
              <button 
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 py-1 min-w-9 min-h-9 text-sm font-normal ${
                  pagination.currentPage === index + 1 
                  ? 'text-white bg-slate-800 border border-slate-800' 
                  : 'text-slate-500 bg-white border border-slate-200'
                } rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease`}
              >
                {index + 1}
              </button>
            ))}

            <button 
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className={`px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease ${pagination.currentPage === pagination.totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
    )}

    </>
  );
}