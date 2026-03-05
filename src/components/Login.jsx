import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'

const apiBase = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');

export default function Login() {
    const [credentials, setCredentials] = useState({email:"",password:""})
    const navigate = useNavigate();
    const { login } = useAuth();

    const onChange=(event)=>{
      setCredentials({...credentials,[event.target.name]:event.target.value})
    }

const handleSubmit = async(e)=>{
       e.preventDefault();
const response = await fetch(`${apiBase}/api/loginuser`,
    {
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({email:credentials.email, password:credentials.password})
    });
  

    const json = await response.json()
    console.log(json);

    if(json.success)
      {
        login({ authToken: json.authToken, email: json.email, role: json.role, name: json.name });
        if (json.role === 'owner') {
          navigate('/owner');
        } else if (json.role === 'worker') {
          navigate('/worker');
        } else {
          navigate('/');
        }
      } else {
        alert("Enter Valid credentials")
      }
    }

  return (
<div>
      <div> <Navbar />
      </div>
 <div className='container'>
    <form className='w-50 m-auto mt-4' onSubmit={handleSubmit}>
  <div className="m-3">
    <label htmlFor="exampleInputEmail1">Email address</label>
    <input type="email" className="form-control"  name='email' value={credentials.email} onChange={onChange} id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"/>
    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
  </div>
  <div className="m-3">
    <label htmlFor="exampleInputPassword1">Password</label>
    <input type="password" className="form-control"  name='password' value={credentials.password} onChange={onChange} id="exampleInputPassword1" placeholder="Password"/>
  </div>
  
  <button type="submit" className="m-3 btn btn-primary">Submit</button>
  <Link to="/createuser" className='m-3 btn btn-danger'> New User</Link>
</form>
</div>
      </div>
  )
}