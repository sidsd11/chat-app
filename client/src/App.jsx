import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import Chats from './pages/Chats'
import Login from './pages/Login'
import MyProfile from './pages/MyProfile'

const App = () => {
    return (
        <div>
            <Toaster />
            <Routes>
                <Route path='/' element={<Navigate to ='/chats' replace />} />
                <Route path='/login' element={<Login />} />
                <Route path='/chats' element={<Chats />} />
                <Route path='/my-profile' element={<MyProfile />} />
                <Route path='*' element={<Navigate to='/login' replace />} />
            </Routes>
        </div>
    )
}

export default App