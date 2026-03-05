import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import AIFeatures from './AIFeatures';

const apiBase = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');

function authHeaders() {
    const token = localStorage.getItem('authToken');
    return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
}

export default function OwnerDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('analytics');

    const [analytics, setAnalytics] = useState(null);
    const [dailyRevenue, setDailyRevenue] = useState([]);
    const [topDishes, setTopDishes] = useState([]);
    const [staff, setStaff] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [message, setMessage] = useState('');

    const [invForm, setInvForm] = useState({ name: '', category: 'ingredient', quantity: '', unit: '', minStock: 10, cost: 0 });
    const [editingInv, setEditingInv] = useState(null);
    const [menuForm, setMenuForm] = useState({ name: '', description: '', price: '', category: '', img: '', available: true });
    const [editingMenu, setEditingMenu] = useState(null);

    const fetchAnalytics = useCallback(async () => {
        try {
            const res = await fetch(`${apiBase}/api/owner/analytics`, { headers: authHeaders() });
            const data = await res.json();
            if (data.success) setAnalytics(data.analytics);
        } catch (e) { console.error(e); }
    }, []);

    const fetchDailyRevenue = useCallback(async () => {
        try {
            const res = await fetch(`${apiBase}/api/owner/revenue/daily`, { headers: authHeaders() });
            const data = await res.json();
            if (data.success) setDailyRevenue(data.daily);
        } catch (e) { console.error(e); }
    }, []);

    const fetchTopDishes = useCallback(async () => {
        try {
            const res = await fetch(`${apiBase}/api/owner/top-dishes`, { headers: authHeaders() });
            const data = await res.json();
            if (data.success) setTopDishes(data.topDishes);
        } catch (e) { console.error(e); }
    }, []);

    const fetchStaff = useCallback(async () => {
        try {
            const res = await fetch(`${apiBase}/api/owner/staff-performance`, { headers: authHeaders() });
            const data = await res.json();
            if (data.success) setStaff(data.staff);
        } catch (e) { console.error(e); }
    }, []);

    const fetchInventory = useCallback(async () => {
        try {
            const res = await fetch(`${apiBase}/api/inventory`, { headers: authHeaders() });
            const data = await res.json();
            if (data.success) setInventory(data.items);
        } catch (e) { console.error(e); }
    }, []);

    const fetchMenu = useCallback(async () => {
        try {
            const res = await fetch(`${apiBase}/api/menu`, { headers: authHeaders() });
            const data = await res.json();
            if (data.success) setMenuItems(data.items);
        } catch (e) { console.error(e); }
    }, []);

    useEffect(() => {
        fetchAnalytics();
        fetchDailyRevenue();
        fetchTopDishes();
        fetchStaff();
        fetchInventory();
        fetchMenu();
    }, [fetchAnalytics, fetchDailyRevenue, fetchTopDishes, fetchStaff, fetchInventory, fetchMenu]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Inventory CRUD
    const saveInventory = async (e) => {
        e.preventDefault();
        const url = editingInv ? `${apiBase}/api/inventory/${editingInv._id}` : `${apiBase}/api/inventory`;
        const method = editingInv ? 'PUT' : 'POST';
        try {
            const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(invForm) });
            const data = await res.json();
            if (data.success) {
                setMessage(editingInv ? 'Inventory updated!' : 'Inventory item added!');
                setInvForm({ name: '', category: 'ingredient', quantity: '', unit: '', minStock: 10, cost: 0 });
                setEditingInv(null);
                fetchInventory();
            }
        } catch (e) { console.error(e); }
    };

    const deleteInventory = async (id) => {
        if (!confirm('Delete this item?')) return;
        try {
            const res = await fetch(`${apiBase}/api/inventory/${id}`, { method: 'DELETE', headers: authHeaders() });
            const data = await res.json();
            if (data.success) { setMessage('Item deleted.'); fetchInventory(); }
        } catch (e) { console.error(e); }
    };

    const editInventory = (item) => {
        setEditingInv(item);
        setInvForm({ name: item.name, category: item.category, quantity: item.quantity, unit: item.unit, minStock: item.minStock, cost: item.cost });
    };

    // Menu CRUD
    const saveMenuItem = async (e) => {
        e.preventDefault();
        const url = editingMenu ? `${apiBase}/api/menu/${editingMenu._id}` : `${apiBase}/api/menu`;
        const method = editingMenu ? 'PUT' : 'POST';
        try {
            const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify({ ...menuForm, price: parseFloat(menuForm.price) }) });
            const data = await res.json();
            if (data.success) {
                setMessage(editingMenu ? 'Menu item updated!' : 'Menu item added!');
                setMenuForm({ name: '', description: '', price: '', category: '', img: '', available: true });
                setEditingMenu(null);
                fetchMenu();
            }
        } catch (e) { console.error(e); }
    };

    const deleteMenuItem = async (id) => {
        if (!confirm('Delete this menu item?')) return;
        try {
            const res = await fetch(`${apiBase}/api/menu/${id}`, { method: 'DELETE', headers: authHeaders() });
            const data = await res.json();
            if (data.success) { setMessage('Menu item deleted.'); fetchMenu(); }
        } catch (e) { console.error(e); }
    };

    const editMenuItem = (item) => {
        setEditingMenu(item);
        setMenuForm({ name: item.name, description: item.description || '', price: item.price, category: item.category, img: item.img || '', available: item.available });
    };

    const toggleAvailability = async (item) => {
        try {
            const res = await fetch(`${apiBase}/api/menu/${item._id}`, {
                method: 'PUT',
                headers: authHeaders(),
                body: JSON.stringify({ available: !item.available })
            });
            const data = await res.json();
            if (data.success) fetchMenu();
        } catch (e) { console.error(e); }
    };

    const tabs = [
        { key: 'analytics', label: '📊 Analytics' },
        { key: 'revenue', label: '💰 Revenue' },
        { key: 'dishes', label: '🍽️ Top Dishes' },
        { key: 'staff', label: '👥 Staff' },
        { key: 'inventory', label: '📦 Inventory' },
        { key: 'menu', label: '📋 Menu' },
        { key: 'ai', label: '🤖 AI Features' }
    ];

    return (
        <div className="container-fluid">
            <nav className="navbar navbar-dark bg-dark px-3 mb-3">
                <span className="navbar-brand">👑 Owner Dashboard</span>
                <span className="text-light me-3">Welcome, {user?.name}</span>
                <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
            </nav>

            {message && (
                <div className="alert alert-info alert-dismissible mx-3" role="alert">
                    {message}
                    <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
                </div>
            )}

            <ul className="nav nav-tabs mx-3 mb-3 flex-wrap">
                {tabs.map(tab => (
                    <li className="nav-item" key={tab.key}>
                        <button
                            className={`nav-link ${activeTab === tab.key ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.key)}
                        >{tab.label}</button>
                    </li>
                ))}
            </ul>

            <div className="mx-3">
                {/* Analytics Tab */}
                {activeTab === 'analytics' && (
                    <div>
                        <h5 className="mb-3">Sales Summary</h5>
                        {analytics ? (
                            <div className="row g-3">
                                <div className="col-6 col-md-3">
                                    <div className="card text-center border-success">
                                        <div className="card-body">
                                            <h6 className="text-muted small">Total Revenue</h6>
                                            <h4 className="text-success">${analytics.totalRevenue}</h4>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6 col-md-3">
                                    <div className="card text-center border-primary">
                                        <div className="card-body">
                                            <h6 className="text-muted small">Total Orders</h6>
                                            <h4 className="text-primary">{analytics.totalOrders}</h4>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6 col-md-3">
                                    <div className="card text-center border-info">
                                        <div className="card-body">
                                            <h6 className="text-muted small">Orders Today</h6>
                                            <h4 className="text-info">{analytics.ordersToday}</h4>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6 col-md-3">
                                    <div className="card text-center border-warning">
                                        <div className="card-body">
                                            <h6 className="text-muted small">Avg Order Value</h6>
                                            <h4 className="text-warning">${analytics.avgOrderValue}</h4>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6 col-md-3">
                                    <div className="card text-center border-danger">
                                        <div className="card-body">
                                            <h6 className="text-muted small">Active Tables</h6>
                                            <h4 className="text-danger">{analytics.activeTables}</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : <p className="text-muted">Loading analytics...</p>}
                    </div>
                )}

                {/* Revenue Chart Tab */}
                {activeTab === 'revenue' && (
                    <div>
                        <h5 className="mb-3">Daily Revenue (Last 30 Days)</h5>
                        {dailyRevenue.length === 0 ? (
                            <p className="text-muted">No revenue data yet.</p>
                        ) : (
                            <ResponsiveContainer width="100%" height={350}>
                                <LineChart data={dailyRevenue}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                                    <YAxis />
                                    <Tooltip formatter={(val) => `$${val}`} />
                                    <Legend />
                                    <Line type="monotone" dataKey="revenue" stroke="#0d6efd" strokeWidth={2} dot={false} name="Revenue ($)" />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                )}

                {/* Top Dishes Tab */}
                {activeTab === 'dishes' && (
                    <div>
                        <h5 className="mb-3">Top Selling Dishes</h5>
                        {topDishes.length === 0 ? (
                            <p className="text-muted">No sales data yet.</p>
                        ) : (
                            <ResponsiveContainer width="100%" height={350}>
                                <BarChart data={topDishes} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 11 }} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="quantity" fill="#198754" name="Units Sold" />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                )}

                {/* Staff Performance Tab */}
                {activeTab === 'staff' && (
                    <div>
                        <h5 className="mb-3">Staff Performance</h5>
                        {staff.length === 0 ? (
                            <p className="text-muted">No staff data yet.</p>
                        ) : (
                            <table className="table table-bordered table-hover">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Orders Served</th>
                                        <th>Revenue Generated</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {staff.map((s, i) => (
                                        <tr key={i}>
                                            <td>{s.name}</td>
                                            <td>{s.email}</td>
                                            <td>{s.orders}</td>
                                            <td>${s.revenue}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {/* Inventory Tab */}
                {activeTab === 'inventory' && (
                    <div>
                        <h5 className="mb-3">Inventory Management</h5>
                        <form className="card card-body mb-4" onSubmit={saveInventory}>
                            <h6>{editingInv ? 'Edit Item' : 'Add New Item'}</h6>
                            <div className="row g-2">
                                <div className="col-md-3">
                                    <input className="form-control" placeholder="Name" value={invForm.name} onChange={e => setInvForm({ ...invForm, name: e.target.value })} required />
                                </div>
                                <div className="col-md-2">
                                    <select className="form-control" value={invForm.category} onChange={e => setInvForm({ ...invForm, category: e.target.value })}>
                                        <option value="ingredient">Ingredient</option>
                                        <option value="beverage">Beverage</option>
                                        <option value="supply">Supply</option>
                                    </select>
                                </div>
                                <div className="col-md-2">
                                    <input className="form-control" type="number" placeholder="Quantity" value={invForm.quantity} onChange={e => setInvForm({ ...invForm, quantity: e.target.value })} required />
                                </div>
                                <div className="col-md-1">
                                    <input className="form-control" placeholder="Unit" value={invForm.unit} onChange={e => setInvForm({ ...invForm, unit: e.target.value })} required />
                                </div>
                                <div className="col-md-2">
                                    <input className="form-control" type="number" placeholder="Min Stock" value={invForm.minStock} onChange={e => setInvForm({ ...invForm, minStock: e.target.value })} />
                                </div>
                                <div className="col-md-1">
                                    <input className="form-control" type="number" placeholder="Cost" value={invForm.cost} onChange={e => setInvForm({ ...invForm, cost: e.target.value })} />
                                </div>
                                <div className="col-md-1">
                                    <button type="submit" className="btn btn-primary w-100">{editingInv ? 'Save' : 'Add'}</button>
                                </div>
                            </div>
                            {editingInv && <button type="button" className="btn btn-link btn-sm mt-1" onClick={() => { setEditingInv(null); setInvForm({ name: '', category: 'ingredient', quantity: '', unit: '', minStock: 10, cost: 0 }); }}>Cancel</button>}
                        </form>
                        <table className="table table-bordered table-hover table-sm">
                            <thead>
                                <tr>
                                    <th>Name</th><th>Category</th><th>Qty</th><th>Unit</th><th>Min</th><th>Cost</th><th>Status</th><th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inventory.map(item => (
                                    <tr key={item._id} className={item.quantity <= item.minStock ? 'table-danger' : ''}>
                                        <td>{item.name}</td>
                                        <td>{item.category}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.unit}</td>
                                        <td>{item.minStock}</td>
                                        <td>${item.cost}</td>
                                        <td>{item.quantity <= item.minStock ? <span className="badge bg-danger">Low Stock</span> : <span className="badge bg-success">OK</span>}</td>
                                        <td>
                                            <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => editInventory(item)}>Edit</button>
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => deleteInventory(item._id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                                {inventory.length === 0 && <tr><td colSpan="8" className="text-muted text-center">No inventory items.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Menu Management Tab */}
                {activeTab === 'menu' && (
                    <div>
                        <h5 className="mb-3">Menu Management</h5>
                        <form className="card card-body mb-4" onSubmit={saveMenuItem}>
                            <h6>{editingMenu ? 'Edit Menu Item' : 'Add Menu Item'}</h6>
                            <div className="row g-2">
                                <div className="col-md-3">
                                    <input className="form-control" placeholder="Name" value={menuForm.name} onChange={e => setMenuForm({ ...menuForm, name: e.target.value })} required />
                                </div>
                                <div className="col-md-3">
                                    <input className="form-control" placeholder="Description" value={menuForm.description} onChange={e => setMenuForm({ ...menuForm, description: e.target.value })} />
                                </div>
                                <div className="col-md-2">
                                    <input className="form-control" type="number" step="0.01" placeholder="Price" value={menuForm.price} onChange={e => setMenuForm({ ...menuForm, price: e.target.value })} required />
                                </div>
                                <div className="col-md-2">
                                    <input className="form-control" placeholder="Category" value={menuForm.category} onChange={e => setMenuForm({ ...menuForm, category: e.target.value })} required />
                                </div>
                                <div className="col-md-1">
                                    <button type="submit" className="btn btn-primary w-100">{editingMenu ? 'Save' : 'Add'}</button>
                                </div>
                            </div>
                            {editingMenu && <button type="button" className="btn btn-link btn-sm mt-1" onClick={() => { setEditingMenu(null); setMenuForm({ name: '', description: '', price: '', category: '', img: '', available: true }); }}>Cancel</button>}
                        </form>
                        <table className="table table-bordered table-hover table-sm">
                            <thead>
                                <tr><th>Name</th><th>Category</th><th>Price</th><th>Available</th><th>Actions</th></tr>
                            </thead>
                            <tbody>
                                {menuItems.map(item => (
                                    <tr key={item._id}>
                                        <td>{item.name}</td>
                                        <td>{item.category}</td>
                                        <td>${item.price.toFixed(2)}</td>
                                        <td>
                                            <button
                                                className={`btn btn-sm ${item.available ? 'btn-success' : 'btn-secondary'}`}
                                                onClick={() => toggleAvailability(item)}
                                            >{item.available ? 'Yes' : 'No'}</button>
                                        </td>
                                        <td>
                                            <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => editMenuItem(item)}>Edit</button>
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => deleteMenuItem(item._id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                                {menuItems.length === 0 && <tr><td colSpan="5" className="text-muted text-center">No menu items.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* AI Features Tab */}
                {activeTab === 'ai' && <AIFeatures />}
            </div>
        </div>
    );
}
