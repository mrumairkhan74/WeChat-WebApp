import React, { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';
const Protected = () => {
    const [isAuthenticated,setIsAuthenticated] = useState(null);
    useEffect(()=>{
        axios.get("http://localhost:3000/user/verify",{withCredentials:true})
        .then(()=>setIsAuthenticated(true))
        .catch(()=>setIsAuthenticated(false))
    },[]);
  if(isAuthenticated===null) return <p className='relative w-full h-screen  '><img className='w-50 h-50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-purple-500 p-2 m-2' src="/images/ups-w.png" alt="" /></p>
  return isAuthenticated? <Outlet/> : <Navigate to='/' replace/>
}

export default Protected