import React, { useEffect } from 'react'
import { useAuth } from '@/store/useAuth'
import { Navigate } from 'react-router-dom'

function Logout() {
  const {Logout} = useAuth()


  useEffect(()=>{
    Logout()
  },[Logout])
     return <Navigate to={"/login"}/>
}

export default Logout