import React from 'react';
import { useCart, useDispatchCart } from '../components/ContextReducer';
import trash from "../trash.svg";
import { useNavigate } from 'react-router-dom';

export default function Cart() {
    let data = useCart();
    let dispatch = useDispatchCart();
    let navigate = useNavigate();
    
    if (data.length === 0) {
        return (
            <div>
                <div className='m-5 w-100 text-center fs-3'> The Cart is Empty! </div>
            </div>
        );
    }
    
    const handleCheckOut = async () => {
        // Navigate to payment page to confirm and process payment
        navigate('/payment');
    };
    
    let totalPrice = data.reduce((total, food) => total + food.price, 0);
    
    return (
        <div className='container mt-5 mb-5'>
            <h2 className='mb-4 fw-bold'>Shopping Cart</h2>
            
            <div className='row g-4'>
                {/* Left side - Order Summary */}
                <div className='col-lg-4 order-lg-1 order-2'>
                    <div className='card shadow-sm border-0 sticky-top' style={{ top: '20px' }}>
                        <div className='card-body p-4'>
                            <h5 className='fw-bold mb-4'>Order Summary</h5>
                            
                            <div className='d-flex justify-content-between mb-3'>
                                <span className='text-muted'>Items ({data.length})</span>
                                <span className='fw-bold'>R{totalPrice}</span>
                            </div>
                            
                            <hr />
                            
                            <div className='d-flex justify-content-between mb-4'>
                                <span className='fs-5 fw-bold'>Total</span>
                                <span className='fs-4 fw-bold text-success'>R{totalPrice}</span>
                            </div>
                            
                            <button 
                                className='btn btn-success w-100 py-3 fw-bold' 
                                onClick={handleCheckOut}
                            >
                                Proceed to Checkout
                            </button>
                            
                            <div className='text-center mt-3'>
                                <small className='text-muted'>Secure checkout guaranteed</small>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Right side - Cart Items */}
                <div className='col-lg-8 order-lg-2 order-1'>
                    <div className='card shadow-sm border-0'>
                        <div className='card-body p-4'>
                            {data && data.length > 0 ? data.map((food, index) => (
                                <div key={index} className='row align-items-center border-bottom pb-3 mb-3'>
                                    <div className='col-md-2 col-3'>
                                        {food.img ? (
                                            <img 
                                                src={food.img} 
                                                alt={food.name} 
                                                className='img-fluid rounded' 
                                                style={{ width: '100%', height: '80px', objectFit: 'cover' }} 
                                                onError={(e) => {e.target.src = 'https://via.placeholder.com/100x80?text=No+Image'}} 
                                            />
                                        ) : (
                                            <div className='bg-secondary rounded d-flex align-items-center justify-content-center' style={{ width: '100%', height: '80px' }}>
                                                <small className='text-white'>No Image</small>
                                            </div>
                                        )}
                                    </div>
                                    <div className='col-md-4 col-9'>
                                        <h6 className='mb-1 fw-bold'>{food.name || 'Unknown'}</h6>
                                        <small className='text-muted'>Size: {food.size || 'N/A'}</small>
                                    </div>
                                    <div className='col-md-2 col-4 text-center'>
                                        <small className='text-muted d-block'>Quantity</small>
                                        <span className='fw-bold'>{food.qty || 0}</span>
                                    </div>
                                    <div className='col-md-2 col-4 text-center'>
                                        <small className='text-muted d-block'>Price</small>
                                        <span className='fw-bold text-success'>R{food.price || 0}</span>
                                    </div>
                                    <div className='col-md-2 col-4 text-end'>
                                        <button 
                                            type="button" 
                                            className="btn btn-outline-danger btn-sm" 
                                            onClick={() => {
                                                dispatch({ type: "REMOVE", index: index });
                                            }}
                                        >
                                            <img src={trash} alt="delete" style={{ width: '16px', height: '16px' }} />
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <div className='text-center py-5'>
                                    <p className='text-muted'>No items in cart</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}