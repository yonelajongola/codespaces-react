import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const apiBase = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');

export default function SignUp() {
    const [credentials, setCredentials] = useState({ name: "", email: "", password: "", geolocation: "", role: "worker" });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`${apiBase}/api/createuser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: credentials.name,
                email: credentials.email,
                password: credentials.password,
                location: credentials.geolocation,
                role: credentials.role
            })
        });

        const json = await response.json();
        console.log(json);

        if (json.success) {
            alert("User created successfully");
            navigate('/login');
        } else {
            alert("Enter Valid credentials");
        }
    };

    const onChange = (event) => {
        setCredentials({ ...credentials, [event.target.name]: event.target.value });
    };

    return (
        <>
            <div>
                <Navbar />
            </div>
            <div className='container'>
                <form className="w-50 m-auto mt-5" onSubmit={handleSubmit}>
                    <div className="m-3">
                        <label htmlFor="nameInput">Name</label>
                        <input
                            type="text"
                            className="form-control"
                            name='name'
                            value={credentials.name}
                            onChange={onChange}
                            id="nameInput"
                        />
                    </div>
                    <div className="m-3">
                        <label htmlFor="emailInput">Email address</label>
                        <input
                            type="email"
                            className="form-control"
                            name='email'
                            value={credentials.email}
                            onChange={onChange}
                            id="emailInput"
                            placeholder="Enter email"
                        />
                        <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                    </div>
                    <div className="m-3">
                        <label htmlFor="passwordInput">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            name='password'
                            value={credentials.password}
                            onChange={onChange}
                            id="passwordInput"
                            placeholder="Password"
                        />
                    </div>
                    <div className="m-3">
                        <label htmlFor="geolocationInput">Address</label>
                        <input
                            type="text"
                            className="form-control"
                            name='geolocation'
                            value={credentials.geolocation}
                            onChange={onChange}
                            id="geolocationInput"
                            placeholder="Location"
                        />
                    </div>
                    <div className="m-3">
                        <label htmlFor="roleSelect">Role</label>
                        <select
                            className="form-control"
                            name='role'
                            value={credentials.role}
                            onChange={onChange}
                            id="roleSelect"
                        >
                            <option value="worker">Worker</option>
                            <option value="owner">Owner</option>
                        </select>
                    </div>
                    <button type="submit" className="m-3 btn btn-primary">Submit</button>
                    <Link to="/login" className='m-3 mx-1 btn btn-danger'>Already a User</Link>
                </form>
            </div>
        </>
    );
}