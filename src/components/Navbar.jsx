import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from './ContextReducer';

export default function Navbar(props) {
  let navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  const items = useCart();

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light position-sticky"
        style={{
          boxShadow: "0 10px 20px gray", filter: "blur(30)", zIndex: "10"
        }}>
        <div className="container-fluid">
          <Link className="navbar-brand fs-1 fst-italic" to="/">foodie Bar</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 lg-0">
              <li className="nav-item">
                <Link className="nav-link active fs-5 mx-3" aria-current="page" to="/">Home</Link>
              </li>
              
              {localStorage.getItem("authToken") && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link fs-5 mx-3" to="/myOrder">My Orders</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link fs-5 mx-3" to="/cart">
                      Cart <span className='badge bg-danger'>{items.length}</span>
                    </Link>
                  </li>
                </>
              )}
            </ul>

            {(!localStorage.getItem("authToken") )? 
              <div className="d-flex">
                <Link className="btn bg-white text-success mx-2 fw-bold" to="/login">Login</Link>
                <Link className="btn bg-white text-success mx-2 fw-bold" to="/createuser">SignUp</Link>
              </div>
             : 
              <div>
                <button className='btn bg-white text-danger mx-2 fw-bold' onClick={handleLogout}>Logout</button>
              </div>
            }
          </div>
        </div>
      </nav>
    </div>
  );
}