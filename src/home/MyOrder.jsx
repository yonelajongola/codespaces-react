import React, { useEffect, useState } from 'react';
import Footer from '../home/Footer';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const apiBase = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');

export default function MyOrder() {
    const [orderData, setOrderData] = useState([]);
    const { user } = useAuth();

    const fetchMyOrder = async () => {
        try {
            const res = await fetch(`${apiBase}/api/myOrderData`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: user?.email
                })
            });
            const response = await res.json();
            setOrderData(response.orderData);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    useEffect(() => {
        if (user?.email) {
            fetchMyOrder();
        }
    }, [user]);

    return (
        <div>
            <Navbar />
            
            <div className='container mt-5 mb-5'>
                <h2 className='mb-4 fw-bold'>My Order History</h2>
                
                {orderData && orderData.order_data ? (
                    orderData.order_data.slice(0).reverse().map((item, index) => {
                        return (
                            <div key={index}>
                                {item.map((arrayData, idx) => {
                                    return (
                                        <div key={idx}>
                                            {arrayData.Order_date ? (
                                                <div className='mt-4 mb-3'>
                                                    <div className='bg-light p-3 rounded'>
                                                        <h5 className='mb-0 text-success fw-bold'>
                                                            <i className="bi bi-calendar-check me-2"></i>
                                                            Order Date: {arrayData.Order_date}
                                                        </h5>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className='card shadow-sm border-0 mb-3'>
                                                    <div className='card-body p-3'>
                                                        <div className='row align-items-center'>
                                                            {/* Left side - Item details */}
                                                            <div className='col-md-8 col-7'>
                                                                <h6 className='fw-bold mb-2'>{arrayData.name}</h6>
                                                                <div className='d-flex gap-3 flex-wrap'>
                                                                    <span className='badge bg-secondary'>
                                                                        Qty: {arrayData.qty}
                                                                    </span>
                                                                    <span className='badge bg-info text-dark'>
                                                                        Size: {arrayData.size}
                                                                    </span>
                                                                    <span className='badge bg-success'>
                                                                        R{arrayData.price}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            
                                                            {/* Right side - Image */}
                                                            <div className='col-md-4 col-5 text-end'>
                                                                <img 
                                                                    src={arrayData.img} 
                                                                    className="img-fluid rounded shadow-sm" 
                                                                    alt={arrayData.name} 
                                                                    style={{ 
                                                                        height: "100px", 
                                                                        width: "140px",
                                                                        objectFit: "cover",
                                                                        border: "2px solid #e0e0e0"
                                                                    }} 
                                                                    onError={(e) => {
                                                                        e.target.src = 'https://via.placeholder.com/140x100?text=No+Image'
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })
                ) : (
                    <div className='m-5 w-100 text-center'>
                        <div className='p-5 bg-light rounded'>
                            <h3 className='text-muted'>No Orders Yet!</h3>
                            <p className='text-muted'>Start ordering to see your history here</p>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}