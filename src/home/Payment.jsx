import React, { useState } from 'react';
import { useCart, useDispatchCart } from '../components/ContextReducer';
import { useNavigate } from 'react-router-dom';

const apiBase = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');

export default function Payment() {
  const cart = useCart();
  const dispatch = useDispatchCart();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const totalPrice = cart.reduce((t, item) => t + (item.price || 0), 0);

  const handlePay = async () => {
    if (cart.length === 0) return alert('Cart is empty');
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) return alert('Please login before checking out');

    setProcessing(true);
    try {
      // Simulate payment delay
      await new Promise(r => setTimeout(r, 1200));

      // On successful payment (mock), save order to backend
      const res = await fetch(`${apiBase}/api/orderData`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_data: cart,
          email: userEmail,
          order_date: new Date().toDateString()
        })
      });

      const json = await res.json();
      if (json.success) {
        dispatch({ type: 'DROP' });
        navigate('/receipt', { state: { orderDate: new Date().toDateString(), total: totalPrice } });
      } else {
        alert('Failed to save order');
      }
    } catch (err) {
      alert('Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      <div className='container mt-4'>
        <h2>Payment</h2>
        {cart.length === 0 ? (
          <div className='m-5'>Your cart is empty.</div>
        ) : (
          <>
            <div className='list-group'>
              {cart.map((c, i) => (
                <div key={i} className='list-group-item d-flex justify-content-between align-items-center'>
                  <div>
                    <strong>{c.name}</strong>
                    <div className='text-muted'>Qty: {c.qty} • Size: {c.size}</div>
                  </div>
                  <div>R{c.price}/-</div>
                </div>
              ))}
            </div>
            <div className='mt-3'>
              <h4>Total: R{totalPrice}/-</h4>
              <div className='mt-3'>
                <p className='text-muted'>This is a mock payment flow. To integrate a real gateway, replace this handler with Stripe/PayPal integration.</p>
                <button className='btn btn-success' onClick={handlePay} disabled={processing}>{processing ? 'Processing...' : 'Pay Now'}</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
