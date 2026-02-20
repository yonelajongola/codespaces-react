import React from 'react'

export default function Carousel() {
  return (
    <div id="carouselExampleFade" className="carousel slide carousel-fade" data-bs-ride="carousel">
      <div className="carousel-inner" id='carousel'>
        <div className="carousel-item active">
          <img className="d-block w-100" src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&h=600&fit=crop" style={{ filter: "brightness(40%)", height: "600px", objectFit: "cover" }} alt="Bergers" />
          <div className="carousel-caption" style={{ zIndex: "10" }}>
            <h1 style={{ fontSize: "3rem", fontWeight: "bold", marginBottom: "20px" }}>Best Burgers in Town</h1>
            <form className="d-flex justify-content-center">
              <input className="form-control me-2" type="search" placeholder="Search for food..." aria-label="Search" style={{ maxWidth: "400px" }} />
              <button className="btn btn-outline-success text-white bg-success" type="submit">Search</button>
            </form>
          </div>
        </div>
        <div className="carousel-item">
          <img className="d-block w-100" src="https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=1200&h=600&fit=crop" style={{ filter: "brightness(40%)", height: "600px", objectFit: "cover" }} alt="Pizza" />
          <div className="carousel-caption" style={{ zIndex: "10" }}>
            <h2 style={{ fontSize: "3rem", fontWeight: "bold" }}>Delicious Pizza</h2>
            <p style={{ fontSize: "1.5rem" }}>Fresh ingredients, Traditional recipes</p>
          </div>
        </div>
        <div className="carousel-item">
          <img className="d-block w-100" src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&h=600&fit=crop" style={{ filter: "brightness(40%)", height: "600px", objectFit: "cover" }} alt="Salads" />
          <div className="carousel-caption" style={{ zIndex: "10" }}>
            <h2 style={{ fontSize: "3rem", fontWeight: "bold" }}>Healthy Salads</h2>
            <p style={{ fontSize: "1.5rem" }}>Fresh vegetables, Nutritious & tasty</p>
          </div>
        </div>
        <div className="carousel-item">
          <img className="d-block w-100" src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200&h=600&fit=crop" style={{ filter: "brightness(40%)", height: "600px", objectFit: "cover" }} alt="Desserts" />
          <div className="carousel-caption" style={{ zIndex: "10" }}>
            <h2 style={{ fontSize: "3rem", fontWeight: "bold" }}>Sweet Desserts</h2>
            <p style={{ fontSize: "1.5rem" }}>Indulge in our heavenly treats</p>
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
  )
}
