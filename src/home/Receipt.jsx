import React from 'react';
import { useLocation, Link } from 'react-router-dom';

export default function Receipt() {
  const { state } = useLocation();
  const orderDate = state?.orderDate || 'N/A';
  const total = state?.total || 0;

  return (
    <div className='container mt-5'>
      <div className='card p-4'>
        <h2 className='text-success'>Payment Successful</h2>
        <p>Order Date: {orderDate}</p>
        <p>Total Paid: R{total}/-</p>
        <Link to='/' className='btn btn-primary'>Back to Home</Link>
      </div>
    </div>
  );
}
