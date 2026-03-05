import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RELEVANT_HOURS = new Set([8, 9, 10, 11, 12, 13, 14, 15, 18, 19, 20]);
const apiBase = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');

function authHeaders() {
    const token = localStorage.getItem('authToken');
    return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
}

export default function AIFeatures() {
    const [activeFeature, setActiveFeature] = useState('demand');

    // Demand Prediction
    const [predictions, setPredictions] = useState([]);
    const [predSummary, setPredSummary] = useState(null);
    const [predLoading, setPredLoading] = useState(false);

    // Menu Generator
    const [menuCategory, setMenuCategory] = useState('Main Course');
    const [menuCuisine, setMenuCuisine] = useState('International');
    const [menuSuggestions, setMenuSuggestions] = useState([]);
    const [menuLoading, setMenuLoading] = useState(false);

    // Receipt Scanner
    const [receiptFile, setReceiptFile] = useState(null);
    const [receiptData, setReceiptData] = useState(null);
    const [receiptLoading, setReceiptLoading] = useState(false);

    const predictDemand = async () => {
        setPredLoading(true);
        try {
            const res = await fetch(`${apiBase}/api/ai/demand-prediction`, {
                method: 'POST',
                headers: authHeaders(),
                body: JSON.stringify({})
            });
            const data = await res.json();
            if (data.success) {
                setPredictions(data.predictions);
                setPredSummary(data.summary);
            }
        } catch (e) { console.error(e); }
        setPredLoading(false);
    };

    const generateMenu = async () => {
        setMenuLoading(true);
        try {
            const res = await fetch(`${apiBase}/api/ai/menu-generator`, {
                method: 'POST',
                headers: authHeaders(),
                body: JSON.stringify({ category: menuCategory, cuisine: menuCuisine })
            });
            const data = await res.json();
            if (data.success) setMenuSuggestions(data.suggestions);
        } catch (e) { console.error(e); }
        setMenuLoading(false);
    };

    const scanReceipt = async () => {
        setReceiptLoading(true);
        try {
            const res = await fetch(`${apiBase}/api/ai/receipt-scan`, {
                method: 'POST',
                headers: authHeaders(),
                body: JSON.stringify({ filename: receiptFile?.name || 'receipt.jpg' })
            });
            const data = await res.json();
            if (data.success) setReceiptData(data.extractedData);
        } catch (e) { console.error(e); }
        setReceiptLoading(false);
    };

    return (
        <div>
            <h5 className="mb-3">🤖 AI Features</h5>
            <ul className="nav nav-pills mb-3">
                {[
                    { key: 'demand', label: '📈 Demand Prediction' },
                    { key: 'menu', label: '🍴 Menu Generator' },
                    { key: 'receipt', label: '🧾 Receipt Scanner' }
                ].map(f => (
                    <li className="nav-item" key={f.key}>
                        <button
                            className={`nav-link ${activeFeature === f.key ? 'active' : ''}`}
                            onClick={() => setActiveFeature(f.key)}
                        >{f.label}</button>
                    </li>
                ))}
            </ul>

            {/* Demand Prediction */}
            {activeFeature === 'demand' && (
                <div>
                    <p className="text-muted">Analyzes your order history to predict busy hours throughout the day.</p>
                    <button className="btn btn-primary mb-3" onClick={predictDemand} disabled={predLoading}>
                        {predLoading ? 'Predicting...' : '🔮 Predict Busy Hours'}
                    </button>
                    {predSummary && (
                        <div className="alert alert-info mb-3">
                            Peak hour: <strong>{predSummary.peakHour}</strong> — based on {predSummary.totalOrdersAnalyzed} orders
                        </div>
                    )}
                    {predictions.length > 0 && (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={predictions.filter(p => p.predicted > 0 || RELEVANT_HOURS.has(parseInt(p.hour)))}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="predicted" fill="#0d6efd" name="Orders" />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            )}

            {/* Menu Generator */}
            {activeFeature === 'menu' && (
                <div>
                    <p className="text-muted">Generate menu item suggestions based on category and cuisine preferences.</p>
                    <div className="row g-2 mb-3">
                        <div className="col-md-3">
                            <select className="form-control" value={menuCategory} onChange={e => setMenuCategory(e.target.value)}>
                                <option>Main Course</option>
                                <option>Starter</option>
                                <option>Dessert</option>
                                <option>Beverage</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <input
                                className="form-control"
                                placeholder="Cuisine type"
                                value={menuCuisine}
                                onChange={e => setMenuCuisine(e.target.value)}
                            />
                        </div>
                        <div className="col-md-2">
                            <button className="btn btn-primary w-100" onClick={generateMenu} disabled={menuLoading}>
                                {menuLoading ? 'Generating...' : '✨ Generate'}
                            </button>
                        </div>
                    </div>
                    {menuSuggestions.length > 0 && (
                        <div className="row">
                            {menuSuggestions.map((item, i) => (
                                <div className="col-md-6 mb-3" key={i}>
                                    <div className="card h-100">
                                        <div className="card-body">
                                            <h6 className="card-title">{item.name}</h6>
                                            <p className="card-text text-muted small">{item.description}</p>
                                            <span className="badge bg-secondary me-2">{item.category}</span>
                                            <span className="fw-bold">${item.price.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Receipt Scanner */}
            {activeFeature === 'receipt' && (
                <div>
                    <p className="text-muted">
                        Upload a receipt image to automatically extract vendor, items, and totals.
                        <span className="badge bg-warning ms-2">Azure Document Intelligence — Stub</span>
                    </p>
                    <div className="mb-3">
                        <input
                            type="file"
                            className="form-control"
                            accept="image/*,.pdf"
                            onChange={e => setReceiptFile(e.target.files[0])}
                        />
                    </div>
                    <button className="btn btn-primary mb-3" onClick={scanReceipt} disabled={receiptLoading}>
                        {receiptLoading ? 'Scanning...' : '🔍 Scan Receipt'}
                    </button>
                    {receiptData && (
                        <div className="card">
                            <div className="card-header d-flex justify-content-between">
                                <strong>{receiptData.vendor}</strong>
                                <span>{receiptData.date}</span>
                            </div>
                            <div className="card-body">
                                <table className="table table-sm">
                                    <thead>
                                        <tr><th>Item</th><th>Qty</th><th>Unit Price</th><th>Total</th></tr>
                                    </thead>
                                    <tbody>
                                        {receiptData.items.map((item, i) => (
                                            <tr key={i}>
                                                <td>{item.description}</td>
                                                <td>{item.quantity}</td>
                                                <td>${item.unitPrice.toFixed(2)}</td>
                                                <td>${item.total.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="fw-bold">
                                            <td colSpan="3">Total</td>
                                            <td>${receiptData.total.toFixed(2)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                                <div className="text-muted small">
                                    Confidence: {(receiptData.confidence * 100).toFixed(0)}% — {receiptData.note}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
