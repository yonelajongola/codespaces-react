import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const apiBase = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');

const statusColors = {
    available: 'success',
    occupied: 'danger',
    reserved: 'warning',
    pending: 'secondary',
    preparing: 'warning',
    ready: 'info',
    served: 'success'
};

function authHeaders() {
    const token = localStorage.getItem('authToken');
    return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
}

export default function WorkerDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('tables');

    const [tables, setTables] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [orders, setOrders] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const fetchTables = useCallback(async () => {
        try {
            const res = await fetch(`${apiBase}/api/tables`, { headers: authHeaders() });
            const data = await res.json();
            if (data.success) setTables(data.tables);
        } catch (e) { console.error(e); }
    }, []);

    const fetchMenu = useCallback(async () => {
        try {
            const res = await fetch(`${apiBase}/api/menu`, { headers: authHeaders() });
            const data = await res.json();
            if (data.success) setMenuItems(data.items);
        } catch (e) { console.error(e); }
    }, []);

    const fetchOrders = useCallback(async () => {
        try {
            const res = await fetch(`${apiBase}/api/kitchen/orders`, { headers: authHeaders() });
            const data = await res.json();
            if (data.success) setOrders(data.orders);
        } catch (e) { console.error(e); }
    }, []);

    useEffect(() => {
        fetchTables();
        fetchMenu();
        fetchOrders();
    }, [fetchTables, fetchMenu, fetchOrders]);

    const addToCart = (item) => {
        setCart(prev => {
            const existing = prev.find(c => c._id === item._id);
            if (existing) {
                return prev.map(c => c._id === item._id ? { ...c, quantity: c.quantity + 1 } : c);
            }
            return [...prev, { ...item, quantity: 1, notes: '' }];
        });
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(c => c._id !== id));
    };

    const updateCartQuantity = (id, qty) => {
        if (qty < 1) { removeFromCart(id); return; }
        setCart(prev => prev.map(c => c._id === id ? { ...c, quantity: qty } : c));
    };

    const updateCartNotes = (id, notes) => {
        setCart(prev => prev.map(c => c._id === id ? { ...c, notes } : c));
    };

    const sendToKitchen = async () => {
        if (!selectedTable) { setMessage('Please select a table first.'); return; }
        if (cart.length === 0) { setMessage('Please add items to the order.'); return; }
        setLoading(true);
        try {
            const items = cart.map(c => ({ name: c.name, quantity: c.quantity, price: c.price, notes: c.notes }));
            const res = await fetch(`${apiBase}/api/kitchen/order`, {
                method: 'POST',
                headers: authHeaders(),
                body: JSON.stringify({ tableNumber: selectedTable.tableNumber, items })
            });
            const data = await res.json();
            if (data.success) {
                setMessage(`Order sent to kitchen for Table ${selectedTable.tableNumber}!`);
                setCart([]);
                setSelectedTable(null);
                fetchTables();
                fetchOrders();
            } else {
                setMessage('Failed to send order.');
            }
        } catch (e) {
            setMessage('Error sending order.');
        }
        setLoading(false);
    };

    const updateOrderStatus = async (orderId, status) => {
        try {
            const res = await fetch(`${apiBase}/api/kitchen/orders/${orderId}/status`, {
                method: 'PUT',
                headers: authHeaders(),
                body: JSON.stringify({ status })
            });
            const data = await res.json();
            if (data.success) {
                fetchOrders();
                fetchTables();
                setMessage(`Order status updated to ${status}`);
            }
        } catch (e) { console.error(e); }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const cartTotal = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);

    return (
        <div className="container-fluid">
            <nav className="navbar navbar-dark bg-dark px-3 mb-3">
                <span className="navbar-brand">🍽️ Worker Dashboard</span>
                <span className="text-light me-3">Welcome, {user?.name}</span>
                <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
            </nav>

            {message && (
                <div className="alert alert-info alert-dismissible mx-3" role="alert">
                    {message}
                    <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
                </div>
            )}

            <ul className="nav nav-tabs mx-3 mb-3">
                {['tables', 'order', 'status'].map(tab => (
                    <li className="nav-item" key={tab}>
                        <button
                            className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab === 'tables' ? '🪑 Tables' : tab === 'order' ? '📝 Create Order' : '📋 Order Status'}
                        </button>
                    </li>
                ))}
            </ul>

            <div className="mx-3">
                {/* Tables Tab */}
                {activeTab === 'tables' && (
                    <div>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5>Restaurant Tables</h5>
                            <button className="btn btn-sm btn-outline-secondary" onClick={fetchTables}>↻ Refresh</button>
                        </div>
                        <div className="row">
                            {tables.length === 0 && <p className="text-muted">No tables found. Ask your owner to seed tables.</p>}
                            {tables.map(table => (
                                <div className="col-6 col-md-3 col-lg-2 mb-3" key={table._id}>
                                    <div
                                        className={`card border-${statusColors[table.status]} cursor-pointer ${selectedTable?._id === table._id ? 'border border-3' : ''}`}
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => { setSelectedTable(table); setActiveTab('order'); }}
                                    >
                                        <div className="card-body text-center p-2">
                                            <h6 className="card-title mb-1">Table {table.tableNumber}</h6>
                                            <span className={`badge bg-${statusColors[table.status]}`}>{table.status}</span>
                                            <div className="text-muted small mt-1">Cap: {table.capacity}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Create Order Tab */}
                {activeTab === 'order' && (
                    <div className="row">
                        <div className="col-md-7">
                            <div className="d-flex align-items-center mb-3 gap-3">
                                <h5 className="mb-0">Menu Items</h5>
                                {selectedTable && (
                                    <span className="badge bg-primary">Table {selectedTable.tableNumber} selected</span>
                                )}
                            </div>
                            {menuItems.length === 0 && <p className="text-muted">No menu items found.</p>}
                            <div className="row">
                                {menuItems.map(item => (
                                    <div className="col-6 col-md-4 mb-3" key={item._id}>
                                        <div className="card h-100">
                                            <div className="card-body p-2">
                                                <h6 className="card-title small">{item.name}</h6>
                                                <div className="text-muted small">{item.category}</div>
                                                <div className="fw-bold">R{item.price.toFixed(2)}</div>
                                                <button
                                                    className="btn btn-sm btn-primary mt-1 w-100"
                                                    onClick={() => addToCart(item)}
                                                >+ Add</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="col-md-5">
                            <h5>Order Cart {selectedTable && <small className="text-muted">- Table {selectedTable.tableNumber}</small>}</h5>
                            {cart.length === 0 ? (
                                <p className="text-muted">Cart is empty. Add items from the menu.</p>
                            ) : (
                                <>
                                    {cart.map(item => (
                                        <div className="card mb-2" key={item._id}>
                                            <div className="card-body p-2">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <strong className="small">{item.name}</strong>
                                                    <button className="btn btn-sm btn-outline-danger py-0" onClick={() => removeFromCart(item._id)}>×</button>
                                                </div>
                                                <div className="d-flex align-items-center gap-2 mt-1">
                                                    <button className="btn btn-sm btn-outline-secondary py-0" onClick={() => updateCartQuantity(item._id, item.quantity - 1)}>-</button>
                                                    <span>{item.quantity}</span>
                                                    <button className="btn btn-sm btn-outline-secondary py-0" onClick={() => updateCartQuantity(item._id, item.quantity + 1)}>+</button>
                                                    <span className="ms-auto">R{(item.price * item.quantity).toFixed(2)}</span>
                                                </div>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm mt-1"
                                                    placeholder="Notes (e.g. no onion)"
                                                    value={item.notes}
                                                    onChange={e => updateCartNotes(item._id, e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    <div className="d-flex justify-content-between fw-bold mt-2 mb-3">
                                        <span>Total:</span>
                                        <span>R{cartTotal.toFixed(2)}</span>
                                    </div>
                                    <button
                                        className="btn btn-success w-100"
                                        onClick={sendToKitchen}
                                        disabled={loading}
                                    >
                                        {loading ? 'Sending...' : '🍳 Send to Kitchen'}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Order Status Tab */}
                {activeTab === 'status' && (
                    <div>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5>Active Orders</h5>
                            <button className="btn btn-sm btn-outline-secondary" onClick={fetchOrders}>↻ Refresh</button>
                        </div>
                        {orders.length === 0 ? (
                            <p className="text-muted">No active orders.</p>
                        ) : (
                            orders.map(order => (
                                <div className="card mb-3" key={order._id}>
                                    <div className="card-header d-flex justify-content-between">
                                        <span>Table {order.tableNumber}</span>
                                        <span className={`badge bg-${statusColors[order.status]}`}>{order.status}</span>
                                    </div>
                                    <div className="card-body">
                                        <ul className="list-unstyled mb-2">
                                            {order.items.map((item, i) => (
                                                <li key={i} className="small">
                                                    {item.quantity}× {item.name} — R{(item.price * item.quantity).toFixed(2)}
                                                    {item.notes && <span className="text-muted"> ({item.notes})</span>}
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="d-flex gap-2 flex-wrap">
                                            {order.status === 'pending' && (
                                                <button className="btn btn-sm btn-warning" onClick={() => updateOrderStatus(order._id, 'preparing')}>Mark Preparing</button>
                                            )}
                                            {order.status === 'preparing' && (
                                                <button className="btn btn-sm btn-info" onClick={() => updateOrderStatus(order._id, 'ready')}>Mark Ready</button>
                                            )}
                                            {order.status === 'ready' && (
                                                <button className="btn btn-sm btn-success" onClick={() => updateOrderStatus(order._id, 'served')}>Mark Served</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
