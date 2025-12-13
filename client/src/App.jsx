import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Chats from './pages/Chats.jsx'
import Login from './pages/Login'
import Profile from './pages/Profile.jsx'
import ResetPassword from './pages/ResetPassword.jsx'

const App = () => {
    return (
        <div>
            <Toaster />
            <Routes>
                <Route path='/' element={<Navigate to ='/chats' replace />} />
                <Route path='/login' element={<Login />} />
                <Route path='/chats' element={<Chats />} />
                <Route path='/profile' element={<Profile />} />
                <Route path='/reset-password' element={<ResetPassword />} />
                <Route path='*' element={<Navigate to='/login' replace />} />
            </Routes>
        </div>
    )
}

export default App