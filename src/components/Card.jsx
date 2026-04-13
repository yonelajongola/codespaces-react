import React, { useEffect, useState, useRef } from 'react';
import { useDispatchCart, useCart } from './ContextReducer';

export default function Card(props) {
  const dispatch = useDispatchCart();
  const data = useCart();
  const { item, options } = props; 
  const priceRef = useRef();
  const priceOptions = Object.keys(options);
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState("");

  const handleAddToCart = async () => {
    if(!size) return alert("Please select a size");
     
    let food = data.find(cartItem => cartItem.id === item._id) || {};
    const finalPrice = qty * (size ? parseInt(options[size]) : 0);

    const cartItem = { 
      id: item._id, 
      name: item.name, 
      price: finalPrice, 
      qty: parseInt(qty), 
      size, 
      img: item.img 
    };

    if (food.id) {
      if (food.size === size) {
        await dispatch({type: "UPDATE", id: item._id, price: finalPrice, qty: parseInt(qty) });
        return;
      } else {
        await dispatch({ type: "ADD", ...cartItem });
      }
    } else {
      await dispatch({type: "ADD", ...cartItem });
    }
  };

  useEffect(() => {
    if (priceRef.current) {
      setSize(priceRef.current.value);
    }
  }, []);

  const finalPrice = qty * (size ? parseInt(options[size]) : 0);
  
  return (
    <div>
      <div className="card mt-3" style={{ "width": "18rem", "maxHeight": "520px" }}>
        <img src={props.imgSrc} className="card-img-top" alt="..." style={{ height: "200px", objectFit: "cover" }} />
        <div className="card-body">
          <h5 className="card-title">{item.name}</h5>
          <p className="card-text">Some quick example text.</p>
          <div className='container w-100'>
            <select className='m-2 h-100 w-100 bg-success' onChange={(e)=> setQty(e.target.value)}>
              {Array.from(Array(6), (e, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
            <select className='m-2 h-100 w-100 bg-success rounded' ref={priceRef} onChange={(e) => setSize(e.target.value)}>
              {priceOptions.map(i => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
            <div className='d-inline h-120 fs-5'>
              R{finalPrice}/-
            </div>
          </div>
          <hr />
          <button className='btn btn-success justify-center ms-2' onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}