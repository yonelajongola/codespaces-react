import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../home/Footer';
import Card from '../components/Card';
import Carousel from '../components/Carousel';

export default function Main() {
    const [foodCat, setFoodCat] = useState([]);
    const [foodItem, setFoodItem] = useState([]);
    const [search, setSearch] = useState('');

    const loadData = async () => {
        try {
            let response = await fetch("/api/foodData", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            response = await response.json();
            setFoodItem(response[0]);
            setFoodCat(response[1]);
        } catch (error) {
            console.error("Error loading data:", error);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <div>
            <div><Navbar /></div>
            <div>
                <div id="carouselExampleFade" className="carousel slide carousel-fade" data-bs-ride="carousel" style={{ objectFit: "contain !important" }}>
                    <div className="carousel-inner" id='carousel'>
                        <div className="carousel-item active">
                            <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&h=600&fit=crop" className="d-block w-100" style={{ filter: "brightness(30%)", height: "600px", objectFit: "cover" }} alt="Burgers" />
                            <div className="carousel-caption" style={{ zIndex: "10" }}>
                                <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "20px" }}>Best Burgers in Town</h1>
                                <div className="d-flex justify-content-center">
                                    <input 
                                        className="form-control me-2" 
                                        type="search" 
                                        placeholder="Search for food..." 
                                        aria-label="Search"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        style={{ maxWidth: "400px" }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <img src="https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=1200&h=600&fit=crop" className="d-block w-100" style={{ filter: "brightness(30%)", height: "600px", objectFit: "cover" }} alt="Pizza" />
                            <div className="carousel-caption" style={{ zIndex: "10" }}>
                                <h2 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>Delicious Pizza</h2>
                                <p style={{ fontSize: "1.2rem" }}>Fresh ingredients, Traditional recipes</p>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&h=600&fit=crop" className="d-block w-100" style={{ filter: "brightness(30%)", height: "600px", objectFit: "cover" }} alt="Salads" />
                            <div className="carousel-caption" style={{ zIndex: "10" }}>
                                <h2 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>Healthy Salads</h2>
                                <p style={{ fontSize: "1.2rem" }}>Fresh vegetables, Nutritious & tasty</p>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <img src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200&h=600&fit=crop" className="d-block w-100" style={{ filter: "brightness(30%)", height: "600px", objectFit: "cover" }} alt="Desserts" />
                            <div className="carousel-caption" style={{ zIndex: "10" }}>
                                <h2 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>Sweet Desserts</h2>
                                <p style={{ fontSize: "1.2rem" }}>Indulge in our heavenly treats</p>
                            </div>
                        </div>
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            </div>
            <div className='container py-5'>
                <h2 className='text-center mb-4' style={{ fontSize: "2rem", fontWeight: "bold", color: '#198754' }}>🍽️ Browse Categories</h2>
                <div className='row g-4 justify-content-center'>
                    {foodCat.length > 0 
                        ? foodCat.map((category) => {
                            const itemCount = foodItem.filter(item => item.CategoryName === category.CategoryName).length;
                            const categoryIcons = {
                                'Burgers': '🍔',
                                'Pizza': '🍕',
                                'Vegetarian': '🥗',
                                'Desserts': '🍰',
                                'Beverages': '🥤',
                                'Salads': '🥙'
                            };
                            const categoryImage = foodItem.find(fi => fi.CategoryName === category.CategoryName)?.img || 'https://via.placeholder.com/300x150?text=No+Image';
                            return (
                                <div key={category._id} className='col-12 col-md-6 col-lg-4 col-xl-3'>
                                    <div className='card text-center shadow-lg h-100' style={{ 
                                        cursor: 'pointer', 
                                        transition: 'all 0.3s ease',
                                        border: 'none',
                                        borderRadius: '10px',
                                        background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)'
                                    }} 
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                                            e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                            e.currentTarget.style.boxShadow = '0 0.5rem 1rem rgba(0, 0, 0, 0.15)';
                                        }}
                                    >
                                        <div className='card-body'>
                                            <div style={{ marginBottom: '10px' }}>
                                                <img src={categoryImage} alt={category.CategoryName} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }} onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300x150?text=No+Image'; }} />
                                            </div>
                                            <h5 className='card-title' style={{ color: '#198754', fontWeight: 'bold', fontSize: '1.3rem' }}>
                                                {category.CategoryName}
                                            </h5>
                                            <div style={{ marginTop: '15px' }}>
                                                <span className='badge bg-success' style={{ fontSize: '0.9rem', padding: '8px 12px' }}>
                                                    {itemCount} {itemCount === 1 ? 'item' : 'items'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                        : null
                    }
                </div>
            </div>
            <div className='container'>
                <h2 className='text-center mb-4' style={{ fontSize: "2rem", fontWeight: "bold" }}>Featured Foods</h2>
                {
                    foodCat.length > 0
                        ? foodCat.map((category) => {
                            return (
                                <div key={category._id} className='row mb-3'>
                                    <div className='fs-3 m-3'>
                                        {category.CategoryName}
                                    </div>
                                    <hr />
                                    {foodItem.length > 0
                                        ? foodItem.filter((item) => 
                                            (item.CategoryName === category.CategoryName) && 
                                            (item.name.toLowerCase().includes(search.toLowerCase()))
                                        ).map(filterItems => {
                                            return (
                                                <div key={filterItems._id} className='col-12 col-md-6 col-lg-3'>
                                                    <Card
                                                        item={filterItems}
                                                        options={filterItems.options}
                                                        imgSrc={filterItems.img}
                                                    />
                                                </div>
                                            );
                                        })
                                        : <div>No Such Data Found</div>
                                    }
                                </div>
                            );
                        })
                        : <div>No categories found</div>
                }
            </div>
            <div><Footer /></div>
        </div>
    );
}